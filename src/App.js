import React, { useState } from 'react';

import BeatmapDesigner from './BeatmapDesigner';

// import logo from './logo.svg';
import './App.css';
import README from './README';

export const BUTTON_WIDTH = 16;

function App() {
    const [fileURL, setURL] = useState(null);
    const [fileName, setName] = useState(null);

    const changeHandler = (event) => {
        const file = event?.target.files[0];
        console.log(file);
        
        if (file !== null && file !== undefined)
        {
            if (file.type === 'audio/wav' || file.type === 'audio/x-wav' || file.type === 'audio/mpeg' || file.type.include('audio'))
            {
                setURL(URL.createObjectURL(file));
                setName(file.name.substring(0, file.name.length - 3));
            }
            else
            {
                alert("Select a wav/mp3 file pls");
            }
        }
        
    };

    return(
        <div>
            <README />
            <input type="file" name="file" onChange={changeHandler} />
            {fileURL !== null ? (
                <BeatmapDesigner fileName={fileName} url={fileURL}/>
            ) : <></> }
        </div>
    );
}

export default App;
