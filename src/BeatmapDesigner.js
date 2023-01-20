import React, { useState } from 'react';

import NotePlacer from './NotePlacer';
import Waveform from './Waveform';

function BeatmapDesigner (props) {
    const [BPM, setBPM] = useState(0)
    const [songTime, setSongTime] = useState(0);
    const [songLength, setSongLength] = useState(0);
    const [allNotes, setNotes] = useState([[],[],[],[],[],[]])

    const addNotes = (index) => {
        const temp = [...allNotes];
        temp[index].push(songTime)
        setNotes(temp);
    };
    console.log(songLength);

    return (
      <div style={ {display: "flex", flexDirection: "column" } }>
        <div>
            <div>
                <label>BPM:</label>
                <input type="number"onChange={(e) => setBPM(e.target.value)}/>
            </div>
            <p> Song time in seconds: {songTime} / {songLength} </p> 
            <p> Song time in beats: {Math.round(songTime * BPM / 60 * 1000) / 1000} </p> 
        </div>
        <div>
            <Waveform url={props.url} time={songTime} setSongTime={setSongTime} setSongLength={setSongLength}/>
            { allNotes.map( (notes, i) => 
               <NotePlacer key={i} index={i} notes={notes} addNotes={addNotes} songLength={songLength}/>
            )}   
            <hr/>
        </div>
      </div>
    );
};

export default BeatmapDesigner;