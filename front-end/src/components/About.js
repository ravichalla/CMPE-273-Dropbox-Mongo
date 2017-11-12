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
        API.getDetails()
            .then((res) => {
                console.log("1 . Response status is --- " + res.status);
                res.json().then((data) => {
                    console.log("2 . Response status is --- " + data.status);

                    if (data.status === 204) {
                        console.log("The response overview is : " + data.overview);

                        this.setState({
                            overview: data.overview,
                            work: data.work,
                            education: data.education,
                            contactNumber: data.contactNumber,
                            lifeEvents: data.lifeEvents,
                            music: data.music,
                            shows: data.shows,
                            sports: data.sports,
                            aboutStatusMessage: "USER INFORMATION FETCHED SUCCESSFULLY"
                        });
                        console.log("Account update successful - 1");
                    } else if (data.status === 500) {
                        this.setState({
                            aboutStatusMessage: "INTERNAL ERROR OCCURRED"
                        });
                    }
                })
            });
    };

    handleAbout = (payload) => {
        API.userAbout(payload)
            .then((res) => {
                if (res.status === 201) {
                    this.setState({
                        aboutStatusMessage: "USER INFORMATION SUCCESSFULLY UPDATED"
                    });
                    console.log("Account update successful - 2");
                } else if (res.status === 500) {
                    this.setState({
                        aboutStatusMessage: "INTERNAL ERROR OCCURRED"
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

                    <table className="table">
                        <tr>
                            <td className="col-sm-3"><h4>User Overview</h4></td>
                            <td className="col-sm-6">
                                <div className="form-group">
                                    <input
                                        className="form-control"
                                        type="text"
                                        label="overview"
                                        placeholder="User Overview"
                                        value={this.state.overview}
                                        onChange={(event) => {
                                            this.setState({
                                                overview: event.target.value
                                            });
                                        }}
                                    />
                                </div>
                            </td>
                        </tr>

                        <tr>
                            <td className="col-sm-3"><h4>Work Information</h4></td>
                            <td className="col-sm-6">
                                <div>
                                    <input
                                        className="form-control"
                                        type="text"
                                        label="work"
                                        placeholder="Work Information"
                                        value={this.state.work}
                                        onChange={(event) => {
                                            this.setState({
                                                work: event.target.value
                                            });
                                        }}
                                    />
                                </div>
                            </td>
                        </tr>
                        <br/>
                        <tr>
                            <td className="col-sm-3"><h4>Education Information</h4></td>
                            <td className="col-sm-6">
                                <div className="form-group">
                                    <input
                                        className="form-control"
                                        type="text"
                                        label="education"
                                        placeholder="Education Information"
                                        value={this.state.education}
                                        onChange={(event) => {
                                            this.setState({
                                                education: event.target.value
                                            });
                                        }}>
                                    </input>
                                </div>
                            </td>
                        </tr>

                        <tr>
                            <td className="col-sm-3"><h4>Contact Number</h4></td>
                            <td className="col-sm-6">
                                <div className="form-group">
                                    <input
                                        className="form-control"
                                        type="text"
                                        label="contactNumber"
                                        placeholder="Contact Number"
                                        value={this.state.contactNumber}
                                        onChange={(event) => {
                                            this.setState({
                                                contactNumber: event.target.value
                                            });
                                        }}
                                    />
                                </div>
                            </td>
                        </tr>

                        <tr>
                            <td className="col-sm-3"><h4>Life Events</h4></td>
                            <td className="col-sm-6">
                                <div className="form-group">
                                    <input
                                        className="form-control"
                                        type="text"
                                        label="lifeEvents"
                                        placeholder="Life Events"
                                        value={this.state.lifeEvents}
                                        onChange={(event) => {
                                            this.setState({
                                                lifeEvents: event.target.value
                                            });
                                        }}
                                    />
                                </div>
                            </td>
                        </tr>

                        <tr>
                            <td className="col-sm-3"><h4>Music</h4></td>
                            <td className="col-sm-6">
                                <div className="form-group">
                                    <input
                                        className="form-control"
                                        type="text"
                                        label="music"
                                        placeholder="Music"
                                        value={this.state.music}
                                        onChange={(event) => {
                                            this.setState({
                                                music: event.target.value
                                            });
                                        }}
                                    />
                                </div>
                            </td>
                        </tr>

                        <tr>
                            <td className="col-sm-3"><h4>Shows</h4></td>
                            <td className="col-sm-6">
                                <div className="form-group">
                                    <input
                                        className="form-control"
                                        type="text"
                                        label="shows"
                                        placeholder="Shows"
                                        value={this.state.shows}
                                        onChange={(event) => {
                                            this.setState({
                                                shows: event.target.value
                                            });
                                        }}
                                    />
                                </div>
                            </td>
                        </tr>

                        <tr>
                            <td className="col-sm-3"><h4>Sports</h4></td>
                            <td className="col-sm-6">
                                <div className="form-group">
                                    <input
                                        className="form-control"
                                        type="text"
                                        label="sports"
                                        placeholder="Sports"
                                        value={this.state.sports}
                                        onChange={(event) => {
                                            this.setState({
                                                sports: event.target.value
                                            });
                                        }}
                                    />
                                </div>
                            </td>
                        </tr>

                        <tr>
                            <td className="col-sm-3"><h4></h4></td>
                            <td className="col-sm-6">
                                <div className="form-group">
                                    <button
                                        className="btn btn-primary"
                                        type="button"
                                        onClick={() => this.handleAbout(this.state)}>
                                        Update
                                    </button>
                                </div>
                            </td>
                        </tr>

                    </table>
                </div>
            </div>
        );
    }
}

export default withRouter(About);