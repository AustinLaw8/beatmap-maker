import React from 'react';

function Note (props) {   
    const {
        position,
    } = props;

    return (
        <button style={{position: "absolute", top:"50%", left:position}}/>
    )
}
export default Note;
