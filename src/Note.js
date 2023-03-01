import React, { useEffect, useState } from 'react';
import { BUTTON_WIDTH } from './App';
// import TapNote from './Tap note.png';

function Note (props) {   
    const {
        index,
        position,
        changeNotes,
        notePos,
    } = props;
    const [type, setType] = useState(0);

    useEffect(() => {
        setType(notePos > 0 ? 0 : 1);
    }, [notePos]);
    

    const cycle = () => {
        changeNotes(index, position + BUTTON_WIDTH / 2, (type + 1) % 2);
        setType((type + 1) % 2);
    }

    const color = type === 0 ? "#904d86" : "yellow";

    return (
        <button style={{backgroundColor:color, borderWidth:"1px", borderRadius:"2px", position: "absolute", top:"50%", height:"6px", left:position+"px"}} onClick={cycle}/>
    )
}
export default Note;
