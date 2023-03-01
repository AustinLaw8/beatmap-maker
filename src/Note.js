import React, { useState } from 'react';
import { BUTTON_WIDTH } from './App';
// import TapNote from './Tap note.png';

function Note (props) {   
    const {
        index,
        position,
        changeNotes,
    } = props;
    const [type, setType] = useState(0);

    const cycle = () => {
        console.log(position + BUTTON_WIDTH / 2)
        changeNotes(index, position + BUTTON_WIDTH / 2, (type + 1) % 2);
        setType((type + 1) % 2)
    }

    return (
        <button style={{position: "absolute", top:"50%", left:position+"px"}} onClick={cycle}/>
            // {/* <img src={TapNote} height={BUTTON_WIDTH} width={B}/> */}
    )
}
export default Note;
