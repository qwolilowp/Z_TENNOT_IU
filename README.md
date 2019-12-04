# Z_TENNOT_IU

The first version of the interface is inspired by harmonic tabel note layout, Tonnetz, Browser GUI, WebMIDI Interface and Sequencing. You can use up to five fingers to play notes on the intervall grid. Theoreticaly you can use as much fingers as your touchhardware supports, but the internal polyphon mapping is limited to five fingers. Additional there is a sequencer that let you loop your input and modifie it in terms of time.

# Usage

## Button Matrix
![](buttonarea.png?raw=true)

Use the note value labeled hexagon to play single tones. Use the belts between hexagons to play the two connected notes. And finaly you can use the encircled area to play the three notes in the corners of the area. Trajectories formed through the travel of you fingertips could constist of only the type of shape you started at, or of all kinds of shapes. MIDI note-on and note-off mapping is close to MIDI Polyphonic Expression. You can play up to three channels with one touch. If you play one tone with one finger on channel is used, if you play two tones with one finger two channels are user and finaly if you play three notes with one finger three channels are used. This MIDI Mapping allows up to five finger polyphon performance.

## MIDI Menu
![](midi.png?raw=true)

There are four menu buttons at the bottom of the interface. The show and hide the corresponding menus. The MIDI menu let you control the hardware / software midi output the programm should send to and listen to. MIDI input is not used now. The last select enables sending to all MIDI devices. Most selections are stored in the browser local storage and is used as configuration preset. 

## UI (user interface) Menu 
![](ui.png?raw=true)

This menu is related to the user interface. You can choose if a path or trajectory you form with your touches has only a single type of noteplay (for example just hexagon buttons) or a could be a mixture of all possible buttonforms. You can choose betrwwn a white and a black background. And there is a touchsimmulation called selftouch for testing purpose.

## Gesture Menu
![](gest.png?raw=true)

Towards a not aleatiric but not functional modification of parameters the software provides a light evaluation of "shape" of trajectories and movement. There are more possibilities to computer control values from movement and picture, but there need to be the possibility of expaction of audible modification a performance provokes.

The gesture menu enables the mapping of computed control value to a MIDI signal. The first selection en- or disables the whole thing. If enabled you can choose if Velocity, Aftertouch or/and Pitch Bend sould be used. The performance gains liveliness. Test it.

## Sequencer Menu
![](seq.png?raw=true)

The sequencer playes back the "recorded trajectories" and emits the MIDI on its own. If the first selection is set, every new touch or path is added to the sequncer. The sequencer main menu supports play, pause, and deleting of the sequence. You also can download a sequnce and upload it again.
Each sequencer step is represented by a box housing a pulldown and a selection. The pulldown lets you choose a delaay after the sequncerstep is played. The selection lets you mute the step. The internal time of each step corresponds to the duration of input. 

# Example Sequencer

## PD
The first example software synthesizer is made with pure data (PD). You can find PD examples in the PDsynth folder. The sequencer takes note-on and -off messages and channel after touch messages. It as 15 voices or let say oscillators and a additional 15 oscillators for modulation. The the output is a singal sum and that is it.


# Looks like?
![](a5..png?raw=true)
![](a6.png?raw=true)
![](a7.png?raw=true)
![No Menu](a1.png?raw=true)
![All Menu](a4.png?raw=true)

# Version
v.0.1 (03.12.2019) tested on latest Chrome 

# Futur Days
For the next Version an adaption to smaller touchscreens is planned. Also I am looking forward to receive some nice sequences as example. If someone needs Open Sound Control, I can provide the whole software as Browserplugin with Open Sound Control. If someone face any errors please forward the issue right hear. The example sequencer will be upgraded with a convoltion filter and a different tuning. Any ideas, onyone?

