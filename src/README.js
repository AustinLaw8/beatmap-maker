function README () {
    return (
      <div>
        Upload a song you want to make a beatmap for (currently only accepts .wav). <br />
        Once the song is uploaded, enter the bpm to be able to see times in beats. <br />
        Press 'P' to play/pause. (clicking buttons is a little iffy, since 'SPACE' also presses the button) <br />
        Click the button on the sides of the channels to add a note at the time you are at. <br />
        Click a location to add a note there.
        {/* If quantize is enabled, the designer will place the note at the nearest 1/32 beat (based on BPM) */}
      </div>
    );
};

export default README;