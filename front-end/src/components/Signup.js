import React, {Component} from 'react';
import {Link, Route, withRouter} from 'react-router-dom';
import * as API from '../api/API';

class Signup extends Component {

    state = {
        username: '',
        password: '',
        firstname: '',
        lastname: '',
        message: ''
    };

    componentWillMount(){
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
                if (res.status === 201) {
                    this.setState({
                        message: "SIGN UP SUCCESSFUL"
                    });
                    console.log("Successful sign up");
                } else if (res.status === 401) {
                    this.setState({
                        message: "SIGN UP FAILED"
                    });
                } else if (res.status === 500) {
                    this.setState({
                        message: "USER ALREADY EXISTS"
                    });
                }
            });
    };

    render() {
        return (
            <div className="row justify-content-md-center">
                <div>
                    <form>
                        <div className="form-group">
                            <h1>Sign Up</h1>
                        </div>

                        <div className="form-group">
                            <input
                                className="form-control"
                                type="text"
                                label="Username"
                                placeholder="Enter Username"
                                value={this.state.username}
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
                                value={this.state.password}
                                onChange={(event) => {
                                    this.setState({
                                        password: event.target.value
                                    });
                                }}
                            />
                        </div>

                        <div className="form-group">
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
                        </div>

                        <div className="form-group">
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
                        </div>

                        <div className="form-group">
                            <button
                                className="btn btn-primary"
                                type="button"
                                onClick={() => this.handleSignup(this.state)}>
                                Signup
                            </button>
                        </div>

                        <div>
                            {this.state.message}
                        </div>
                        <br/>
                        <Link to="/">Login</Link>
                    </form>
                </div>
            </div>
        );
    }
}

export default Signup;