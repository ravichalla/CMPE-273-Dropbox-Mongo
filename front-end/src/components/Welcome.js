import React, {Component} from 'react';
import {Route, Link, withRouter} from 'react-router-dom';
import * as API from '../api/API';
import About from './About';

import "../welcome.css";
import "../login.css";

class Welcome extends Component {

    state = {
        username: this.props.username,
        firstname: this.props.firstname,
        lastname: this.props.lastname,
        statusMessage: '',
        result: []
    };

    // handleAbout = (userdata) => {
    //     API.updateAbout(userdata)
    //         .then((status) => {
    //             if (status === 201) {
    //                 this.setState({
    //                     firstname: userdata.firstname,
    //                     lastname: userdata.lastname
    //                 });
    //                 console.log("Successful login");
    //             } else if (status === 401) {
    //                 this.setState({
    //                     message: "Welcome.js - Fetch unsuccessful !!!"
    //                 });
    //             }
    //         });
    // };

    handleFileUpload = (event) => {
        console.log("In handleFileUpload");
        const payload = new FormData();
        payload.append('myfile', event.target.files[0]);
        console.log("The event.target.files[0] : " + event.target.files[0]);
        console.log("The payload is : " + payload);

        API.uploadFile(payload)
            .then((res) => {
                if (res.status === 201) {
                    console.log("In Welcome.js - uploadFile completed");
                    API.getImages()
                        .then((res) => {
                            res.json().then((data) => {
                                    console.log(data);
                                    this.setState({
                                        result: data,
                                        statusMessage: 'File successfully UPLOADED into the local file system'
                                    })
                                }
                            )
                        });
                }
            });
    };

    handleFileShare = (fileObject) => {
        console.log("In handleFileShare");

        var sharedUser = prompt("Enter the valid username to share");

        let payload = {
            "username": fileObject.username,
            "documentName": fileObject.documentName,
            "mimeType": fileObject.mimeType,
            "path": fileObject.path,
            "sharedWith": sharedUser
        };

        console.log("0: " + payload);
        console.log("1: " + payload.username);
        console.log("2: " + payload.documentName);
        console.log("3: " + payload.mimeType);
        console.log("4: " + payload.path);
        console.log("5: " + payload.sharedWith);

        API.shareFile(payload)
            .then((res) => {
                    console.log(res.status);
                    if (res.status === 201) {
                        this.setState({
                            statusMessage: "FILE SHARE SUCCESSFUL"
                        });
                    }
                    else if (res.status === 404) {
                        this.setState({
                            statusMessage: "SUCH USER DOESN'T EXIST"
                        });
                    }
                    else {
                        console.log("INTERNAL ERROR");
                    }
                }
            )
    };

    componentWillMount() {
        console.log("Welcome.js - In componentWillMount");
        this.setState({
            username: this.props.username
        });
    };

    handleDeleteFile = (payload) => {

        let payload1 = {id: payload};
        console.log("In handleDeleteFile - payload1 : " + payload1);
        console.log("In handleDeleteFile - payload1 : " + payload1.id);

        API.deleteFile(payload1)
            .then((res) => {
                console.log("1:" + res.status);

                if (res.status === 201) {
                    console.log("In handleDeleteFolder");
                    API.getImages()
                        .then((res) => {
                            res.json().then((data) => {
                                console.log("In Welcome - data : " + data);
                                console.log(data);
                                this.setState({
                                    result: data,
                                    statusMessage: ''
                                })
                            })
                        });
                }
            });
    };


    componentDidMount() {
        API.getImages()
            .then((res) => {
                res.json().then((data) => {
                    console.log("In Welcome - data : " + data);
                    console.log(data);
                    this.setState({
                        result: data,
                        statusMessage: ''
                    })
                })
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
                <img src = "https://goo.gl/yFaAFJ" height = "80" width = "80"/>
                <h2>Dropbox</h2>
                <p class="lead">Welcome</p>

                <div className = "col-sm-5">
                    <div className="row">
                        <button className="btn btn-success" onClick={() => {
                            this.props.history.push("/about");
                        }}>
                            About
                        </button>
                    </div>

                    <br/>

                    <div className="row">
                        <button
                            className="btn btn-primary"
                            type="button"
                            onClick={this.handleLogout}>
                            Logout
                        </button>
                    </div>

                    <br/>

                    <div className="row">
                    <input
                        className={'fileupload'}
                        type="file"
                        name="myfile"
                        onChange={this.handleFileUpload}
                    />
                    </div>

                    <div>
                        {this.state.statusMessage}
                    </div>

                </div>

                <div className = "col-sm-7">
                    {
                        this.state.result.map((fileObject) => {
                                return (
                                    <table className={'table table-striped'} key={fileObject.id}>
                                        <tbody>
                                        <tr>
                                            {/*<td>{fileObject._id}</td>*/}
                                            <td>{fileObject.username}</td>
                                            <td>{fileObject.documentName}</td>
                                            <td>{fileObject.documentType}</td>
                                            <td>{fileObject.path}</td>
                                            <td>{fileObject.star}</td>
                                            <td>{fileObject.sharedWith}</td>
                                            <td>
                                                <img src="../images/delete_icon.png"/>

                                            </td>
                                            <td>
                                                <button onClick={() => this.handleFileShare(fileObject)}>Share</button>
                                            </td>
                                        </tr>
                                        </tbody>
                                    </table>
                                )
                            }
                        )
                    }
                </div>

                <Route path="/about" render={() => (
                    <About username={this.state.username}/>
                )}/>

            </div>
        )
    }
}

export default withRouter(Welcome);