/*

tonnetz exp 2019

GPLv3 copyrigth

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with this program.  If not, see <http://www.gnu.org/licenses/>.

MIDI / LINUX NOTE:
-VMPK: out of the box (ALSA MIDI)
-VCV: out of the box (ALSA MIDI)
-PD: aconnect 'Midi Through' 'Pure Data' (connection via commandline)

*/

"use strict";


/*******************************************************************************

            M U L T I T O U C H M I D I G U I  - N E T Z 

*******************************************************************************/

/*global touch data*/
let touchesTargetOvertime = { };
let mixedtraj = false;
let notesplaying = { };
let mouseit = false;
let howmuchreduce = 0;
let clickedelem = null; //add a elemntmemory for clickinging
let clickedelemid = null; //add a start elem id for pointerEvents Other than touch

/*sequnecer*/
let passtosequencer = true;
let sequencer = [ ];
let seqplaying = 0; //index of which part of sequence is playing 
let doplay = false; //do or not do that is the question
let timingcheck = Date.now();

/*Display*/
let showupelem = null;
let mainsvgelem = null;
let trajectoryelem = null;
let trajcon = null;
let seqdrawelem = null;
let sequcon = null;
let w = null;
let h = null;
let backgrDAYNIGHT = 1; //1 day 0 night
let currentsize = 0; // size of keyarea
let strokeoftraj = "black";
let seqtimingelem = null;
let countbuttons = 0;

//Buttons 
let elemsize = 57; //values are reset by the init fkt
let elemdist = 5;
let elemcount = 19;
let elemradius = 0;
let elemfontsize = 0;
let vs = 4;
let hs = 7;

/*MIDI globals*/
//NEUER STRANDRAD: POLYPHONE EXPRESSION (MPE)
const NOTE_ON_1 = 0x90;//channes 1
const NOTE_ON_2 = 0x91;//channes 2
const NOTE_ON_3 = 0x92;//channes 3
const NOTE_ON_4 = 0x93;//channes 4
const NOTE_ON_5 = 0x94;//channes 5
const NOTE_ON_6 = 0x95;//channes 6
const NOTE_ON_7 = 0x96;//channes 7
const NOTE_ON_8 = 0x97;//channes 8
const NOTE_ON_9 = 0x98;//channes 9
const NOTE_ON_10 = 0x99;//channes 10
const NOTE_ON_11 = 0x9A;//channes 11
const NOTE_ON_12 = 0x9B;//channes 12
const NOTE_ON_13 = 0x9C;//channes 13
const NOTE_ON_14 = 0x9D;//channes 14
const NOTE_ON_15 = 0x9E;//channes 15
const NOTE_ON_16 = 0x9F;//channes 16
const NOTE_ONS = [ [],
                   [NOTE_ON_1, NOTE_ON_2, NOTE_ON_3],
                   [NOTE_ON_4, NOTE_ON_5, NOTE_ON_6], 
                   [NOTE_ON_7, NOTE_ON_8, NOTE_ON_9], 
                   [NOTE_ON_10, NOTE_ON_11, NOTE_ON_12], 
                   [NOTE_ON_13, NOTE_ON_14, NOTE_ON_15], 
                   [NOTE_ON_16] ];
const NOTE_OFF_1 = 0x80;
const NOTE_OFF_2 = 0x81;
const NOTE_OFF_3 = 0x82;
const NOTE_OFF_4 = 0x83;
const NOTE_OFF_5 = 0x84;
const NOTE_OFF_6 = 0x85;
const NOTE_OFF_7 = 0x86;
const NOTE_OFF_8 = 0x87;
const NOTE_OFF_9 = 0x88;
const NOTE_OFF_10 = 0x89;
const NOTE_OFF_11 = 0x8A;
const NOTE_OFF_12 = 0x8B;
const NOTE_OFF_13 = 0x8C;
const NOTE_OFF_14 = 0x8D;
const NOTE_OFF_15 = 0x8E;
const NOTE_OFF_16 = 0x8F;
const NOTE_OFFS = [ [],
                    [NOTE_OFF_1, NOTE_OFF_2, NOTE_OFF_3], 
                    [NOTE_OFF_4, NOTE_OFF_5, NOTE_OFF_6], 
                    [NOTE_OFF_7, NOTE_OFF_8, NOTE_OFF_9], 
                    [NOTE_OFF_10, NOTE_OFF_11, NOTE_OFF_12], 
                    [NOTE_OFF_13, NOTE_OFF_14, NOTE_OFF_15], 
                    [NOTE_OFF_16] ];
const CHANNEL = [ [],
                    [1, 2, 3], 
                    [4, 5, 6], 
                    [7, 8, 9], 
                    [10, 11, 12], 
                    [13, 14, 15], 
                    [16] ];
const FULL_VEL = 127;//0x7f;
const ZERO_VEL = 0;//0x40;
const CHAN_AFTER_1 = 0xD0;
const CHAN_AFTER_2 = 0xD1;
const CHAN_AFTER_3 = 0xD2;
const CHAN_AFTER_4 = 0xD3;
const CHAN_AFTER_5 = 0xD4;
const CHAN_AFTER_6 = 0xD5;
const CHAN_AFTER_7 = 0xD6;
const CHAN_AFTER_8 = 0xD7;
const CHAN_AFTER_9 = 0xD8;
const CHAN_AFTER_10 = 0xD9;
const CHAN_AFTER_11 = 0xDA;
const CHAN_AFTER_12 = 0xDB;
const CHAN_AFTER_13 = 0xDC;
const CHAN_AFTER_14 = 0xDD;
const CHAN_AFTER_15 = 0xDE;
const CHAN_AFTER_16 = 0xDF;
const CHAN_AFTERS = [ [],
                    [CHAN_AFTER_1, CHAN_AFTER_2, CHAN_AFTER_3], 
                    [CHAN_AFTER_4, CHAN_AFTER_5, CHAN_AFTER_6], 
                    [CHAN_AFTER_7, CHAN_AFTER_8, CHAN_AFTER_9], 
                    [CHAN_AFTER_10, CHAN_AFTER_11, CHAN_AFTER_12], 
                    [CHAN_AFTER_13, CHAN_AFTER_14, CHAN_AFTER_15], 
                    [CHAN_AFTER_16] ];
const KEX_AFTER_1 = 0xA0;     
const KEX_AFTER_2 = 0xA1;
const KEX_AFTER_3 = 0xA2;
const KEX_AFTER_4 = 0xA3;
const KEX_AFTER_5 = 0xA4;
const KEX_AFTER_6 = 0xA5;
const KEX_AFTER_7 = 0xA6;
const KEX_AFTER_8 = 0xA7;
const KEX_AFTER_9 = 0xA8;
const KEX_AFTER_10 = 0xA9;
const KEX_AFTER_11 = 0xAA;
const KEX_AFTER_12 = 0xAB;
const KEX_AFTER_13 = 0xAC;
const KEX_AFTER_14 = 0xAD;
const KEX_AFTER_15 = 0xAE;
const KEX_AFTER_16 = 0xAF;
const KEX_AFTERS =  [ [],
                    [KEX_AFTER_1, KEX_AFTER_2, KEX_AFTER_3], 
                    [KEX_AFTER_4, KEX_AFTER_5, KEX_AFTER_6], 
                    [KEX_AFTER_7, KEX_AFTER_8, KEX_AFTER_9], 
                    [KEX_AFTER_10, KEX_AFTER_11, KEX_AFTER_12], 
                    [KEX_AFTER_13, KEX_AFTER_14, KEX_AFTER_15], 
                    [KEX_AFTER_16] ];
const PITCHBE_1 = 0xE0;
const PITCHBE_2 = 0xE1; 
const PITCHBE_3 = 0xE2; 
const PITCHBE_4 = 0xE3; 
const PITCHBE_5 = 0xE4; 
const PITCHBE_6 = 0xE5; 
const PITCHBE_7 = 0xE6; 
const PITCHBE_8 = 0xE7; 
const PITCHBE_9 = 0xE8; 
const PITCHBE_10 = 0xE9; 
const PITCHBE_11 = 0xEA; 
const PITCHBE_12 = 0xEB; 
const PITCHBE_13 = 0xEC; 
const PITCHBE_14 = 0xED; 
const PITCHBE_15 = 0xEE; 
const PITCHBE_16 = 0xEF; 
const PITCHBES =  [ [],
                    [PITCHBE_1, PITCHBE_2, PITCHBE_3], 
                    [PITCHBE_4, PITCHBE_5, PITCHBE_6], 
                    [PITCHBE_7, PITCHBE_8, PITCHBE_9], 
                    [PITCHBE_10, PITCHBE_11, PITCHBE_12], 
                    [PITCHBE_13, PITCHBE_14, PITCHBE_15], 
                    [PITCHBE_16] ];  
//other and unused now
//Controlchange: 0xB,     
//Channelmode: 0xB,       
//Nrpn: 0xB,              
//Programchange: 0xC,     

let Midioutputs = null;
let MIDIinputs = null;
let sendtoall = false; //send to all channels
let theMIDIout = null; //selected MIDI DEVICE
let MIDIchanOffAvailable = [5,4,3,2,1]; //offset available

/*OSC MSG*/    
let jesnoOSC = false;
let OSCstring = "/zTennoT/";

/*GESTURES*/
let jesnogest = false;
let jesnovel = true;
let jesnoafter = false;
let jesnomodulation = false;

/*SVG Globals*/
let xmlns = "http://www.w3.org/2000/svg";

/*internal synth*/
let useinternal = false;

//TONNETZ / harmonische Tabelle
//jedes folgende array ist so versetzt, dass die a10 und a20 kleine Terz ist
//kleine und große Terz und Quinte bestimmen:
//https://upload.wikimedia.org/wikipedia/commons/a/a8/Geteilte_tastatur2.gif
//Layout und Octaven:
//https://www.c-thru-music.com/cgi/?page=layout_octaves
//Orientierung:
//https://en.wikipedia.org/wiki/Harmonic_table_note_layout#/media/File:HarmonicTableMusicNoteLayout.png
//bei dieser Anordnung gibt es zusätzlich andere Intervalle die entstehen, neben Quinten, kleinen und großen Terzen auch Septimen
//USING HELMHOLZ NOTATION -- ONSCREEN USING SCIENTIFIC NOTATION

// kl. Terz -- 3 Halbtonschritte 
// gr. Terz -- 4 Halbtonschritte
// Quinte -- 7 Halbtonschritte
// 1  2    3  4    5  6  7    8  9    10 11   12
// C  Cis  D  Dis  E  F  Fis  G  Gis  A  Ais  H 

let quintenterzen = [
    ["h’’’’’", "e’’’’’", "a’’’’", "d’’’’", "g’’’", "c’’’", "f’’", "ais’", "dis’", "gis", "cis", "Fis", "H#", "E#", "A##", "D##", "G###", "C###"],
    ["g’’’’’", "c’’’’’", "f’’’’", "ais’’’", "dis’’’", "gis’’", "cis’’", "fis’", "h", "e", "A", "Dis", "Gis#", "Cis#", "Fis##", "H###", "E###"],
    ["dis’’’’’", "gis’’’’", "cis’’’’", "fis’’’", "h’’", "e’’", "a’", "d’", "g", "c", "F", "Ais#", "Dis#", "Gis##", "Cis##", "Fis###"], 
    ["h’’’’", "e’’’’", "a’’’", "d’’’", "g’’", "c’’", "f’", "ais", "dis", "Gis", "Cis", "Fis#", "H##", "E##", "A###", "D###"],
    ["g’’’’", "c’’’’", "f’’’", "ais’’", "dis’’", "gis’", "cis’", "fis", "H", "E", "A#", "D#", "G##", "C##", "F###"],
    ["dis’’’’", "gis’’’", "cis’’’", "fis’’", "h’", "e’", "a", "d", "G", "C", "F#","Ais##","Dis##","Gis###","Cis###"],
    ["h’’’", "e’’’", "ais’’", "dis’’", "gis’", "cis’", "fis", "H", "E", "A#", "D#", "G##", "C##", "F###"],
    ["g’’’", "c’’’", "f’’", "ais’", "dis’", "gis", "cis", "Fis", "H#", "E#", "A##", "D##", "G###", "C###"],
    ["dis’’’", "gis’’", "cis’’", "fis’", "h", "e", "A", "Dis", "Gis#", "Cis#", "Fis##", "H###", "E###"],
    ["h’’", "e’’", "a’", "d’", "g", "c", "F", "Ais#", "Dis#", "Gis##", "Cis##", "Fis###"],
    ["g’’", "c’’", "f’", "ais", "dis", "Gis", "Cis", "Fis#", "H##", "E##", "A###", "D###"],
    ["dis’’", "gis’", "cis’", "fis", "H", "E", "A#", "D#", "G##", "C##", "F###"],
    ["h’", "e’", "a", "d", "G", "C", "F#", "Ais##", "Dis##", "Gis###", "Cis###"],
    ["g’", "c’", "f", "Ais", "Dis", "Gis#", "Cis#", "Fis##", "H###", "E###"],
    ["dis’", "gis", "cis", "Fis", "H#", "E#", "A##", "D##", "G###", "C###"],
    ["h", "e", "A", "D", "G#", "C#", "F##", "Ais###", "Dis###"],
    ["g", "c", "F", "Ais#", "Dis#", "Gis##", "Cis##", "Fis###"],
    ["dis", "Gis", "Cis", "Fis#", "H##", "E##", "A###", "D###"],
    ["H", "E", "A#", "D#", "G##", "C##", "F###"],
    ["G", "C", "F#", "Ais##", "Dis##", "Gis###", "Cis###"],
    ["Dis", "Gis#", "Cis#", "Fis##", "H###", "E###"],
    ["H#", "E#", "A##", "D##", "G###", "C###"],
    ["G#", "C#", "F##", "Ais###", "Dis###"],
    ["Dis#", "Gis##", "Cis##", "Fis###"],
    ["H##", "E##", "A###", "D###"],
    ["G##", "C##", "F###"],
    ["Dis##", "Gis###", "Cis###"],
    ["H###", "E###"],
    ["G###", "C###"],
    ["Dis###"],
];


