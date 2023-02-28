import React, { useState } from 'react';

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
    const [allNotes, setNotes] = useState([[],[],[],[],[],[],[]])
    const [fullWidth, setWidth] = useState(0);
    const [quantize, setQuantize] = useState(0);

    const BPS = BPM / 60;
    const SPB = 1 / BPS;

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

        if (quantize !== 0)
        {
            const targetInBeats = target * BPS;
            const quantizedTargetInBeats = Math.round(targetInBeats * quantize) / quantize;
            target = quantizedTargetInBeats * SPB;
            console.log(target);
        }

        const temp = [...allNotes];
        temp[index].push(target)
        setNotes(temp);
    };

    const changeNotes = (index, location, next) => {
        location = getSongTime(location, songLength, fullWidth);
        const temp = [...allNotes];
        // lowkey i dont understand this code it does not work the way i think its supposed to but 
        switch (next) 
        {
            case 0: 
                temp[index][temp[index].findIndex(e => e === location)] *= -1;
                break;
            case 1:
                temp[index][temp[index].findIndex(e => e === -location)] *= -1;
                break;
            default:
                console.log("err probably occurred in changeNotes, BeatmapDesigner line 57");
                break;
        }
        setNotes(temp);
    }

    const downloadMap = () => {
        const data = allNotes.map( (lane) => {
            return lane.sort( (a, b) => Math.abs(a) - Math.abs(b) ).join()
        }).join('\n');
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

    // Full width, including the scroll part
    if (fullWidth === 0) 
    {
        setWidth(Math.max(
            document.body.scrollWidth,
            document.documentElement.scrollWidth,
            document.body.offsetWidth,
            document.documentElement.offsetWidth,
            document.body.clientWidth,
            document.documentElement.clientWidth
        ));
    }

    const position = getSongPosition(songTime, songLength, fullWidth)
    const measureBars = BPM !== 0 ? new Array (Math.floor(BPS * songLength)).fill(0) : [];
    console.log(allNotes)
    return (
        <div>
            <div style={ {width:fullWidth+"px"} }>
                <div>
                    { measureBars.map( (_, i) => {
                        return <Playhead key={i} position={getSongPosition((i + 1) * SPB, songLength, fullWidth)} color={"silver"}/>
                    })}
                    <Playhead position={position}/>
                    <Waveform url={props.url} time={songTime} setSongTime={setSongTime} setSongLength={setSongLength} fullWidth={fullWidth}/>
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