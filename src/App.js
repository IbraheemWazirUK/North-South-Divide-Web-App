import React from 'react';
import './App.css';
import axios from "axios";

class App extends React.Component {

    constructor(props) {
        super(props);
        this.state = {loading: true, drawingMissing: true, item: {message: ""}, token: "" };
    }

    async componentDidMount() {
        const deviceId = "test";
        const result = await axios.post('https://l6m6isx62e.execute-api.eu-west-2.amazonaws.com/prod/fetchDrawing', {deviceId: deviceId});

        console.log(result);
        if (result && result.data && result.data.message === "User's drawing is not in the database.") {
            this.setState({loading: false});
        } else {
            this.setState({loading: false, drawingMissing: false});
        }
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

    async handleDeleteData() {
        const response = await axios.delete('https://l6m6isx62e.execute-api.eu-west-2.amazonaws.com/prod/drawing', {
            headers: {
                authorization: this.state.token
            }
        });

        if (response && response.data && response.data.message === "User's drawing deleted from the database.") {
            this.setState({drawingMissing: true, item: { message: "" } });
        } else {
            console.error("Unknown error occurred!");
        }
    }

    render() {
        return (
            <div className="App">
                {this.state.loading ?
                    <b>Loading...</b> :
                    this.state.drawingMissing ?
                        <p>Drawing is not in the database.</p>
                        :
                        <p>Drawing is in the database.</p>
                }
            </div>
        );
    }
}

export default App;
