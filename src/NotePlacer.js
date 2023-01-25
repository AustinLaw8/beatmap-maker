import React from 'react';

function NotePlacer(props) {
    const {
        index, 
        notes,
        addNotes,
        songLength,
    } = props;
    

    // Full width, including the scroll part
    const fullWidth = Math.max(
        document.body.scrollWidth,
        document.documentElement.scrollWidth,
        document.body.offsetWidth,
        document.documentElement.offsetWidth,
        document.body.clientWidth,
        document.documentElement.clientWidth
    );
    console.log(fullWidth)
        
    return(
        <div style={{position:"relative"}}>
            <hr/>
            <button onClick={ () => addNotes(index) }/>
            { notes.map( (note, i) => {
                const position = String(Math.floor((note / songLength + 16 / fullWidth) * 100000) / 1000) + "%";
                console.log(position)
                return (
                    <button key={i} style={{position: "absolute", top:"0", left:position}}/>
                );
            })}
        </div> 
    );
}

export default NotePlacer;
