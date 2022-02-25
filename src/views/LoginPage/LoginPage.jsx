import React from "react";
import {login} from "../../auth"

export default class LoginPage extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            email: "",
            password: "",
            error: null,
        };

        this.handleInputChange = this.handleInputChange.bind(this);
        this.login = this.login.bind(this);
    }

    handleInputChange(e) {
        const {id, value} = e.target;

        this.setState(() => ({[id]: value}));
    }

    login() {
        const user = {
            email: this.state.email,
            password: this.state.password
        }

        fetch('/api/login', {
            method: "POST",
            mode: "cors",
            cache: "no-cache",
            credentials: "same-origin",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(user),
        })
            .then(res => res.json())
            .then(data => {
                const {error, access_token, refresh_token} = data;

                if (error) {
                    this.setState(state => ({error}));

                    return;
                }

                if (access_token) {
                    login({access_token, refresh_token})

                    window.location = '/home';
                }
            });
    }

    render() {
        return (
            <div className="w-full h-screen">
                <h1 className="mt-20 text-3xl font-bold">Plagiarism Detector</h1>
                <div className="rounded-md absolute bg-white lg:w-1/5 lg:-translate-x-1/2 lg:left-1/2 -translate-y-1/2 top-1/2 w-4/5 left-10">
                    <div className="flex justify-center -mt-10">
                        <img className="border-2 bg-white w-20 h-20 rounded-full" src="/logo.png" alt="Logo" width="50" height="50"/>
                    </div>
                    <div className="px-12 py-10">
                        <div className="w-full mb-2">
                            <div className="flex items-center">
                                <i className="ml-3 fill-current text-gray-400 text-xs z-10 far fa-user"/>
                                <input type="text" id="email" placeholder="Email [demo@demo.com]"
                                       className="-mx-6 px-8  w-full border rounded px-3 py-1 text-gray-700"
                                       onChange={e => this.handleInputChange(e)} value={this.state.email}/>
                            </div>
                        </div>
                        <div className="w-full mb-2">
                            <div className="flex items-center">
                                <i className="ml-3 fill-current text-gray-400 text-xs z-10 fas fa-lock"/>
                                <input type="password" id="password" placeholder="Password [demo]"
                                       className="-mx-6 px-8 w-full border rounded px-3 py-1 text-gray-700"
                                       onChange={e => this.handleInputChange(e)} value={this.state.password}/>
                            </div>
                        </div>
                        <div className="mt-8 flex justify-center">
                            <div>
                                <button type="button"
                                        className="bg-yellow-400 text-xs text-gray-700 rounded px-4 py-2"
                                        onClick={this.login}>
                                    SIGN IN
                                </button>
                            </div>
                        </div>
                        {
                            this.state.error !== null &&
                            <div className="mt-8 text-center text-red-700">
                                {this.state.error}
                            </div>
                        }
                    </div>
                </div>
            </div>
        );
    }
}
