import React, { useEffect, useState } from 'react'
import '../index.css';
import { useNavigate, Link } from 'react-router-dom';
import { getAuth, onAuthStateChanged, sendPasswordResetEmail } from 'firebase/auth';
import '../config/firebase-config';
import Loading from '../components/Loading';
import LoadingSuccessFailure from '../components/LoadingSuccessFailure';

export default function ForgotPassword() {

    const auth = getAuth();
    const navigate = useNavigate();

    const [alerts, setAlerts] = useState({});

    const [email, setEmail] = useState("");

    useEffect(() => {
        const unsubscibeAuth = onAuthStateChanged(auth, (user) => {
            if (user) {
                if (user.emailVerified)
                    navigate('/Home');
            }
        });
        return () => unsubscibeAuth();
    })

    const handleSubmit = (event) => {
        event.preventDefault();
        setAlerts({
            alertProcess: true,
            message: "Processing your request"
        });

        sendPasswordResetEmail(auth, email)
            .then(() => {
                setAlerts({
                    alertSuccess: true,
                    success: true,
                    message: "Password reset link sent to your email"
                });
                setEmail("");

                setTimeout(() => {
                    setAlerts({});
                }, 2000);
            })
            .catch((error) => {
                setAlerts({
                    alertSuccess: true,
                    success: false,
                    message: "Failed to send password reset link"
                });

                setTimeout(() => {
                    setAlerts({});
                }, 2000);
            });
    }

    return (
        <>
            {alerts.alertProcess && <Loading loadingMessage={alerts.message} />}
            {alerts.alertSuccess && <LoadingSuccessFailure success={alerts.success} loadingSuccessMessage={alerts.message} />}
            <div className="flex min-h-screen w-screen w-full items-center justify-center text-gray-600 bg-gray-50">
                <div className="relative">

                    <div className="hidden sm:block h-56 w-56 text-indigo-300 absolute a-z-10 -left-20 -top-20">
                        <svg id='patternId' width='100%' height='100%' xmlns='http://www.w3.org/2000/svg'><defs><pattern id='a' patternUnits='userSpaceOnUse' width='40' height='40' patternTransform='scale(0.6) rotate(0)'><rect x='0' y='0' width='100%' height='100%' fill='none' /><path d='M11 6a5 5 0 01-5 5 5 5 0 01-5-5 5 5 0 015-5 5 5 0 015 5' strokeWidth='1' stroke='none' fill='currentColor' /></pattern></defs><rect width='800%' height='800%' transform='translate(0,0)' fill='url(#a)' /></svg>
                    </div>
                    <div className="hidden sm:block h-28 w-28 text-indigo-300 absolute a-z-10 -right-20 -bottom-20">
                        <svg id='patternId' width='100%' height='100%' xmlns='http://www.w3.org/2000/svg'><defs><pattern id='b' patternUnits='userSpaceOnUse' width='40' height='40' patternTransform='scale(0.5) rotate(0)'><rect x='0' y='0' width='100%' height='100%' fill='none' /><path d='M11 6a5 5 0 01-5 5 5 5 0 01-5-5 5 5 0 015-5 5 5 0 015 5' strokeWidth='1' stroke='none' fill='currentColor' /></pattern></defs><rect width='800%' height='800%' transform='translate(0,0)' fill='url(#b)' /></svg>
                    </div>
                    <div className="relative flex flex-col sm:w-[30rem] rounded-lg border-gray-400 bg-white shadow-lg px-4">
                        <div className="flex-auto p-6">
                            <div className="mb-10 flex flex-shrink-0 flex-grow-0 items-center justify-center overflow-hidden">
                                <a href="#" className="flex cursor-pointer items-center gap-2 text-indigo-500 no-underline hover:text-indigo-500">
                                    <span className="flex-shrink-0 text-3xl font-black tracking-tight opacity-100">Password Manager</span>
                                </a>
                            </div>
                            <h4 className="mb-2 font-medium text-gray-700 xl:text-xl">Forgot Password ?</h4>
                            <p className="mb-6 text-gray-500">Please enter your email to recover your account</p>

                            <form className="mb-4" onSubmit={handleSubmit}>
                                <div className="mb-4">
                                    <label htmlFor="email" className="mb-2 inline-block text-sm font-medium text-gray-700">Email or Username</label>
                                    <input type="text" className="block w-full cursor-text appearance-none rounded-md border border-gray-400 bg--100 py-3 px-3 text-sm outline-none focus:border-indigo-500 focus:bg-white focus:text-gray-600 focus:shadow" name="email" placeholder="Enter your email" autoFocus=""
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)} />
                                </div>
                                <div className="mb-4">
                                    <button className="grid w-full cursor-pointer select-none rounded-md border border-indigo-500 bg-indigo-500 py-2 px-5 text-center align-middle text-base font-semibold text-white shadow hover:border-indigo-600 hover:bg-indigo-600 hover:text-white focus:border-indigo-600 focus:bg-indigo-600 focus:text-white focus:shadow-none" type="submit">Submit</button>
                                </div>
                            </form>

                            <p className="mb-4 text-center">
                                New on Password Manager?
                                <Link to="/SignUp" className="cursor-pointer text-indigo-500 no-underline hover:text-indigo-500"> Create an account </Link>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}
