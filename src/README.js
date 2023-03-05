function README () {
    return (
        <div>
            <div>
                <h2> Currently not implemented </h2>
                <ul>
                    <li> Deleting hold notes </li>
                    <li> Undo/redo for hold notes </li>
                </ul>
            </div>
            <div>
                <h1> Instructions </h1>
                Upload a song you want to make a beatmap for (currently only accepts .wav). <br />
                Once the song is uploaded, enter the bpm to be able to see times in beats. <br />
                Click the button on the sides of the channels to add a note at the time you are at. <br />
                Click a location to add a note there. <br />
                If quantize is enabled, the designer will place the note at the nearest chosen fraction of a beat (based on BPM) <br />
                It is highly recommended to provide a large page width and include BPM to get a better idea of your beatmap. <br />
                <h1> Keyboard Shortcuts </h1>
                'P' or 'SPACE' to play/pause <br />
                'Ctrl + Z' to undo. (sometimes undo and redo does not work) <br />
                'Ctrl + Y' to redo. <br />
                'Backspace' to delete currently selected note (be careful, since there is no indication of the "currently selected" note. however, it is the last note you clicked or placed down"<br />
                <h1> Legend </h1>
                Purple: tap note <br />
                Gold: Flick note <br />
            </div>
        </div>
    );
};

export default README;