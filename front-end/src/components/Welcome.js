import React, {Component} from 'react';
import {Route, Link, withRouter} from 'react-router-dom';
import * as API from '../api/API';
import About from './About';

class Welcome extends Component {

    state = {
        username: this.props.username,
        firstname: '',
        lastname: '',
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

    // handleFileUpload = (event) => {
    //     console.log("1");
    //     const payload = new FormData();
    //     payload.append('mypic', event.target.files[0]);
    //     console.log("2");
    //
    //     API.uploadFile(payload)
    //         .then((status) => {
    //             if (status === 201) {
    //                 console.log("Post upload - before getImages");
    //                 API.getImages()
    //                     .then((res) => {
    //                         res.json().then((data) => {
    //                             console.log(data);
    //                             this.setState({
    //                                 result: data.result,
    //                                 statusMessage: 'File successfully UPLOADED into the local file system'
    //                             })
    //                             }
    //                         )
    //                     });
    //             }
    //         });
    // };

    // handleDeleteFile = (payload) => {
    //     let payload1 = {id : payload};
    //     console.log("In handleDeleteFile");
    //     API.deleteFile(payload1)
    //         .then((status) => {
    //         if(status === 201) {
    //             console.log("In handleDeleteFolder");
    //             API.getImages()
    //                 .then((res) => {
    //                     res.json().then((data) => {
    //                             console.log(data);
    //                             this.setState({
    //                                 result: data.result,
    //                                 statusMessage: 'File successfully DELETED from the local file system'
    //                             })
    //                         }
    //                     )
    //                 });
    //         }
    //         });
    // }

    componentWillMount() {
        console.log("Welcome.js - In componentWillMount");
        this.setState({
            username: this.props.username
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
            <div className="row justify-content-md-center">
                <div>
                    <h2>
                        <small>welcome to</small>
                        DROPBOX
                    </h2>

                    <h4>First name : {this.state.firstname}</h4>
                    <h4>Last name : {this.state.lastname}</h4>
                    <h5>Username : {this.state.username}</h5>

                    <div className="form-group">
                        <button className="btn btn-success" onClick={() => {
                            this.props.history.push("/about");
                        }}>
                            About
                        </button>
                    </div>

                    <div className="form-group">
                        <button
                            className="btn btn-primary"
                            type="button"
                            onClick={this.handleLogout}>
                            Logout
                        </button>
                    </div>
                </div>

                {/*<input*/}
                {/*className={'fileupload'}*/}
                {/*type="file"*/}
                {/*name="mypic"*/}
                {/*onChange={this.handleFileUpload}*/}
                {/*/>*/}

                <div>
                    {this.state.statusMessage}
                </div>

                <div>
                    {
                        this.state.result.map((fileObject) => {
                                return (
                                    <table className={'table table-striped'} key={fileObject.id}>
                                        <tbody>
                                        <tr>
                                            <td>{fileObject.id}</td>
                                            <td>{fileObject.username}</td>
                                            <td>{fileObject.documentName}</td>
                                            <td>{fileObject.documentType}</td>
                                            <td>{fileObject.path}</td>
                                            <td>{fileObject.star}</td>
                                            {/*<td><button onClick={() => this.handleDeleteFile(fileObject.id)}>Delete</button></td>*/}
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