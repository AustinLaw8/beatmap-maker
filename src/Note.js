import React, { useState } from 'react';
import { BUTTON_WIDTH } from './App';


function Note (props) {   
    const {
        index,
        position,
        changeNotes,
    } = props;
    const [type, setType] = useState(0);
    console.log("note pos" + position)

    const cycle = () => {
        setType((type + 1) % 2)
        changeNotes(index, position + BUTTON_WIDTH / 2, type);
    }

    return (
        <button style={{position: "absolute", top:"50%", left:position+"px"}} onClick={cycle}/>
    )
}
export default Note;
