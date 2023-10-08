import React from 'react';
import Note from './Note'

import { getSongPosition, getSongTime } from './BeatmapDesigner'
import { BUTTON_WIDTH } from './App';

function NotePlacer(props) {
    const {
        index, 
        notes,
        addNotes,
        setHoldNote,
        setHoldNoteStart,
        songLength,
        fullWidth,
    } = props;

    const pointerListener = (e) => {
        const x = e.pageX;
        if (x <= 16)
        {
            return;
        }
        if (e.target.type === 'submit') 
        {
            setHoldNoteStart([index, e.pageX, e.pageY ]);
            return;
        }
        const location = getSongTime(x, songLength, fullWidth);
        addNotes(index, 'location', location);
    }

    const dropListener = (e) => {
        setHoldNote([index, e.pageX, e.pageY]);
    }

    // TODO: draggable notes
    
    return (
        <div onMouseDown={pointerListener} onDragOver={(e)=>e.preventDefault()} onDrop={dropListener} style={{position:"relative"}}>
            <hr/>
             <button onClick={ () => addNotes(index, 'index', -1) }/> {/* <img></button> */}
            { notes.map( (note, i) => {
                const position = (getSongPosition(note, songLength, fullWidth, false) - BUTTON_WIDTH / 2);
                return (
                    <Note key={i} position={position} notePos={note} {...props}/>
                );
            })}
        </div> 
    );
}

export default NotePlacer;
