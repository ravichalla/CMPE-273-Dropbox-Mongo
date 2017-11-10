import React, {Component} from 'react';
import {Route, withRouter} from 'react-router-dom';
import * as API from "../api/API";

class About extends Component {

    state = {
        username: '',
        overview: '',
        work: '',
        education: '',
        contactNumber: '',
        lifeEvents: '',
        music: '',
        shows: '',
        sports: '',
        aboutStatusMessage: ''
    };

    componentWillMount(){
        console.log("About - componentWillMount - username is " + this.props.username);
        this.setState({
            username: this.props.username,
            overview: '',
            work: '',
            education: '',
            contactNumber: '',
            lifeEvents: '',
            music: '',
            shows: '',
            sports: '',
            aboutStatusMessage: ''
        });
    }

    handleAbout = (payload) => {
        API.userAbout(payload)
            .then((res) => {
                if (res.status === 201) {
                    this.setState({

                        aboutStatusMessage: "USER INFORMATION SUCCESSFULLY UPDATED",
                    });
                    console.log("Account update successful");
                } else if (res.status === 500) {
                    this.setState({
                        aboutStatusMessage: "INTERNAL ERROR OCCURED"
                    });
                }
            });
    };

    render() {
        return (
            <div className="container-fluid">
                <div className="row justify-content-md-center">
                    <div>
                        <button className="btn btn-success" onClick={() => {
                            this.props.history.push("/welcome");
                        }}>
                            Home
                        </button>

                        <div>
                            <form>
                                <div className="form-group">
                                    <h1>About and Interests</h1>
                                </div>
                                <div className="form-group">
                                    <input
                                        className="form-control"
                                        type="text"
                                        label="overview"
                                        placeholder="User Overview"
                                        onChange={(event) => {
                                            this.setState({
                                                overview: event.target.value
                                            });
                                        }}
                                    />
                                </div>

                                <div className="form-group">
                                    <input
                                        className="form-control"
                                        type="text"
                                        label="work"
                                        placeholder="Work Information"
                                        onChange={(event) => {
                                            this.setState({
                                                work: event.target.value
                                            });
                                        }}
                                    />
                                </div>

                                <div className="form-group">
                                    <input
                                        className="form-control"
                                        type="text"
                                        label="education"
                                        placeholder="Education Information"
                                        onChange={(event) => {
                                            this.setState({
                                                education: event.target.value
                                            });
                                        }}
                                    />
                                </div>

                                <div className="form-group">
                                    <input
                                        className="form-control"
                                        type="text"
                                        label="contactNumber"
                                        placeholder="Contact Number"
                                        onChange={(event) => {
                                            this.setState({
                                                contactNumber: event.target.value
                                            });
                                        }}
                                    />
                                </div>

                                <div className="form-group">
                                    <input
                                        className="form-control"
                                        type="text"
                                        label="lifeEvents"
                                        placeholder="Life Events"
                                        onChange={(event) => {
                                            this.setState({
                                                lifeEvents: event.target.value
                                            });
                                        }}
                                    />
                                </div>

                                <div className="form-group">
                                    <input
                                        className="form-control"
                                        type="text"
                                        label="music"
                                        placeholder="Music"
                                        onChange={(event) => {
                                            this.setState({
                                                music: event.target.value
                                            });
                                        }}
                                    />
                                </div>

                                <div className="form-group">
                                    <input
                                        className="form-control"
                                        type="text"
                                        label="shows"
                                        placeholder="Shows"
                                        onChange={(event) => {
                                            this.setState({
                                                shows: event.target.value
                                            });
                                        }}
                                    />
                                </div>

                                <div className="form-group">
                                    <input
                                        className="form-control"
                                        type="text"
                                        label="sports"
                                        placeholder="Sports"
                                        onChange={(event) => {
                                            this.setState({
                                                sports: event.target.value
                                            });
                                        }}
                                    />
                                </div>

                                <div className="form-group">
                                    <button
                                        className="btn btn-primary"
                                        type="button"
                                        onClick={() => this.handleAbout(this.state)}>
                                        Update
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>

                    <div>
                        {this.state.aboutStatusMessage}
                    </div>
                </div>
            </div>
        );
    }
}

export default withRouter(About);