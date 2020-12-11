# Z_TENNOT_IU

The first version of the interface is inspired by harmonic table note layout, Euler-Tonnetz, Browser GUI, WebMIDI interface and sequencing. You can use up to five fingers to play notes on the interval grid. Theoretically you can use as much fingers as your touch-hardware supports, but the internal polyphonic mapping is limited to five fingers. Additional there is a sequencer that let you loop your input and modifies it in terms of time.

Visit

https://www.z-tennot-iu.de

# Usage

## Button Matrix
![](buttonarea.png?raw=true)

Use the note value labeled squares to play single tones. Use the belts between squares to play the two connected notes (interval of two tones, thirds downwards, fith horizontal path, and other intervals digonal path). And finally you can use the encircled area to play the three notes in the corners of the area (a harmonic interval of three tones). Trajectories (melodic intervals) formed through the travel of you fingertips could consist of only the type of shape you started at, or of all kinds of shapes. MIDI note-on and note-off mapping is close to MIDI Polyphonic Expression. You can play up to three channels with one touch. If you play one tone with one finger on channel is used, if you play two tones with one finger two channels are used and finally if you play three notes with one finger three channels are used. This MIDI mapping allows up to five finger polyphonic performance.


## Main Menu
![](allmen.png?raw=true)

There are six menu buttons at the bottom of the interface. They show and hide the corresponding menus. The last Button is a reload button. 

## MIDI Menu
![](midi.png?raw=true)

The MIDI menu let you control the hardware / software midi output the program should send to and listen to. MIDI input is not used now. The last selection enables sending to all MIDI devices. Most user-selections are stored in the browser local storage and are used as configuration preset.

## UI (user interface) Menu
![](ui.png?raw=true)

This menu is related to the user interface. You can choose if a path or trajectory you form with your touches has only a single type of note play (for example just hexagon buttons) or could be a mixture of all possible button forms. You can choose between a white and a black background (day/night selection). There is a select to increase the spcing between the hexagon buttons and a selction how big the botton areashould get. Note, if you change the size of the buttonarea the page gets reloaded. Use The *vTS* and the *hTS* pulldown menu to change the halfetone steps of the tonnetz gui. *vTS* changes the vertical stepsize and *hTS* changes the horizontal stepsize.

## Gesture Menu
![](gest.png?raw=true)

Towards a not random aleatoric and not functional modification of parameters the software provides a light evaluation of "shape" of trajectories and movement. There are more possibilities to computer control values from movement and picture, but there need to be the possibility of expectation of audible modification a performance provokes.

The gesture menu enables the mapping of computed control value to a MIDI signal. The first selection en- or disables the whole thing. If enabled you can choose if Velocity, Aftertouch or/and Pitch Bend should be used. The performance gains liveliness. Test it.

## Sequencer Menu
![](seq.png?raw=true)

The sequencer plays back the "recorded trajectories" and emits the MIDI on its own. If the first selection is set, every new touch or path is added to the sequencer. The sequencer main menu supports play, pause, and deleting of the sequence. You also can download a sequence and upload it again.
Each sequencer step is represented by a box housing a pulldown and a selection. The pulldown lets you choose a delay after the sequencerstep is played. The selection lets you mute the step. The Pulldown sets a delay after the step. And the arrow buttons let you change the position of the step.

Example sequences are hosted in the seqs folder.

The visual feedback provided by the sequencer is a point mirrored picture of the input trajectory. Small lines guide you back to where the input took place.

# Example Synthesizers

## internal Synth Menu
![](synth.png?raw=true)

To test the button matrix one can use a simple muilt oszillator WebAudio synth. The checkbox enables or disables the internal playback. The selection is not part if the presets, since user interactio is forced by the WebAudio implementation.


### Sound
Use the pulldown label "Waveform" to change the charcteristic of all oscillators. Use the pulldown labeled "Filtertype" to change the filter characteristic of all active filters. Select a Q Factor (0.0001 - 1000.0) of all filters and a the cutoff / center frequency of the filter. You also can select between two tunings.
 
### Gesture mapping (experimental)
The mapping of the gesture values is as follwos:

Movement/Gesture | MIDI | internal Synth
-------- | -------- | --------
trajectory speed | Note Venocity | oscillator gain
curvature | Channel Aftertouch | detune of all active osicillators

### Note
Take a look into the browser list, if WebAudio is supported by your browser:

https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API

## PD
The first example software synthesizer is made with pure data (PD). You can find PD examples in the PDsynth folder. The sequencer takes note-on and -off messages and channel-aftertouch messages. It has 15 voices or let say oscillators and a additional 15 oscillators for modulation. The output is a signal sum and that is it. 

# MIDI
Take a look if you Browser supports WebMidi:

https://developer.mozilla.org/en-US/docs/Web/API/MIDIAccess


## on Linux
On linux you might use the command

aconnect 'Midi Through' 'Pure Data'

to connect the virtual MIDI cable, depending on you setup.

## on Windows
On Windows you might use a additional software to create virtual MIDI ports. We have tested virtualMIDI (get it from https://www.tobias-erichsen.de/software/virtualmidi.html)

## on OSX 
You can use the

# Notes
* Use Chrome, there are Issues with other browsers.
* Use the fullscreen mode of the browser to expand the button area.
* No WebMidi, try the polyfill: https://github.com/cwilso/WebMIDIAPIShim
* Since this https://www.fxsitecompat.dev/en-CA/docs/2019/legacy-touch-events-api-is-now-disabled-on-desktop/ is a problem we moved to PointerEvent API


# Looks like?
![](a5..png?raw=true)
![](a6.png?raw=true)
![](a7.png?raw=true)
![No Menu](a1.png?raw=true)
![All Menu](a4.png?raw=true)
![](v21.png?raw=true)
![](v22.png?raw=true)
![](v23.png?raw=true)
![](v24.png?raw=true)
One quick screencast of the running sequencer:

https://www.z-tennot-iu.de/quickview1.webm

# Version
v.0.1 (03.12.2019) tested on latest Linux desktop Chrome and 24" Full HD touchscreen

v.0.2 (21.01.2020) pointing and touch device support, tested on VGA and HD screens

v.0.3 (12.02.2020) better webaudio, better interface, multitouch error deletion

Tested ON:


Chrome Version 79.0.3945.79 64 Bit Linux -- *full support*

Chromium Version 79.0.3945.79 64 Bit Linux -- *full support*

Opera 65.0.3467.69 64 Bit Linux -- *full support*

Firefox, Safari, Edge and IE are not supported.

# Future Days
If someone needs Open Sound Control, I can provide the whole software as browser plug-in with Open Sound Control. If someone face any errors please forward the issue right hear. 

# Installation

If you want to use the software offline or on your server, just extract the content of the src folder to a dictory of your server and make this available. It's just a website. Note: For online operation HTTPS is required to enable webMIDI. If you run localhost, it is not required. If you just open the index.html from a local folder a configuration of your browser is maybe needed. 

