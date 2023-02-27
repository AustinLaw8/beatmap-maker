import React, { useEffect, useRef } from 'react';
import WaveSurfer from 'wavesurfer.js';

// import { WaveformContainer, Wave, PlayButton } from './Waveform.styled';

function Waveform (props) {  
    const {
        url,
        setSongTime,
        setSongLength,
        fullWidth,
    } = props;
    const waveform = useRef(null);
    if (waveform.current)
    {
        waveform.current.minPxPerSec = fullWidth / waveform.current.getDuration();
    }
    
    useEffect(() => {
        const interval = setInterval(() => setSongTime(Math.round(waveform.current.getCurrentTime() * 1000) / 1000), 1);

        return () => clearInterval(interval);
    }, [setSongTime]);

    useEffect( () => {
        const onSpacePress = (e) => {
            if (e.code === "KeyP") {
                waveform.current.playPause();
            }
        }
        document.addEventListener("keydown", onSpacePress, false);
    }, []);

    useEffect( () => {
        const setSongLengthAndSize = (length) => {
            setSongLength(length)
            waveform.current.minPxPerSec = fullWidth / length;
        }
    
        var pxPerSec;
        if (waveform.current)
        {
            pxPerSec = fullWidth / waveform.current.getDuration();
            waveform.current.destroy();
        }
        else
        {
            pxPerSec = 50;
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
            fillParent: true,
            minPxPerSec:pxPerSec,
        });
    
        waveform.current.load(url);
        waveform.current.on('ready', () => setSongLengthAndSize(waveform.current.getDuration()));
    }, [url, waveform, setSongLength, fullWidth]);


    return (
      <div style={ {display: "flex" } }>
        <button onClick={ () => waveform.current.playPause() }/>
        <div id="waveform" style={ { width:fullWidth + "px", height: "90px"} }/>
        <audio id="track" src={url} />
      </div>
    );
};

export default Waveform;