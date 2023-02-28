function README () {
    return (
        <div>
            <div>
                <h2> Currently not implemented </h2>
                <ul>
                    <li> Deleting notes </li>
                    <li> Undo / redo stacks </li>
                    <li> Other note types in general (flick and hold) </li>
                </ul>
            </div>
            <div>
                <h1> Instructions </h1>
                Upload a song you want to make a beatmap for (currently only accepts .wav). <br />
                Once the song is uploaded, enter the bpm to be able to see times in beats. <br />
                Press 'P' to play/pause. (clicking buttons is a little iffy, since 'SPACE' also presses the button) <br />
                Click the button on the sides of the channels to add a note at the time you are at. <br />
                Click a location to add a note there. <br />
                If quantize is enabled, the designer will place the note at the nearest chosen fraction of a beat (based on BPM) <br />
                It is highly recommended to provide a large page width and include BPM to get a better idea of your beatmap.
            </div>
        </div>
    );
};

export default README;