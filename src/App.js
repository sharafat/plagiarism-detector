import React from 'react';
import {BrowserRouter, Route, Routes} from 'react-router-dom';

import './App.css';

import LoginPage from "./views/LoginPage/LoginPage.jsx";
import HomePage from "./views/HomePage/HomePage.jsx";
import CheckDocumentPage from "./views/CheckDocumentPage/CheckDocumentPage.jsx";

function App() {

    return (
        <div className="App">
            <header className="App-header">
                <BrowserRouter>
                    <Routes>
                        <Route path="/" element={<LoginPage/>}/>
                        <Route path="/home" element={<HomePage/>}/>
                        <Route path="/check" element={<CheckDocumentPage/>}/>
                    </Routes>
                </BrowserRouter>
            </header>
        </div>
    );
}

export default App;