let quintenterzenSMALL = [
    ["g’’’", "c’’’", "f’’", "ais’", "dis’", "gis", "cis", "Fis", "H#", "E#", "A##", "D##", "G###", "C###"],
    ["dis’’’", "gis’’", "cis’’", "fis’", "h", "e", "A", "D", "G#", "C#", "F##", "Ais###", "Dis###"],
    ["h’’", "e’’", "a’", "d’", "g", "c", "F", "Ais#", "Dis#", "Gis##", "Cis##", "Fis###"],
    ["g’’", "c’’", "f’", "ais", "dis", "Gis", "Cis", "Fis#", "H##", "E##", "A###", "D###"],
    ["dis’’", "gis’", "cis’", "fis", "H", "E", "A#", "D#", "G##", "C##", "F###", ],
    ["h’", "e’", "a", "d", "G", "C", "F#", "Ais##", "Dis##", "Gis###", "Cis###"],
    ["g’", "c’", "f", "Ais", "Dis", "Gis#", "Cis#", "Fis##", "H###", "E###"],
    ["dis’", "gis", "cis", "Fis", "H#", "E#", "A##", "D##", "G###", "C###"],
    ["h", "e", "A", "D", "G#", "C#", "F##", "Ais###", "Dis###"],
    ["g", "c", "F", "Ais#", "Dis#", "Gis##", "Cis##", "Fis###"],
    ["dis", "Gis", "Cis", "Fis#", "H##", "E##", "A###", "D###"],
    ["H", "E", "A#", "D#", "G##", "C##", "F###"],
    ["G", "C", "F#", "Ais##", "Dis##", "Gis###", "Cis###"],
    ["Dis", "Gis#", "Cis#", "Fis##", "H###", "E###"],
    ["H#", "E#", "A##", "D##", "G###", "C###"],
    ["G#", "C#", "F##", "Ais###", "Dis###"],
    ["Dis#", "Gis##", "Cis##", "Fis###"],
    ["H##", "E##", "A###"],
    ["G##", "C##"],
    ["Dis##"]
];


let quintenterzenVERYSMALL = [
//9
    ["e’’’’", "a’’’", "d’’’", "g’’", "c’’", "f’", "ais", "dis", "Gis"],
//8
    ["c’’’’", "f’’’", "ais’’", "dis’’", "gis’", "cis’", "fis", "H"],
    ["gis’’’", "cis’’’", "fis’’", "h’", "e’", "a", "d", "G"],
//7
    ["e’’’", "a’’", "d’’", "g’", "c’", "f", "Ais"],
    ["c’’’", "f’’", "ais’", "dis’", "gis", "cis", "Fis"],
//6
    ["gis’’", "cis’’", "fis’", "h", "e", "A"],
    ["e’’", "a’", "d’", "g", "c"],
//5
    ["c’’", "f’", "ais", "dis", "Gis"],
    ["gis’", "cis’", "fis", "H", "E"],
//4
    ["e’", "a", "d", "G"],
    ["c’", "f", "Ais", "Dis"],
//3
    ["gis", "cis", "Fis"],
    ["e", "A", "D"],
//2
    ["c", "F"],
//1
    ["A"]
];

/*OLD OLD NETWORK

let quintenterzen = [
//18
    ["h’’’’’", "e’’’’’", "a’’’’", "d’’’’", "g’’’", "c’’’", "f’’", "ais’", "dis’", "gis", "cis", "Fis", "H#", "E#", "A##", "D##", "G###", "C###"],
    ["gis’’’’’", "cis’’’’’", "fis’’’’", "h’’’", "e’’’", "a’’", "d’’", "g’", "c’", "f", "Ais","Dis","Gis#","Cis#","Fis##","H###","E###"],
//17
    ["f’’’’’", "ais’’’’", "dis’’’’", "gis’’’", "cis’’’", "fis’’", "h’", "e’", "a", "d", "G", "C", "F#", "Ais##", "Dis##", "Gis###", "Cis###"],
    ["d’’’’’", "g’’’’", "c’’’’", "f’’’", "ais’’", "dis’’", "gis’", "cis’", "fis", "H", "E", "A#", "D#", "G##", "C##", "F###"],
//16
    ["h’’’’", "e’’’’", "a’’’", "d’’’", "g’’", "c’’", "f’", "ais", "dis", "Gis", "Cis", "Fis#", "H##", "E##", "A###", "D###"],
//15
    ["gis’’’’", "cis’’’’", "fis’’’", "h’’", "e’’", "a’", "d’", "g", "c", "F", "Ais#","Dis#","Gis##","Cis##","Fis###"],
    ["f’’’’", "ais’’’", "dis’’’", "gis’’", "cis’’", "fis’", "h", "e", "A", "D", "G#", "C#", "F##", "Ais###", "Dis###"],
    ["d’’’’", "g’’’", "c’’’", "f’’", "ais’", "dis’", "gis", "cis", "Fis", "H#", "E#", "A##", "D##", "G###", "C###"],
//14
    ["h’’’", "e’’’", "a’’", "d’’", "g’", "c’", "f", "Ais", "Dis", "Gis#", "Cis#", "Fis##", "H###", "E###"],
    ["gis’’’", "cis’’’", "fis’’", "h’", "e’", "a", "d", "G", "C", "F#", "Ais##", "Dis##", "Gis###", "Cis###"],
//13
    ["f’’’", "ais’’", "dis’’", "gis’", "cis’", "fis", "H", "E", "A#", "D#", "G##", "C##", "F###"],
    ["d’’’", "g’’", "c’’", "f’", "ais", "dis", "Gis", "Cis", "Fis#", "H##", "E##", "A###", "D###"],
//12
    ["h’’", "e’’", "a’", "d’", "g", "c", "F", "Ais#", "Dis#", "Gis##", "Cis##", "Fis###"],
    ["gis’’", "cis’’", "fis’", "h", "e", "A", "D", "G#", "C#", "F##", "Ais###", "Dis###"],
    ["f’’", "ais’", "dis’", "gis", "cis", "Fis", "H#", "E#", "A##", "D##", "G###", "C###"],
//11
    ["d’’", "g’", "c’", "f", "Ais", "Dis", "Gis#", "Cis#", "Fis##", "H###", "E###"],
    ["h’", "e’", "a", "d", "G", "C", "Fis#", "Ais##", "Dis##", "Gis###", "Cis###"],
//10
    ["gis’", "cis’", "fis", "H", "E", "A#", "D#", "G##", "C##", "F###"],
    ["f’", "ais", "dis", "Gis", "Cis", "Fis#", "H##", "E##", "A###", "D###"],
//9
    ["d’", "g", "c", "F", "Ais#", "Dis#", "Gis##", "Cis##", "Fis###"],
    ["h", "e", "A", "D", "G#", "C#", "F##", "Ais###", "Dis###"],
    ["gis", "cis", "Fis", "H#", "E#", "A##", "D##", "G###", "C###"],
//8
    ["f", "Ais", "Dis", "Gis#", "Cis#", "Fis##", "H###", "E###"],
    ["d", "G", "C", "F#", "Ais##", "Dis##", "Gis###", "Cis###"],
//7
    ["H", "E", "A#", "D#", "G##", "C##", "F###"],
    ["Gis", "Cis", "Fis#", "H##", "E##", "A###", "D###"],
//6
    ["F", "Ais#", "Dis#", "Gis##", "Cis##", "Fis###"],
    ["D", "G#", "C#", "F##", "Ais###", "Dis###"],
    ["H#", "E#", "A##", "D##", "G###", "C###"],
//5
    ["Gis#", "Cis#", "Fis##", "H###", "E###"],
    ["F#", "Ais##", "Dis##", "Gis###", "Cis###"],
//4
    ["D#", "G##", "C##", "F###"],
    ["H##", "E##", "A###", "D###"],
//3 ?
    ["Gis##", "Cis##", "Fis###"],
    ["F##", "Ais###", "Dis###"],
    ["D##", "G###", "C###"],
//2
    ["H###", "E###"],
    ["Gis###", "Cis###"],
//1
    ["F###"],
    ["D###"]
];

let quintenterzenSMALL = [
//13
    ["dis’’’’", "gis’’’", "cis’’’", "fis’’", "h’", "e’", "a", "d", "G", "C", "F#", "Ais##", "Dis##"],
    ["c’’’’", "f’’’", "ais’’", "dis’’", "gis’", "cis’", "fis", "H", "E", "A#", "D#", "G##"],
//12
    ["a’’’", "d’’’", "g’’", "c’’", "f’", "ais", "dis", "Gis", "Cis", "Fis#", "H##", "E##"],
//11
    ["fis’’’", "h’’", "e’’", "a’", "d’", "g", "c", "F", "Ais#","Dis#","Gis##"],
    ["dis’’’", "gis’’", "cis’’", "fis’", "h", "e", "A", "D", "G#", "C#", "F##"],
    ["c’’’", "f’’", "ais’", "dis’", "gis", "cis", "Fis", "H#", "E#", "A##", "D##"],
//10
    ["a’’", "d’’", "g’", "c’", "f", "Ais", "Dis", "Gis#", "Cis#", "Fis##"],
    ["fis’’", "h’", "e’", "a", "d", "G", "C", "F#", "Ais##", "Dis##"],
//9
    ["dis’’", "gis’", "cis’", "fis", "H", "E", "A#", "D#", "G##"],
    ["c’’", "f’", "ais", "dis", "Gis", "Cis", "Fis#", "H##", "E##"],
//8
    ["a’", "d’", "g", "c", "F", "Ais#", "Dis#", "Gis##"],
    ["fis’", "h", "e", "A", "D", "G#", "C#", "F##"],
    ["dis’", "gis", "cis", "Fis", "H#", "E#", "A##", "D##"],
//7
    ["c’", "f", "Ais", "Dis", "Gis#", "Cis#", "Fis##"],
    ["a", "d", "G", "C", "Fis#", "Ais##", "Dis##"],
//6
    ["fis", "H", "E", "A#", "D#", "G##"],
    ["dis", "Gis", "Cis", "Fis#", "H##", "E##"],
//5
    ["c", "F", "Ais#", "Dis#", "Gis##"],
    ["A", "D", "G#", "C#", "F##"],
    ["Fis", "H#", "E#", "A##", "D##"],
//4
    ["Dis", "Gis#", "Cis#", "Fis##"],
    ["C", "F#", "Ais##", "Dis##"],
//3
    ["A#", "D#", "G##"],
    ["Fis#", "H##", "E##"],
//2
    ["Dis#", "Gis##"],
    ["C#", "F##"],
    ["A##", "D##"],
//1
    ["Fis##"],
    ["Dis##"]
];

let quintenterzenVERYSMALL = [
//8
    [ "cis’’’", "fis’’", "h’", "e’", "a", "d", "G", "C"],
    ["ais’’", "dis’’", "gis’", "cis’", "fis", "H", "E"],
//7
    ["g’’", "c’’", "f’", "ais", "dis", "Gis", "Cis"],
//6
    ["e’’", "a’", "d’", "g", "c", "F"],
    ["cis’’", "fis’", "h", "e", "A", "D"],
    ["ais’", "dis’", "gis", "cis", "Fis", "H#"],
//5
    ["g’", "c’", "f", "Ais", "Dis"],
    ["e’", "a", "d", "G", "C"],
//4
    ["cis’", "fis", "H", "E"],
    ["ais", "dis", "Gis", "Cis"],
//3
    ["g", "c", "F"],
    ["e", "A", "D"],
    ["cis", "Fis", "H#"],
//2
    ["Ais", "Dis"],
    ["G", "C"],
//1
    ["E"],
    ["Cis"]
];

*/

//MIDI NOTES AND EVENTS
let midiNotes = {
"gis’’’’’’": 128, 
//"ges’’’’’’": 128,
"g’’’’’’":    127,	
"fis’’’’’’":  126,
//"ges’’’’’’":  126,	
"f’’’’’’":    125,
"e’’’’’’":	  124,
"dis’’’’’’":   123,
//"es’’’’’’":   123,	
"d’’’’’’":	  122,
"cis’’’’’’":  121, 
//"des’’’’’’":  121,
"c’’’’’’": 120,
//
"h’’’’’": 119,
"ais’’’’’": 118,
//"b’’’’’": 118,
"a’’’’’": 117,
"gis’’’’’":116,
//"ges’’’’’":116,
"g’’’’’":115,
"fis’’’’’":114,
//"ges’’’’’":114,
"f’’’’’":113,
"e’’’’’": 112,
"dis’’’’’":111,
//"es’’’’’":111,
"d’’’’’":110,
"cis’’’’’":109,
//"des’’’’’":109,
"c’’’’’":108,
//
"h’’’’":107,
"ais’’’’":106,
//"b’’’’":106,
"a’’’’":105,
"gis’’’’":104,
//"ges’’’’":104,
"g’’’’":103,
"fis’’’’":102, 
//"ges’’’’":102,	
"f’’’’":101,	
"e’’’’":100,	
"dis’’’’":99,
//"es’’’’":99,	
"d’’’’":98,
"cis’’’’":97,
//"des’’’’":97,	
"c’’’’":96,
//
"h’’’":95,
"ais’’’":94,
//"b’’’":94,
"a’’’":93,
"gis’’’":92,
//"as’’’":92,
"g’’’":91,
"fis’’’":90,
//"ges’’’":90,
"f’’’":89,
"e’’’":88,
"dis’’’":87,
//"es’’’":87,
"d’’’":86,
"cis’’’":85,
//"des’’’":85,
"c’’’":84,
//
"h’’":83,
//"ais’’":82,
"b’’":82,
"a’’":81,
"gis’’":80,
//"as’’":80,
"g’’":79,
"fis’’":78,
//"ges’’":78,
"f’’":77,
"e’’":76,
"dis’’":75,
//"es’’":75,
"d’’":74,
"cis’’":73,
//"des’’":73,
"c’’":72,
//
"h’":71,
"ais’":70,
//"b’":70,
"a’":69, 
"gis’":68,
//"as’":68,
"g’":67,	
"fis’":66,
//"ges’":66,
"f’":65,
"e’":64,	
"dis’":63,
//"es’":64,
"d’":62,
"cis’":61,
//"des’":61,
"c’":60,
//
"h":59,
"ais":58,
//"b":58,
"a":57,
"gis":56,
//"as":56,
"g":55,
"fis":54,
//"ges":54,
"f":53,
"e":52,
"dis":51,
//"es":51,
"d":50,
"cis":49,
//"des":49,
"c":48,
//
"H":47,
"Ais":46,
//"B":46,
"A":45,	
"Gis":44,
//"As":44,
"G": 43,	
"Fis":42,
//"Ges":42,	
"F":41,	
"E":40,	
"Dis":39,
//"Es":39,
"D":38,	
"Cis":37,
//"Des":37,
"C":36,
//
"H#":35,	
"Ais#":34,
//"B#":34,	
"A#":33,	
"Gis#":32,
//"As#":32,
"G#":31,	
"Fis#":30,
//"Ges#":30,	
"F#":29,	
"E#":28,	
"Dis#":27,
//"Es#":27,
"D#":26,	
"Cis#":25,
//"Des#":25,
"C#":24,	
//
"H##":23,	
"Ais##":22,
//"B##":22,	
"A##":21,
"Gis##":20,	
//"As##":20,
"G##":19,
"Fis##":18,	
//"Ges##":18,
"F##":17,	
"E##":16,
"Dis##":15,
//"Es##":15,	
"D##":14,	
"Cis##":13,
//"Des##":13,
"C##":12,
//	
"H###":11,
"Ais###":10,	
//"B###":10,	
"A###":9,	
"Gis###":8,
//"As###":8,	
"G###":7,	
"Fis###":6,
//"Ges###":6,
"F###":5,	
"E###":4,
//"Dis###":4,
"Es###":3,
"D###":2,
"Cis###":1, 
//"Des###":1,
"C###":0	
//
};

