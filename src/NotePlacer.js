  

import React from 'react';

function NotePlacer(props) {
    const {
        index, 
        notes,
        addNotes,
        songLength,
    } = props;
    
    return(
        <div style={{position:"relative"}}>
            <hr/>
            <button onClick={ () => addNotes(index) }/>
            { notes.map( (note, i) => {
                const position = String(Math.floor(note / songLength * 100)) + "%";
                return (
                    <button key={i} style={{position: "absolute", top:"0", left:position}}/>
                );
            })}
        </div> 
    );
}

export default NotePlacer;
