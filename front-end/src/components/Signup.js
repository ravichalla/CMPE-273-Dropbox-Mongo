import React, {Component} from 'react';
import {Link, Route, withRouter} from 'react-router-dom';
import * as API from '../api/API';

import '../login.css'

class Signup extends Component {

    state = {
        username: '',
        password: '',
        firstname: '',
        lastname: '',
        message: ''
    };

    componentWillMount() {
        this.setState({
            username: '',
            password: '',
            firstname: '',
            lastname: '',
            message: ''
        });
    }

    handleSignup = (userdata) => {
        API.doSignup(userdata)
            .then((res) => {
                res.json().then((data) => {
                    console.log("SIGNUP status : " + data.status);
                    if (data.status === 200) {
                        this.setState({
                            message: "SIGN UP SUCCESSFUL"
                        });
                        console.log("Successful sign up");
                    } else if (data.status === 401) {
                        this.setState({
                            message: "USER ALREADY EXISTS"
                        });
                    } else if (data.status === 403) {
                        this.setState({
                            message: "FIELD SHOULD NOT BE EMPTY"
                        });
                    }
                    else if (data.status === 500) {
                        this.setState({
                            message: "SIGN UP FAILED"
                        });
                    }
                })
            });
    };

    render() {
        return (
            <div>
                <div className="col-md-offset-5 col-md-4">

                    <form className="form-login">

                        <img src="https://goo.gl/yFaAFJ" alt="Icon"/>

                        <h4>SIGN UP</h4>

                        <input
                            className="form-control"
                            type="email"
                            label="Username"
                            placeholder="Enter Username"
                            value={this.state.username}
                            onChange={(event) => {
                                this.setState({
                                    username: event.target.value
                                });
                            }
                            }
                        />

                        <br/>

                        <input
                            className="form-control"
                            type="password"
                            label="password"
                            placeholder="Enter Password"
                            value={this.state.password}
                            onChange={(event) => {
                                this.setState({
                                    password: event.target.value
                                });
                            }}
                        />

                        <br/>

                        <input
                            className="form-control"
                            type="text"
                            label="Firstname"
                            placeholder="Enter Firstname"
                            value={this.state.firstname}
                            onChange={(event) => {
                                this.setState({
                                    firstname: event.target.value
                                });
                            }}
                        />

                        <br/>

                        <input
                            className="form-control"
                            type="text"
                            label="Lastname"
                            placeholder="Enter Lastname"
                            value={this.state.lastname}
                            onChange={(event) => {
                                this.setState({
                                    lastname: event.target.value
                                });
                            }}
                        />

                        <br/>

                        <div className="wrapper">

                            <button
                                className="btn btn-primary btn-group-sm"
                                type="button"
                                onClick={() => this.handleSignup(this.state)}>
                                Signup
                            </button>

                            <br/>
                            <br/>

                            <Link to="/">Login</Link>

                            <br/>
                            <br/>

                            <div>
                                {this.state.message}
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        );
    }
}

export default Signup;