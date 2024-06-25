import React, { useEffect, useState } from 'react'
import '../config/firebase-config';
import { onAuthStateChanged, getAuth, signOut } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { collection, getFirestore, onSnapshot } from 'firebase/firestore';
import delete_icon from '../assets/icons/delete_icon.png';
import ConfirmationDialog from '../components/ConfirmationDialog';
import Password from '../components/Password';
import Loading from '../components/Loading';
import LoadingSuccessFailure from '../components/LoadingSuccessFailure';
import Navbar from '../components/Navbar';
import { set } from 'firebase/database';

export default function Home() {

    const navigate = useNavigate();
    const auth = getAuth();
    const db = getFirestore();

    const [confirmationDialog, setConfirmationDialog] = useState({
        showConfirmDeleteDialog: false,
        passwordId: ""
    });

    const [passwordDialog, setPasswordDialog] = useState({
        showAddPasswordDialog: false,
        showEditPasswordDialog: false
    });

    const [alerts, setAlerts] = useState({});

    const [userId, setUserId] = useState("");
    const [idToken, setIdToken] = useState("");
    const [passwordList, setPasswordList] = useState(null);

    const [editPasswordId, setEditPasswordId] = useState("");

    useEffect(() => {
        const unsubscribeAuth = onAuthStateChanged(auth, async (user) => {
            if (user) {
                if (user.emailVerified) {
                    const token = await user.getIdToken(true);
                    setUserId(user.uid);
                    setIdToken(token);
                }
                else
                    navigate('/Login');
            } else {
                navigate('/Login');
            }
            return () => unsubscribeAuth();
        }, []);

        return () => unsubscribeAuth();
    }, []);

    useEffect(() => {
        if (!idToken) return;
        const unsub = onSnapshot(collection(db, "passwords"), async (snapshot) => {
            let list = [];
            snapshot.docs.forEach((doc) => {
                if (doc.data().uid === userId) {
                    list.push({ id: doc.id, ...doc.data() });
                }
            });

            const response = await fetch(`${process.env.REACT_APP_BASE_URL}/decryptPasswords`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${idToken}`,
                },
                body: JSON.stringify({
                    "passwords": list,
                }),
            });
            const result = await response.json();
            setPasswordList(result.message);
        },
            (error) => {
                setAlerts({
                    alertSuccessFailure: true,
                    success: false,
                    message: 'Failed to load all passwords'
                });
                setTimeout(() => {
                    setAlerts({});
                }, 2000);
            }
        );
        return () => {
            unsub();
        }
    }, [userId]);

    const handleLogout = (params) => {
        if (params) {
            setAlerts({ alertProcess: true, message: "Logging out..." });
            signOut(auth).then(() => {
                navigate("/Login")
                setAlerts({});
            }).catch((error) => {
                setAlerts({ alertSuccessFailure: true, success: false, message: "Error Logging out" });
                setTimeout(() => {
                    setAlerts({});
                }, 2000);
            });
        }
    }

    const handleDeletePassword = async (option) => {
        if (option) {
            setAlerts({ alertProcess: true, message: "Deleting password" });

            try {
                const response = await fetch(`${process.env.REACT_APP_BASE_URL}/deletePassword`, {
                    method: 'POST',
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${idToken}`,
                    },
                    body: JSON.stringify({
                        "id": confirmationDialog.passwordId,
                        "uid": userId,
                    }),
                });

                if (!response.ok) {
                    setAlerts({ alertSuccessFailure: true, success: false, message: "Failed to delete password" });
                    setTimeout(() => {
                        setAlerts({});
                    }, 2000);

                    throw new Error('Network response was not ok');
                }

                const result = await response.json();
                setAlerts({ alertSuccessFailure: true, success: true, message: "Password deleted successfully" });

                setTimeout(() => {
                    setAlerts({});
                }, 2000);

            } catch (error) {
                setAlerts({ alertSuccessFailure: true, success: false, message: "Failed to delete password" });
                setTimeout(() => {
                    setAlerts({});
                }, 2000);
            }
        }

        setConfirmationDialog({
            showConfirmDeleteDialog: false,
            passwordId: ""
        });
    }

    const handleAddPasswordClick = () => {
        setPasswordDialog({
            showAddPasswordDialog: true,
            showEditPasswordDialog: false
        });
    }

    const handleAddPassword = async (params) => {
        setPasswordDialog({});
        if (params) {
            setAlerts({ alertProcess: true, message: "Adding Password" });
            try {
                const response = await fetch(`${process.env.REACT_APP_BASE_URL}/addPassword`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${idToken}`,
                    },
                    body: JSON.stringify({
                        "uid": userId,
                        "service": params.service,
                        "username": params.username,
                        "password": params.password,
                    }),
                });

                if (!response.ok) {
                    setAlerts({ alertSuccessFailure: true, success: false, message: "Failed to add password" });
                    setTimeout(() => {
                        setAlerts({});
                    }, 2000);

                    throw new Error('Network response was not ok');
                }

                const result = await response.json();
                setAlerts({ alertSuccessFailure: true, success: true, message: "Password added successfully" });
                setTimeout(() => {
                    setAlerts({});
                }, 2000);

            } catch (error) {
                setAlerts({ alertSuccessFailure: true, success: false, message: "Failed to add password" });
                setTimeout(() => {
                    setAlerts({});
                }, 2000);

                console.error('Error:', error);
            }
        }
    }

    const handleEditPasswordClick = (id) => {
        let service = "";
        let username = "";
        let password = "";

        passwordList.forEach((obj) => {
            if (obj.id == id) {
                service = obj.service;
                username = obj.username;
                password = obj.password;
            }
        })
        setPasswordDialog({
            showAddPasswordDialog: false,
            showEditPasswordDialog: true,
            service: service,
            username: username,
            password: password
        });

        setEditPasswordId(id);
    }

    const handleEditPassword = async (params) => {
        setPasswordDialog({});
        if (params) {
            setAlerts({ alertProcess: true, message: "Updating password" });
            try {
                const response = await fetch(`${process.env.REACT_APP_BASE_URL}/editPassword`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${idToken}`,
                    },
                    body: JSON.stringify({
                        "id": editPasswordId,
                        "uid": userId,
                        "service": params.service,
                        "username": params.username,
                        "password": params.password,
                    }),
                });
                if (!response.ok) {
                    setAlerts({
                        alertSuccessFailure: true,
                        success: false,
                        message: "Failed to update password"
                    });

                    setTimeout(() => {
                        setAlerts({});
                    }, 2000);
                    throw new Error('Network response was not ok');
                }

                const result = await response.json();

                setAlerts({
                    alertSuccessFailure: true,
                    success: true,
                    message: "Password updated successfully"
                });
                setTimeout(() => {
                    setAlerts({});
                }, 2000);

            } catch (error) {
                setAlerts({
                    alertSuccessFailure: true,
                    success: false,
                    message: "Failed to update password"
                });
                setTimeout(() => {
                    setAlerts({});
                }, 2000);
                console.error('Error:', error);
            }
        }
    }

    if (!passwordList || !idToken)
        return <p>Loading...</p>

    return (
        <>
            <Navbar reduceOpacity={passwordDialog.showAddPasswordDialog || passwordDialog.showEditPasswordDialog || confirmationDialog.showConfirmDeleteDialog ? true : false} logout={handleLogout} />
            {passwordDialog.showAddPasswordDialog && <Password passwordDialogTitle="Add a new password" passwordDialogService="" passwordDialogUsername="" passwordDialogPassword="" passwordDialogButtonText="Add Password" onPasswordDialogClose={handleAddPassword} />}

            {passwordDialog.showEditPasswordDialog && <Password passwordDialogTitle="Edit Password" passwordDialogService={passwordDialog.service} passwordDialogUsername={passwordDialog.username} passwordDialogPassword={passwordDialog.password} passwordDialogButtonText="Update Password" onPasswordDialogClose={handleEditPassword} />}

            {alerts.alertProcess && <Loading loadingMessage={alerts.message} />}

            {alerts.alertSuccessFailure && <LoadingSuccessFailure success={alerts.success} loadingSuccessMessage={alerts.message} />}

            {confirmationDialog.showConfirmDeleteDialog && <ConfirmationDialog onConfirmationClose={handleDeletePassword} />}
            
            <div className={`${passwordDialog.showAddPasswordDialog || passwordDialog.showEditPasswordDialog || confirmationDialog.showConfirmDeleteDialog ? 'opacity-40' : ''} relative flex flex-col w-full h-full text-gray-700 bg-white shadow-md rounded-xl bg-clip-border`}>
                <div className="relative mx-4 mt-4 overflow-hidden text-gray-700 bg-white rounded-none bg-clip-border">
                    <div className="flex items-center justify-between gap-8 mb-8">
                        <div>
                            <h5
                                className="block font-sans text-xl antialiased font-semibold leading-snug tracking-normal text-blue-gray-900">
                                Password list
                            </h5>
                        </div>
                        <div className="flex flex-col gap-2 shrink-0 sm:flex-row">
                            <button
                                onClick={handleAddPasswordClick}
                                className="flex select-none items-center gap-3 rounded-lg bg-gray-900 py-3 px-4 text-center align-middle font-sans text-xs font-bold uppercase text-white shadow-md shadow-gray-900/10 transition-all hover:shadow-lg hover:shadow-gray-900/20 focus:opacity-[0.85] focus:shadow-none active:opacity-[0.85] active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
                                type="button">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"
                                    strokeWidth="2" className="w-4 h-4">
                                    <path
                                        d="M6.25 6.375a4.125 4.125 0 118.25 0 4.125 4.125 0 01-8.25 0zM3.25 19.125a7.125 7.125 0 0114.25 0v.003l-.001.119a.75.75 0 01-.363.63 13.067 13.067 0 01-6.761 1.873c-2.472 0-4.786-.684-6.76-1.873a.75.75 0 01-.364-.63l-.001-.122zM19.75 7.5a.75.75 0 00-1.5 0v2.25H16a.75.75 0 000 1.5h2.25v2.25a.75.75 0 001.5 0v-2.25H22a.75.75 0 000-1.5h-2.25V7.5z">
                                    </path>
                                </svg>
                                Add Password
                            </button>
                        </div>
                    </div>
                </div>
                <div className="overflow-scroll">
                    <table className="w-full mt-0 text-left table-auto min-w-max">
                        <thead>
                            <tr>
                                <th className="p-4 border-y border-blue-gray-100 bg-blue-gray-50/50">
                                    <p className="block font-sans text-sm antialiased font-normal leading-none text-blue-gray-900 opacity-70">
                                        Username
                                    </p>
                                </th>
                                <th className="p-4 border-y border-blue-gray-100 bg-blue-gray-50/50">
                                    <p className="block font-sans text-sm antialiased font-normal leading-none text-blue-gray-900 opacity-70">
                                        Password
                                    </p>
                                </th>
                                <th className="p-4 border-y border-blue-gray-100 bg-blue-gray-50/50">
                                    <p className="block font-sans text-sm antialiased font-normal leading-none text-blue-gray-900 opacity-70">
                                        Service
                                    </p>
                                </th>
                                <th className="p-4 border-y border-blue-gray-100 bg-blue-gray-50/50">
                                    <p className="block font-sans text-sm antialiased font-normal leading-none text-blue-gray-900 opacity-70">
                                    </p>
                                </th>
                                <th className="p-4 border-y border-blue-gray-100 bg-blue-gray-50/50">
                                    <p className="block font-sans text-sm antialiased font-normal leading-none text-blue-gray-900 opacity-70">
                                    </p>
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {passwordList.map((row, index) => {
                                return (
                                    <tr key={index}>
                                        <td className="p-4 border-b border-blue-gray-50">
                                            <div className="flex items-center gap-3">
                                                <div className="flex flex-col">
                                                    <p
                                                        className="block font-sans text-sm antialiased font-normal leading-normal text-blue-gray-900">
                                                        {row.username}
                                                    </p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="p-4 border-b border-blue-gray-50">
                                            <div className="flex flex-col">
                                                <p
                                                    className="block font-sans text-sm antialiased font-normal leading-normal text-blue-gray-900">
                                                    {row.password}
                                                </p>
                                            </div>
                                        </td>
                                        <td className="p-4 border-b border-blue-gray-50">
                                            <p className="block font-sans text-sm antialiased font-normal leading-normal text-blue-gray-900">
                                                {row.service}
                                            </p>
                                        </td>
                                        <td className="p-4 border-b border-blue-gray-50">
                                            <button
                                                className="relative h-10 max-h-[40px] w-10 max-w-[40px] select-none rounded-lg text-center align-middle font-sans text-xs font-medium uppercase text-gray-900 transition-all hover:bg-gray-900/10 active:bg-gray-900/20 disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
                                                type="button"
                                                onClick={() => handleEditPasswordClick(row.id)}>
                                                <span className="absolute transform -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2">
                                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"
                                                        className="w-4 h-4">
                                                        <path
                                                            d="M21.731 2.269a2.625 2.625 0 00-3.712 0l-1.157 1.157 3.712 3.712 1.157-1.157a2.625 2.625 0 000-3.712zM19.513 8.199l-3.712-3.712-12.15 12.15a5.25 5.25 0 00-1.32 2.214l-.8 2.685a.75.75 0 00.933.933l2.685-.8a5.25 5.25 0 002.214-1.32L19.513 8.2z">
                                                        </path>
                                                    </svg>
                                                </span>
                                            </button>
                                        </td>
                                        <td className="p-4 border-b border-blue-gray-50">
                                            <button
                                                onClick={() => {
                                                    setConfirmationDialog({
                                                        showConfirmDeleteDialog: true,
                                                        passwordId: row.id
                                                    });
                                                }}
                                                className="relative h-10 max-h-[40px] w-10 max-w-[40px] select-none rounded-lg text-center align-middle font-sans text-xs font-medium uppercase text-gray-900 transition-all hover:bg-gray-900/10 active:bg-gray-900/20 disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
                                                type="button">
                                                <span className="absolute transform -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2">
                                                    <img src={delete_icon} />
                                                </span>
                                            </button>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                    {passwordList.length == 0 && <div className="text-center my-5">No Passwords Found</div>}
                </div>
                {/* <div className="flex items-center justify-between p-4 border-t border-blue-gray-50">
          <p className="block font-sans text-sm antialiased font-normal leading-normal text-blue-gray-900">
            Page 1 of 10
          </p>
          <div className="flex gap-2">
            <button
              className="select-none rounded-lg border border-gray-900 py-2 px-4 text-center align-middle font-sans text-xs font-bold uppercase text-gray-900 transition-all hover:opacity-75 focus:ring focus:ring-gray-300 active:opacity-[0.85] disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
              type="button">
              Previous
            </button>
            <button
              className="select-none rounded-lg border border-gray-900 py-2 px-4 text-center align-middle font-sans text-xs font-bold uppercase text-gray-900 transition-all hover:opacity-75 focus:ring focus:ring-gray-300 active:opacity-[0.85] disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
              type="button">
              Next
            </button>
          </div>
        </div> */}
            </div>
        </>
    )
}