let midiNotesCOLOR = {
"gis’’’’’’": ["",""], 
"ges’’’’’’": ["",""],
"g’’’’’’":    ["",""],	
"fis’’’’’’":  ["",""],
"ges’’’’’’":  ["",""],	
"f’’’’’’":    ["",""],
"e’’’’’’":	  ["",""],
"dis’’’’’’":   ["",""],
"es’’’’’’":   ["",""],	
"d’’’’’’":	  ["",""],
"cis’’’’’’":  ["",""], 
"des’’’’’’":  ["",""],
"c’’’’’’": ["",""],
//
"h’’’’’": ["",""],
"ais’’’’’": ["",""],
"b’’’’’": ["",""],
"a’’’’’": ["",""],
"gis’’’’’":["",""],
"ges’’’’’":["",""],
"g’’’’’":["",""],
"fis’’’’’":["",""],
"ges’’’’’":["",""],
"f’’’’’":["",""],
"e’’’’’": ["",""],
"dis’’’’’":["",""],
"es’’’’’":["",""],
"d’’’’’":["",""],
"cis’’’’’":["",""],
"des’’’’’":["",""],
"c’’’’’":["",""],
//
"h’’’’":["",""],
"ais’’’’":["",""],
"b’’’’":["",""],
"a’’’’":["",""],
"gis’’’’":["",""],
"ges’’’’":["",""],
"g’’’’":["",""],
"fis’’’’":["",""], 
"ges’’’’":["",""],	
"f’’’’":["",""],	
"e’’’’":["",""],	
"dis’’’’":["",""],
"es’’’’":["",""],	
"d’’’’":["",""],
"cis’’’’":["",""],
"des’’’’":["",""],	
"c’’’’":["",""],
//
"h’’’":["",""],
"ais’’’":["",""],
"b’’’":["",""],
"a’’’":["",""],
"gis’’’":["",""],
"as’’’":["",""],
"g’’’":["",""],
"fis’’’":["",""],
"ges’’’":["",""],
"f’’’":["",""],
"e’’’":["",""],
"dis’’’":["",""],
"es’’’":["",""],
"d’’’":["",""],
"cis’’’":["",""],
"des’’’":["",""],
"c’’’":["",""],
//
"h’’":["",""],
"ais’’":["",""],
"b’’":["",""],
"a’’":["",""],
"gis’’":["",""],
"as’’":["",""],
"g’’":["",""],
"fis’’":["",""],
"ges’’":["",""],
"f’’":["",""],
"e’’":["",""],
"dis’’":["",""],
"es’’":["",""],
"d’’":["",""],
"cis’’":["",""],
"des’’":["",""],
"c’’":["",""],
//
"h’":["",""],
"ais’":["",""],
"b’":["",""],
"a’":["",""], 
"gis’":["",""],
"as’":["",""],
"g’":["",""],	
"fis’":["",""],
"ges’":["",""],
"f’":["",""],
"e’":["",""],	
"dis’":["",""],
"es’":["",""],
"d’":["",""],
"cis’":["",""],
"des’":["",""],
"c’":["",""],
//
"h":["",""],
"ais":["",""],
"b":["",""],
"a":["",""],
"gis":["",""],
"as":["",""],
"g":["",""],
"fis":["",""],
"ges":["",""],
"f":["",""],
"e":["",""],
"dis":["",""],
"es":["",""],
"d":["",""],
"cis":["",""],
"des":["",""],
"c":["",""],
//
"H":["",""],
"Ais":["",""],
"B":["",""],
"A":["",""],	
"Gis":["",""],
"As":["",""],
"G": ["",""],	
"Fis":["",""],
"Ges":["",""],	
"F":["",""],	
"E":["",""],	
"Dis":["",""],
"Es":["",""],
"D":["",""],	
"Cis":["",""],
"Des":["",""],
"C":["",""],
//
"H#":["",""],	
"Ais#":["",""],
"B#":["",""],	
"A#":["",""],	
"Gis#":["",""],
"As#":["",""],
"G#":["",""],	
"Fis#":["",""],
"Ges#":["",""],	
"F#":["",""],	
"E#":["",""],	
"Dis#":["",""],
"Es#":["",""],
"D#":["",""],	
"Cis#":["",""],
"Des#":["",""],
"C#":["",""],	
//
"H##":["",""],	
"Ais##":["",""],
"B##":["",""],	
"A##":["",""],
"Gis##":["",""],	
"As##":["",""],
"G##":["",""],
"Fis##":["",""],	
"Ges##":["",""],
"F##":["",""],	
"E##":["",""],
"Dis##":["",""],
"Es##":["",""],	
"D##":["",""],	
"Cis##":["",""],
"Des##":["",""],
"C##":["",""],
//	
"H###":["",""],
"Ais###":["",""],	
"B###":["",""],	
"A###":["",""],	
"Gis###":["",""],
"As###":["",""],	
"G###":["",""],	
"Fis###":["",""],
"Ges###":["",""],
"F###":["",""],	
"E###":["",""],
"Dis###":["",""],
"Es###":["",""],
"D###":["",""],
"Cis###":["",""], 
"Des###":["",""],
"C###":["",""]	
//
};

//MIDI NUM FREQ MAPPING -Stimmung
//welche: https://bluemich.net/drehorgel/stimmung-temperaturen.pdf
let currtunning = 0;
let basetone = 440.0;
let clean = { //initialized with equnal tuning values changed by function
    128:13289.75,
    127:12543.85,
    126:11839.82,
    125:11175.30,
    124:10548.08,
    123:9956.06,
    122:9397.27,
    121:8869.84,
    120:8372.02,
    119:7902.13,
    118:7458.62,
    117:7040.00,
    116:6644.88,
    115:6271.93,
    114:5919.91,
    113:5587.65,
    112:5274.04,
    111:4978.03,
    110:4698.64,
    109:4434.92,
    108:4186.01,
    107:3951.07,
    106:3729.31,
    105:3520.00,
    104:3322.44,
    103:3135.96,
    102:2959.96,
    101:2793.83,
    100:2637.02,
    99:2489.02,
    98:2349.32,
    97:2217.46,
    96:2093.00,
    95:1975.53,
    94:1864.66,
    93:1760.00,
    92:1661.22,
    91:1567.98,
    90:1479.98,
    89:1396.91,
    88:1318.51,
    87:1244.51,
    86:1174.66,
    85:1108.73,
    84:1046.50,
    83:987.77,
    82:932.33,
    81:880.00,
    80:830.61,
    79:783.99,
    78:739.99,
    77:698.46,
    76:659.26,
    75:622.25,
    74:587.33,
    73:554.37,
    72:523.25,
    71:493.88,
    70:466.16,
    69:440.00,
    68:415.30,
    67:392.00,
    66:369.99,
    65:349.23,
    64:329.63,
    63:311.13,
    62:293.66,
    61:277.18,
    60:261.63,
    59:246.94,
    58:233.08,
    57:220.00,
    56:207.65,
    55:196.00,
    54:185.00,
    53:174.61,
    52:164.81,
    51:155.56,
    50:146.83,
    49:138.59,
    48:130.81,
    47:123.47,
    46:116.54,
    45:110.00,
    44:103.83,
    43:98.00,
    42:92.50,
    41:87.31,
    40:82.41,
    39:77.78,
    38:73.42,
    37:69.30,
    36:65.41,
    35:61.74,
    34:58.27,
    33:55.00,
    32:51.91,
    31:49.00,
    30:46.25,
    29:43.65,
    28:41.20,
    27:38.89,
    26:36.71,
    25:34.65,
    24:32.70,
    23:30.87,
    22:29.14,
    21:27.50,
    20:25.96,
    19:24.50,
    18:23.12,
    17:21.83,
    16:20.60,
    15:19.45,
    14:18.35,
    13:17.32,
    12:16.35,
    11:15.43,
    10:14.57,
    9:13.75,
    8:12.98,
    7:12.25,
    6:11.56,
    5:10.91,
    4:10.30,
    3:9.72,
    2:9.18,
    1:8.66,
    0:8.18
};

let equal = {
    128:13289.75,
    127:12543.85,
    126:11839.82,
    125:11175.30,
    124:10548.08,
    123:9956.06,
    122:9397.27,
    121:8869.84,
    120:8372.02,
    119:7902.13,
    118:7458.62,
    117:7040.00,
    116:6644.88,
    115:6271.93,
    114:5919.91,
    113:5587.65,
    112:5274.04,
    111:4978.03,
    110:4698.64,
    109:4434.92,
    108:4186.01,
    107:3951.07,
    106:3729.31,
    105:3520.00,
    104:3322.44,
    103:3135.96,
    102:2959.96,
    101:2793.83,
    100:2637.02,
    99:2489.02,
    98:2349.32,
    97:2217.46,
    96:2093.00,
    95:1975.53,
    94:1864.66,
    93:1760.00,
    92:1661.22,
    91:1567.98,
    90:1479.98,
    89:1396.91,
    88:1318.51,
    87:1244.51,
    86:1174.66,
    85:1108.73,
    84:1046.50,
    83:987.77,
    82:932.33,
    81:880.00,
    80:830.61,
    79:783.99,
    78:739.99,
    77:698.46,
    76:659.26,
    75:622.25,
    74:587.33,
    73:554.37,
    72:523.25,
    71:493.88,
    70:466.16,
    69:440.00,
    68:415.30,
    67:392.00,
    66:369.99,
    65:349.23,
    64:329.63,
    63:311.13,
    62:293.66,
    61:277.18,
    60:261.63,
    59:246.94,
    58:233.08,
    57:220.00,
    56:207.65,
    55:196.00,
    54:185.00,
    53:174.61,
    52:164.81,
    51:155.56,
    50:146.83,
    49:138.59,
    48:130.81,
    47:123.47,
    46:116.54,
    45:110.00,
    44:103.83,
    43:98.00,
    42:92.50,
    41:87.31,
    40:82.41,
    39:77.78,
    38:73.42,
    37:69.30,
    36:65.41,
    35:61.74,
    34:58.27,
    33:55.00,
    32:51.91,
    31:49.00,
    30:46.25,
    29:43.65,
    28:41.20,
    27:38.89,
    26:36.71,
    25:34.65,
    24:32.70,
    23:30.87,
    22:29.14,
    21:27.50,
    20:25.96,
    19:24.50,
    18:23.12,
    17:21.83,
    16:20.60,
    15:19.45,
    14:18.35,
    13:17.32,
    12:16.35,
    11:15.43,
    10:14.57,
    9:13.75,
    8:12.98,
    7:12.25,
    6:11.56,
    5:10.91,
    4:10.30,
    3:9.72,
    2:9.18,
    1:8.66,
    0:8.18
};

let tunings = [equal, clean];


/******************************************************************************* 

                    HELPER FKT

*******************************************************************************/

function dodownit( contentof, nameoffile, type ){
    let af = new Blob( [ contentof ], {type: type} );
    let theIE = false || !!document.documentMode;
    if( theIE ){
        window.navigator.msSaveOrOpenBlob( af, nameoffile );
    } else {
        let alink = document.createElement( 'a' );
        alink.href = URL.createObjectURL( af );
        alink.download = nameoffile;
        document.body.appendChild( alink )
        alink.click( );
        document.body.removeChild( alink );
    }
}

function scalarProd( v1, v2 ){
    //gleiche laenge vorausgesetzt
    let sp = 0; 
    for(let t = 0; t < v1.length; t++){
        sp += v1[t]*v2[t];
    }
    return sp;
}

Array.prototype.swapIT = function( pos1, pos2 ) {
  var memit = this[ pos1 ];
  this[ pos1 ] = this[ pos2 ];
  this[ pos2 ] = memit;
  return this;
}

/******************************************************************************* 

                    Storage

*******************************************************************************/

function TOstorage( ){
    localStorage.setItem( "mixedtraj", mixedtraj );
    localStorage.setItem( "passtosequencer", passtosequencer );
    //localStorage.setItem( "doplay", doplay );
    localStorage.setItem( "backgrDAYNIGHT", backgrDAYNIGHT );
    localStorage.setItem( "currentsize", currentsize );
    
    localStorage.setItem( "strokeoftraj", strokeoftraj );
    localStorage.setItem( "sendtoall", sendtoall );
  
    localStorage.setItem( "jesnoOSC", jesnoOSC );
    localStorage.setItem( "OSCstring", OSCstring );
    localStorage.setItem( "jesnogest", jesnogest );
    localStorage.setItem( "jesnovel", jesnovel );
    localStorage.setItem( "jesnoafter", jesnoafter );
    localStorage.setItem( "jesnomodulation", jesnomodulation );
    //localStorage.setItem( "useinternal", useinternal );
    localStorage.setItem( "mouseit", mouseit );
    localStorage.setItem( "elemdist", elemdist );
    localStorage.setItem( "vs", vs );
    localStorage.setItem( "hs", hs );
}

