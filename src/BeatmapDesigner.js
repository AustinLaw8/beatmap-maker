import React, { useCallback, useEffect, useRef, useState } from 'react';

import NotePlacer from './NotePlacer';
import Waveform from './Waveform';

import { BUTTON_WIDTH } from './App';

import { cloneDeep } from 'lodash';

export function getSongPosition (position, songLength, fullWidth, px=true)
{
    position = Math.abs(position);
    if(px)
        return String(Math.floor(position / songLength * (fullWidth - BUTTON_WIDTH)) + BUTTON_WIDTH) + "px";
    else
        return String(Math.floor(position / songLength * (fullWidth - BUTTON_WIDTH)) + BUTTON_WIDTH);

    // return String(Math.floor((position / songLength + 16 / fullWidth) * 100000) / 1000) + "%";
}

export function getSongTime (position, songLength, fullWidth)
{
    position = Math.abs(position);
    return (position - BUTTON_WIDTH) / (fullWidth - BUTTON_WIDTH) * songLength;
}

export function isEqual(a1, a2)
{
    return JSON.stringify(a1)===JSON.stringify(a2);
}

function BeatmapDesigner (props) {
    const [BPM, setBPM] = useState(0)
    const [songTime, setSongTime] = useState(0);
    const [songLength, setSongLength] = useState(0);
    const [allNotes, setNotes] = useState([[],[],[],[],[],[],[]]);
    const [fullWidth, setWidth] = useState(
        Math.max(
            document.body.scrollWidth,
            document.documentElement.scrollWidth,
            document.body.offsetWidth,
            document.documentElement.offsetWidth,
            document.body.clientWidth,
            document.documentElement.clientWidth
        )
    );
    const [quantize, setQuantize] = useState(0);
    const [undoStack, setUndoStack] = useState([]);
    const [redoStack, setRedoStack] = useState([]);
    const [isPlaying, setPlaying] = useState(false);
    const [selected, setSelected] = useState([0,0]);
    const [holdNoteStart, setHoldNoteStart] = useState([0,0,0,0]);
    const [holdNotes, setHoldNotes] = useState([]);
    const [offset, setOffset] = useState(0);

    const canvasRef = useRef(null);

    const BPS = BPM / 60;
    const SPB = 1 / BPS;

    const approxEqual = useCallback( (a, b, epsilon) => {
        if(epsilon === null || epsilon === undefined) epsilon = Math.abs(getSongTime(BUTTON_WIDTH / 2, songLength, fullWidth));
        return Math.abs(b) - epsilon <= Math.abs(a) && Math.abs(a) <= Math.abs(b) + epsilon;
    },[songLength, fullWidth]);

    const undo = () => {
        if (undoStack.length === 0) return;

        const undoCopy = cloneDeep(undoStack);
        const redoCopy = cloneDeep(redoStack);

        const currentState = [cloneDeep(allNotes), cloneDeep(holdNotes)];
        redoCopy.push(currentState);

        const undoneState = undoCopy.pop();

        setUndoStack(undoCopy);
        setRedoStack(redoCopy);
        setNotes(undoneState[0]);
        setHoldNotes(undoneState[1]);
        setSelected([0,0]);
    }

    const redo = () => {
        if (redoStack.length === 0) return;

        const undoCopy = cloneDeep(undoStack);
        const redoCopy = cloneDeep(redoStack);

        const currentState = [cloneDeep(allNotes), cloneDeep(holdNotes)];
        undoCopy.push(currentState);

        const redoneState = redoCopy.pop();

        setUndoStack(undoCopy);
        setRedoStack(redoCopy);
        setNotes(redoneState[0]);
        setHoldNotes(redoneState[1]);
        setSelected([0,0]);
    }

    const deleteLastNote = () => {
        if (!isEqual(selected, [0,0])) {
            const [ target, index ] = selected
            const copy = [cloneDeep(allNotes), cloneDeep(holdNotes)];
            const temp = cloneDeep(allNotes);
            const holds = cloneDeep(holdNotes);
            temp[index].splice(temp[index].findIndex(e => e === target),1);
            
            const del = [];
            holdNotes.forEach( ([start, end], i) => {
                if ((index === start[0] && approxEqual(target, getSongTime(start[1], songLength, fullWidth))) ||
                    (index === end[0] && approxEqual(target, getSongTime(end[1], songLength, fullWidth)))   
                ) {
                    del.push(i);
                }
            });

            del.reverse().forEach( (i) => {
                holds.splice(i,1);
            });
            
            setUndoStack([...undoStack, copy]);
            setRedoStack([]);
            setNotes(temp);
            setHoldNotes(holds);
            setSelected([0,0]);
        }
    }

    const onKeyDown = (e) => {
        switch (e.keyCode)
        {
            case 8: // Backspace
                if (e.target.className !== "editable") {
                    deleteLastNote();
                    e.preventDefault();
                }
                break;
            case 32: // Space
                setPlaying(!isPlaying);
                e.preventDefault();
                break;
            case 80: // P
                setPlaying(!isPlaying);
                break;
            case 89: // Y
                if (e.ctrlKey || e.metaKey) {
                    redo();
                    e.preventDefault();
                }
                break; 
            case 90: // Z
                if (e.ctrlKey || e.metaKey) {
                    undo();
                    e.preventDefault();
                }
                break;
            default:
                break;
        }
    }

    const addNotes = (index, by, location) => {
        var target;
        if (by === 'index')
        {
            target = songTime;
        }
        else if (by === 'location')
        {
            target = location;
        }

        if (quantize && BPM)
        {
            const targetInBeats = target * BPS - Number(offset);
            const quantizedTargetInBeats = Math.round(targetInBeats * quantize) / quantize;
            target = Number(quantizedTargetInBeats * SPB) + Number(offset);
        }
    
        const copy = [cloneDeep(allNotes), cloneDeep(holdNotes)];
        const temp = cloneDeep(allNotes);
        temp[index].push(target);
        setUndoStack([...undoStack, copy]);
        setRedoStack([]);
        setNotes(temp);
        setSelected([target, index]);
    };

    const changeNotes = (index, location, next) => {
        location = getSongTime(location, songLength, fullWidth);
        const temp = cloneDeep(allNotes);
        var ind;
        switch (next) 
        {
            case 0: 
                ind = temp[index].findIndex(e => e === location)
                if (ind !== -1)
                    temp[index][ind] *= -1;
                else
                    console.log("err occurred");
                break;
            case 1:
                ind = temp[index].findIndex(e => e === -location)
                if (ind !== -1)
                    temp[index][ind] *= -1;
                else
                    console.log("err occurred");
                break;
            default:
                console.log("err probably occurred in changeNotes, BeatmapDesigner line 57");
                break;
        }

        const copy = [cloneDeep(allNotes), cloneDeep(holdNotes)];
        setUndoStack([...undoStack, copy]);
        setRedoStack([]);
        setNotes(temp);
        setSelected([location*-1, index]);
    };

    const setHoldNote = (location) => {
        const temp = cloneDeep(holdNotes);
        const noteCopy = cloneDeep(allNotes);

        var target = getSongTime(location[1], songLength, fullWidth);
        
        if (quantize && BPM)
        {
            const targetInBeats = target * BPS - Number(offset);
            const quantizedTargetInBeats = Math.round(targetInBeats * quantize) / quantize;
            target = Number(quantizedTargetInBeats * SPB) + Number(offset);
        }

        noteCopy[location[0]].push(target)
        // noteCopy[holdNoteStart[1]].splice(noteCopy[holdNoteStart[1]].findIndex(e => e === holdNoteStart[0]), 1);
        if (location[1] < holdNoteStart[1])
            temp.push([location, holdNoteStart])
        else
            temp.push([holdNoteStart, location])
        // console.log(temp)

        setUndoStack([...undoStack, [cloneDeep(allNotes), temp]]);
        setRedoStack([]);
        setHoldNotes(temp);
        setNotes(noteCopy);
        setSelected([target, location[0]]);
    };

    const downloadMap = useCallback( () => {
        const removeAll = (index, arr, value) => {
            var i = 0;
            while (i < arr.length) {
                if (index === value[0] && approxEqual(arr[i], value[1])) {
                    arr.splice(i, 1);
                } else {
                    i++;
                }
            }
            return arr;
        };
        const merge = (arr) => {
            const sorted = cloneDeep(arr);
            sorted.sort((a,b)=>a[0][1] - b[0][1]);
            // console.log(sorted[0])
            const res = [];
            const epsilon = Math.abs(getSongTime(BUTTON_WIDTH / 4, songLength, fullWidth));
            // console.log(sorted)
            // console.log(res)
            // console.log(epsilon)
            var i = 0;
            while (i < sorted.length) {
                // console.log(i)
                // console.log(sorted[i])
                var [start, end] = sorted[i];
                var [startInd, startTime] = start;
                var j = 0;
                var last = res[j]?.length - 1
                
                while (j < res.length && 
                        !(
                            (res[j][last][0]) === startInd &&
                            approxEqual(startTime, res[j][last][1], epsilon)
                        ))
                        {
                            last = res[j].length - 1;
                            // console.log(res[j])
                            j++;
                        }
                // console.log(j)
                if (j !== res.length) {
                    res[j].push(cloneDeep(end));
                } else {
                    res.push(cloneDeep(sorted[i]));
                }
                i++;
            }
            return res;
        }
    
        const inHolds = [];
        const holds = holdNotes.map( ([start, end], i) => {
            const startCopy = cloneDeep(start);
            const endCopy = cloneDeep(end);
            // console.log(start)
            // console.log(end)
            // console.log(temp)
            return [
                [startCopy[0], getSongTime(startCopy[1],songLength,fullWidth)],
                [endCopy[0], getSongTime(endCopy[1],songLength,fullWidth)],
            ]; 
        });

        holds.forEach(element => {
            element.forEach( e => {
                inHolds.push(cloneDeep(e));
            });
        });

        const copy = cloneDeep(allNotes);

        copy.forEach( (lane, i) => {
            inHolds.forEach( val => removeAll(i, lane, val) )
        })

        const data = copy.map( (lane) => 
            lane.sort( (a, b) => Math.abs(a) - Math.abs(b) ).join()
        ).join('\n') + '\n';
        
        console.log("below is the data that should have been downloaded")
        console.log("data for tap/flicks")

        console.log(data)
        const mergedHolds = merge(holds);
        const mergedHoldsData = mergedHolds.join('\n');

        console.log("data for holds")
        console.log(mergedHoldsData)
        const url = window.URL.createObjectURL(
            new Blob([data, mergedHoldsData]),
        );

        const link = document.createElement('a');
        link.href = url;
        link.setAttribute(
            'download',
            `${props.fileName}map`,
        );
        
        document.body.appendChild(link);
        link.click();
        link.parentNode.removeChild(link);
    }, [allNotes,fullWidth,holdNotes,songLength, props.fileName, approxEqual])

    const position = getSongPosition(songTime, songLength, fullWidth);
    const measureBars = BPM !== 0 ? new Array (Math.floor(BPS * songLength)).fill(0) : [];

    console.log("Tap/flick notes")
    console.log(allNotes);
    console.log("Hold notes")
    console.log(holdNotes);
    // console.log(undoStack);
    // console.log(redoStack);
    // console.log(selected);
    // console.log(offset);
    useEffect( () => {
        const ctx = canvasRef?.current?.getContext('2d');
        if (ctx)
        {
            ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
            holdNotes.forEach( pair => {
                const [first, second] = pair;
                const x1 = first[1];
                const y1 = first[2] - 650;

                const x2 = second[1];
                const y2 = second[2] - 650;

                // console.log(x1 + " " + y1)
                // console.log(x2 + " " + y2)
                ctx.beginPath(); // Start a new path
                ctx.moveTo(x1, y1); // Move the pen to (30, 50)
                ctx.lineTo(x2, y2); // Draw a line to (150, 100)
                ctx.stroke(); // Render the path
            });
        }
    }, [holdNotes]);
    
    return (
        <div style={{outlineStyle:"hidden"}}tabIndex={-1} onKeyDown={onKeyDown}>
            <div style={{margin:"10px"}}>
                click here to activate keyboard shortcuts because idk how to fix this bug
            </div>
            <div style={ { width:fullWidth+"px"} }>
                <div style={{pointerEvents: 'none', height:"355px",width:"100%", position:'absolute'}}>
                    <canvas ref={canvasRef} height={"355px"} width={fullWidth+"px"}/>
                </div>
                { measureBars.map( (_, i) => {
                    return <Playhead key={i} position={getSongPosition(Number((i + 1) * SPB) + Number(offset), songLength, fullWidth)} color={"silver"}/>
                })}
                <Playhead position={position}/>
                <Waveform url={props.url} isPlaying={isPlaying} time={songTime} setPlaying={setPlaying} setSongTime={setSongTime} setSongLength={setSongLength} fullWidth={fullWidth} setSelected={setSelected}/>
                { allNotes.map( (notes, i) => 
                <NotePlacer key={i} index={i} notes={notes} holdNotes={holdNotes} addNotes={addNotes} setHoldNote={setHoldNote} setHoldNoteStart={setHoldNoteStart} songLength={songLength} fullWidth={fullWidth} changeNotes={changeNotes}/>
                )}
                <hr/>
            </div>

            <div style={{marginLeft:BUTTON_WIDTH+10+"px"}}>
                {/* <form> */}
                    <div>
                        <label>
                            Page Width:
                            <input defaultValue={fullWidth} className="editable" type="number" onChange={ (e) => setWidth(e.target.value) }/>
                        </label>
                    </div>
                    <div>
                        <label>
                            BPM:
                            <input name="bpm" className="editable" type="number" onChange={ (e) => setBPM(e.target.value) }/>
                        </label>
                    </div>
                    <div>
                        <label>
                            Offset:
                            <input name="offset" className="editable" type="number" onChange={ (e) => setOffset(e.target.value) }/>
                        </label>
                    </div>
                    <div>
                        <label> Time Quantize </label>
                        <select onChange={(e) => setQuantize(Number(e.target.value))}>
                            <option value={0}>None</option>
                            <option value={1}>Beat</option>
                            <option value={2}>Half</option>
                            <option value={4}>Quarter</option>
                            <option value={8}>Eighth</option>
                            <option value={16}>Sixteenth</option>
                            <option value={32}>32nd</option>
                            <option value={64}>64th</option>
                        </select>
                    </div>
                {/* </form> */}
                <p> Song time in seconds: {songTime} / {songLength} </p> 
                <p> Song time in beats: {Math.round(songTime * BPS * 1000) / 1000} </p> 
                <button onClick={downloadMap}> Download Map </button>
            </div>
        </div>
    );
};

function Playhead (props) {
    const color = props.color ? props.color : "black"
    return (
        <div style={{color: color, position: "absolute", borderLeft: "1px solid", height:"375px", left:props.position}}></div>
    )
}

export default BeatmapDesigner;