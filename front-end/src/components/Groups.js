import React, {Component} from 'react';
import {Route, withRouter} from 'react-router-dom';
import * as API from "../api/API";

import "../welcome.css";
import "../login.css";

class Groups extends Component {

    state = {
        groupname: '',
        owner: this.props.username,
        groups: [],
        usernames: '',
        statusMessage: ''
    };

    componentWillMount() {
        API.getGroups()
            .then((res) => {
                res.json().then((data) => {
                    console.log("In Groups - data : " + data);
                    console.log(data);
                    this.setState({
                        groups: data,
                        statusMessage: 'GROUPS FETCHED SUCCESSFULLY'
                    })
                })
            });
    };

    createGroup = () => {
        console.log("In create group");

        var groupName = prompt("Enter the group name");

        console.log("Owner is " + this.props.username);

        let payload = {
            "groupname": groupName
        };

        API.createGroup(payload)
            .then((res) => {
                res.json().then((data) => {
                    console.log(data.status);
                    if (data.status === 201) {
                        API.getGroups()
                            .then((res) => {
                                res.json().then((data) => {
                                    console.log("In Groups - data : " + data);
                                    console.log(data);
                                    this.setState({
                                        groups: data,
                                        statusMessage: 'GROUP CREATED SUCCESSFULLY'
                                    });
                                });
                            });
                    }
                });
            });

    };

    addUser = (fileObject) => {

        let newUsername = prompt("Enter the username you want to add to the group " + fileObject.groupname);

        let finalUsernames = fileObject.usernames.concat(newUsername).concat(",");

        let payload = {
            "groupname": fileObject.groupname,
            "usernames": finalUsernames
        };

        API.updateUsernames(payload)
            .then((res) => {
                res.json().then((data) => {
                    if (data.status === 201) {
                        API.getGroups()
                            .then((res) => {
                                res.json().then((data) => {
                                    console.log("In Groups - data : " + data);
                                    console.log(data);
                                    this.setState({
                                        groups: data,
                                        statusMessage: 'USERNAME ADDED TO THE GROUP SUCCESSFULLY'
                                    });
                                });
                            });
                    }
                });
            });
    };

    handleDeleteGroup = (payload) => {

        let payload1 = {id: payload};
        console.log("In handleDeleteFile - payload1 : " + payload1);
        console.log("In handleDeleteFile - payload1 : " + payload1.id);

        API.deleteGroup(payload1)
            .then((res) => {
                console.log("1:" + res.status);

                if (res.status === 201) {
                    console.log("In handleDeleteFolder");
                    API.getGroups()
                        .then((res) => {
                            res.json().then((data) => {
                                console.log("In Groups - data : " + data);
                                console.log(data);
                                this.setState({
                                    groups: data,
                                    statusMessage: 'GROUP DELETED SUCCESSFULLY'
                                })
                            })
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

                        <h3>Groups</h3>
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
                            className="btn btn-success"
                            type="button"
                            onClick={this.createGroup}>
                            Create Group
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
                        {this.state.statusMessage}
                    </div>
                </div>

                <div className="col-sm-9">
                    {
                        this.state.groups.map((fileObject) => {
                                return (
                                    <table className="table" key={fileObject.id}>
                                        <tbody>
                                        <tr>
                                            {/*<td>{fileObject._id}</td>*/}

                                            <td className="col-sm-1">
                                                <td>{fileObject.groupname} </td>
                                            </td>

                                            <td className="col-sm-1">{fileObject.owner}</td>

                                            <td className="col-sm-5">{fileObject.usernames}</td>

                                            <td className="col-sm-1">
                                                <img src="https://www.iapps4you.com/images/apps/598/598452/logo.jpg"
                                                     onClick={() => this.addUser(fileObject)} height="30"
                                                     width="30">
                                                </img>
                                                <img src="https://image.flaticon.com/icons/png/128/61/61391.png"
                                                     onClick={() => this.handleDeleteGroup(fileObject._id)} height="30"
                                                     width="30">
                                                </img>
                                            </td>
                                        </tr>
                                        </tbody>
                                    </table>
                                )
                            }
                        )
                    }
                </div>
            </div>
        );
    }
}

export default withRouter(Groups);