function FROMstorage( ){
    mixedtraj = JSON.parse( localStorage.getItem( "mixedtraj" ) );
    passtosequencer = JSON.parse( localStorage.getItem( "passtosequencer" ) );
    //doplay = JSON.parse( localStorage.getItem( "doplay" ) );

    backgrDAYNIGHT = parseInt( localStorage.getItem( "backgrDAYNIGHT" ) );
    currentsize = parseInt( localStorage.getItem( "currentsize" ) );
    strokeoftraj = localStorage.getItem( "strokeoftraj" );
    sendtoall = JSON.parse( localStorage.getItem( "sendtoall" ) );
  
    jesnoOSC = JSON.parse( localStorage.getItem( "jesnoOSC" ) );
    OSCstring = localStorage.getItem( "OSCstring" );
    jesnogest = JSON.parse( localStorage.getItem( "jesnogest" ) );
    jesnovel = JSON.parse( localStorage.getItem( "jesnovel" ) );
    jesnoafter = JSON.parse( localStorage.getItem( "jesnoafter" ) );
    jesnomodulation = JSON.parse( localStorage.getItem( "jesnomodulation" ) );
    //useinternal = JSON.parse( localStorage.getItem( "useinternal" ) );
    mouseit = JSON.parse( localStorage.getItem( "mouseit" ) );
    elemdist = parseInt( localStorage.getItem( "elemdist" ) );
    vs = parseInt( localStorage.getItem( "vs" ) );
    hs = parseInt( localStorage.getItem( "hs" ) );
}

function initSettings( ){
    if( localStorage.getItem( "mixedtraj" ) !== null ){
        FROMstorage( ); //if config present it is the preset or a setting       
    } else {
        TOstorage( ); //write presets
    } 
}

/******************************************************************************* 

                    Menu

*******************************************************************************/
function endFullScree( ){
    if (document.exitFullscreen) {
    document.exitFullscreen();
  } else if (document.mozCancelFullScreen) { /* Firefox */
    document.mozCancelFullScreen();
  } else if (document.webkitExitFullscreen) { /* Chrome, Safari and Opera */
    document.webkitExitFullscreen();
  } else if (document.msExitFullscreen) { /* IE/Edge */
    document.msExitFullscreen();
  }
}

function entFullScree( ){
  let elem = document.documentElement;
  if( elem.requestFullscreen ){
    elem.requestFullscreen( ).then();
  } else if( elem.mozRequestFullScreen ){ /* Firefox */
    elem.mozRequestFullScreen( ).then();
  } else if( elem.webkitRequestFullscreen ){ /* Chrome, Safari and Opera */
    elem.webkitRequestFullscreen( ).then(); //
  } else if( elem.msRequestFullscreen ){ /* IE/Edge */
    elem.msRequestFullscreen( ).then();
  }
    
}

function resetMIDIin( ){//not used now
    let inpsel = document.getElementById("inputportselector");
    theMIDIin = inpsel.options[ inpsel.selectedIndex ].value; //should throw error
}

function resetMIDIout( ){
    let outpsel = document.getElementById("outputportselector");
    theMIDIout = outpsel.options[ outpsel.selectedIndex ].value;
}

function setsendtoall( ){
    if( document.getElementById('sedtoall').checked ){
        sendtoall = true;
    } else {
        sendtoall = false;
    }
    TOstorage( );
}

function menutraj( ){
    if( document.getElementById('trajrec').checked ){
        mixedtraj = true;
    } else {
        mixedtraj = false;
    }
    TOstorage( );
}

function daynight( ){
    let dnsel = document.getElementById("daynightsel");
    backgrDAYNIGHT = parseInt(dnsel.options[ dnsel.selectedIndex ].value);
    if( backgrDAYNIGHT === 0 ){
        document.body.style.background = "black";
        strokeoftraj = "white";
    } else if( backgrDAYNIGHT === 1 ){
        document.body.style.background = "white";
        strokeoftraj = "black";
    }
    TOstorage( );
}

function sizeselection( ){
    let sisel = document.getElementById("sizesle");
    currentsize = parseInt(sisel.options[ sisel.selectedIndex ].value);
    
    TOstorage( );
    location.reload( );
}

function menusequtraj( ){
    if( document.getElementById('trajrecseq').checked ){
        passtosequencer = true;
    } else {
        passtosequencer = false;
    }
    TOstorage( );
}


function buttdist( ){
    let thesel = document.getElementById("buttspace");
    let elemdisttemp = parseInt(thesel.options[ thesel.selectedIndex ].value);
    if(elemdisttemp > 0 && elemdisttemp < 100 ){
        elemdist = elemdisttemp;
    }
    
    TOstorage( );
    location.reload( );
}

function buttvs( ){
    let thesel = document.getElementById("vs");
    vs = parseInt( thesel.options[ thesel.selectedIndex ].value );
     
    TOstorage( );
    location.reload( );
}

function butths( ){
    let thesel = document.getElementById("hs");
    hs = parseInt(thesel.options[ thesel.selectedIndex ].value);
    
    TOstorage( );
    location.reload( );
}


function setsendosc( ){
    if( document.getElementById('sendosc').checked ){
        jesnoOSC = true;
    } else {
        jesnoOSC = false;
    }
    TOstorage( );
}

function setusegest( ){ 
    if( document.getElementById('gestrec').checked ){
        jesnogest = true;
    } else {
        jesnogest = false;
    }
    TOstorage( );
}

function setusevel( ){ 
    if( document.getElementById('gestvel').checked ){
        jesnovel = true;
    } else {
        jesnovel = false;
    }
    TOstorage( );
}

function setuseafter( ){ 
    if( document.getElementById('gestafter').checked ){
        jesnoafter = true;
    } else {
        jesnoafter = false;
    }
    TOstorage( );
}

function setusemodul( ){ 
    if( document.getElementById('gestmodu').checked ){
        jesnomodulation = true;
    } else {
        jesnomodulation = false;
    }
    TOstorage( );
}

function setuseinternalsynth( ){ 
    if( document.getElementById('internalsynthsw').checked ){
        useinternal = true;
        if( notinitsynth ){
            initSynth( );
        }
    } else {
        useinternal = false;
    }
    TOstorage( );
}


function changeOSCstr( ){
    if( document.getElementById('basestring').value !== "" ){
        OSCstring = document.getElementById('basestring').value;
    }
    TOstorage( );
}

function shiftsequelem( elem ){ 
    if( elem ){
        let cn = elem.getAttribute( "class" );
        let index = Array.prototype.indexOf.call( seqtimingelem.children, elem.parentNode );
        let lastpos = seqtimingelem.children.length-1;
        let indexindex = index;
        if( cn === "right" ){
            indexindex = index+1;
            if( indexindex > lastpos ){
                indexindex = 0;
            }
        } else if( cn === "left" ){
            indexindex = index-1;
            if( indexindex < 0 ){
                indexindex = lastpos;
            }
        }
        //swap values of display
        let sel = seqtimingelem.children[ index ].children[0].selectedIndex; //delay after parseInt( delayelem.options[ delayelem.selectedIndex ].value );
        seqtimingelem.children[ index ].children[0].selectedIndex = seqtimingelem.children[ indexindex ].children[0].selectedIndex;
        seqtimingelem.children[ indexindex ].children[0].selectedIndex = sel;
        //mute
        let mu = seqtimingelem.children[ index ].children[1].checked;
        seqtimingelem.children[ index ].children[1].checked = seqtimingelem.children[ indexindex ].children[1].checked;
        seqtimingelem.children[ indexindex ].children[1].checked = mu;
        //color of border
        let bor = seqtimingelem.children[ index ].style.border;
        seqtimingelem.children[ index ].style.border = seqtimingelem.children[ indexindex ].style.border;
        seqtimingelem.children[ indexindex ].style.border = bor;
        //swap values of sequnecer
        sequencer.swapIT(index, indexindex );
    }
}

function addtoseqtiming( ){
    let sp = document.createElement( "span" );
    sp.className = "seqteprep";
    sp.style.border = '2px solid #' + Math.random().toString(16).substring(2, 8);

    let i = document.createElement( "select" );//DELAY AFTER
    for( let u = 0; u < 30; u+=1 ){
        let o = document.createElement( "option" );
        o.value = u*50;
        o.innerHTML = u*50;
        i.appendChild( o );
    }
    let j = document.createElement( "input" ); //MUTE step
    j.setAttribute( "type", "checkbox" );
    j.checked = true;
    

    let b = document.createElement( "button" );
    //b.style.fontSize = elemsize.toString()+"px";
    b.innerHTML = "⤶";
    b.className = "left";
    b.onclick = function(){shiftsequelem(this)};
    let k = document.createElement( "button" ); 
    k.type = "button";
    
    //k.style.fontSize = elemsize.toString()+"px";
    k.innerHTML = "⤷";
    k.className = "right";
    k.onclick = function(){shiftsequelem(this)};
    sp.appendChild( i );
    sp.appendChild( j );
    sp.appendChild( b );
    sp.appendChild( k );
    seqtimingelem.appendChild( sp ); 
    HplaceMenu(  ); //hm  
} 

function HplaceMenu( val ){
    let m = document.getElementById('menu');
    if( val === undefined ){
        val = parseInt(m.offsetHeight)
    }
    m.style.top = (h-val).toString()+"px";
}

function showmidimenu( elem ){
    showsubmenudiv( "#midimenu" , elem ); 
}

function showbuttmenu( elem ){
    showsubmenudiv( "#buttonmenu", elem );
}

function showsynthmenu( elem ){
    showsubmenudiv( "#synthmenu", elem );
}

function showseqmenu( elem ){
    showsubmenudiv( "#seqmenu", elem );
}

function showoscmenu( elem ){
    showsubmenudiv( "#oscmenu", elem );
}

function showgestmenu( elem ){
    showsubmenudiv( "#gestmenu", elem );
}

function showsubmenudiv( elemid, oelem ){
    let melem = document.querySelector( elemid );
    if( melem.style.display === "none" ){
        let c = '#' + Math.random().toString(16).substring(2, 8);
        melem.style.background = c;
        melem.style.display = "block";
        oelem.style.background = c;
    } else {
        melem.style.display = "none";
        oelem.style.background = "buttonface";
    }
    HplaceMenu(  ); //hm 
}

function downseq( ){
    if( sequencer.length !== 0 ){
        dodownit( JSON.stringify( sequencer ) +"----"+ w.toString()+","+h.toString(), "sequenc"+Date.now( ).toString( )+".seq",  "application/json" );
    } else {
        alert("No Sequence to download.");
    }
}

function upseq( ){
    let fifisel = document.getElementById("seqinput").files[0];
    var reader = new FileReader();
    reader.onload = function (e) {
        seqtimingelem.innerHTML = "";
        let ab = reader.result.split("----");
        let wh = ab[1].split(",");
        let wo = parseInt( wh[0] );
        let ho = parseInt( wh[1] );
		sequencer = JSON.parse( ab[0] );
        //rebuild position of the sequnecer if w != w" and h != h"
        
        if( w !== wo || h !== ho ){
            console.log(wo, w, ho, h);
            let corrW = w/wo;
            let corrH = h/ho;
            for( let s = 0; s < sequencer.length; s+=1 ){
                for( let elemid in sequencer[ s ][ 1 ] ){
                    for( let t = 0; t < sequencer[ s ][ 1 ][elemid].length; t+=1 ){ 
                        //[x, y, linewidth, strokestyle]
                        sequencer[ s ][ 1 ][elemid][ t ][0] = Math.round( sequencer[ s ][ 1 ][elemid][ t ][0] * corrW );
                        sequencer[ s ][ 1 ][elemid][ t ][1] = Math.round( sequencer[ s ][ 1 ][elemid][ t ][1] * corrH );
                    }
                }
            }
        }
    
        for( let s = 0; s < sequencer.length; s+=1 ){
            addtoseqtiming( );
        }
	}
    reader.readAsText( fifisel );
}

function play( ){
    console.log(doplay)
    if( !doplay ){
        doplay = true;
        TOstorage( );
        sequencerstep( );
    }
}

function pause( ){
    alltosilence( );
    doplay = false;
    TOstorage( );
}

function alltosilence(){
    for( let out of Midioutputs.values( ) ){
        if( theMIDIout === out.name || sendtoall ){
            for(let seqframe in sequencer){
                for( let elemid in sequencer[ seqframe ][0] ){
                    for( let n = 0; n < sequencer[ seqframe ][0][ elemid ].length; n+=1 ){
                        let notedurr = sequencer[ seqframe ][0][ elemid ][n][4];// - sequencer[ seqframe ][0][ elemid ][n][1];
                        let channeloffset = sequencer[ seqframe ][0][ elemid ][ n ][2];
                        for( let r = 0; r < sequencer[ seqframe ][0][ elemid ][ n ][0].length; r+=1 ){
                            out.send(
                                [NOTE_OFFS[channeloffset][r], 
                                 parseInt( sequencer[ seqframe ][0][ elemid ][ n ][0][r] ), 
                                 ZERO_VEL]);

                        }
                    }
                }
            }
        }
    }
}

function clearseq( ){
    alltosilence( );
    doplay = false;
    sequencer = [];
    seqplaying = 0;
    seqtimingelem.innerHTML = "";
    HplaceMenu( );
    TOstorage( );
}

function delmuted( ){ 
    for( let z = 0; z < seqtimingelem.children.length; z+=1 ){
        if( !seqtimingelem.children[ z ].children[ 1 ].checked ){
            seqtimingelem.removeChild(seqtimingelem.children[ z ]);
            sequencer.splice(z, 1);
            console.log("deled from seq:", z);
        }
    }
    HplaceMenu( );
}

function initMenu( ){    
    //write presets to the menu GUI
    document.getElementById('sedtoall').checked = sendtoall;
    document.getElementById('trajrec').checked = mixedtraj;
    document.getElementById("daynightsel").selectedIndex = parseInt(backgrDAYNIGHT);
    document.getElementById("sizesle").selectedIndex = parseInt(currentsize);
    document.getElementById('trajrecseq').checked = passtosequencer;
    document.getElementById('sendosc').checked = jesnoOSC;
    document.getElementById('gestrec').checked = jesnogest;
    document.getElementById('gestvel').checked = jesnovel;
    document.getElementById('gestafter').checked = jesnoafter;
    document.getElementById('basestring').value = OSCstring;
    document.getElementById('gestmodu').checked = jesnomodulation;
    //document.getElementById('internalsynthsw').checked = useinternal;
    //document.getElementById('useklickel').checked = mouseit;
    document.getElementById("buttspace").selectedIndex = parseInt(elemdist);
    console.log("vs", vs, "hs", hs);
    document.getElementById("vs").selectedIndex = parseInt(vs);
    document.getElementById("hs").selectedIndex = parseInt(hs);
    //position of menu
    let m = document.getElementById('menu');
    m.style.width = (w-120).toString()+"px";
    m.style.top = (h-m.offsetHeight).toString()+"px";
    m.style.left = Math.round(w/10).toString()+"px";

    m.addEventListener('touchstart', function( e ) {  e.stopImmediatePropagation(); });
    m.addEventListener('touchend', function( e ) { e.stopImmediatePropagation(); });

    seqtimingelem = document.getElementById('seqtiming');
    
    //add filter q value selctions
    let i = document.getElementById( "filterQ" );
    for( let u = 1; u < 150; u+=5 ){
        let o = document.createElement( "option" );
        o.value = parseFloat( u );
        o.innerHTML = parseFloat( u );
        i.appendChild( o );
    }
    //add filter freq options to selct
    i = document.getElementById( "filterF" );
    for( let u = 1; u < 10000; u+=100 ){
        let o = document.createElement( "option" );
        o.value = u;
        o.innerHTML = u;
        i.appendChild( o );
    }
}

