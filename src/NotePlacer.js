import React from 'react';
import Note from './Note'

import { getSongPosition, getSongTime } from './BeatmapDesigner'
import { BUTTON_WIDTH } from './App';

function NotePlacer(props) {
    const {
        index, 
        notes,
        addNotes,
        changeNotes,
        songLength,
        fullWidth,
    } = props;

    const clickListener = (e) => {
        const x = e.pageX;
        if (x <= 16 || e.target.type === 'submit') return;
        const location = getSongTime(x, songLength, fullWidth);
        addNotes(index, 'location', location);
    }

    return (
        <div onClick={clickListener} style={{position:"relative"}}>
            <hr/>
             <button onClick={ () => addNotes(index, 'index', -1) }/> {/* <img></button> */}
            { notes.map( (note, i) => {
                const position = (getSongPosition(note, songLength, fullWidth, false) - BUTTON_WIDTH / 2);
                return (
                    <Note key={i} index={index} position={position} changeNotes={changeNotes}/>
                );
            })}
        </div> 
    );
}

export default NotePlacer;
