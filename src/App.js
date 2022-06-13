
import React, { useState, useEffect } from "react";

// Variables_______________________________________________________________________________________

const soundBank = [
    {
        name: "Kick",
        letter: "Q",
        letterCode: 81,
        url: "./sounds/kick.wav"
    },
    {
        name: "Clap",
        letter: "W",
        letterCode: 87,
        url: "./sounds/clap.wav"
    },
    {
        name: "Snare",
        letter: "E",
        letterCode: 69,
        url: "./sounds/snare.wav"
    },
    {
        name: "Open Hat",
        letter: "A",
        letterCode: 65,
        url: "./sounds/open-hat.wav"
    },
    {
        name: "Closed Hat",
        letter: "S",
        letterCode: 83,
        url: "./sounds/closed-hat.wav"
    },
    {
        name: "Rim Shot",
        letter: "D",
        letterCode: 68,
        url: "./sounds/rim-shot.wav"
    },
    {
        name: "High Tom",
        letter: "Z",
        letterCode: 90,
        url: "./sounds/hi-tom.wav"
    },
    {
        name: "Low Tom",
        letter: "X",
        letterCode: 88,
        url: "./sounds/lo-tom.wav"
    },
    {
        name: "Crash",
        letter: "C",
        letterCode: 67,
        url: "./sounds/crash.wav"
    },
]

const sequencerInputs = [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15];

let counter = 0;

let timeArr = [];

// Main app component, including sequencer_______________________________________________________________________________________
console.log("working");

class App extends React.Component {
    constructor(props) {
    super(props);
    this.state = {
        lastSound: '',
        mode: "live",
        sequence: ['', '', '', '', '', '', '', '', '', '', '', '', '', '', '', ''],
        bpm: 125,
        playing: false
    }
    this.padPress = this.padPress.bind(this);
    this.handleKeyPress = this.handleKeyPress.bind(this);
    this.handleSequencerInput = this.handleSequencerInput.bind(this);
    this.playSequence = this.playSequence.bind(this);
    this.handleBPMInput = this.handleBPMInput.bind(this);
    this.bpmTap = this.bpmTap.bind(this);
    }

    
    componentDidMount() {
        document.addEventListener('keydown', this.handleKeyPress);
        const sequencerTimer = setInterval(() => {
            if (this.state.playing === true) {
            let activePad = document.getElementById(`sequencer-${counter}`)
            let lastPad = document.getElementById(`sequencer-${counter - 1}`)
                activePad.classList.add('active');
                if(counter > 0) {lastPad.classList.remove('active');}
                let soundLetter = soundBank.filter((entry) => {return entry.name == this.state.sequence[counter]})
            if (soundLetter.length === 1) {soundLetter = soundLetter[0].letter};
            if (/[A-Z]/.test(soundLetter)) {
                    
                let audio = document.getElementById(soundLetter);
                console.log(audio);
                audio.currentTime = 0;
                 audio.play();
                    
                } else {console.log('rest')};
                if(counter === 15) {activePad.classList.remove('active');}
                counter++;
                counter = counter % 16;
            }
            }, this.state.bpm ? (15000/this.state.bpm) : 125);
            return () => clearInterval(sequencerTimer);
      }
    
    componentWillUnmount() {
        document.removeEventListener('keydown', this.handleKeyPress);
        clearInterval(sequencerTimer);
      }
    
    // Functions________________________________________________________________________________________


    handleKeyPress(key) {
        if(this.state.mode === "live") {
        let sound = soundBank.filter((x) => {
            return x.letterCode == key.keyCode;
        })
        if (sound.length === 1) {
        let audio = document.getElementById(sound[0].letter);
        audio.currentTime = 0;
        audio.play();
        this.setState({
            lastSound: sound[0].name,
            mode: this.state.mode,
            sequence: this.state.sequence,
            bpm: this.state.bpm,
            playing: this.state.playing
        });
        
    }
    }
    }


    padPress(event) {
        
        let padId = event.target.id[0];

        let sound = soundBank.filter((x) => {
            return x.letter == padId;
        })
        if (sound.length === 1) {
        let audio = document.getElementById(sound[0].letter);
        audio.currentTime = 0;
        audio.play();
        
        this.setState({
            lastSound: sound[0].name,
            mode: this.state.mode,
            sequence: this.state.sequence,
            bpm: this.state.bpm,
            playing: this.state.playing
        });
    }
    }

    handleSequencerInput(event) {
        let inputNumber = 0;
        if (event.target.id.length === 12) {
            inputNumber = parseInt(event.target.id[10].concat(event.target.id[11]));
        } else {inputNumber = parseInt(event.target.id[10])};
        let newSequence = [...this.state.sequence.slice(0, inputNumber), event.target.value, ...this.state.sequence.slice((inputNumber - 15))]
        this.setState({
            lastSound: this.state.lastSound,
            mode: this.state.mode,
            sequence: newSequence,
            bpm: this.state.bpm,
            playing: this.state.playing
        })
    }

