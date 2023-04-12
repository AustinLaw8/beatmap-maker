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
        // console.log(e)
        const x = e.pageX;
        if (x <= 16)
        {
            console.log("click triggered out of bounds");
            return;
        }
        if (e.target.type === 'submit') 
        {
            console.log("click triggered on note ")
            setHoldNoteStart([index, e.pageX, e.pageY ]);
            return;
        }
        const location = getSongTime(x, songLength, fullWidth);
        console.log("click triggered");
        addNotes(index, 'location', location);
    }

    const dropListener = (e) => {
        // console.log(e)
        // console.log(getSongTime(x, songLength, fullWidth))
        console.log("drop")
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
