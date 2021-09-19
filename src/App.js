import React from 'react';
import './App.css';
import {AmplifySignOut, withAuthenticator} from '@aws-amplify/ui-react';
import axios from "axios";
import {Auth} from "aws-amplify";

class App extends React.Component {

    constructor(props) {
        super(props);
        this.state = {loading: true, drawingMissing: true};
    }

    componentDidMount() {
        Auth.currentSession().then(async authConfig => {
            const result = await axios.get('https://l6m6isx62e.execute-api.eu-west-2.amazonaws.com/prod/drawing', {headers: {authorization: authConfig.getIdToken().getJwtToken()}});
            if (result && result.data && result.data.message === "User's drawing is not in the database.") {
                this.setState({loading: false});
            } else {
                this.setState({loading: false, drawingMissing: false});
            }
        });
    }

    render() {
        return (
            <div className="App">
                <AmplifySignOut/>
                {this.state.loading ?
                    <b>Loading...</b> :
                    this.state.drawingMissing ?
                        <b>Drawing is missing</b> : <b>Drawing is present</b>
                }
            </div>
        );
    }
}

export default withAuthenticator(App);
