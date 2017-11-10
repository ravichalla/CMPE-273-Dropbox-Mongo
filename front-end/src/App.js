import React, {Component} from 'react';
import './App.css';

// import HomePage from "./components/HomePage";
// import NewHomePage from "./components/NewHomePage";

import {BrowserRouter} from 'react-router-dom';
import Login from "./components/Login";


// import HomePage from "./components/HomePage";

    class App extends Component {
        render() {
            return (
                <div>
                    {/*<HomePage/>*/}
                    {/*<NewHomePage/>*/}
                    <BrowserRouter>
                        <Login/>
                    </BrowserRouter>
                </div>
            );
        }
    }

    export default App;
