import React, { Component } from 'react';

import Message from './Message';

import UserInput from './UserInput';

import './css/App.css';


import ai_static_animation from './animations/static.gif';
import listening_animation from './animations/listening.gif';

import speaking_animation from './animations/speaking.gif';

export default class App extends Component {


    constructor(props) {

        super(props);


        this.state = {

            outputData: undefined,
            ImgSrc: ai_static_animation

        };


    }


    outputReply = (data) => {


        this.setState({

            outputData: data

        });


    }

    changeStatus = (data) => {

        if (data === 'listening') {

            this.setState({

                ImgSrc: listening_animation

            });

        } else if (data === 'speaking') {


            this.setState({

                ImgSrc: speaking_animation

            });


        } else {

            this.setState({

                ImgSrc: ai_static_animation

            });


        }


    };


    render() {

        return (

            <div>



                {/* {
                    this.state.outputData !== undefined ?  : null

                } */}

                <div id="message_container">

                    <img id="ai_animation" src={this.state.ImgSrc} alt="loading..." />

                    <Message data={this.state.outputData} />


                </div>





                <UserInput demo={this.outputReply} currentStatus={this.changeStatus} />

            </div>


        );

    }


}