/******************************************************************************* 

                   SEQUENCER

*******************************************************************************/

function fromseqtomidi( seqframeI ){
    let seqframe = seqframeI+0;
    let minstarttime = 1000000000000000000000;
    
    for( let elemid in sequencer[ seqframe ][ 0 ] ){
        for( let n = 0; n < sequencer[ seqframe ][ 0 ][ elemid ].length; n+=1 ){
            let t0 = sequencer[ seqframe ][ 0 ][ elemid ][ n ][ 1 ];
            if( t0 < minstarttime ){
                minstarttime = t0;
            }
        }
    }
    for( let elemid in sequencer[ seqframe ][ 0 ] ){
        if( sequencer[ seqframe ][ 0 ][ elemid ].length > 0 ){
        let durr =  sequencer[ seqframe ][ 0 ][ elemid ][ 0 ][ 1 ] - minstarttime;
        let channeloffset = null;
        if( MIDIchanOffAvailable.length !== 0 ){
            channeloffset = MIDIchanOffAvailable.pop();
        } else {
            break;
        }
        //console.log("using chanoff", channeloffset, MIDIchanOffAvailable);
        for( let n = 0; n < sequencer[ seqframe ][ 0 ][ elemid ].length; n+=1 ){
            
            
            //let channeloffset = sequencer[ seqframe ][ 0 ][ elemid ][ n ][ 2 ];
            let notedurr = sequencer[ seqframe ][ 0 ][ elemid ][ n ][ 4 ];
            
            let VEL_VEL = FULL_VEL;
            if( jesnovel && jesnogest ){
                VEL_VEL = sequencer[ seqframe ][ 0 ][ elemid ][ n ][ 5 ];
            }
            setTimeout( function( ){  
                for( let out of Midioutputs.values( ) ){
                    if( theMIDIout === out.name || sendtoall ){
                        for( let r = 0; r < sequencer[ seqframe ][ 0 ][ elemid ][ n ][ 0 ].length; r+=1 ){
                            out.send(
                            [NOTE_ONS[ channeloffset ][ r ], 
                             parseInt( sequencer[ seqframe ][ 0 ][ elemid ][ n ][ 0 ][ r ] ), 
                             VEL_VEL]);
                            //send Aftertouch per channel 
                            if( jesnoafter && jesnogest ){
                                out.send(
                                //[( channelaftertouch<<4 ) + (CHANNEL[channeloffset][r]-1), 
                                [CHAN_AFTERS[ channeloffset ][ r ],
                                sequencer[ seqframe ][0][ elemid ][ n ][8]]);
                            }
                            //send Pitch Bend per channel
                            if( jesnomodulation && jesnogest ){
                                var valv1 = parseInt( (16384 * sequencer[ seqframe ][0][ elemid ][ n ][8]) / 128 );
                                var be1 = valv1&127;
                                var be2 = valv1>>7;
                                out.send( 
                                [PITCHBES[ channeloffset ][ r ],
                                 be1,be2]);
                            }
                            //send 
                        } 
                    }
                }
            }, durr );
            durr += notedurr
            setTimeout( function( ){  
                for( let out of Midioutputs.values( ) ){
                    if( theMIDIout === out.name || sendtoall ){ 
                        for( let r = 0; r < sequencer[ seqframe ][ 0 ][ elemid ][ n ][ 0 ].length; r+=1 ){
                            out.send(
                                [NOTE_OFFS[ channeloffset ][ r ], 
                                 parseInt( sequencer[ seqframe ][ 0 ][ elemid ][ n ][ 0 ][ r ] ), 
                                 ZERO_VEL]);
                            //send Aftertouch per channel 
                            if( jesnoafter && jesnogest ){
                                out.send(
                                //[( channelaftertouch<<4 ) + (CHANNEL[channeloffset][r]-1), 
                                [CHAN_AFTERS[ channeloffset ][ r ],
                                 0]);
                            }
                            //send Pitch Bend per channel
                            if( jesnomodulation && jesnogest ){
                                out.send( 
                                [PITCHBES[ channeloffset ][ r ],
                                 0,0]);
                            }
                        } 
                    }
                }
                if( MIDIchanOffAvailable.indexOf( channeloffset ) === -1 ){
                    MIDIchanOffAvailable.push( channeloffset );
                    //console.log("free chan", channeloffset)
                }
            }, durr );
        }
        }
    }
}

function drawseq( seqframe ){
    sequcon.clearRect(0, 0, seqdrawelem.width, seqdrawelem.height);
    for( let elemid in sequencer[ seqframe ][ 1 ] ){
        for( let t = 0; t < sequencer[ seqframe ][ 1 ][elemid].length-1; t+=1 ){ //there is only one touch in touchlist per time when only one touch is per target - is this right?????
            sequcon.beginPath();
            //[x, y, linewidth, strokestyle]
            sequcon.strokeStyle = sequencer[ seqframe ][ 1 ][elemid][t][3];
            sequcon.lineWidth = 1;
            sequcon.moveTo( sequencer[ seqframe ][ 1 ][elemid][t  ][0], sequencer[ seqframe ][ 1 ][elemid][t  ][1] );
            sequcon.lineTo( w-sequencer[ seqframe ][ 1 ][elemid][t  ][0], h-sequencer[ seqframe ][ 1 ][elemid][t  ][1] );
            sequcon.stroke();
            sequcon.closePath();
            //[x, y, linewidth, strokestyle]
            sequcon.strokeStyle = sequencer[ seqframe ][ 1 ][elemid][t][3];
            sequcon.lineWidth = 1;
            sequcon.moveTo( sequencer[ seqframe ][ 1 ][elemid][t+1][0], sequencer[ seqframe ][ 1 ][elemid][t+1][1] );
            sequcon.lineTo( w-sequencer[ seqframe ][ 1 ][elemid][t+1][0], h-sequencer[ seqframe ][ 1 ][elemid][t+1][1] );
            sequcon.stroke();
            sequcon.closePath();
            sequcon.beginPath();
            sequcon.lineWidth = sequencer[ seqframe ][ 1 ][elemid][t][2]*10;
            
            sequcon.moveTo( sequencer[ seqframe ][ 1 ][elemid][t  ][0], sequencer[ seqframe ][ 1 ][elemid][t  ][1] );
            sequcon.lineTo( sequencer[ seqframe ][ 1 ][elemid][t+1][0], sequencer[ seqframe ][ 1 ][elemid][t+1][1] );
            sequcon.stroke();
            sequcon.closePath();
        }
        if( sequencer[ seqframe ][ 1 ][elemid].length == 1 ){
            sequcon.beginPath();
            sequcon.strokeStyle = "lightgrey";
            sequcon.lineWidth = 1;
            sequcon.moveTo( sequencer[ seqframe ][ 1 ][elemid][0][0], sequencer[ seqframe ][ 1 ][elemid][0][1] );
            sequcon.lineTo( w-sequencer[ seqframe ][ 1 ][elemid][0][0], h-sequencer[ seqframe ][ 1 ][elemid][0][1] );
            sequcon.stroke();
            sequcon.beginPath();
            sequcon.closePath();
            sequcon.fillStyle = "lightgrey";
            sequcon.arc( sequencer[ seqframe ][ 1 ][elemid][0][0], sequencer[ seqframe ][ 1 ][elemid][0][1], (elemsize/2), 0, 2 * Math.PI );
            sequcon.closePath();
            sequcon.fill();
        }
    }
    
}

function sequencerstep( ){
    if( doplay ){
        let currduration = 0; //duration 
        if( seqtimingelem.children[ seqplaying ].children[ 1 ].checked ){
            let maxdura = 0;
            for( let elemid in sequencer[ seqplaying ][0] ){
                let compdura = 0;
                //only single note playing
                if( sequencer[ seqplaying ][0][ elemid ].length === 1 ){
                    compdura = sequencer[ seqplaying ][0][ elemid ][0][4];
                } else {
                    for( let n = 0; n < sequencer[ seqplaying ][0][ elemid ].length; n+=1 ){
                        compdura += sequencer[ seqplaying ][0][ elemid ][n][4];
                    }
                }
                
                if( maxdura < compdura ){
                    maxdura = compdura;
                }
            }
            
            if( maxdura > 0 ){
                currduration = maxdura;
            } else {
                currduration = 1000;
            }
            
            let delayelem = seqtimingelem.children[ seqplaying ].children[ 0 ];
            let delay = parseInt( delayelem.options[ delayelem.selectedIndex ].value );
            setTimeout( function(){ sequencerstep(); }, currduration+delay );

            //a thread why not???
            fromseqtomidi( seqplaying );
            //draw and mak the noise noise like the doctor
            drawseq( seqplaying );
            for( let ele = 0; ele < seqtimingelem.children.length; ele+=1 ){ 
                seqtimingelem.children[ ele ].style.background = "white";
            }
            seqtimingelem.children[ seqplaying ].style.background = '#' + Math.random().toString(16).substring(2, 8);
        }
        timingcheck = Date.now();
        seqplaying+=1;//the sequencer frames
        if( seqtimingelem.children.length === seqplaying ){ //restart seqloop
            seqplaying = 0;
        } 
        if( !seqtimingelem.children[ seqplaying ].children[ 1 ].checked ){
            sequencerstep();
        }
    }
}

/******************************************************************************* 

                   DEFAULT GESTURE / TOUCH HANDLING / CLICK

*******************************************************************************/

//PREVENT REGULAR BEHAVIOR
//Safari and IE related
window.addEventListener( 'gesturestart', function( e ){
    e.preventDefault();
}, false);

window.addEventListener( 'gestureend', function( e ){
    e.preventDefault();
    if (e.scale < 1.0) {
        console.log(e.scale);
    } else if (e.scale > 1.0) {
        // User moved fingers further apart
        console.log(e.scale);
    }
}, false);

//context menu on long press
window.addEventListener( 'long-press', function( e ){
    e.preventDefault();
}, false);

window.oncontextmenu = function( e ){
        e.preventDefault();
        e.stopPropagation();
        return false;
};

/*
document.getElementById('yourElement').oncontextmenu = function(event) {
    event.preventDefault();
    event.stopPropagation(); // not necessary in my case, could leave in case stopImmediateProp isn't available? 
    event.stopImmediatePropagation();
    return false;
};
*/

/*******************************************************************************
       
             touching you is like touching the dead
    
*******************************************************************************/

//EVENT LISTENER touch
function drawallTouch( ){
    let tritra = {};
     trajcon.clearRect(0, 0, trajectoryelem.width, trajectoryelem.height);
    //draw all trajectories
    for( let elemid in touchesTargetOvertime ){
        for( let t = 0; t < touchesTargetOvertime[elemid].length-1; t+=1 ){ 
            trajcon.beginPath();
            trajcon.lineWidth = touchesTargetOvertime[elemid][t][3].split(",").length*2;
            trajcon.moveTo(touchesTargetOvertime[elemid][t][0][0].pageX, touchesTargetOvertime[elemid][t][0][0].pageY);
            trajcon.lineTo(touchesTargetOvertime[elemid][t+1][0][0].pageX, touchesTargetOvertime[elemid][t+1][0][0].pageY);
            trajcon.stroke();
            trajcon.closePath();
        }
        //daw new sequnecer image
        if( passtosequencer ){
            let thetrajofthis = [];
            for( let t = 0; t < touchesTargetOvertime[elemid].length-1; t+=1 ){ //there is only one touch in touchlist per time when only one touch is per target - is this right?????
                
                sequcon.beginPath();
                let lwi =  touchesTargetOvertime[elemid][t][3].split(",").length;;
                sequcon.lineWidth = lwi*10;
                let stro = touchesTargetOvertime[elemid][t][2];
                sequcon.strokeStyle = stro;
                let ix = w-touchesTargetOvertime[elemid][t][0][0].pageX;
                let uy = h-touchesTargetOvertime[elemid][t][0][0].pageY;
                thetrajofthis.push([ix, uy, lwi, stro]);
                sequcon.moveTo(ix, uy);
                sequcon.lineTo(w-touchesTargetOvertime[elemid][t+1][0][0].pageX, h-touchesTargetOvertime[elemid][t+1][0][0].pageY);
                sequcon.stroke();
            }
            if( touchesTargetOvertime[elemid].length > 0 ){
                thetrajofthis.push([ w-touchesTargetOvertime[elemid][touchesTargetOvertime[elemid].length-1][0][0].pageX, h-touchesTargetOvertime[elemid][touchesTargetOvertime[elemid].length-1][0][0].pageY]);
            }
            if( touchesTargetOvertime[elemid].length == 1 ){
                let ix = w-touchesTargetOvertime[elemid][0][0][0].pageX;
                let uy = h-touchesTargetOvertime[elemid][0][0][0].pageY;
                sequcon.beginPath();
                sequcon.fillStyle = "lightgrey";
                sequcon.arc( ix, uy, (elemsize/2), 0, 2 * Math.PI );
                sequcon.closePath();
                sequcon.fill();
            }
            tritra[ elemid ] = thetrajofthis;
        }
    }
    return tritra;
}

function drawTouch( elemid ){
    //draw currend trajectories
    for( let t = 0; t < touchesTargetOvertime[elemid].length-1; t+=1 ){
        trajcon.beginPath();
        trajcon.lineWidth = touchesTargetOvertime[elemid][t][3].split(",").length*2;
        trajcon.strokeStyle = strokeoftraj;
        trajcon.moveTo(touchesTargetOvertime[elemid][t][0][0].pageX, touchesTargetOvertime[elemid][t][0][0].pageY);
        trajcon.lineTo(touchesTargetOvertime[elemid][t+1][0][0].pageX, touchesTargetOvertime[elemid][t+1][0][0].pageY);
        trajcon.stroke();
        trajcon.closePath();
    }
    
}

