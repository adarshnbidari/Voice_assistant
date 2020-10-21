import React, { Component } from 'react';

import Message from './Message';

import UserInput from './UserInput';

export default class App extends Component {


    constructor(props) {


        super(props);


        this.state = {

            outputData: []

        };


    }


    outputReply = (data) => {

        let newData = this.state.outputData;

        newData.push(data);

        this.setState({ outputData: newData });

    }

    render() {

        return (

            <div>

                {

                    this.state.outputData.map(e => {

                        return <Message key={Math.random()} userType='bot' data={e} />;

                    })

                }




                <UserInput demo={this.outputReply} />

            </div>


        );

    }


}