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
//let touchesOvertime = { };
//let touchesChangedOvertime = { };
let touchesTargetOvertime = { };
let mixedtraj = false;
let notesplaying = { };

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
let strokeoftraj = "black";
let seqtimingelem = null;
//Buttons 
let elemsize = 27; //values are reset by the init fkt
let elemdist = 2;
let elemcount = 19;

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
let jesnogest = true;
let jesnovel = true;
let jesnoafter = true;
let jesnomodulation = false;

/*SVG Globals*/
let xmlns = "http://www.w3.org/2000/svg";


//TONNETZ / harmonische Tabelle
//jedes folgende array ist so versetzt, dass die a10 und a20 kleine Terz ist
//kleine und große Terz und Quinte bestimmen:
//https://upload.wikimedia.org/wikipedia/commons/a/a8/Geteilte_tastatur2.gif
//Layout und Octaven:
//https://www.c-thru-music.com/cgi/?page=layout_octaves
//orientierung:
//https://en.wikipedia.org/wiki/Harmonic_table_note_layout#/media/File:HarmonicTableMusicNoteLayout.png
//bei dierser Anordnung gibt es zusätzlich andere Intervalle die entstehen, neben Quinten, kleinen und großen Terzen auch Septimen
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
]

//MIDI NOTES AND EVENTS
let midiNotes = {
"gis’’’’’’": 128, 
"ges’’’’’’": 128,
"g’’’’’’":    127,	
"fis’’’’’’":  126,
"ges’’’’’’":  126,	
"f’’’’’’":    125,
"e’’’’’’":	  124,
"dis’’’’’’":   123,
"es’’’’’’":   123,	
"d’’’’’’":	  122,
"cis’’’’’’":  121, 
"des’’’’’’":  121,
"c’’’’’’": 120,
//
"h’’’’’": 119,
"ais’’’’’": 118,
"b’’’’’": 118,
"a’’’’’": 117,
"gis’’’’’":116,
"ges’’’’’":116,
"g’’’’’":115,
"fis’’’’’":114,
"ges’’’’’":114,
"f’’’’’":113,
"e’’’’’": 112,
"dis’’’’’":111,
"es’’’’’":111,
"d’’’’’":110,
"cis’’’’’":109,
"des’’’’’":109,
"c’’’’’":108,
//
"h’’’’":107,
"ais’’’’":106,
"b’’’’":106,
"a’’’’":105,
"gis’’’’":104,
"ges’’’’":104,
"g’’’’":103,
"fis’’’’":102, 
"ges’’’’":102,	
"f’’’’":101,	
"e’’’’":100,	
"dis’’’’":99,
"es’’’’":99,	
"d’’’’":98,
"cis’’’’":97,
"des’’’’":97,	
"c’’’’":96,
//
"h’’’":95,
"ais’’’":94,
"b’’’":94,
"a’’’":93,
"gis’’’":92,
"as’’’":92,
"g’’’":91,
"fis’’’":90,
"ges’’’":90,
"f’’’":89,
"e’’’":88,
"dis’’’":87,
"es’’’":87,
"d’’’":86,
"cis’’’":85,
"des’’’":85,
"c’’’":84,
//
"h’’":83,
"ais’’":82,
"b’’":82,
"a’’":81,
"gis’’":80,
"as’’":80,
"g’’":79,
"fis’’":78,
"ges’’":78,
"f’’":77,
"e’’":76,
"dis’’":75,
"es’’":75,
"d’’":74,
"cis’’":73,
"des’’":73,
"c’’":72,
//
"h’":71,
"ais’":70,
"b’":70,
"a’":69, 
"gis’":68,
"as’":68,
"g’":67,	
"fis’":66,
"ges’":66,
"f’":65,
"e’":64,	
"dis’":63,
"es’":64,
"d’":62,
"cis’":61,
"des’":61,
"c’":60,
//
"h":59,
"ais":58,
"b":58,
"a":57,
"gis":56,
"as":56,
"g":55,
"fis":54,
"ges":54,
"f":53,
"e":52,
"dis":51,
"es":51,
"d":50,
"cis":49,
"des":49,
"c":48,
//
"H":47,
"Ais":46,
"B":46,
"A":45,	
"Gis":44,
"As":44,
"G": 43,	
"Fis":42,
"Ges":42,	
"F":41,	
"E":40,	
"Dis":39,
"Es":39,
"D":38,	
"Cis":37,
"Des":37,
"C":36,
//
"H#":35,	
"Ais#":34,
"B#":34,	
"A#":33,	
"Gis#":32,
"As#":32,
"G#":31,	
"Fis#":30,
"Ges#":30,	
"F#":29,	
"E#":28,	
"Dis#":27,
"Es#":27,
"D#":26,	
"Cis#":25,
"Des#":25,
"C#":24,	
//
"H##":23,	
"Ais##":22,
"B##":22,	
"A##":21,
"Gis##":20,	
"As##":20,
"G##":19,
"Fis##":18,	
"Ges##":18,
"F##":17,	
"E##":16,
"Dis##":15,
"Es##":15,	
"D##":14,	
"Cis##":13,
"Des##":13,
"C##":12,
//	
"H###":11,
"Ais###":10,	
"B###":10,	
"A###":9,	
"Gis###":8,
"As###":8,	
"G###":7,	
"Fis###":6,
"Ges###":6,
"F###":5,	
"E###":4,
"Dis###":4,
"Es###":3,
"D###":2,
"Cis###":1, 
"Des###":1,
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

/******************************************************************************* 

                    HELPER FKT

*******************************************************************************/

function dodownit( contentof, nameoffile, type ){
    var af = new Blob( [ contentof ], {type: type} );
    var theIE = false || !!document.documentMode;
    if ( theIE ){
        window.navigator.msSaveOrOpenBlob( af, nameoffile );
    } else {
        var alink = document.createElement( 'a' );
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

/******************************************************************************* 

                    Storage

*******************************************************************************/

function TOstorage( ){
    localStorage.setItem( "mixedtraj", mixedtraj );
    localStorage.setItem( "passtosequencer", passtosequencer );
    localStorage.setItem( "doplay", doplay );
    localStorage.setItem( "backgrDAYNIGHT", backgrDAYNIGHT );
    localStorage.setItem( "strokeoftraj", strokeoftraj );
    localStorage.setItem( "sendtoall", sendtoall );
  
    localStorage.setItem( "jesnoOSC", jesnoOSC );
    localStorage.setItem( "OSCstring", OSCstring );
    localStorage.setItem( "jesnogest", jesnogest );
    localStorage.setItem( "jesnovel", jesnovel );
    localStorage.setItem( "jesnoafter", jesnoafter );
    localStorage.setItem( "jesnomodulation", jesnomodulation );
}

function FROMstorage( ){
    mixedtraj = JSON.parse( localStorage.getItem( "mixedtraj" ) );
    passtosequencer = JSON.parse( localStorage.getItem( "passtosequencer" ) );
    doplay = JSON.parse( localStorage.getItem( "doplay" ) );

    backgrDAYNIGHT = parseInt( localStorage.getItem( "backgrDAYNIGHT" ) );
    strokeoftraj = localStorage.getItem( "strokeoftraj" );
    sendtoall = JSON.parse( localStorage.getItem( "sendtoall" ) );
  
    jesnoOSC = JSON.parse( localStorage.getItem( "jesnoOSC" ) );
    OSCstring = localStorage.getItem( "OSCstring" );
    jesnogest = JSON.parse( localStorage.getItem( "jesnogest" ) );
    jesnovel = JSON.parse( localStorage.getItem( "jesnovel" ) );
    jesnoafter = JSON.parse( localStorage.getItem( "jesnoafter" ) );
    jesnomodulation = JSON.parse( localStorage.getItem( "jesnomodulation" ) );
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

function menusequtraj( ){
    if( document.getElementById('trajrecseq').checked ){
        passtosequencer = true;
    } else {
        passtosequencer = false;
    }
    TOstorage( );
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

function changeOSCstr( ){
    if( document.getElementById('basestring').value !== "" ){
        OSCstring = document.getElementById('basestring').value;
    }
    TOstorage( );
}

function addtoseqtiming( ){
    let sp = document.createElement( "span" );
    sp.className = "seqteprep";

    let i = document.createElement( "select" );//DELAY AFTER
    for( let u = 0; u < 20; u+=1 ){
        let o = document.createElement( "option" );
        o.value = u*250;
        o.innerHTML = u*250;
        
        i.appendChild( o );
    }
    let j = document.createElement( "input" ); //MUTE step
    j.setAttribute( "type", "checkbox" );
    j.checked = true;

    let b = document.createElement( "br" );
    let k = document.createElement( "span" ); //DELET FROM SEQ
    //k.onclick = delfromseq( this );
    k.innerHTML = "X";
    sp.appendChild( i );
    //sp.appendChild( b );
    sp.appendChild( j );
    //sp.appendChild( k );
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

function initMenu( ){    
    //write presets to the menu GUI
    document.getElementById('sedtoall').checked = sendtoall;
    document.getElementById('trajrec').checked = mixedtraj;
    document.getElementById("daynightsel").selectedIndex = parseInt(backgrDAYNIGHT);
    document.getElementById('trajrecseq').checked = passtosequencer;
    document.getElementById('sendosc').checked = jesnoOSC;
    document.getElementById('gestrec').checked = jesnogest;
    document.getElementById('gestvel').checked = jesnovel;
    document.getElementById('gestafter').checked = jesnoafter;
    document.getElementById('basestring').value = OSCstring;
    document.getElementById('gestmodu').checked = jesnomodulation;

    //position of menu
    let m = document.getElementById('menu');
    m.style.width = (w-120).toString()+"px";
    m.style.top = (h-m.offsetHeight).toString()+"px";
    m.style.left = (100).toString()+"px";

    m.addEventListener('touchstart', function( e ) {  e.stopImmediatePropagation(); });
    m.addEventListener('touchend', function( e ) { e.stopImmediatePropagation(); });

    seqtimingelem = document.getElementById('seqtiming');
}

function showmidimenu( ){
    showsubmenudiv( "#midimenu" ); 
}

function showbuttmenu( ){
    showsubmenudiv( "#buttonmenu" );
}

function showseqmenu( ){
    showsubmenudiv( "#seqmenu" );
}

function showoscmenu( ){
    showsubmenudiv( "#oscmenu" );
}

function showgestmenu( ){
    showsubmenudiv( "#gestmenu" );
}

function showsubmenudiv( elemid ){
    let melem = document.querySelector( elemid );
    if( melem.style.display === "none" ){
        melem.style.background = '#' + Math.random().toString(16).substring(2, 8);
        melem.style.display = "block";
    } else {
        melem.style.display = "none";
    }
    HplaceMenu(  ); //hm 
}

function downseq( ){
    if( sequencer.length !== 0 ){
        dodownit( JSON.stringify( sequencer ) , "sequenc"+Date.now( ).toString( )+".seq",  "application/json" );
    } else {
        alert("No Sequence to download.");
    }
}

function upseq( ){
    let fifisel = document.getElementById("seqinput").files[0];
    var reader = new FileReader();
    reader.onload = function (e) {
        seqtimingelem.innerHTML = "";
		sequencer = JSON.parse( reader.result );
        for( let s = 0; s < sequencer.length; s+=1 ){
            addtoseqtiming( );
        }
	}
    reader.readAsText( fifisel );
}

function play( ){
    doplay = true;
    TOstorage( );
    sequencerstep( );
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


/******************************************************************************* 

                   SEQUNECER

*******************************************************************************/
function delfromseq( elem ){
    console.log("not imple now");
}

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
        //console.log("startof traj in seqframe", durr, minstarttime)
        for( let n = 0; n < sequencer[ seqframe ][ 0 ][ elemid ].length; n+=1 ){
            let notedurr = sequencer[ seqframe ][ 0 ][ elemid ][ n ][ 4 ];
            let channeloffset = sequencer[ seqframe ][ 0 ][ elemid ][ n ][ 2 ];
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
                for( let n = 0; n < sequencer[ seqplaying ][0][ elemid ].length; n+=1 ){
                    compdura += sequencer[ seqplaying ][0][ elemid ][n][4];
                }
                //only single note playing
                if( sequencer[ seqplaying ][0][ elemid ].length == 1 ){
                    compdura = sequencer[ seqplaying ][0][ elemid ][0][4];
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

                   DEFAULT GESTURE / TOUCH HANDLING

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
    for( let t = 0; t < touchesTargetOvertime[elemid].length-1; t+=1 ){ //there is only one touch in touchlist per time when only one touch is per target - is this right?????
        trajcon.beginPath();
        trajcon.lineWidth = touchesTargetOvertime[elemid][t][3].split(",").length*2;
        trajcon.strokeStyle = strokeoftraj;
        trajcon.moveTo(touchesTargetOvertime[elemid][t][0][0].pageX, touchesTargetOvertime[elemid][t][0][0].pageY);
        trajcon.lineTo(touchesTargetOvertime[elemid][t+1][0][0].pageX, touchesTargetOvertime[elemid][t+1][0][0].pageY);
        trajcon.stroke();
        trajcon.closePath();
    }
    
}

window.addEventListener('touchmove', function( e ) {
    e.preventDefault();
    e.stopPropagation();
    e.stopImmediatePropagation();
    if( window.visualViewport.scale !== 1 ){
        let zoomfak = 1/window.visualViewport.scale;
        let offsetLeft = window.visualViewport.offsetLeft/10;
        //console.log( "zoomfak", zoomfak, "" );
        let offsetTop =  -window.visualViewport.offsetTop/10;
        mainsvgelem.style.transform = 'translate(' +
                              offsetLeft + 'px,' +
                              offsetTop + 'px) ' +
                              'scale(' + zoomfak + ')';

    }
    if( e.target.getAttribute("title") ){
        // Feedback
        let idofelem = e.target.getAttribute('id');
        let ix = e.targetTouches[e.targetTouches.length-1].pageX;
        let iy = e.targetTouches[e.targetTouches.length-1].pageY;
        let elemunder = document.elementFromPoint( ix, iy );
        let realy = "";
        
        if( mixedtraj ){
            elemunder.setAttribute( 'fill' , "#fff"  );
            realy = elemunder.getAttribute("title");
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
        if( realy !== "" ){
            let currnotes = realy.split( "," );
            let timestamp = Date.now( );
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
                            VEL_VAL = Math.min( 127, Math.round((s/notesplaying[idofelem][lastNOTEsWere][4]) *1000 ) );
                            //console.log(s, notesplaying[idofelem][lastNOTEsWere][4], VEL_VAL )
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
                    touchesTargetOvertime[ idofelem ].push( [e.targetTouches,timestamp,elemunder.getAttribute("name"),elemunder.getAttribute("title")] );    
                    if( touchesTargetOvertime[ idofelem ].length % 2 == 0 ){
                        drawTouch( idofelem );
                    }
                }
            }
        }
    }
}, false);

window.addEventListener('touchstart', function( e ) { 
    //default behavior
    e.preventDefault();
    e.stopPropagation(); 
    e.stopImmediatePropagation();
    let channeloffset = null;
    if( MIDIchanOffAvailable.length !== 0 ){
        channeloffset = MIDIchanOffAvailable.pop();
    }
    if( e.target.getAttribute("title") && channeloffset !== null ){
        let idofelem = e.target.getAttribute('id');
        let currnotes = e.target.getAttribute("title").split(",");
        let timestamp = Date.now();
        for (let out of Midioutputs.values() ){
            if( theMIDIout === out.name || sendtoall ){
                for( let i = 0; i < currnotes.length; i+=1 ){
                    let nnn = parseInt(currnotes[i]);
                    out.send([NOTE_ONS[channeloffset][i], nnn, FULL_VEL]);
                }
                
            }            
        }
        let ix = e.targetTouches[e.targetTouches.length-1].pageX;
        let iy = e.targetTouches[e.targetTouches.length-1].pageY;
        if( notesplaying[idofelem] ){
            notesplaying[ idofelem ].push( [currnotes, timestamp, channeloffset, , , FULL_VEL, ix, iy ] );
        } else {
            notesplaying[ idofelem ] = [ [currnotes, timestamp, channeloffset, , , FULL_VEL, ix, iy ] ];
        }
        //visual feedback
        e.target.setAttribute( 'fill' , "black"  );
        //storage
        if( touchesTargetOvertime[ idofelem ] ){
            touchesTargetOvertime[ idofelem ].push( 
                [e.targetTouches, timestamp,e.target.getAttribute("name"),e.target.getAttribute("title")] );    
        } else {
            touchesTargetOvertime[ idofelem ] = [[e.targetTouches,timestamp,e.target.getAttribute("name"),e.target.getAttribute("title")]]; 
        }  
    }
}, false);

window.addEventListener('touchend', function( e ) {   
    //default behavior 
    e.preventDefault();
    e.stopPropagation(); 
    e.stopImmediatePropagation();
    let idofelem = e.target.getAttribute('id');
    if( e.target.getAttribute("title") && notesplaying[idofelem] ){
        if( notesplaying[idofelem].length !== 0 ){
            let timestamp = Date.now();
            //preparation for restart a seq frame
            for( let eid in notesplaying ){ //alles durchgucken, ob noch was keine endezeit hat
                for( let l = 0; l < notesplaying[ eid ].length; l+=1 ){
                    if( notesplaying[eid][l][3] === undefined ){
                        notesplaying[eid][l][3] = timestamp; //set endtime on last note
                        notesplaying[eid][l][4] = notesplaying[eid][l][3]- notesplaying[eid][l][1];
                    }
                }
            }
            //care for playing
            for( let out of Midioutputs.values() ) {
                if( theMIDIout === out.name || sendtoall ){
                    for( let l = 0; l < notesplaying[idofelem].length; l+=1 ){
                        for(let partnotes = 0; partnotes < notesplaying[idofelem][l][0].length; partnotes+=1 ){
                            out.send( [ NOTE_OFFS[ notesplaying[idofelem][l][2] ][ partnotes ], 
                                        notesplaying[idofelem][l][0][partnotes], 
                                        ZERO_VEL ]); 
                        }
                        notesplaying[idofelem][l][3] = timestamp; //set endtime on last note
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
                            //console.log("AFtertouch created", curvature, l1, l2);
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
            notesplaying[idofelem] = [];
            touchesTargetOvertime[ idofelem ] = []; 
            //interaction//vis feedback
            e.target.setAttribute( 'fill' , e.target.getAttribute("name")  );
            //check if other notesareplaying and reject all but last note
            let newtimestamp = Date.now( );
            for( let eid in notesplaying ){
                if( notesplaying[ eid ].length > 1){
                    let lastnote = notesplaying[ eid ][notesplaying[ eid ].length-1];
                    lastnote[1] = newtimestamp;
                    notesplaying[ eid ] = [lastnote];
                } else if( notesplaying[idofelem].length == 1 ){
                    notesplaying[ eid ][0][1] = newtimestamp;
                }
            }
        }
    }
}, false);

//SIMULATE a touch
function filthselftouch(x, y, element, eventType) {
  const touchObj = new Touch({
    identifier: Date.now(),
    target: element,
    clientX: x,
    clientY: y,
    radiusX: 2.5,
    radiusY: 2.5,
    rotationAngle: 10,
    force: 0.5,
  });
  const touchEvent = new TouchEvent(eventType, {
    cancelable: true,
    bubbles: true,
    touches: [touchObj],
    targetTouches: [touchObj],
    changedTouches: [touchObj],
    shiftKey: true,
  });
  element.dispatchEvent(touchEvent);
}

function doselftouch(){
    let x1 = 55;
    let y1 = 66;
    let elem1 = document.elementFromPoint(x1, y1);
    let x2 = 255;
    let y2 = 255;
    let elem2 = document.elementFromPoint(x2, y2);
    //console.log(elem2);
    filthselftouch(x1, y1, elem1, 'touchstart');
    filthselftouch(x2, y2, elem2, 'touchstart');
    let i = 0;
    for(i = 0; i < 100; i+=1 ){
        
        filthselftouch(x1, y1+i, elem1, 'touchmove');
        filthselftouch(x2, y2+i, elem2, 'touchmove');
        

    }
    filthselftouch(x1, y1+i, elem1, 'touchend');
    filthselftouch(x2, y2+i, elem2, 'touchend');
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

function getTriangleGradient( c1, c2, c3 ){
    /*
VERSION 2
    <defs>

      <linearGradient id="fadeA-1" gradientUnits="userSpaceOnUse" x1="50.000000" y1="0.000000" x2="50.000000" y2="86.600000">
        <stop offset="0%" stop-color="#FF0000"/>
        <stop offset="100%" stop-color="#000000" />
      </linearGradient>
      <linearGradient id="fadeB-1" gradientUnits="userSpaceOnUse" x1="0.000000" y1="86.60000" x2="75.000000" y2="43.300000">
        <stop offset="0%" stop-color="#00FF00"/>
        <stop offset="100%" stop-color="#000000" />
      </linearGradient>
      <linearGradient id="fadeC-1" gradientUnits="userSpaceOnUse" x1="100.000000" y1="86.60000" x2="25.000000" y2="43.300000">
        <stop offset="0%" stop-color="#0000FF"/>
        <stop offset="100%" stop-color="#000000" />
      </linearGradient>

      <path id="pathA-1" d="M 50.000000,0.000000 L 0.000000,86.600000 100.000000,86.600000 Z" fill="url(#fadeA-1)"/>
      <path id="pathB-1" d="M 50.000000,0.000000 L 0.000000,86.600000 100.000000,86.600000 Z" fill="url(#fadeB-1)"/>
      <filter id="Default">
        <feImage xlink:href="#pathA-1" result="layerA" x="0" y="0" />
        <feImage xlink:href="#pathB-1" result="layerB" x="0" y="0" />
        <feComposite in="layerA" in2="layerB" operator="arithmetic" k1="0" k2="1.0" k3="1.0" k4="0" result="temp"/>
        <feComposite in="temp" in2="SourceGraphic"   operator="arithmetic" k1="0" k2="1.0" k3="1.0" k4="0"/>
      </filter>
    </defs>
*/

    /*let d = document.createElementNS( xmlns, 'defs' );
    let g1 = document.createElementNS( xmlns, 'linearGradient' );
    let g2 = document.createElementNS( xmlns, 'linearGradient' );
    let g3 = document.createElementNS( xmlns, 'linearGradient' );*/
    //return d; //return gradient and ID
}

function getDreiklang( cx, cy, r, incw, inch, n0, nq, nt1, nt2, cocol, colstro ){
    let cont = document.createElementNS( xmlns, 'g' );
    let ri = Math.sqrt( (r*r)-((r/2)*(r/2)) );
    if( n0 !== undefined && nq !== undefined && nt1 !== undefined ){
        let po = "";
        po += cx.toString()+","+cy.toString()+" ";
        po += (cx+(incw/2)).toString()+","+(cy-inch).toString()+" "; 
        po += (cx+incw).toString()+","+(cy).toString()+" "; 
        let popo = document.createElementNS( xmlns, 'polygon' );
            popo.setAttribute( 'title', n0.toString()+","+nq.toString()+","+nt1.toString() );
            popo.setAttribute( 'id', n0+"d0" );
            popo.setAttribute( 'fill' , cocol     );
            popo.setAttribute( 'stroke' , colstro     );
            popo.setAttribute( 'name' , cocol     );
            popo.setAttribute( 'points', po );
        cont.appendChild( popo );
    }
    if( n0 !== undefined && nq !== undefined && nt2 !== undefined ){
        let poo = "";
        poo += cx.toString()+","+cy.toString()+" ";
        poo += (cx+(incw/2)).toString()+","+(cy+inch).toString()+" "; 
        poo += (cx+incw).toString()+","+(cy).toString()+" "; 
        let popopo = document.createElementNS( xmlns, 'polygon' );
            popopo.setAttribute( 'title', n0.toString()+","+nq.toString()+","+nt2.toString() );
            popopo.setAttribute( 'id', n0+"d#" );
            popopo.setAttribute( 'fill' , cocol     );
            popopo.setAttribute( 'stroke' , colstro     );
            popopo.setAttribute( 'name' , cocol     );
            popopo.setAttribute( 'points', poo );
        
                cont.appendChild( popopo );
    }   
    
    return cont;
}

function getZweiklang( cx, cy, r, incw, inch, n0, nq, nt1, nt2, cocol, colstro ){
    let cont = document.createElementNS( xmlns, 'g' );
    let hi = Math.round(r/2);
    let ri = Math.sqrt( (r*r)-((r/2)*(r/2)) );
    
    if( n0 !== undefined && nq !== undefined ){
        let poo = "";
        poo += (cx).toString()+","+(cy-(ri/3)).toString()+" "; 
        poo += (cx+incw).toString()+","+(cy-(ri/3)).toString()+" "; 
        poo += (cx+incw).toString()+","+(cy+(ri/3)).toString()+" "; 
        poo += cx.toString()+","+(cy+(ri/3)).toString()+" "; 
        let rere1 = document.createElementNS( xmlns, 'polygon' );
            rere1.setAttribute( 'title', n0.toString()+","+nq.toString() );
            rere1.setAttribute( 'id', n0+"z0" );
            rere1.setAttribute( 'fill' , cocol     );
            rere1.setAttribute( 'stroke' , colstro     );
            rere1.setAttribute( 'name' , cocol     );
            rere1.setAttribute( 'points', poo );
        cont.appendChild( rere1 );
    }
    if( n0 !== undefined && nt2 !== undefined ){
        let pooo = "";
        
        pooo += (cx+(r/3)).toString()+","+(cy).toString()+" "; //eigenes 6 eck
        pooo += (cx+(incw/2)+(r/3)).toString()+","+(cy+inch).toString()+" "; //mitte oben
        pooo += (cx+(incw/2)-(r/3)).toString()+","+(cy+inch).toString()+" "; //anderes 6 eck
        pooo += (cx-(r/3)).toString()+","+(cy).toString()+" ";
        let rere2 = document.createElementNS( xmlns, 'polygon' );
            rere2.setAttribute( 'title', n0.toString()+","+nt2.toString() );
            rere2.setAttribute( 'id', n0+"z1" );
            rere2.setAttribute( 'fill' , cocol     );
            rere2.setAttribute( 'stroke' , colstro     );
            rere2.setAttribute( 'name' , cocol     );
            rere2.setAttribute( 'points', pooo );
        cont.appendChild( rere2 );
    }
    if( n0 !== undefined && nt1 !== undefined ){
        let poooo = "";
        poooo += (cx-(r/3)).toString()+","+(cy).toString()+" "; //eigenes 6 eck
        poooo += (cx+(incw/2)-(r/3)).toString()+","+(cy-inch).toString()+" "; //mitte oben
        poooo += (cx+(incw/2)+(r/3)).toString()+","+(cy-inch).toString()+" "; //anderes 6 eck
        poooo += (cx+(r/3)).toString()+","+(cy).toString()+" ";
        let rere3 = document.createElementNS( xmlns, 'polygon' );
            rere3.setAttribute( 'title', n0.toString()+","+nt1.toString() );
            rere3.setAttribute( 'id', n0+"z2" );
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
        subt.style.fontSize = '6px';
        subt.textContent = (textlabspl.length-1).toString();
        textlab = textlabspl[ 0 ];
        add = -3;
    }
    
    
    let ll = textlab.length;
    if( ll === 1){
        text.setAttribute('x', cx-Math.round(r)+9+add);
    } else if(ll === 2 ){
        text.setAttribute('x', cx-Math.round(r)+7+add);
    } else{
        text.setAttribute('x', cx-Math.round(r)+6+add);
    }
    text.setAttribute('y', cy+2);
    text.setAttribute('fill', 'black');
    text.setAttribute('font-family', 'monospace'); 
    text.style.fontSize = '9px';
    text.textContent = textlab;
    text.appendChild(subt);
    let ri = Math.sqrt( (r*r)-((r/2)*(r/2)) );
    let po = "";
    po += (cx+r).toString()+","+cy.toString()+" "; //r 0
    po += (cx+(r/2)).toString()+","+(cy+ri).toString()+" "; //u 1
    po += (cx-(r/2)).toString()+","+(cy+ri).toString()+" "; //uu 2
    po += (cx-r).toString()+","+cy.toString()+" "; //l 3
    po += (cx-(r/2)).toString()+","+(cy-ri).toString()+" "; //o 4
    po += (cx+(r/2)).toString()+","+(cy-ri).toString()+" "; //oo 5
    
    let popo = document.createElementNS( xmlns, 'polygon' );
        popo.setAttribute( 'title', titletext );
        popo.setAttribute( 'id', titletext+"e0" );
        popo.setAttribute( 'fill' , cocol     );
        popo.setAttribute( 'stroke' , colstro     );
        popo.setAttribute( 'name' , cocol     );
        popo.setAttribute( 'points', po );
    
    cont.appendChild( popo );
    cont.appendChild( text );   

    return cont;
}

function buildUIbuttons( msvg ){ //vertival display better perf
    let elemradius = Math.floor(elemsize/2);
    //elemcount is eual to the first array length in quintenterzen
    let incforW = Math.round((w-elemradius)/(elemcount));
    let incforH = Math.round((h-elemsize)/(quintenterzen.length));


    
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
                notenameT1 = quintenterzen[indexTerzen-1][indexQuniten+addalittle];
            }catch{}
            let notenameT2 = undefined;
            try{
                notenameT2 = quintenterzen[indexTerzen+1][indexQuniten+addalittle];
            }catch{}
            
            if( notename == undefined ){
                break;
            }
            
            //
            
            let randcolor = midiNotesCOLOR[ notename ][0];
            let randcolor2 =  midiNotesCOLOR[ notename ][1];
            if( alternate % 2 == 0 ){
                msvg.appendChild( getDreiklang( x, y, elemradius, incforW, incforH, midiNotes[ notename ], midiNotes[ notenameQ ], midiNotes[ notenameT1 ], midiNotes[ notenameT2 ], randcolor, randcolor2 ) );
            } else {
                msvg.appendChild( getDreiklang( x+(incforW/2), y, elemradius, incforW, incforH,  midiNotes[ notename ], midiNotes[ notenameQ ], midiNotes[ notenameT1 ], midiNotes[ notenameT2 ], randcolor, randcolor2 ) );
            }
            alternate+=1;
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
                notenameT1 = quintenterzen[indexTerzen-1][indexQuniten+addalittle];
            }catch{}
            let notenameT2 = undefined;
            try{
                notenameT2 = quintenterzen[indexTerzen+1][indexQuniten+addalittle];
            }catch{}
            
            if( notename == undefined ){
                break;
            }
            //
            let randcolor = midiNotesCOLOR[ notename ][0];
            let randcolor2 = midiNotesCOLOR[ notename ][1];
            //console.log(notename, midiNotes[ notename ], notenameQ, midiNotes[ notenameQ ], notenameT1, midiNotes[ notenameT1 ], notenameT2, midiNotes[ notenameT2 ])
            if( alternate % 2 == 0 ){
                msvg.appendChild( getZweiklang( x, y, elemradius, incforW, incforH, midiNotes[ notename ], midiNotes[ notenameQ ], midiNotes[ notenameT1 ], midiNotes[ notenameT2 ], randcolor, randcolor2 ) );
            } else {
                msvg.appendChild( getZweiklang( x+(incforW/2), y, elemradius, incforW, incforH,  midiNotes[ notename ], midiNotes[ notenameQ ], midiNotes[ notenameT1 ], midiNotes[ notenameT2 ], randcolor, randcolor2 ) );
            }
            alternate+=1;
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
            alternate+=1;
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
    w = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
	h = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
    //and color
    for( let key in midiNotesCOLOR ){
        midiNotesCOLOR[ key ][0] = '#' + Math.random().toString(16).substring(2, 8);
        midiNotesCOLOR[ key ][1] = '#' + Math.random().toString(16).substring(2, 8);
    }
    //
    elemcount = quintenterzen[0].length;
    
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
    //console.log("MIDI in: ", midiMessage.data.toString());
}

function midiInit( ){ //...
    if( window.navigator.requestMIDIAccess ){
        let midi = window.navigator.requestMIDIAccess().then( onMIDISuccess, onMIDIFailure );
    } else {
        console.log("NO MIDI NO FUN");
    }
}

/*******************************************************************************

                        MAIN MAIN

*******************************************************************************/

function netz( elemid ){
    console.log("Tonnetz GUI");
    midiInit( );
    screenInit( ); //set globals about the screen
    initSettings( );

    let thehtmltolinein = document.getElementById( elemid );
    thehtmltolinein.style.position = "fixed";//**

    //0 svg / touch event and curr feedback
    mainsvgelem = getsvgMAINELEM( );
    buildUIbuttons( mainsvgelem ); 
    thehtmltolinein.appendChild( mainsvgelem );

    //1 trajectories
    trajectoryelem = getTrajElem( );
    trajcon = trajectoryelem.getContext('2d');
    thehtmltolinein.appendChild( trajectoryelem );

    //2 trajectories drawn for sequencer
    seqdrawelem = getSequTrajElem( );
    sequcon = seqdrawelem.getContext('2d');
    thehtmltolinein.appendChild( seqdrawelem );

    //menu init
    initMenu( );
    daynight( );
    //performe happieness
    console.log("Ready for usage."); 
}

//eoffoe//