function pointermoveEvfkt( e ) {
    e.preventDefault();
    e.stopPropagation(); 
    e.stopImmediatePropagation();
    /*if( window.visualViewport.scale !== 1 ){
        let zoomfak = 1/window.visualViewport.scale;
        let offsetLeft = window.visualViewport.offsetLeft/10;
        let offsetTop =  -window.visualViewport.offsetTop/10;
        mainsvgelem.style.transform = 'translate(' +
                              offsetLeft + 'px,' +
                              offsetTop + 'px) ' +
                              'scale(' + zoomfak + ')';

    }*/
    if( e.target.getAttribute("title") && clickedelem !== null ){
        // Feedback
        let idofelem = e.target.getAttribute('id');
        let ix = e.pageX;
        let iy = e.pageY;
        let elemunder = document.elementFromPoint( ix, iy );
        if( e.pointerType !== "touch" ){
            idofelem = clickedelem.getAttribute('id');
            elemunder = e.target;
        }
        let realy = "";
        
        if( elemunder !== null ){
            if( mixedtraj ){
                elemunder.setAttribute( 'fill' , "#fff"  );
                realy = elemunder.getAttribute( "title" );
                setTimeout(function(){elemunder.setAttribute( 'fill' , elemunder.getAttribute("name")  );},200);
            } else {
                let ideleunder = elemunder.id;
                if( ideleunder[ideleunder.length-2] == idofelem[idofelem.length-2] ){
                    elemunder.setAttribute( 'fill' , "#fff"  );
                    realy = elemunder.getAttribute("title");
                    setTimeout(function(){elemunder.setAttribute( 'fill' , elemunder.getAttribute("name")  );},200);
                }
            }
            //MIDI    
            //if last note in midinotes playing != the note of the elemnt under the touchpos add the note and send midid start
            if( realy !== "" && realy !== null ){
                let currnotes = realy.split( "," );
                let timestamp = e.timeStamp;
                if( notesplaying[idofelem] ){
                    if( notesplaying[idofelem].length !== 0 ){
                        if( notesplaying[idofelem][notesplaying[idofelem].length-1][0].join("") != currnotes.join("") ){
                            let lastNOTEsWere = notesplaying[idofelem].length-1;
                            let channeloffset = notesplaying[idofelem][lastNOTEsWere][2];
                            //update timing and sendoff to last notes
                            if( notesplaying[idofelem][lastNOTEsWere][3] === undefined ){
                                notesplaying[idofelem][lastNOTEsWere][3] = timestamp; //set end timestamp
                            } 
                            notesplaying[idofelem][lastNOTEsWere][4] = 
                                notesplaying[idofelem][lastNOTEsWere][3] - notesplaying[idofelem][lastNOTEsWere][1];
                            
                            let VEL_VAL = FULL_VEL;
                            if( jesnovel && jesnogest ){
                                let lasttartou = touchesTargetOvertime[ idofelem ][touchesTargetOvertime[ idofelem ].length-1][0];
                                let xx = Math.abs( ix - lasttartou[lasttartou.length-1].pageX);
                                let yy = Math.abs( iy - lasttartou[lasttartou.length-1].pageY);
                                let s = Math.sqrt((xx*xx)+(yy*yy));
                                VEL_VAL = Math.min( 127, Math.round((s/(notesplaying[idofelem][lastNOTEsWere][4]/100)) * 13 ) );
                            }
                            // do midi
                            for (let out of Midioutputs.values() ){
                                if( theMIDIout === out.name || sendtoall ){
                                    for( let i = 0; i < notesplaying[idofelem][lastNOTEsWere][0].length; i+=1 ){
                                        let nnn = parseInt(notesplaying[idofelem][lastNOTEsWere][0][i]);
                                        out.send([NOTE_OFFS[channeloffset][i], nnn, ZERO_VEL]);
                                    }
                                    //send on to new
                                    for( let i = 0; i < currnotes.length; i+=1 ){
                                        let nnn = parseInt(currnotes[i]);
                                        out.send([NOTE_ONS[channeloffset][i], nnn, VEL_VAL]);
                                    }
                                }            
                            }
                            //do add notes and
                            if( notesplaying[idofelem] ){
                                notesplaying[idofelem].push( [currnotes, timestamp, channeloffset, , , VEL_VAL, ix, iy] );
                            } else {
                                notesplaying[idofelem] = [ [currnotes, timestamp, channeloffset, , , VEL_VAL, ix, iy] ];
                            }
                        }
                        //storage  
                        touchesTargetOvertime[ idofelem ].push( [[e],timestamp,elemunder.getAttribute("name"),elemunder.getAttribute("title")] );   
                        if( touchesTargetOvertime[ idofelem ].length % 2 == 0 ){
                            drawTouch( idofelem );
                        }
                    }
                }
            }
        }
    }
}

function pointerdownEventFkt( e ) { 
    //default behavior
    e.preventDefault();
    e.stopPropagation(); 
    e.stopImmediatePropagation();
    
    let channeloffset = null;
    if( MIDIchanOffAvailable.length !== 0 ){
        channeloffset = MIDIchanOffAvailable.pop();
    }
    //console.log("------inuse chan", channeloffset)
    if( e.target.getAttribute("title") && channeloffset !== null ){
        let idofelem = e.target.getAttribute('id');
        clickedelem = e.target;
        let currnotes = e.target.getAttribute("title").split(",");
        let timestamp = e.timeStamp;
        for (let out of Midioutputs.values() ){
            if( theMIDIout === out.name || sendtoall ){
                for( let i = 0; i < currnotes.length; i+=1 ){
                    let nnn = parseInt(currnotes[i]);
                    out.send([NOTE_ONS[channeloffset][i], nnn, FULL_VEL]);
                }
            }            
        }
        let ix = e.pageX;
        let iy = e.pageY;
        
        if( notesplaying[ idofelem ] ){
            notesplaying[ idofelem ].push( [currnotes, timestamp, channeloffset, , , FULL_VEL, ix, iy ] );
        } else {
            notesplaying[ idofelem ] = [ [currnotes, timestamp, channeloffset, , , FULL_VEL, ix, iy ] ];
        }
        //visual feedback
        e.target.setAttribute( 'fill' , "black"  );
        //storage
        if( touchesTargetOvertime[ idofelem ] ){
            touchesTargetOvertime[ idofelem ].push( 
               [[e], timestamp, e.target.getAttribute("name"), e.target.getAttribute("title")] );    
        } else {
            touchesTargetOvertime[ idofelem ] = [[[e],timestamp,e.target.getAttribute("name"),e.target.getAttribute("title")]]; 
        }  
    }
}

function pointerupEventFkt( e ) {  
    //default behavior 
    e.preventDefault();
    e.stopPropagation(); 
    e.stopImmediatePropagation();
    
    let idofelem = e.target.getAttribute('id');
    if( e.pointerType !== "touch" ){
        if(clickedelem){
            idofelem = clickedelem.getAttribute('id');
        }
    }
    
    if( notesplaying[idofelem] ){
        if( notesplaying[idofelem].length !== 0 ){
            let timestamp = e.timeStamp;
            //preparation for restart a seq frame
            for( let eid in notesplaying ){ //alles durchgucken, ob noch was keine endezeit hat
                for( let l = 0; l < notesplaying[ eid ].length; l+=1 ){
                    if( notesplaying[eid][l][3] === undefined ){
                        notesplaying[eid][l][3] = timestamp; //set endtime on last note
                        notesplaying[eid][l][4] = notesplaying[eid][l][3] - notesplaying[eid][l][1];
                    }
                }
            }
            //care for playing
            for( let out of Midioutputs.values() ) {
                if( theMIDIout === out.name || sendtoall ){
                    for( let l = 0; l < notesplaying[idofelem].length; l+=1 ){
                        for( let partnotes = 0; partnotes < notesplaying[idofelem][l][0].length; partnotes+=1 ){
                            out.send( [ NOTE_OFFS[ notesplaying[idofelem][l][2] ][ partnotes ], 
                                        notesplaying[idofelem][l][0][partnotes], 
                                        ZERO_VEL ]); 
                        }
                    }  
                }         
            }
            //add to sequencer
            let currtrajectory = drawallTouch( );
            //reset AND pass to sequnecer
            if( passtosequencer ){
                //AFTERTOUCH VALUE IS CURVATUARE IN ON SOUND
                for( let nono in notesplaying ){
                    if( notesplaying[ nono ].length > 2 ){
                        
                        for(let l = 1; l < notesplaying[ nono ].length-1; l+=1 ){
                            let xv = notesplaying[ nono ][l-1][6];
                            let yv = notesplaying[ nono ][l-1][7];
                            let xu = notesplaying[ nono ][l][6];
                            let yu = notesplaying[ nono ][l][7];
                            let xn = notesplaying[ nono ][l+1][6];
                            let yn = notesplaying[ nono ][l+1][7];
                            let vx1 = Math.abs(xu-xn);
                            let vy1 = Math.abs(yu-yn);
                            let vx2 = Math.abs(xu-xv);
                            let vy2 = Math.abs(yu-yv);
                            let l1 = Math.sqrt((vx1*vx1)+(vy1*vy1));
                            let l2 = Math.sqrt((vx2*vx2)+(vy2*vy2));
                            let curvature = Math.min(127,Math.round((Math.acos( (scalarProd( [vx1, vy1], [vx2, vy2] ))/( l1*l2)) * (180 / Math.PI))*(380/128))) ;
                            notesplaying[ nono ][l].push( curvature ); //8ter index
                        }
                        if( notesplaying[ nono ][0].length !== 9 ){
                                notesplaying[ nono ][0].push(notesplaying[ nono ][1][8]); //setze  naechstes in erstes
                        }
                        if( notesplaying[ nono ][notesplaying[ nono ].length-1].length !== 9 ){
                                notesplaying[ nono ][notesplaying[ nono ].length-1].push(notesplaying[ nono ][notesplaying[ nono ].length-2][8]); //setze  naechstes in erstes
                        }
                    }

                }
                sequencer.push( [ JSON.parse( JSON.stringify( notesplaying ) ), currtrajectory ] ); //does this deep copy???     
                addtoseqtiming( );         
            }
            //reset and household
            MIDIchanOffAvailable.push( notesplaying[idofelem][0][2] );//push back/free the midichanneloffset 
            //console.log("-----------chan back",  notesplaying[idofelem][0][2])
            notesplaying[ idofelem ] = [];
            touchesTargetOvertime[ idofelem ] = []; 
            //interaction//vis feedback
            e.target.setAttribute( 'fill' , e.target.getAttribute("name")  );
            
            //check if other notesareplaying and reject all but last note
            //let newtimestamp = Date.now( );
            let wasnotin = true; 
            for( let eid in notesplaying ){
                if( notesplaying[ eid ].length > 0 ){
                    let lastnote = notesplaying[ eid ][notesplaying[ eid ].length-1];
                    lastnote[1] = timestamp;
                    lastnote[3] = undefined;
                    notesplaying[ eid ] = [lastnote];
                    wasnotin = false;
                } 
            } 
            if( wasnotin ){
                clickedelem = null;
            }
        }
    }
}

/*******************************************************************************
  
              GUI Building

*******************************************************************************/


function buidlbotton( cx, cy, r, titletext, svgns, cocol, colstro, atext ){
    let cici = document.createElementNS( svgns, 'circle' );
        cici.setAttribute( 'title', titletext );
        cici.setAttribute( 'id', titletext );
        cici.setAttribute( 'fill' , cocol     );
        cici.setAttribute( 'stroke' , colstro     );
        cici.setAttribute( 'name' , cocol     );
        cici.setAttribute( 'cx'   , cx        );
        cici.setAttribute( 'cy'   , cy        );
        cici.setAttribute( 'r'    , r         );
        cici.textContent = atext;
    return cici;
}

function getDreiklang( cx, cy, r, incw, inch, n0, nq, nt1, nt2, cocol, colstro ){
    let cont = document.createElementNS( xmlns, 'g' );
    let ri = Math.sqrt( (r*r)-((r/2)*(r/2)) );
    if( n0 !== undefined && nt2 !== undefined && nt1 !== undefined ){
        let po = "";
        po += cx.toString()+","+cy.toString()+" ";
        po += (cx+(incw)).toString()+","+(cy+inch).toString()+" "; 
        po += (cx).toString()+","+(cy+inch).toString()+" "; 
        let popo = document.createElementNS( xmlns, 'polygon' );
            popo.setAttribute( 'title', n0.toString()+","+nt1.toString()+","+nt2.toString() );
            popo.setAttribute( 'id', countbuttons.toString()+n0+"d0" );
            popo.setAttribute( 'fill' , cocol     );
            popo.setAttribute( 'stroke' , colstro     );
            popo.setAttribute( 'name' , cocol     );
            popo.setAttribute( 'points', po );
        cont.appendChild( popo );
    }
    if( n0 !== undefined && nq !== undefined && nt2 !== undefined ){
        let poo = "";
        poo += cx.toString()+","+cy.toString()+" ";
        poo += (cx+incw).toString()+","+(cy).toString()+" "; 
        poo += (cx+incw).toString()+","+(cy+inch).toString()+" "; 
        let popopo = document.createElementNS( xmlns, 'polygon' );
            popopo.setAttribute( 'title', n0.toString()+","+nq.toString()+","+nt2.toString() );
            popopo.setAttribute( 'id', countbuttons.toString()+n0+"d#" );
            popopo.setAttribute( 'fill' , cocol     );
            popopo.setAttribute( 'stroke' , colstro     );
            popopo.setAttribute( 'name' , cocol     );
            popopo.setAttribute( 'points', poo );
        
                cont.appendChild( popopo );
    }   
    
    return cont;
}

