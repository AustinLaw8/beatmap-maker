import React, { useEffect, useState } from 'react';

import NotePlacer from './NotePlacer';
import Waveform from './Waveform';

import { BUTTON_WIDTH } from './App';

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

    const BPS = BPM / 60;
    const SPB = 1 / BPS;

    
    const undo = () => {
        if (undoStack.length === 0) return;

        const undoCopy = JSON.parse(JSON.stringify(undoStack));
        const redoCopy = JSON.parse(JSON.stringify(redoStack));

        const currentState = JSON.parse(JSON.stringify(allNotes));
        redoCopy.push(currentState);

        const undoneState = undoCopy.pop();

        setUndoStack(undoCopy);
        setRedoStack(redoCopy);
        setNotes(undoneState);
        setSelected([0,0]);
    }

    const redo = () => {
        if (redoStack.length === 0) return;

        const undoCopy = JSON.parse(JSON.stringify(undoStack));
        const redoCopy = JSON.parse(JSON.stringify(redoStack));

        const currentState = JSON.parse(JSON.stringify(allNotes));
        undoCopy.push(currentState);

        const redoneState = redoCopy.pop();

        setUndoStack(undoCopy);
        setRedoStack(redoCopy);
        setNotes(redoneState);
        setSelected([0,0]);
    }

    const deleteLastNote = () => {
        if (selected !== [0,0]) {
            const [ target, index ] = selected
            const copy = JSON.parse(JSON.stringify(allNotes));
            const temp = JSON.parse(JSON.stringify(allNotes));
            temp[index].splice(temp[index].findIndex(e => e === target),1);

            setUndoStack([...undoStack, copy]);
            setRedoStack([]);
            setNotes(temp);
            setSelected([0,0]);
        }
    }

    const onKeyDown = (e) => {
        switch (e.keyCode)
        {
            case 8: // Backspace
                deleteLastNote();
                break;
            case 32: // Space
                setPlaying(!isPlaying);
                e.preventDefault();
                break;
            case 80: // P
                setPlaying(!isPlaying);
                break;
            case 89: // Y
                if (e.ctrlKey || e.metaKey) redo();
                if (e.metaKey) e.preventDefault();
                break; 
            case 90: // Z
                if (e.ctrlKey || e.metaKey) undo();
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

        if (quantize != 0 && BPM !== 0)
        {
            const targetInBeats = target * BPS;
            const quantizedTargetInBeats = Math.round(targetInBeats * quantize) / quantize;
            target = quantizedTargetInBeats * SPB;
        }
    
        const copy = JSON.parse(JSON.stringify(allNotes));
        const temp = JSON.parse(JSON.stringify(allNotes));
        temp[index].push(target);
        setUndoStack([...undoStack, copy]);
        setRedoStack([]);
        setNotes(temp);
        setSelected([target, index]);
    };

    const changeNotes = (index, location, next) => {
        location = getSongTime(location, songLength, fullWidth);
        const temp = JSON.parse(JSON.stringify(allNotes));
        switch (next) 
        {
            case 0: 
                temp[index][temp[index].findIndex(e => e === -location)] *= -1;
                break;
            case 1:
                temp[index][temp[index].findIndex(e => e === location)] *= -1;
                break;
            default:
                console.log("err probably occurred in changeNotes, BeatmapDesigner line 57");
                break;
        }

        const copy = JSON.parse(JSON.stringify(allNotes));
        setUndoStack([...undoStack, copy]);
        setRedoStack([]);
        setNotes(temp);
        setSelected([location*-1, index]);
    }

    const downloadMap = () => {
        const data = allNotes.map( (lane) => 
            lane.sort( (a, b) => Math.abs(a) - Math.abs(b) ).join()
        ).join('\n');
        const url = window.URL.createObjectURL(
            new Blob([data]),
        );

        const link = document.createElement('a');
        link.href = url;
        link.setAttribute(
            'download',
            `FileName.pdf`,
        );

        document.body.appendChild(link);
        link.click();
        link.parentNode.removeChild(link);
    }


    const position = getSongPosition(songTime, songLength, fullWidth);
    const measureBars = BPM !== 0 ? new Array (Math.floor(BPS * songLength)).fill(0) : [];

    console.log(allNotes);
    console.log(undoStack);
    console.log(redoStack);
    console.log(selected);

    return (
        <div style={{outlineStyle:"hidden"}}tabIndex={-1} onKeyDown={onKeyDown}>
            <div style={{margin:"10px"}}>
                click here to activate keyboard shortcuts because idk how to fix this bug
            </div>
            <div style={ {width:fullWidth+"px"} }>
                <div>
                    { measureBars.map( (_, i) => {
                        return <Playhead key={i} position={getSongPosition((i + 1) * SPB, songLength, fullWidth)} color={"silver"}/>
                    })}
                    <Playhead position={position}/>
                    <Waveform url={props.url} isPlaying={isPlaying} time={songTime} setPlaying={setPlaying} setSongTime={setSongTime} setSongLength={setSongLength} fullWidth={fullWidth}/>
                    { allNotes.map( (notes, i) => 
                    <NotePlacer key={i} index={i} notes={notes} addNotes={addNotes} songLength={songLength} fullWidth={fullWidth} changeNotes={changeNotes}/>
                    )}   
                    <hr/>
                </div>
            </div>

            <div style={{position:"fixed", marginLeft:BUTTON_WIDTH+10+"px"}}>
                <div>
                    <label>Page Width:</label>
                    <input type="number"onChange={(e) => setWidth(e.target.value) }/>
                </div>
                <div>
                    <label>BPM:</label>
                    <input type="number"onChange={(e) => setBPM(e.target.value)}/>
                </div>
                <div>
                    <label> Time Quantize </label>
                    <select onChange={(e) => setQuantize(e.target.value)}>
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
        <div style={{color: color, position: "absolute", borderLeft: "1px solid", height: "500px", left:props.position}}></div>
    )
}

export default BeatmapDesigner;