import React from "react";
import {authFetch, logout} from "../../auth";
import nl2br from "react-nl2br";

export default class HomePage extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            documents: [],
            documentIndexToShow: null,
        };

        this.showDocument = this.showDocument.bind(this);
        this.logout = this.logout.bind(this);
    }

    componentDidMount() {
        authFetch('api/documents', {
            method: "GET",
            mode: "cors",
            cache: "no-cache",
            credentials: "same-origin",
            headers: {
                "Content-Type": "application/json",
            }
        }).then(res => res.json())
            .then(data => {
                if (data.length === 0) {
                    return;
                }

                this.setState(() => ({documents: data}));
            });
    }

    showDocument(index) {
        this.setState(() => ({documentIndexToShow: index}));
        window.toggleModal('documentModal');
    }

    logout() {
        logout();
        window.location = '/';
    }

    render() {
        return (
            <div className="w-full max-w-3xl px-5">
                <div className="flex items-center mt-8">
                    <div className="text-left font-bold text-2xl">My Documents</div>
                    <div className="grow"/>
                    <button className="px-4 py-1 text-sm text-white bg-blue-400 rounded"
                            onClick={() => window.location='/check'}>+ Check Document</button>
                    <button className="ml-4 px-4 py-1 text-sm text-white bg-red-400 rounded"
                            onClick={this.logout}>Logout</button>
                </div>
                <div className="mx-auto mt-12">
                    <div className="border-b border-gray-200 shadow overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-2 text-xs text-gray-500">ID</th>
                                <th className="px-6 py-2 text-xs text-gray-500">Title</th>
                                <th className="px-6 py-2 text-xs text-gray-500">Document</th>
                                <th className="px-6 py-2 text-xs text-gray-500">Match</th>
                                <th className="px-6 py-2 text-xs text-gray-500">Created</th>
                            </tr>
                            </thead>
                            <tbody className="bg-white">
                            {
                                this.state.documents.length > 0 &&
                                this.state.documents.map((row, index) => {
                                    return (
                                        <tr className="whitespace-nowrap" key={index}>
                                            <td className="px-6 py-4 text-sm text-gray-500">{row.id}</td>
                                            <td className="px-6 py-4 text-left">
                                                <div className="text-sm text-gray-900">{row.title}</div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <button onClick={() => this.showDocument(index)}
                                                    className="px-4 py-1 text-sm text-white bg-blue-400 rounded">View
                                                </button>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <div className="text-sm text-gray-900">{row.matching_probability}%</div>
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-500">{row.created_at}</td>
                                        </tr>
                                    )
                                })
                            }
                            </tbody>
                        </table>
                    </div>
                </div>

                <div id="documentModal" aria-hidden="true"
                     className="hidden overflow-y-scroll overflow-x-hidden fixed right-0 left-0 top-4 z-50 justify-center items-center h-modal">
                    <div className="relative px-4 w-full max-w-3xl h-auto">
                        <div className="relative bg-white rounded-lg shadow dark:bg-gray-700">
                            <div
                                className="flex justify-between items-start p-5 rounded-t border-b dark:border-gray-600">
                                <h3 className="text-xl font-semibold text-gray-900 lg:text-2xl dark:text-white">
                                    {this.state.documentIndexToShow !== null ? this.state.documents[this.state.documentIndexToShow].title : null}
                                </h3>
                                <button type="button"
                                        className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-600 dark:hover:text-white"
                                        data-modal-toggle="documentModal">
                                    Close
                                </button>
                            </div>
                            <div className="p-6 space-y-6 overflow-y-scroll text-left" style={{maxHeight: '80vh'}}>
                                {this.state.documentIndexToShow !== null ? nl2br(this.state.documents[this.state.documentIndexToShow].document) : null}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}
