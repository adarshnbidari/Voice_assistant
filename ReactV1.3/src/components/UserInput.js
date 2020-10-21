import React, { Component } from 'react';

import './css/UserInput.css';

import { MdMic } from 'react-icons/md';


import * as qna from '@tensorflow-models/qna';


export default class UserInput extends Component {


    constructor(props) {

        super(props);

        this.recognition = undefined;

        this.listening = false;

        this.synth = undefined;

        this.userInput = undefined;

        this.state = {

            listening: false,
            model: undefined

        };


    }

    //---------------------

    async componentDidMount() {

        console.log('component mounted');

        let model = await qna.load();

        this.setState({

            model: model

        });

        console.log('model loaded');

        if ('speechSynthesis' in window) {

            this.synth = window.speechSynthesis;

        }


        if ('webkitSpeechRecognition' in window) {

            this.recognition = new window.webkitSpeechRecognition();

            this.recognition.continuous = false;

            this.recognition.lang = "en-US";

            this.recognition.interimResults = true;

            this.recognition.maxAlternatives = 1;

            this.userInput = undefined;

            console.log(this.recognition);

        }

        this.recognition.onresult = e => {

            console.log('onresult');

            if (this.listening) {

                let res = e.results[0][0].transcript;

                this.props.demo(res);


                this.userInput = res;


            }

        };


        this.recognition.onspeechend = e => {

            console.log('onspeechend');

            if (this.listening) {
                this.recognition.stop();

                this.setState({ listening: false });

                console.log(this.userInput);

                this.props.currentStatus('stopped');

            }

        };

        this.recognition.onaudioend = e => {

            if (this.userInput !== undefined && this.state.model !== undefined) {

                this.AssistantReply(this.userInput);

            }

        };


        this.recognition.onsoundend = e => {
            console.log('onsoundend');
            if (this.listening) {
                this.listening = false;
                this.recognition.stop();
                this.setState({ listening: false });

                this.props.currentStatus('stopped');

            }
        };



        this.recognition.onnomatch = e => {

            console.log('onnomatch');

            this.recognition.abort();
            this.setState({ listening: false });
            this.props.demo("Sorry, i didn't recognize it");

            this.props.currentStatus('stopped');
        };


        this.recognition.onerror = e => {

            console.log('onerror');

            this.recognition.stop();
            this.setState({ listening: false });
            //alert('Current we are having a trouble!... Please try again later');
            console.log(e);

            this.props.currentStatus('stopped');
            document.location.reload();

        };




    }
    //

    getCurrentTime = () => {

        let d = new Date();


        let data = {

            currentTime: `${d.getHours()} Hours ${d.getMinutes()} Minutes ${d.getSeconds()} Seconds`,
            currentDate: d.getDate()

        };


        return data;


    };


    //--------------------------------------------------------

    AssistantReply = async (userInput) => {

        console.log('assistant reply');

        // let passage = `my name is corona.iam your assistant.
        // i can help your in answering your questions.
        // i am 22 years old.
        // the time is ${this.getCurrentTime().currentTime}.
        // today's date is ${this.getCurrentTime().currentDate}`;

        let passage = "GM Institute of Technology a Hi-tech engineering institute established in the academic year 2001 by Srishyla Educational Trust ,Bheemasamudra with the vision to provide quality technical and management education to the rural students and To develop technologically competent,humane and socially responsible engineers and managers to meet the ever growing challenges of the Global Environment. The mission to provide quality technical and management education by applying best practices in teaching, learning and with the state of the art infrastructural facilities.The Goals to create a comprehensive Technical platform for students to develop inter personnel skills,creativity and incisive edge of professionalism and To collaborate with organizations in the industry for mutual exchange of skills, technology and global vision. The objective of collage is to develop and implement quality policies, that effectively incorporates the dynamics of technical education,with required specification. The total number of students are 2500. The total number of teaching staff are 260. It is offering 6 UG Engineering Programs are Electronics and Communication, Computer Science, Information Science, Mechanical Engineering, Civil Engineering and Bio-Technology programme. The Founder President of the Trust was Late Sri. G. Mallikarjunappa the then Honorable Member of Parliament, Davangere. The campus is spread over 54 acres of lush green land. It has well planned monolithic buildings with the state-of-the-art infrastructure. Ph. D Programs are  Mechanical Engineering, Computer Science & Information Science Engineering, Electronics & Communication Engineering, Biotechnology and Engineering Chemistry and It is also offering master’s degree in Management. The principal of the GMIT is Doctor  Y Vijaya Kumar. The chairman and secretary of GMIT is Sri G M Lingaraju. The administarative officer is Sri Y U Subhashchandra. The HOD of computer science department is Doctor Sanjay Pande M B. ";


        if (userInput !== undefined) {


            console.log(`userInput is defined in assistant reply: ${userInput}`);

            let model = await this.state.model;

            let answers = await model.findAnswers(userInput, passage);

            console.log(answers);

            if (answers[0] !== undefined) {

                console.log('considering answers');

                this.props.demo(answers[0].text);

                let replyFromBot = new window.SpeechSynthesisUtterance(answers[0].text);
                this.synth.speak(replyFromBot);

                replyFromBot.addEventListener('start', e => {

                    this.props.currentStatus('speaking');

                });

                replyFromBot.addEventListener('end', e => {

                    this.props.currentStatus('stopped');

                });


            } else {
                console.log('no answer from model');
            }

        }


    };


    //----------------------------------------------

    startListening = () => {

        console.log('start Listening');

        if (this.state.listening === true) {

            console.log('1');

            this.setState({ listening: false });

            if (this.listening) {

                this.recognition.abort();

                this.props.currentStatus('stopped');

            }

        } else if (this.state.listening === false) {


            console.log('2');

            this.props.currentStatus('listening');

            this.setState({ listening: true });



            if (!this.listening) {
                this.recognition.abort();
                this.recognition.start();
                this.listening = true;
            }


        } else {
            console.log('reached third state!...');
        }


    };


    //-----------------------------

    render() {

        return (

            <div id="inputArea">

                <MdMic id="voiceInputButton" onClick={this.startListening} style={{ color: this.state.listening ? 'grey' : 'white', display: this.state.model !== undefined ? 'block' : 'none' }} />

            </div>


        );

    }


}