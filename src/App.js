import React, { useState } from 'react';

import BeatmapDesigner from './BeatmapDesigner';

// import logo from './logo.svg';
import './App.css';
import README from './README';

function App() {
    const [fileURL, setURL] = useState(null);

    const changeHandler = (event) => {
        const file = event?.target.files[0];
        console.log(file)
        if (file !== null && file !== undefined)
        {
            if (file.type === 'audio/wav')
            {
                setURL(URL.createObjectURL(file));
            }
            else
            {
                alert("Select a wav file pls");
            }
        }
        
    };

    return(
        <div>
            <README />
            <input type="file" name="file" onChange={changeHandler} />
            {fileURL !== null ? (
                <BeatmapDesigner url={fileURL}/>
            ) : <></> }
        </div>
    );
}

export default App;
