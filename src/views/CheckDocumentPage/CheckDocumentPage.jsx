import React from "react";
import {authFetch} from "../../auth";

export default class CheckDocumentPage extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            text: '',
            file: null,
            errorText: null,
            errorFile: null,
            matching_probability: null,
        };

        this.handleTextChange = this.handleTextChange.bind(this);
        this.handleFileChange = this.handleFileChange.bind(this);
        this.checkPastedDocument = this.checkPastedDocument.bind(this);
        this.checkFileDocument = this.checkFileDocument.bind(this);
    }

    handleTextChange(e) {
        const {value} = e.target;

        this.setState(() => ({text: value, errorText: null}));
    }

    handleFileChange(e) {
        const file = e.target.files[0];

        this.setState(() => ({file, errorFile: null}));
    }

    checkPastedDocument() {
        this.setState(() => ({errorText: null}));

        const text = this.state.text;
        if (text.trim() === '') {
            this.setState(() => ({errorText: 'Please add some text.'}));

            return;
        }

        const formData = new FormData();
        formData.append('text', text);

        this._checkDocument(formData, 'errorText')
    }

    checkFileDocument() {
        this.setState(() => ({errorFile: null}));

        const file = this.state.file;
        if (file === null) {
            this.setState(() => ({errorFile: 'Please choose a file.'}));

            return;
        }

        const formData = new FormData();
        formData.append('file', file, file.name);

        this._checkDocument(formData, 'errorFile')
    }

    _checkDocument(formData, stateErrorKey) {
        authFetch('api/documents/check', {
            method: "POST",
            mode: "cors",
            cache: "no-cache",
            credentials: "same-origin",
            body: formData,
        }).then(res => res.json())
            .then(data => {
                const {error, matching_probability} = data;

                if (error) {
                    this.setState(() => ({[stateErrorKey]: error}));

                    return;
                }

                this.setState(() => ({matching_probability}));
                window.toggleModal('resultModal');
            });
    }

    render() {
        return (
            <div className="w-full max-w-3xl px-5">
                <div className="text-left font-bold text-2xl mt-8">Check Document</div>
                <div className="mx-auto mt-12">
                    <div className="mb-4 border-b border-gray-200 dark:border-gray-700">
                        <ul className="flex flex-wrap -mb-px" id="myTab" data-tabs-toggle="#myTabContent"
                            role="tablist">
                            <li className="mr-2" role="presentation">
                                <button
                                    className="inline-block py-4 px-4 text-sm font-medium text-center text-gray-500 rounded-t-lg border-b-2 border-transparent hover:text-gray-600 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300 active"
                                    id="paste-tab" data-tabs-target="#paste" type="button" role="tab"
                                    aria-controls="paste" aria-selected="true">Paste Document
                                </button>
                            </li>
                            <li className="mr-2" role="presentation">
                                <button
                                    className="inline-block py-4 px-4 text-sm font-medium text-center text-gray-500 rounded-t-lg border-b-2 border-transparent hover:text-gray-600 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300"
                                    id="upload-tab" data-tabs-target="#upload" type="button" role="tab"
                                    aria-controls="upload" aria-selected="false">Upload Document
                                </button>
                            </li>
                        </ul>
                    </div>
                    <div id="myTabContent">
                        <div className="p-4 bg-gray-50 rounded-lg dark:bg-gray-800" id="paste" role="tabpanel"
                             aria-labelledby="paste-tab">
                            <textarea id="message" rows="10" value={this.state.text}
                                      onChange={e => this.handleTextChange(e)}
                                      className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                      placeholder="Paste document text here..."/>
                            {
                                this.state.errorText !== null &&
                                <div className="mt-4 text-left text-red-700">
                                    {this.state.errorText}
                                </div>
                            }
                            <div className="mt-4 text-left">
                                <button className="px-4 py-1 text-sm text-white bg-blue-400 rounded"
                                        onClick={this.checkPastedDocument}>Check Document
                                </button>
                            </div>
                        </div>
                        <div className="hidden p-4 bg-gray-50 rounded-lg dark:bg-gray-800" id="upload" role="tabpanel"
                             aria-labelledby="upload-tab">
                            <input
                                className="block w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 cursor-pointer dark:text-gray-400 focus:outline-none focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400"
                                id="document_file" type="file" accept="text/*" onChange={e => this.handleFileChange(e)}/>
                            {
                                this.state.errorFile !== null &&
                                <div className="mt-4 text-left text-red-700">
                                    {this.state.errorFile}
                                </div>
                            }
                            <div className="mt-4 text-left">
                                <button className="px-4 py-1 text-sm text-white bg-blue-400 rounded"
                                        onClick={this.checkFileDocument}>Check Document
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                <div id="resultModal" aria-hidden="true"
                     className="hidden overflow-y-auto overflow-x-hidden fixed right-0 left-0 top-4 z-50 justify-center items-center h-modal md:h-full md:inset-0">
                    <div className="relative px-4 w-full max-w-2xl h-full md:h-auto">
                        <div className="relative bg-white rounded-lg shadow dark:bg-gray-700">
                            <div className="p-6 space-y-6">
                                Plagiarism Probability is <span className="font-bold">{this.state.matching_probability}%</span>.
                            </div>
                            <div
                                className="flex items-center justify-center p-6 space-x-2 rounded-b border-t border-gray-200 dark:border-gray-600">
                                <button type="button" onClick={() => window.location='/home'}
                                        className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
                                    OK
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}
