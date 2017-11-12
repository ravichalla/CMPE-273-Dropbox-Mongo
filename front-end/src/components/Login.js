import React, {Component} from 'react';
import {Route, withRouter} from 'react-router-dom';
import * as API from "../api/API";
import Welcome from "./Welcome";
import Signup from './Signup';
import About from './About';
import Groups from './Groups';

import '../login.css'

class Login extends Component {

    state = {
        isLoggedIn: false,
        message: '',
        username: '',
        password: ''
    };

    componentDidMount() {
        this.setState({
            isLoggedIn: false,
            message: '',
            username: '',
            password: ''
        });
    }

    handleSubmit = (userdata) => {
        API.doLogin(userdata)
            .then((res) => {
                res.json().then((data) => {
                    console.log(data);
                    if (data.status === 201) {
                        this.setState({
                            isLoggedIn: true,
                            message: "Login.js - handleSubmit - Successfully Logged In !!",
                            username: data.username,
                            firstname: data.firstname,
                            lastname: data.lastname
                        });
                        console.log("Login.js - handleSubmit - Successful login");
                        console.log("Login.js - handleSubmit - Username: " + this.state.username);
                        this.props.history.push("/welcome");
                    }
                    else if (data.status === 401) {
                        this.setState({
                            isLoggedIn: false,
                            message: "Wrong username or password. Try again..!!"
                        });
                    }
                });
            });
    };

    render() {
        return (
            <div className="container">
                <div className="col-md-offset-5 col-md-4">

                    <Route exact path="/" render={() => (
                        <form className="form-login">

                            <img src="https://goo.gl/yFaAFJ" alt="Icon"/>

                            <h4>SIGN IN</h4>

                            <input
                                className="form-control"
                                type="text"
                                label="username"
                                placeholder="Enter username"
                                onChange={(event) => {
                                    this.setState({
                                        username: event.target.value
                                    });
                                }}
                            />
                            <br/>
                            <input
                                className="form-control"
                                type="password"
                                label="password"
                                placeholder="Enter Password"
                                onChange={(event) => {
                                    this.setState({
                                        password: event.target.value
                                    });
                                }}
                            />
                            <br/>
                            <div className="wrapper">
                                <button
                                    className="btn btn-primary btn-group-sm"
                                    type="button"
                                    onClick={() => this.handleSubmit(this.state)}>
                                    Login
                                </button>
                                <br/>
                                <br/>
                                <button className="btn btn-success btn-group-sm" onClick={() => {
                                    this.props.history.push("/signup");
                                }}>
                                    Signup
                                </button>
                            </div>
                        </form>
                    )}/>
                </div>

                <Route exact path="/signup" render={() => (
                    <div>
                        <Signup/>
                    </div>
                )}/>

                <Route exact path="/welcome" render={() => (
                    <Welcome username={this.state.username} firstname={this.state.firstname} lastname={this.state.lastname}/>
                )}/>

                <Route path="/about" render={() => (
                    <About username={this.state.username}/>
                )}/>

                <Route path="/groups" render={() => (
                    <Groups username={this.state.username}/>
                )}/>
            </div>
        );
    }
}

export default withRouter(Login);