import React from 'react';
import './App.css';
import {AmplifySignOut, withAuthenticator} from '@aws-amplify/ui-react';
import axios from "axios";
import {Auth} from "aws-amplify";

class App extends React.Component {

    constructor(props) {
        super(props);
        this.state = {loading: true, drawingMissing: true, item: {message: ""}, token: "" };
    }

    componentDidMount() {
        Auth.currentSession().then(async authConfig => {
            const token = authConfig.getIdToken().getJwtToken();
            const result = await axios.get('https://l6m6isx62e.execute-api.eu-west-2.amazonaws.com/prod/drawing', {headers: {authorization: token}});

            if (result && result.data && result.data.message === "User's drawing is not in the database.") {
                this.setState({loading: false, token});
            } else {
                const parsedData = JSON.parse(result.data.data);
                this.setState({loading: false, drawingMissing: false, token, item: parsedData});
            }
        });
    }

    handleInputChanged(event) {
        const item = {...(this.state.data)};
        item.message = event.target.value;
        this.setState({item});
    }

    async handleDatabaseSave() {
        const response = await axios.post('https://l6m6isx62e.execute-api.eu-west-2.amazonaws.com/prod/drawing', this.state.item, {
            headers: {
                authorization: this.state.token
            }
        });
        if (response && response.data && response.data.message === "User's drawing inserted to the database.") {
            this.setState({ drawingMissing: false });
        } else {
            console.error("Unknown error occurred!");
        }
    }

    render() {
        return (
            <div className="App">
                <AmplifySignOut/>
                {this.state.loading ?
                    <b>Loading...</b> :
                    this.state.drawingMissing ?
                        <div>
                            <input type="text" onChange={this.handleInputChanged.bind(this)} />
                            <button onClick={this.handleDatabaseSave.bind(this)}>Save</button>
                        </div>
                        :
                        <div>
                            <p><b>Data stored in DB:</b> {this.state.item.message}</p>
                        </div>
                }
            </div>
        );
    }
}

export default withAuthenticator(App);