function getZweiklang( cx, cy, r, incw, inch, n0, nq, nt1, nt2, cocol, colstro, n ){
    //console.log(n);
    let nn = n.split(" ");
    let cont = document.createElementNS( xmlns, 'g' );
    let hi = Math.round(r/2);
    let ri = Math.sqrt( (r*r)-((r/2)*(r/2)) );
    if( n0 !== undefined && nt2 !== undefined ){ //ton und schraeg 
        let pooo = "";
        
        pooo += (cx+r).toString()+","+cy.toString()+" "; //eigenes 6 eck
        pooo += (cx+incw+r).toString()+","+(cy+inch).toString()+" "; //mitte oben
        pooo += (cx+incw-r).toString()+","+(cy+inch).toString()+" "; //anderes 6 eck
        pooo += (cx-r).toString()+","+(cy).toString()+" ";
        let rere2 = document.createElementNS( xmlns, 'polygon' );
            rere2.setAttribute( 'title', n0.toString()+","+nt2.toString() );
            rere2.setAttribute( 'id', countbuttons.toString()+n0+"z1" );
            rere2.setAttribute( 'fill' , cocol     );
            rere2.setAttribute( 'stroke' , colstro     );
            rere2.setAttribute( 'name' , cocol     );
            rere2.setAttribute( 'points', pooo );
        cont.appendChild( rere2 );
    }
    if( n0 !== undefined && nq !== undefined ){ //ton und quinte
        
        
        let poo = "";
        poo += (cx).toString()+","+(cy-(ri/2)).toString()+" "; 
        poo += (cx+incw).toString()+","+(cy-(ri/2)).toString()+" "; 
        poo += (cx+incw).toString()+","+(cy+(ri/2)).toString()+" "; 
        poo += cx.toString()+","+(cy+(ri/2)).toString()+" "; 
        let rere1 = document.createElementNS( xmlns, 'polygon' );
            rere1.setAttribute( 'title', n0.toString()+","+nq.toString() );
            rere1.setAttribute( 'id', countbuttons.toString()+n0+"z0" );
            rere1.setAttribute( 'fill' , cocol     );
            rere1.setAttribute( 'stroke' , colstro     );
            rere1.setAttribute( 'name' , cocol     );
            rere1.setAttribute( 'points', poo );
        cont.appendChild( rere1 );
    }
    if( n0 !== undefined && nt1 !== undefined ){//ton und terz
        let poooo = "";
        //console.log("von", nn[0], "nach", nn[3]);
        poooo += (cx-(r/2)).toString()+","+cy.toString()+" "; 
        poooo += (cx-(r/2)).toString()+","+(cy+inch).toString()+" "; //mitte oben
        poooo += (cx+(r/2)).toString()+","+(cy+inch).toString()+" "; //anderes 6 eck
        poooo += (cx+(r/2)).toString()+","+(cy).toString()+" ";
        let rere3 = document.createElementNS( xmlns, 'polygon' );
            rere3.setAttribute( 'title', n0.toString()+","+nt1.toString() );
            rere3.setAttribute( 'id', countbuttons.toString()+n0+"z2" );
            rere3.setAttribute( 'fill' , cocol     );
            rere3.setAttribute( 'stroke' , colstro     );
            rere3.setAttribute( 'name' , cocol     );
            rere3.setAttribute( 'points', poooo );
        cont.appendChild( rere3 ); 
    }
    return cont;
}

function getEinklang( cx, cy, r, titletext, cocol, colstro, textlab ){
    let cont = document.createElementNS( xmlns, 'g' );
    let text = document.createElementNS( xmlns, 'text' );
    let subt = document.createElementNS( xmlns, 'tspan');
    let countupper = textlab.split("’").length-1;
    let a_t = "";
    
    if( textlab.indexOf("’") !== -1 ){
        a_t = "’";
    } else if( textlab.indexOf("#") !== -1 ){
        a_t = "#";
    }
    let add = 0;
    if( a_t !== "" ){
        let textlabspl = textlab.split( a_t );
        if( a_t === "’" ){
            subt.setAttribute( 'baseline-shift', "super" );
        } else {
            subt.setAttribute( 'baseline-shift', "sub" );
        }
        subt.setAttribute('fill', 'black');
        subt.style.fontSize = (Math.round(elemfontsize/3)*2).toString()+"px";//(Math.round(r/2)).toString()+'px';
        subt.textContent = (textlabspl.length-1).toString();
        textlab = textlabspl[ 0 ];
        add = -3;
    }
    
    
    //let ll = textlab.length;
    //if( ll === 1){
    //    text.setAttribute('x', cx-Math.round(r));
    //} else if(ll === 2 ){
    //    text.setAttribute('x', cx-Math.round(r));
    //} else{
        text.setAttribute('x', cx-Math.round(r)+2);
    //}
    text.setAttribute('y', cy+3);
    text.setAttribute('fill', 'black');
    text.setAttribute('font-family', 'monospace');
    text.setAttribute('font-size', elemfontsize.toString()+'px' ); 
    text.textContent = textlab;
    text.appendChild(subt);
    let ri = Math.sqrt( (r*r)-((r/2)*(r/2)) );
    /*let po = "";
    po += (cx+r).toString()+","+cy.toString()+" "; //r 0
    po += (cx+(r/2)).toString()+","+(cy+ri).toString()+" "; //u 1
    po += (cx-(r/2)).toString()+","+(cy+ri).toString()+" "; //uu 2
    po += (cx-r).toString()+","+cy.toString()+" "; //l 3
    po += (cx-(r/2)).toString()+","+(cy-ri).toString()+" "; //o 4
    po += (cx+(r/2)).toString()+","+(cy-ri).toString()+" "; //oo 5
    */
    let popo = document.createElementNS( xmlns, 'rect' );
        popo.setAttribute( 'title', titletext );
        popo.setAttribute( 'id', countbuttons.toString()+titletext+"e0" );
        popo.setAttribute( 'fill' , cocol     );
        popo.setAttribute( 'stroke' , colstro     );
        popo.setAttribute( 'name' , cocol     );
        //popo.setAttribute( 'points', po );
        popo.setAttribute( 'x', cx-r);
        popo.setAttribute( 'y', cy-r);
        popo.setAttribute( 'height', r+r);
        popo.setAttribute( 'width', r+r);
    
    cont.appendChild( popo );
    cont.appendChild( text );   
    countbuttons += 1;
    return cont;
}

function buildTonnetzarray(){
    let notenallesamt = Object.keys( midiNotes );
    //console.log("notenalle", notenallesamt)

    let offset = 0;
    let howmanyoctin = Math.floor( notenallesamt.length/vs );
    if( quintenterzen.length < howmanyoctin ){
        offset = Math.floor( (howmanyoctin-quintenterzen.length)/2 );
    }
    let vpos = offset;
    let hpos = vpos;
    //console.log(notenallesamt.length/vs, quintenterzen.length, offset);
    for( let ver in quintenterzen ){
        for( let hor in quintenterzen[ ver ] ){
            quintenterzen[ ver ][ hor ] = notenallesamt[ hpos ];
            hpos += hs;
        }
        vpos += vs;
        hpos = vpos;
    }
    offset = 0;
    
    if( quintenterzenSMALL.length < howmanyoctin ){
        offset = Math.floor( howmanyoctin-quintenterzenSMALL.length );
    } else { offset = 0; }
    
    //console.log( notenallesamt.length/vs, quintenterzenSMALL.length, offset);
    vpos = offset;
    hpos = vpos;
    for( let ver in quintenterzenSMALL ){
        for( let hor in quintenterzenSMALL[ ver ] ){
            quintenterzenSMALL[ ver ][ hor ] = notenallesamt[ hpos ];
            hpos += hs;
        }
        vpos += vs;
        hpos = vpos;
    }
    
    if( quintenterzenVERYSMALL.length < howmanyoctin ){
        offset = Math.floor( howmanyoctin-quintenterzenVERYSMALL.length );
    } else { offset = 0; }
    //console.log(notenallesamt.length/vs, quintenterzenVERYSMALL.length*(vs/12), offset)

    vpos = offset;
    hpos = vpos;
    for( let ver in quintenterzenVERYSMALL ){
        for( let hor in quintenterzenVERYSMALL[ ver ] ){
            quintenterzenVERYSMALL[ ver ][ hor ] = notenallesamt[ hpos ];
            hpos += hs;
        }
        vpos += vs;
        hpos = vpos;
    }
}


function buildUIbuttons( msvg ){ //vertival display better perf

    buildTonnetzarray();
    //select size of the key area
    if( currentsize === 1 ){
        quintenterzen = quintenterzenSMALL;
    } else if( currentsize === 2 ){
        quintenterzen = quintenterzenVERYSMALL;
    }
    let elemradius = Math.floor( elemsize / 2 );
    
    //elemcount is eual to the first array length in quintenterzen
    elemcount = quintenterzen[0].length;
    let incforW = Math.round( (w-elemradius) / (elemcount) );
    let incforH = Math.round( (h-elemsize)   / (quintenterzen.length) );

    
    
    let indexQuniten = 0;  
    for( let x = elemradius; x < (w-elemradius); x+=incforW ){
        let alternate = 0;
        let indexTerzen = 0;
        for( let y = elemradius; y < (h-elemsize); y+=incforH ){
            let addalittle = 1;
            if( alternate % 2 == 0 ){
                addalittle = 0;
            }
            let notename = undefined;
            try{    
                notename = quintenterzen[indexTerzen][indexQuniten];
            }catch{}
            let notenameQ = undefined;
            try{
                notenameQ = quintenterzen[indexTerzen][indexQuniten+1];
            }catch{}
            let notenameT1 = undefined;
            try{
                notenameT1 = quintenterzen[indexTerzen+1][indexQuniten];
            }catch{}
            let notenameT2 = undefined;
            try{
                notenameT2 = quintenterzen[indexTerzen+1][indexQuniten+1];
            }catch{}
            
            if( notename == undefined ){
                break;
            }
            
            //
            //console.log(notename, indexTerzen, indexQuniten);
            let randcolor = midiNotesCOLOR[ notename ][0];
            let randcolor2 =  midiNotesCOLOR[ notename ][1];
            if( alternate % 2 == 0 ){
                msvg.appendChild( getDreiklang( x, y, elemradius, incforW, incforH, midiNotes[ notename ], midiNotes[ notenameQ ], midiNotes[ notenameT1 ], midiNotes[ notenameT2 ], randcolor, randcolor2 ) );
            } else {
                msvg.appendChild( getDreiklang( x+(incforW/2), y, elemradius, incforW, incforH,  midiNotes[ notename ], midiNotes[ notenameQ ], midiNotes[ notenameT1 ], midiNotes[ notenameT2 ], randcolor, randcolor2 ) );
            }
            //alternate+=1;
            indexTerzen+=1;
            
        }
        indexQuniten+=1;
        if(quintenterzen.length === indexQuniten ){
            break;
        }
    }
    indexQuniten = 0;
    for( let x = elemradius; x < (w-elemradius); x+=incforW ){
        let alternate = 0;
        let indexTerzen = 0;
        
        for( let y = elemradius; y < (h-elemsize); y+=incforH ){
            let addalittle = 1;
            if( alternate % 2 == 0 ){
                addalittle = 0;
            }
            let notename = undefined;
            try{    
                notename = quintenterzen[indexTerzen][indexQuniten];
            }catch{}
            let notenameQ = undefined;
            try{
                notenameQ = quintenterzen[indexTerzen][indexQuniten+1];
            }catch{}
            let notenameT1 = undefined;
            try{
                notenameT1 = quintenterzen[indexTerzen+1][indexQuniten];
            }catch{}
            let notenameT2 = undefined;
            try{
                notenameT2 = quintenterzen[indexTerzen+1][indexQuniten+1];
            }catch{}
            
            if( notename == undefined ){
                break;
            }
            //
            let randcolor = midiNotesCOLOR[ notename ][0];
            let randcolor2 = midiNotesCOLOR[ notename ][1];
            if( alternate % 2 == 0 ){
                msvg.appendChild( getZweiklang( x, y, elemradius, incforW, incforH, midiNotes[ notename ], midiNotes[ notenameQ ], midiNotes[ notenameT1 ], midiNotes[ notenameT2 ], randcolor, randcolor2, notename+" "+notenameQ+" "+notenameT1+" "+notenameT2 ) );
            } else {
                msvg.appendChild( getZweiklang( x+(incforW/2), y, elemradius, incforW, incforH,  midiNotes[ notename ], midiNotes[ notenameQ ], midiNotes[ notenameT1 ], midiNotes[ notenameT2 ], randcolor, randcolor2, notename+" "+notenameQ+" "+notenameT1+" "+notenameT2 ) );
            }
            //alternate+=1;
            indexTerzen += 1;
        }
        indexQuniten+=1;
        if(quintenterzen.length === indexQuniten ){
            break;
        }
    }
    indexQuniten = 0;
    for( let x = elemradius; x < (w-elemradius); x+=incforW ){
        let alternate = 0;
        let indexTerzen = 0;
        for( let y = elemradius; y < (h-elemsize); y+=incforH ){
            let notename = undefined;
            try{    
                notename = quintenterzen[indexTerzen][indexQuniten];
            }catch{}
            if(notename == undefined){
                break;
            }
            let randcolor = midiNotesCOLOR[ notename ][0];
            let randcolor2 = midiNotesCOLOR[ notename ][1];
            if( alternate % 2 == 0 ){
                msvg.appendChild( getEinklang( x, y, elemradius,  midiNotes[ notename ], randcolor, randcolor2, notename ) );
            } else {
                msvg.appendChild( getEinklang( x+(incforW/2), y, elemradius,  midiNotes[ notename ], randcolor, randcolor2, notename ) );
            }
            //alternate+=1;
            indexTerzen+=1;
        }
        indexQuniten+=1;
        if(quintenterzen.length === indexQuniten ){
            break;
        }
    }
}

function getSequTrajElem( ){
    let e = document.createElement( "canvas" );
    e.setAttribute("width", w );
    e.setAttribute("height", h );
    e.style.display = "block";
    e.style.position = "fixed";//**
    e.style.left = 0;
    e.style.top = 0;
    e.style.zIndex = 1;
    return e;
}

function getTrajElem( ){
    let e = document.createElement( "canvas" );
    e.setAttribute("width", w );
    e.setAttribute("height", h );
    e.style.display = "block";
    e.style.position = "fixed";//**
    e.style.left = 0;
    e.style.top = 0;
    e.style.zIndex = 2;
    //e.style.opacity = 0.7;
    return e;
}

function getsvgMAINELEM( ){
	let e = document.createElementNS( xmlns, "svg" );
	e.setAttributeNS(null, "viewBox", "0 0 " + w + " " + h );
    e.setAttributeNS(null, "width", w );
    e.setAttributeNS(null, "height", h );
    e.style.display = "block";
    e.style.position = "fixed";//**
    e.style.left = 0;
    e.style.top = 0;
    e.style.zIndex = 3;
    e.style.opacity = 0.8;
    return e;
}

