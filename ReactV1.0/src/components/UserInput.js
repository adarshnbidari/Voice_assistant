import React, { Component } from 'react';

import './css/UserInput.css';

import { MdMic } from 'react-icons/md';


import * as qna from '@tensorflow-models/qna';


export default class UserInput extends Component {


    constructor(props) {

        super(props);

        this.model = undefined;

        this.recognition = undefined;

        this.listening = false;

        this.synth = undefined;

        this.userInput = undefined;

        this.state = {

            listening: false

        };

    }

    //---------------------

    async componentDidMount() {

        this.model = await qna.load();

        if ('speechSynthesis' in window) {

            this.synth = window.speechSynthesis;

        }


        if ('webkitSpeechRecognition' in window) {

            this.recognition = new window.webkitSpeechRecognition();

            this.recognition.continous = true;

            this.recognition.lang = "en-US";

            this.recognition.interimResults = true;

            this.recognition.maxAlternatives = 1;

            this.userInput = undefined;


        }

        this.recognition.onresult = e => {

            if (this.listening) {

                let res = e.results[0][0].transcript;

                this.props.demo(res);

                this.userInput = res;

            }

        };


        this.recognition.onspeechend = e => {
            if (this.listening) {
                this.recognition.stop();

                this.setState({ listening: false });

                this.AssistantReply(this.userInput);
            }
        };


        this.recognition.onsoundend = e => {
            if (this.listening) {
                this.listening = false;
                this.recognition.stop();
                this.setState({ listening: false });
            }
        };



        this.recognition.onnomatch = e => {
            this.recognition.stop();
            this.setState({ listening: false });
            this.props.demo("Sorry, i didn't recognize it");
        };


        this.recognition.onerror = e => {
            this.recognition.stop();
            this.setState({ listening: false });
            alert('Current we are having a trouble!... Please try again later');
            console.log(e);
        };




    }

    //--------------------------------------------------------

    AssistantReply = async (userInput) => {

        let passage = "my name is adarsh and i dont know your name and i can help you in answering your questions!";

        if (userInput !== undefined) {

            let model = await this.model;

            let answers = await model.findAnswers(userInput, passage);

            if (answers[0] !== undefined) {

                this.props.demo(answers[0].text);

                let replyFromBot = new window.SpeechSynthesisUtterance(answers[0].text);
                this.synth.speak(replyFromBot);

            }


        }


    };


    //----------------------------------------------

    startListening = () => {

        if (this.state.listening === true) {

            this.setState({ listening: false });

            if (this.listening) {

                this.recognition.stop();

            }

        } else {

            this.setState({ listening: true });



            if (!this.listening) {
                this.recognition.start();
                this.listening = true;
            }


        }


    };


    //-----------------------------

    render() {

        return (

            <div id="inputArea">

                <MdMic id="voiceInputButton" onClick={this.startListening} style={{ color: this.state.listening ? 'red' : 'black' }} />

            </div>


        );

    }


}