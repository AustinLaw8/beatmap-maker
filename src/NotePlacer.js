import React from 'react';
import getSongPosition from './BeatmapDesigner'

function NotePlacer(props) {
    const {
        index, 
        notes,
        addNotes,
        songLength,
        fullWidth,
    } = props;
    
    return(
        <div style={{position:"relative"}}>
            <hr/>
             <button onClick={ () => addNotes(index) }/> {/* <img></button> */}
            { notes.map( (note, i) => {
                const position = getSongPosition(note, songLength, fullWidth);
                return (
                    <button key={i} style={{position: "absolute", top:"0", left:position}}/>
                );
            })}
        </div> 
    );
}

export default NotePlacer;
