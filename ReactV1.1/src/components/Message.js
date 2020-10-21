import React, { Component } from 'react';

import './css/Message.css';


export default class Message extends Component {

    render() {

        return (


            <div id="message">

                {this.props.data}


            </div>



        );


    }


}