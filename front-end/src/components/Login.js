import React, {Component} from 'react';
import {Route, withRouter} from 'react-router-dom';
import * as API from "../api/API";
import Welcome from "./Welcome";
import Signup from './Signup';
import About from './About';

class Login extends Component {

    state = {
        isLoggedIn: false,
        message: '',
        username: '',
        password: ''
    };

    componentDidMount(){
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
                if (res.status === 201) {
                    this.setState({
                        isLoggedIn: true,
                        message: "Login.js - handleSubmit - Successfully Logged In !!",
                        username: userdata.username
                    });
                    console.log("Login.js - handleSubmit - Successful login");
                    console.log("Login.js - handleSubmit - Username: " + this.state.username);
                    this.props.history.push("/welcome");
                } else if (res.status === 401) {
                    this.setState({
                        isLoggedIn: false,
                        message: "Wrong username or password. Try again..!!"
                    });
                }
            });
    };

    render() {
        return (
            <div className="row justify-content-md-center">
                <div className="col-md-3">
                    <Route exact path="/" render={() => (
                        <form>
                            <div className="form-group">
                                <h1>Login</h1>
                            </div>
                            <div className="form-group">
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
                            </div>

                            <div className="form-group">
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
                            </div>
                            <div className="form-group">
                                <button
                                    className="btn btn-primary"
                                    type="button"
                                    onClick={() => this.handleSubmit(this.state)}>
                                    Login
                                </button>
                                <br/>
                                <br/>
                                <button className="btn btn-success" onClick={() => {
                                    this.props.history.push("/signup");
                                }}>
                                    Signup
                                </button>
                            </div>
                        </form>
                    )}/>

                    <Route exact path="/signup" render={() => (
                        <div>
                            <Signup/>
                        </div>
                    )}/>

                    <Route exact path="/welcome" render={() => (
                        <Welcome username={this.state.username}/>
                    )}/>

                    <Route path="/about" render={() => (
                        <About username={this.state.username}/>
                    )}/>


                </div>
            </div>
        );
    }
}

export default withRouter(Login);