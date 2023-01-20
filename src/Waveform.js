import React, { useEffect, useState, useRef } from 'react';
import WaveSurfer from 'wavesurfer.js';

// import { WaveformContainer, Wave, PlayButton } from './Waveform.styled';

function Waveform (props) {  
    const {
        url,
        setSongTime,
        setSongLength,
    } = props;
    const waveform = useRef(null);
    const [isPlaying, playPause] = useState(false);

    
    const onPlayPause  = () => {
        playPause(!isPlaying);
        waveform.current.playPause();
    };

    const onSpacePress = (e) => {
        if (e.code === "KeyP") {
            onPlayPause();
        }
    }

    useEffect(() => {
        const interval = setInterval(() => setSongTime(Math.round(waveform.current.getCurrentTime() * 1000) / 1000), 1);

        return () => clearInterval(interval);
    }, []);

    useEffect( () => {
        document.addEventListener("keydown", onSpacePress, false);
    }, []);

    useEffect( () => {
        if (waveform.current)
        {
            waveform.current.destroy();
        }
        
        waveform.current = WaveSurfer.create({
            barWidth: 3,
            cursorWidth: 1,
            container: '#waveform',
            backend: 'WebAudio',
            height: 80,
            progressColor: '#2D5BFF',
            responsive: true,
            waveColor: '#EFEFEF',
            cursorColor: 'transparent',
        });
    
        waveform.current.load(url);
        waveform.current.on('ready', () => setSongLength(waveform.current.getDuration()));
    }, [url, waveform, setSongLength]);


    return (
      <div style={ {display: "flex" } }>
        <button onClick={onPlayPause}/>
        <div id="waveform" style={ { width: "100%", height: "90px"} }/>
        <audio id="track" src={url} />
      </div>
    );
};

export default Waveform;