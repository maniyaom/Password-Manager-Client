import React, { useState } from 'react'

export default function Password({ passwordDialogTitle, passwordDialogService, passwordDialogUsername, passwordDialogPassword, passwordDialogButtonText, onPasswordDialogClose }) {

    const [service, setService] = useState(passwordDialogService);
    const [username, setUsername] = useState(passwordDialogUsername);
    const [password, setPassword] = useState(passwordDialogPassword);
    const [errors, setErrors] = useState({});

    const validateForm = () => {
        const error = {}
        if (!service)
            error.service = 'Service is required';
        if (!username)
            error.username = 'Username is required';
        if (!password)
            error.password = 'Password is required';
        setErrors(error);
        return Object.keys(error).length === 0;
    }

    const handleSubmit = (event) => {
        event.preventDefault();
        setErrors({});
        if (validateForm()){
            onPasswordDialogClose({
                service: service,
                username: username,
                password: password
            });
        }
        else{
            console.log("Invalid");
        }
    }

    return (
        <>
            <div id="crud-modal" tabIndex="-1" aria-hidden="true" className="overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 flex justify-center items-center w-full md:inset-0 h-[calc(100%-1rem)] max-h-full">
                <div className="relative p-4 w-full max-w-md max-h-full">
                    <div className="relative bg-white rounded-lg shadow dark:bg-gray-700">
                        <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600">
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                                {passwordDialogTitle}
                            </h3>
                            <button type="button" 
                            onClick={() => onPasswordDialogClose(false)}
                            className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white" data-modal-toggle="crud-modal">
                                <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6" />
                                </svg>
                                <span className="sr-only">Close modal</span>
                            </button>
                        </div>
                        <form className="p-4 md:p-5">
                            <div className="grid gap-4 mb-4 grid-cols-2">
                                <div className="col-span-2">
                                    <label htmlFor="service" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Service Name</label>
                                    <input type="text" name="service" id="service" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500" placeholder="Enter Service Name" required=""
                                        value={service}
                                        onChange={(e) => setService(e.target.value)} />
                                    <p className="mt-2 text-sm text-red-600 dark:text-slate-300">{errors.service}</p>
                                </div>
                                <div className="col-span-2">
                                    <label htmlFor="username" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Username</label>
                                    <input type="text" name="username" id="username" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500" placeholder="Enter Your Username" required=""
                                        value={username}
                                        onChange={(e) => setUsername(e.target.value)} />
                                    <p className="mt-2 text-sm text-red-600 dark:text-slate-300">{errors.username}</p>
                                </div>
                                <div className="col-span-2">
                                    <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Password</label>
                                    <input type="password" name="password" id="password" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500" placeholder="Enter Your Password" required=""
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)} />
                                    <p className="mt-2 text-sm text-red-600 dark:text-slate-300">{errors.password}</p>
                                </div>
                            </div>
                            <button type="submit"
                                onClick={handleSubmit}
                                className="text-white inline-flex items-center bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
                                {passwordDialogButtonText}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </>
    )
}
