import React, { useState } from 'react';

import NotePlacer from './NotePlacer';
import Waveform from './Waveform';

function getSongPosition (position, songLength, fullWidth)
{
    return String(Math.floor(position / songLength * (fullWidth - 16)) + 16) + "px";
    // return String(Math.floor((position / songLength + 16 / fullWidth) * 100000) / 1000) + "%";
}

function BeatmapDesigner (props) {
    const [BPM, setBPM] = useState(0)
    const [songTime, setSongTime] = useState(0);
    const [songLength, setSongLength] = useState(0);
    const [allNotes, setNotes] = useState([[],[],[],[],[],[],[]])
    const [fullWidth, setWidth] = useState(0);

    const addNotes = (index) => {
        const temp = [...allNotes];
        temp[index].push(songTime)
        setNotes(temp);
    };

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
    const measureBars = BPM !== 0 ? new Array (Math.floor(BPM / 60 * songLength)).fill(0) : [];
    return (
      <div style={ {display: "flex", flexDirection: "column", width:fullWidth+"px"} }>
        <div style={{position:"fixed"}}>
            <div>
                <label>Page Width:</label>
                <input type="number"onChange={(e) => setWidth(e.target.value) }/>
            </div>
            <div>
                <label>BPM:</label>
                <input type="number"onChange={(e) => setBPM(e.target.value)}/>
            </div>
            <p> Song time in seconds: {songTime} / {songLength} </p> 
            <p> Song time in beats: {Math.round(songTime * BPM / 60 * 1000) / 1000} </p> 
        </div>
        <div style={{marginTop:"150px"}}>
            { measureBars.map( (_, i) => {
                return <Playhead position={getSongPosition((i + 1) * 60 / BPM, songLength, fullWidth)} color={"silver"}/>
            })}
            <Playhead position={position}/>
            <Waveform url={props.url} time={songTime} setSongTime={setSongTime} setSongLength={setSongLength} fullWidth={fullWidth}/>
            { allNotes.map( (notes, i) => 
               <NotePlacer key={i} index={i} notes={notes} addNotes={addNotes} songLength={songLength} fullWidth={fullWidth}/>
            )}   
            <hr/>
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