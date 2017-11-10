import React, {Component} from 'react';
import {Route, withRouter} from 'react-router-dom';
import * as API from "../api/API";

import "../welcome.css";
import "../login.css";

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

    componentWillMount() {
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

    handleLogout = () => {
        console.log('In handleLogout');
        API.doLogout()
            .then((status) => {
                if (status === 200) {
                    console.log("Logout Successful");
                    this.props.history.push("/");
                }
            });
    };

    render() {
        return (
            <div className="container">
                <div className="row">

                    <div className="col-sm-3">
                        <img src="https://goo.gl/yFaAFJ" height="80" width="80"/>
                        <h2>Dropbox</h2>
                    </div>

                    <div className="col-sm-9">
                        <br/><br/><br/><br/><br/>

                        <h3>About and Interests</h3>
                    </div>
                </div>

                <hr/>

                <div className="col-sm-3">
                    <div className="row">
                        <button className="btn btn-primary" onClick={() => {
                            this.props.history.push("/welcome");
                        }}>
                            Home
                        </button>
                    </div>

                    <br/>

                    <div className="row">
                        <button
                            className="btn btn-danger"
                            type="button"
                            onClick={this.handleLogout}>
                            Logout
                        </button>
                    </div>

                    <br/>

                    <div className="row">
                        {this.state.aboutStatusMessage}
                    </div>
                </div>

                <div className="col-sm-9">

                    <form>
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
        );
    }
}

export default withRouter(About);