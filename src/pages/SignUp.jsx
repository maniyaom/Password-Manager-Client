import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../config/firebase-config';
import { getAuth, updateProfile, onAuthStateChanged, createUserWithEmailAndPassword, sendEmailVerification, signInWithRedirect, GoogleAuthProvider } from "firebase/auth";
import '../index.css';
import google_logo from '../assets/icons/google-logo.png';
import Loading from '../components/Loading';
import LoadingSuccessFailure from '../components/LoadingSuccessFailure';

export default function SignUp() {

    const navigate = useNavigate();
    const auth = getAuth();

    const [alerts, setAlerts] = useState({});

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [agreedToTerms, setAgreedToTerms] = useState(false);
    const [errors, setErrors] = useState({});
    const [authError, setAuthError] = useState("");

    const validateForm = () => {
        resetErrors();
        let error = {};
        if (!name) {
            error.name = 'Name is required';
        }
        if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            error.email = 'Invalid email address';
        }
        if (!password || password.length < 8) {
            error.password = 'Password must be at least 8 characters long';
        }
        if (!agreedToTerms) {
            error.terms = 'You must agree to the Terms and Conditions';
            setAuthError(error.terms);
        }
        setErrors(error);
        return Object.keys(error).length === 0;
    };

    const resetErrors = () => {
        setErrors({});
        setAuthError("");
    }

    const resetInputFields = () => {
        setName("");
        setEmail("");
        setPassword("");
    }

    const handleSubmit = async (event) => {
        event.preventDefault();
        const val = validateForm();
        if (val == true) {

            setAlerts({ alertProcess: true });

            createUserWithEmailAndPassword(auth, email, password)
                .then((userCredential) => {
                    const user = userCredential.user;
                    updateProfile(auth.currentUser, {
                        displayName: name
                    }).then(() => {
                        sendEmailVerification(auth.currentUser)
                            .then(() => {
                                resetInputFields();
                                setAlerts({ alertSuccess: true, success: true });
                                setTimeout(() => {
                                    navigate('/Login');
                                }, 1000);
                            });
                    })
                    console.log(user);
                })
                .catch((error) => {
                    if (error.code == 'auth/email-already-in-use')
                        setAuthError("Email already in use !!");
                    else
                        setAuthError(error.message);

                    setAlerts({});
                });
        }
    };

    const handleSignInWithGoogle = () => {
        const provider = new GoogleAuthProvider();
        signInWithRedirect(auth, provider);
    };

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                console.log(user);
                if (user.emailVerified)
                    navigate('/Home');
            } else {
                console.log("No user logged in...");
            }
        });

        return () => unsubscribe();
    }, []);


    return (
        <>
            {alerts.alertProcess && <Loading loadingMessage="Creating Your Account" />}
            {alerts.alertSuccess && <LoadingSuccessFailure success={alerts.success} loadingSuccessMessage="Verification mail sent to your registered email." />}
            <div className="flex justify-center align-center h-screen w-screen flex-wrap text-slate-800">
                <div className="flex w-full flex-col md:w-1/2">
                    <div className="my-auto mx-auto flex flex-col justify-center px-6 pt-8 md:justify-start lg:w-[28rem]">
                        <p className="text-center text-3xl font-bold md:text-left md:leading-tight">Create your account</p>
                        <p className="mt-6 text-center font-medium md:text-left">
                            Already using password manager?
                            <Link to="/Login" className="whitespace-nowrap font-semibold text-blue-700 mx-1">Login here</Link>
                        </p>
                        <button className="mt-8 flex items-center justify-center rounded-md border px-4 py-2 outline-none ring-gray-400 ring-offset-2 transition hover:border-transparent hover:bg-black hover:text-white focus:ring-2"
                            onClick={handleSignInWithGoogle}>
                            <img className="mr-2 h-5" src={google_logo} alt="Google logo" />
                            Sign in with Google
                        </button>
                        <div className="relative mt-8 flex h-px place-items-center bg-gray-200">
                            <div className="absolute left-1/2 h-6 -translate-x-1/2 bg-white px-4 text-center text-sm text-gray-500">Or use email instead</div>
                        </div>
                        <form id="signupForm" className="mb-4 mt-3" onSubmit={handleSubmit}>
                            <div className="mb-4 flex flex-col w-full">
                                <label htmlFor="nameOfTheUser" className="mb-2 inline-block text-sm font-medium text-gray-700">Name</label>
                                <input type="text" className="block w-full cursor-text appearance-none rounded-md border border-gray-400 bg--100 py-3 px-3 text-sm outline-none focus:border-indigo-500 focus:bg-white focus:text-gray-600 focus:shadow" id="nameOfTheUser" name="nameOfTheUser" placeholder="Enter Your Name" autoFocus=""
                                    value={name}
                                    onChange={(e) => setName(e.target.value)} />
                                <p className="mt-2 text-sm text-red-600 dark:text-red-500">{errors.name}</p>
                            </div>
                            <div className="mb-4">
                                <div className="flex justify-between align-center">
                                    <label className="mb-2 inline-block text-sm font-medium text-gray-700" htmlFor="email">Email</label>
                                </div>
                                <div className="relative flex flex-col w-full flex-wrap items-stretch">
                                    <input type="email" id="email" className="relative block flex-auto cursor-text appearance-none rounded-md border border-gray-400 bg--100 py-3 px-3 text-sm outline-none focus:border-indigo-500 focus:bg-white focus:text-gray-600 focus:shadow" name="email" placeholder="Enter your Email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)} />
                                    <p className="mt-2 text-sm text-red-600 dark:text-red-500">{errors.email}</p>
                                </div>
                            </div>
                            <div className="mb-4">
                                <div className="flex justify-between align-center">
                                    <label className="mb-2 inline-block text-sm font-medium text-gray-700" htmlFor="password">Password</label>
                                </div>
                                <div className="relative flex flex-col w-full flex-wrap items-stretch">
                                    <input type="password" id="password" className="relative block flex-auto cursor-text appearance-none rounded-md border border-gray-400 bg--100 py-3 px-3 text-sm outline-none focus:border-indigo-500 focus:bg-white focus:text-gray-600 focus:shadow" name="password" placeholder="Enter your Password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)} />
                                    <p className="mt-2 text-sm text-red-600 dark:text-red-500">{errors.password}</p>
                                </div>
                            </div>
                            <div className="mb-4">
                                <div className="block">
                                    <input className="mt-1 mr-2 h-5 w-5 appearance-none rounded border border-gray-300 bg-contain bg-no-repeat align-top text-black shadow checked:bg-indigo-500 focus:border-indigo-500 focus:shadow" type="checkbox" id="agree-terms-and-conditions" style={{ backgroundImage: 'url("data:image/svg+xml,%3csvg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 20 20\'%3e%3cpath fill=\'none\' stroke=\'%23fff\' stroke-linecap=\'round\' stroke-linejoin=\'round\' stroke-width=\'2\' d=\'M6 10l3 3l6-6\'/%3e%3c/svg%3e")' }}
                                        value={agreedToTerms}
                                        onChange={(e) => {
                                            setAgreedToTerms(e.target.checked);
                                        }} />
                                    <div className="inline">
                                        <label className="inline-block" htmlFor="agree-terms-and-conditions"> I agree to the <a className="underline" href="#">Terms and Conditions</a></label>
                                        <p className="mt-3 text-sm text-red-600 dark:text-red-500">{authError}</p>
                                    </div>
                                </div>
                            </div>
                            <div className="mb-4">
                                <button className="grid w-full cursor-pointer select-none rounded-md border border-indigo-500 bg-indigo-500 py-2 px-5 text-center align-middle text-base font-semibold text-white shadow hover:border-indigo-600 hover:bg-indigo-600 hover:text-white focus:border-indigo-600 focus:bg-indigo-600 focus:text-white focus:shadow-none" type="submit">Sign Up</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </>
    );
}