    playSequence(event) {
        // for(let i = 0; i < 16; i++) {
        //     let activePad = document.getElementById(`sequencer-${i}`)
        //     let lastPad = document.getElementById(`sequencer-${i - 1}`)
        //     setTimeout(() => {
        //         activePad.classList.add('active');
        //         if(i > 0) {lastPad.classList.remove('active');}
        //         let soundLetter = soundBank.filter((entry) => {return entry.name == this.state.sequence[i]})
        //     if (soundLetter.length === 1) {soundLetter = soundLetter[0].letter};
        //     if (/[A-Z]/.test(soundLetter)) {
                    
        //         let audio = document.getElementById(soundLetter);
        //         console.log(audio);
        //         audio.currentTime = 0;
        //          audio.play();
                    
        //         } else {console.log('rest')};
        //         if(i === 15) {activePad.classList.remove('active');}
        //     }, this.state.bpm ? (15000/this.state.bpm) * i : 125 * i);
            
        // }
        if (this.state.playing === false) {
        this.setState({
            lastSound: this.state.lastSound,
            mode: this.state.mode,
            sequence: this.state.sequence,
            bpm: this.state.bpm,
            playing: true
        })
        }
        else {
            counter = 0;
            this.setState({
                lastSound: this.state.lastSound,
                mode: this.state.mode,
                sequence: this.state.sequence,
                bpm: this.state.bpm,
                playing: false
            })
        }
    }

    handleBPMInput(event) {
        console.log(event.target.value);
        if (!isNaN(event.target.value)) {
        this.setState({
            lastSound: this.state.lastSound,
            mode: this.state.mode,
            sequence: this.state.sequence,
            bpm: event.target.value,
            playing: this.state.playing
        })
        }
    }

    bpmTap() {
        let newTime = Date.now();
        let updatedBPM = 0;
        if (timeArr.length < 4) {
            timeArr.push(newTime);
            switch(timeArr.length) {
                case 1:
                    return
                case 2:
                    updatedBPM = 60000 / (timeArr[1] - timeArr[0]);
                    break;
                case 3:
                    updatedBPM = 60000 / (((timeArr[1] - timeArr[0]) + (timeArr[2] - timeArr[1])) / 2);
                    break;
            }
        } else {
            timeArr.push(newTime);
            timeArr.shift();
            updatedBPM = 60000 / (((timeArr[1] - timeArr[0]) + (timeArr[2] - timeArr[1])) / 2);
            
        }
        this.setState({
            lastSound: this.state.lastSound,
            mode: this.state.mode,
            sequence: this.state.sequence,
            bpm: Math.floor(updatedBPM),
            playing: this.state.playing
        })
        console.log(timeArr);
        }
    
    
    
    // Render section_________________________________________________________________________________________________________________________
    render() {
    return (
    <div className="app-container" id="drum-machine">
        <h1>Dynamic Drum Sequencer</h1>
        <div className="pad-controls-container">
        <div className="drumpad-container">
            {/* Use CSS grid */}
            {soundBank.map((sound) => {
                return <button key={sound.letter} className="drumpad" id={`${sound.letter}-pad`} onClick={this.padPress}>{sound.letter}<audio id={sound.letter} src={`${sound.url}`}></audio></button>;
            })}
        </div>
        
        <div className="display-container">
            <p className="label container-label">LAST SOUND:</p>
            <p id="display" className="display">{this.state.lastSound}</p>
        </div>
        <div className="bpm-container">
            <p className="label container-label">SEQUENCER</p>
                    <p className="label bpm-label">Current BPM:</p>
                    <p className="display bpm-output">{this.state.bpm ? this.state.bpm : 125}</p>
                    <p className="label set-bpm-label">Set BPM:</p>
                    <input type="number" className="display" onChange={this.handleBPMInput}></input>
                    <button className="button tap-bpm-button" onClick={this.bpmTap}>Tap</button>
                    <button id="play-button" className="button play-button" onClick={this.playSequence}>Play</button>
            </div>
        
        </div>
            <div className="sequencer-container">
                {sequencerInputs.map((item) => {
                    return <div className="sequencer-input-container" key={item}>
                    <label className="label sequencer-input-label">{item + 1}</label>
                    <select id={`sequencer-${item}`} className="button sequencer-input" onChange={this.handleSequencerInput}>
                        <option value=""> </option>
                        {soundBank.map((item) => {
                            return <option value={item.name} key={item.letter}>{item.name}</option>
                        })}
                    </select>
                    </div>
                })}
                
                
            </div>
    </div>
    );
    }

}

// _________User Story #1: I should be able to see an outer container with a corresponding id="drum-machine" that contains all other elements.

// __________User Story #2: Within #drum-machine I can see an element with a corresponding id="display".

// _________User Story #3: Within #drum-machine I can see 9 clickable drum pad elements, each with a class name of drum-pad, a unique id that describes the audio clip the drum pad will be set up to trigger, and an inner text that corresponds to one of the following keys on the keyboard: Q, W, E, A, S, D, Z, X, C. The drum pads MUST be in this order.

// ________User Story #4: Within each .drum-pad, there should be an HTML5 audio element which has a src attribute pointing to an audio clip, a class name of clip, and an id corresponding to the inner text of its parent .drum-pad (e.g. id="Q", id="W", id="E" etc.).

// __________User Story #5: When I click on a .drum-pad element, the audio clip contained in its child audio element should be triggered.

// __________User Story #6: When I press the trigger key associated with each .drum-pad, the audio clip contained in its child audio element should be triggered (e.g. pressing the Q key should trigger the drum pad which contains the string Q, pressing the W key should trigger the drum pad which contains the string W, etc.).

// User Story #7: When a .drum-pad is triggered, a string describing the associated audio clip is displayed as the inner text of the #display element (each string must be unique).

export default App;