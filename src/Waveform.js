import React, { useEffect, useRef } from 'react';
import WaveSurfer from 'wavesurfer.js';

function Waveform (props) {  
    const {
        url,
        isPlaying,
        setPlaying,
        setSongTime,
        setSongLength,
        fullWidth,
    } = props;
    const waveform = useRef(null);

    useEffect(() => {
        if (waveform.current && isPlaying !== waveform.current.isPlaying()) waveform.current.playPause();
    }, [isPlaying]);
    
    useEffect(() => {
        const interval = setInterval(() => setSongTime(waveform.current.getCurrentTime()), 1);
        return () => clearInterval(interval);
    }, [setSongTime]);


    useEffect( () => {
        const setSongLengthAndSize = (length) => {
            setSongLength(length)
            waveform.current.minPxPerSec = fullWidth / length;
        }
    
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
            fillParent: true,
        });
    
        waveform.current.load(url);
        waveform.current.on('ready', () => setSongLengthAndSize(waveform.current.getDuration()));
    }, [url, fullWidth, setSongLength]);

    return (
      <div style={ {display: "flex" } }>
        <button onClick={ () => { waveform.current.playPause(); setPlaying(waveform.current.isPlaying());} }/>
        <div id="waveform" style={ { width:fullWidth + "px", height: "90px"} }/>
      </div>
    );
};

export default Waveform;