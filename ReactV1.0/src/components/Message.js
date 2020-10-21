import React, { Component } from 'react';

import './css/Message.css';


export default class Message extends Component {

    render() {

        return (

            <div className="message"

                style={{ float: `${this.props.userType === 'user' ? 'right' : 'left'}` }} >

                {this.props.data}

            </div>


        );


    }


}