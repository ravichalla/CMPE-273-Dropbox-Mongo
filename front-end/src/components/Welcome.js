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
        result: [],
        starImage: "https://cdn3.iconfinder.com/data/icons/web-and-user-interface-9/48/407-512.png"
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
                                        statusMessage: 'FILE UPLOAD SUCCESSFUL'
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

    handleStarFile = (payload) => {
        let payload1 = {id: payload};

        API.starFile(payload1)
            .then((res) => {
                console.log("1---------" + res.status);
                if (res.status === 201) {

                    API.getImages()
                        .then((res) => {
                            res.json().then((data) => {
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
                <div className="row">

                    <div className="col-sm-3">
                        <img src="https://goo.gl/yFaAFJ" height="80" width="80"/>
                        <h2>Dropbox</h2>
                    </div>

                    <div className="col-sm-9">
                        <br/><br/><br/><br/><br/>

                        <h3>Home</h3>
                    </div>
                </div>

                <hr/>

                <div className="col-sm-3">
                    <div className="row">
                        <button className="btn btn-primary" onClick={() => {
                            this.props.history.push("/about");
                        }}>
                            About
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
                        <input
                            className={'fileupload'}
                            type="file"
                            name="myfile"
                            onChange={this.handleFileUpload}
                        />
                    </div>

                    <br/>

                    <div className="row">
                        {this.state.statusMessage}
                    </div>

                </div>

                <div className="col-sm-9">
                    {
                        this.state.result.map((fileObject) => {
                                return (
                                    <table className="table" key={fileObject.id}>
                                        <tbody>
                                        <tr>
                                            {/*<td>{fileObject._id}</td>*/}
                                            <td className="col-sm-2">{fileObject.documentName}</td>
                                            <td className="col-sm-1">{fileObject.documentType}</td>
                                            <td className="col-sm-3">{fileObject.path}</td>
                                            <td className="col-sm-2">{fileObject.sharedWith}</td>

                                            <td className="col-sm-1">
                                                <td>
                                                    <img src = {fileObject.starImage}
                                                         onClick={() => this.handleStarFile(fileObject._id)} height="20" width="20">
                                                    </img>
                                                </td>
                                                <td>
                                                    <img src = "https://image.flaticon.com/icons/png/128/61/61391.png"
                                                         onClick={() => this.handleDeleteFile(fileObject._id)} height="20" width="20">
                                                    </img>
                                                </td>
                                                <td>
                                                    <img src = "https://www.shareicon.net/data/128x128/2015/09/19/643381_internet_512x512.png"
                                                         onClick={() => this.handleFileShare(fileObject)} height="20" width="20"></img>
                                                </td>
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