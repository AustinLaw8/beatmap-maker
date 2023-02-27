import React from 'react';
import Note from './Note'

import { getSongPosition } from './BeatmapDesigner'
import { BUTTON_WIDTH } from './App';

function NotePlacer(props) {
    const {
        index, 
        notes,
        addNotes,
        songLength,
        fullWidth,
    } = props;

    const clickListener = (e) => {
        console.log(e)
        const x = e.pageX;
        if (x <= 16) return;
        const location = (x - BUTTON_WIDTH) / (fullWidth - BUTTON_WIDTH) * songLength;
        addNotes(index, 'location', location);
    }

    return (
        <div onClick={clickListener} style={{position:"relative"}}>
            <hr/>
             <button onClick={ () => addNotes(index, 'index', -1) }/> {/* <img></button> */}
            { notes.map( (note, i) => {
                const position = (getSongPosition(note, songLength, fullWidth, false) - BUTTON_WIDTH / 2) + "px";
                return (
                    <Note key={i} position={position}/>
                );
            })}
        </div> 
    );
}

export default NotePlacer;