function screenInit( ){
    //add event listener
    document.getElementById("hereitlives").addEventListener('pointerup', function( e ){ pointerupEventFkt(e); }, false);
    document.getElementById("hereitlives").addEventListener('pointermove', function( e ){ pointermoveEvfkt(e); }, false);
    document.getElementById("hereitlives").addEventListener('pointerdown', function( e ){ pointerdownEventFkt(e); }, false);

    w = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
	h = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
    //and color
    for( let key in midiNotesCOLOR ){
        midiNotesCOLOR[ key ][0] = '#' + Math.random().toString(16).substring(2, 8);
        midiNotesCOLOR[ key ][1] = '#' + Math.random().toString(16).substring(2, 8);
    }
    //
    elemcount = quintenterzen[0].length;
    elemsize = Math.abs(Math.round(Math.max(w,h) / (2*elemcount))-elemdist);

    elemradius = Math.floor( elemsize / 2 );
    elemfontsize = Math.round(elemradius/2) + Math.round(elemradius/3);

    //add options for pull down menus
}
/*******************************************************************************
   
 MIDI GENERAL SETTINGS AND FKT

*******************************************************************************/

function onMIDISuccess( midi ) {
    console.log('WebMIDI supported!', midi);
    MIDIinputs = midi.inputs;
    Midioutputs = midi.outputs;
    for (let input of MIDIinputs.values()) {
        input.onmidimessage = getMIDIMessage;
        var opt = document.createElement("option");
        opt.text = input.name;
        opt.value = input.name;
        document.getElementById("inputportselector").appendChild(opt);
    }
    for (let out of Midioutputs.values()) {
        if( theMIDIout === null ){
            theMIDIout = out.name;
        }
        var opt = document.createElement("option");
        opt.text = out.name;
        opt.value = out.name;
        document.getElementById("outputportselector").appendChild(opt);
    }  
}

function onMIDIFailure( ){
    console.log('No WebMidi No Fun');
}

function getMIDIMessage( midiMessage ) {
    if( useinternal ){
        routeTOsynth( midiMessage );
    } 
}

function midiInit( ){ //...
    if( window.navigator.requestMIDIAccess ){
        let midi = window.navigator.requestMIDIAccess().then( onMIDISuccess, onMIDIFailure );
    } else {
        alert("NO WEBmidi NO fun. Update Browser.");
        console.log("NO MIDI NO FUN");
    }
}

/******************************************************************************* 

                    internal synth for example usage (webaudio)

*******************************************************************************/
let notinitsynth = true;
let audiocontext = null;

let attack = 0.0;			
let release = 0.05;		
let portamento = 0.0;	


let OSCIS = [];
let ENVES = [];
let FILTERS = [];
let notesinsynth = [];
//let mastergain = null;

function routeTOsynth( msg ){
    //tunings[currtunning][notenumber]
    // https://github.com/cwilso/monosynth/blob/gh-pages/index.html
    let type = msg.data[0] & 0xf0; // channel agnostic message type. Thanks, Phil Burk.
    
    let channel = msg.data[0] & 0xf;
    if( type === 144 || type === 128 ){
        
        
        let note = msg.data[1];
        let velocity = msg.data[2] / 128.0;
        if( type === 128 ){
            //note off
            ENVES[channel].gain.cancelScheduledValues( 0 );
			ENVES[channel].gain.setTargetAtTime( 0.0, 0, release );
            notesinsynth[ channel ] = 0;
        } else {
            //console.log("note on", tunings[currtunning][note], )
            OSCIS[channel].frequency.cancelScheduledValues( 0 );
            notesinsynth[channel] = tunings[currtunning][note];
			OSCIS[channel].frequency.setTargetAtTime( tunings[currtunning][note], 0, portamento );
            ENVES[channel].gain.cancelScheduledValues( 0 );
			ENVES[channel].gain.setTargetAtTime( velocity, 0, attack );
        }
    } else {
        let payload = Math.round(msg.data[1]/10);
        //console.log( "t: ", type, "c: ", channel, "v: ", payload  );
        if( notesinsynth[channel] !== 0 ){
            //console.log( "t: ", type, "c: ", channel, "v: ", payload  );
            //let newfreq = notesinsynth[channel] + payload;
            OSCIS[channel].frequency.cancelScheduledValues( 0 );
	        //OSCIS[channel].frequency.setTargetAtTime( newfreq, 0, portamento );
            OSCIS[channel].detune.setValueAtTime( payload, 0 );
        }
    }
    
}

function changeWaveForm( ){
    let newtype = document.getElementById("wavesel").options[ document.getElementById("wavesel").selectedIndex ].value;
    for( let c in OSCIS ){
        OSCIS[c].type = newtype;
    } 
}

function changeQ( ){
    let newQ = parseFloat( document.getElementById("filterQ").options[ document.getElementById("filterQ").selectedIndex ].value );
    if( newQ !== NaN ){
        if( newQ < 0.0001){
            newQ = 0.0001;
        }
        if( newQ > 1000.0 ){
            newQ = 1000.0;
        }
        for( let f in FILTERS ){
            if(FILTERS[f].Q){
                FILTERS[f].Q.value = newQ;
            }
        }
    }
}

function changeF( ){
    let newF = parseInt( document.getElementById("filterF").options[ document.getElementById("filterF").selectedIndex ].value );
    if( newF !== NaN ){
        if( newF < 0){
            newF = 0;
        }
        if( newF > 30000 ){
            newF = 30000;
        }
        
        for( let f in FILTERS ){
            if(FILTERS[f].frequency){
                FILTERS[f].frequency.value = newF;
            }
        }
    }
}

function changetuning( ){
    currtunning = parseInt( document.getElementById("tuningsel").options[ document.getElementById("tuningsel").selectedIndex ].value );
}

function changeFilType( ){
    let newtype = document.getElementById("filsel").options[ document.getElementById("filsel").selectedIndex ].value;
    for( let f in FILTERS ){
        if(FILTERS[f].type){
            FILTERS[f].type = newtype;
        }
    }
}

function initSynth( ){
    computertuning();
    window.AudioContext = window.AudioContext || window.webkitAudioContext;
    audiocontext = new AudioContext( );
    //audiooutput = audiocontext.createMediaStreamDestination( );
    //mastergain = audiocontext.createGain( );
    //mastergain.gain.value = 100;
    for( let s = 0; s < 16; s+=1 ){
        let oscil = audiocontext.createOscillator( );
        let enve = audiocontext.createGain( );
        let fil = audiocontext.createBiquadFilter( );
			
        oscil.connect( fil );
        oscil.type = 'sawtooth';
	    oscil.start(0);

        enve.gain.value = 0.0;
        enve.connect( audiocontext.destination );

        fil.frequency.value = 1000;
	    fil.Q.value = 10.0;
        fil.gain.value = 1.0;
		fil.type = 'lowpass';
        fil.connect( enve );
        
        OSCIS.push(oscil);
        ENVES.push(enve);
        FILTERS.push(fil);
        notesinsynth.push(0);
    }
    
    //mastergain.connect( audiocontext.destination );
    //once
    notinitsynth = false;
    console.log("internal Synth usable");
}

function computertuning( ){
    //clean scaling factors
    let sc11 = 15.0/8.0;
    let sc10 = 9.0/5.0;
    let sc9 = 5.0/3.0;
    let sc8 = 8.0/5.0;
    let sc7 = 3.0/2.0;
    let sc6 = 7.0/5.0;
    let sc5 = 4.0/3.0;
    let sc4 = 5.0/4.0;
    let sc3 = 6.0/5.0;
    let sc2= 9.0/8.0;
    let sc1 = 17.0/16.0;

    //scaling basetone: 440.0

    //bases per octav
    clean[69] = basetone;

    //upper octaves
    clean[81] = clean[69]*2.0;
    clean[93] = clean[81]*2.0;
    clean[105] = clean[93]*2.0;
    clean[117] = clean[105]*2.0;
    //lower octaves
    clean[57] = clean[69]/2.0;    
    clean[45] = clean[57]/2.0;
    clean[33] = clean[45]/2.0;
    clean[21] = clean[33]/2.0;
    clean[9] = clean[21]/2.0;
    let ggg = clean[9]/2.0;

    clean[128] = clean[117]*sc11;
    clean[127] = clean[117]*sc10;
    clean[126] = clean[117]*sc9;
    clean[125] = clean[117]*sc8;
    clean[124] = clean[117]*sc7;
    clean[123] = clean[117]*sc6;
    clean[122] = clean[117]*sc5;
    clean[121] = clean[117]*sc4;
    clean[120] = clean[117]*sc3;
    clean[119] = clean[117]*sc2;
    clean[118] = clean[117]*sc1;
    
    
    clean[116] = clean[105]*sc11;
    clean[115] = clean[105]*sc10;
    clean[114] = clean[105]*sc9;
    clean[113] = clean[105]*sc8;
    clean[112] = clean[105]*sc7;
    clean[111] = clean[105]*sc6;
    clean[110] = clean[105]*sc5;
    clean[109] = clean[105]*sc4;
    clean[108] = clean[105]*sc3;
    clean[107] = clean[105]*sc2;
    clean[106] = clean[105]*sc1;
    
    
    clean[104] = clean[93]*sc11;
    clean[103] = clean[93]*sc10;
    clean[102] = clean[93]*sc9;
    clean[101] = clean[93]*sc8;
    clean[100] = clean[93]*sc7;
    clean[99] = clean[93]*sc6;
    clean[98] = clean[93]*sc5;
    clean[97] = clean[93]*sc4;
    clean[96] = clean[93]*sc3;
    clean[95] = clean[93]*sc2;
    clean[94] = clean[93]*sc1;
    
    
    clean[92] = clean[81]*sc11;
    clean[91] = clean[81]*sc10;
    clean[90] = clean[81]*sc9;
    clean[89] = clean[81]*sc8;
    clean[88] = clean[81]*sc7;
    clean[87] = clean[81]*sc6;
    clean[86] = clean[81]*sc5;
    clean[85] = clean[81]*sc4;
    clean[84] = clean[81]*sc3;
    clean[83] = clean[81]*sc2;
    clean[82] = clean[81]*sc1;
    

    clean[80] = clean[69]*sc11;
    clean[79] = clean[69]*sc10;
    clean[78] = clean[69]*sc9;
    clean[77] = clean[69]*sc8;
    clean[76] = clean[69]*sc7;
    clean[75] = clean[69]*sc6;
    clean[74] = clean[69]*sc5;
    clean[73] = clean[69]*sc4;
    clean[72] = clean[69]*sc3;
    clean[71] = clean[69]*sc2;
    clean[70] = clean[69]*sc1;
    

    
    clean[68] = clean[57]*sc11;// 15/8
    clean[67] = clean[57]*sc10;// 9/5
    clean[66] = clean[57]*sc9;// 5/3
    clean[65] = clean[57]*sc8;// 8/5
    clean[64] = clean[57]*sc7;// 3/2
    clean[63] = clean[57]*sc6;// 7/5
    clean[62] = clean[57]*sc5;// 4/3
    clean[61] = clean[57]*sc4;// 5/4
    clean[60] = clean[57]*sc3;// 6/5
    clean[59] = clean[57]*sc2;// 9/8
    clean[58] = clean[57]*sc1;// 17/16
    

    clean[56] = clean[45]*sc11;
    clean[55] = clean[45]*sc10;
    clean[54] = clean[45]*sc9;
    clean[53] = clean[45]*sc8;
    clean[52] = clean[45]*sc7;
    clean[51] = clean[45]*sc6;
    clean[50] = clean[45]*sc5;
    clean[49] = clean[45]*sc4;
    clean[48] = clean[45]*sc3;
    clean[47] = clean[45]*sc2;
    clean[46] = clean[45]*sc1;

    clean[44] = clean[33]*sc11;
    clean[43] = clean[33]*sc10;
    clean[42] = clean[33]*sc9;
    clean[41] = clean[33]*sc8;
    clean[40] = clean[33]*sc7;
    clean[39] = clean[33]*sc6;
    clean[38] = clean[33]*sc5;
    clean[37] = clean[33]*sc4;
    clean[36] = clean[33]*sc3;
    clean[35] = clean[33]*sc2;
    clean[34] = clean[33]*sc1;

    clean[32] = clean[21]*sc11;
    clean[31] = clean[21]*sc10;
    clean[30] = clean[21]*sc9;
    clean[29] = clean[21]*sc8;
    clean[28] = clean[21]*sc7;
    clean[27] = clean[21]*sc6;
    clean[26] = clean[21]*sc5;
    clean[25] = clean[21]*sc4;
    clean[24] = clean[21]*sc3;
    clean[23] = clean[21]*sc2;
    clean[22] = clean[21]*sc1;

    clean[20] = clean[9]*sc11;
    clean[19] = clean[9]*sc10;
    clean[18] = clean[9]*sc9;
    clean[17] = clean[9]*sc8;
    clean[16] = clean[9]*sc7;
    clean[15] = clean[9]*sc6;
    clean[14] = clean[9]*sc5;
    clean[13] = clean[9]*sc4;
    clean[12] = clean[9]*sc3;
    clean[11] = clean[9]*sc2;
    clean[10] = clean[9]*sc1;
    

    clean[8] = ggg*sc11;
    clean[7] = ggg*sc10;
    clean[6] = ggg*sc9;
    clean[5] = ggg*sc8;
    clean[4] = ggg*sc7;
    clean[3] = ggg*sc6;
    clean[2] = ggg*sc5;
    clean[1] = ggg*sc4;
    clean[0] = ggg*sc3;
    //console.log(tunings);
}

/*******************************************************************************

                        MAIN MAIN

*******************************************************************************/

function netz( elemid ){
    console.log("Tonnetz GUI");
    
    initSettings( );
    midiInit( );
    screenInit( ); //set globals about the screen and menu

    let thehtmltolinein = document.getElementById( elemid );
    thehtmltolinein.style.position = "fixed";//**

    //0 svg / touch event and curr feedback
    mainsvgelem = getsvgMAINELEM( );
    buildUIbuttons( mainsvgelem ); 
    thehtmltolinein.appendChild( mainsvgelem );

    //1 trajectories
    trajectoryelem = getTrajElem( );
    trajcon = trajectoryelem.getContext('2d');
    trajcon.lineCap = "round";
    thehtmltolinein.appendChild( trajectoryelem );

    //2 trajectories drawn for sequencer
    seqdrawelem = getSequTrajElem( );
    sequcon = seqdrawelem.getContext('2d');
    sequcon.lineCap = "round";
    thehtmltolinein.appendChild( seqdrawelem );

    //menu init
    initMenu( );
    daynight( );

    //performe happieness
    console.log("Ready for usage."); 
}

//eoffoe//
