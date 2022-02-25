import React from "react";
import {authFetch} from "../../auth";

export default class HomePage extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            documents: [],
        };
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

    render() {
        return (
            <div className="w-full max-w-3xl px-5">
                <div className="flex items-center mt-8">
                    <div className="text-left font-bold text-2xl">My Documents</div>
                    <div className="grow"/>
                    <button className="px-4 py-1 text-sm text-white bg-blue-400 rounded">+ Add Document</button>
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
                                this.state.documents.map((row, index) => {
                                    return (
                                        <tr className="whitespace-nowrap" key={index}>
                                            <td className="px-6 py-4 text-sm text-gray-500">{row.id}</td>
                                            <td className="px-6 py-4 text-left">
                                                <div className="text-sm text-gray-900">{row.title}</div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <button
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
            </div>
        );
    }
}
