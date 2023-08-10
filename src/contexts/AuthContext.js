import React, {useContext, useState, useEffect} from 'react';
import { auth, database } from '../firebase'
const AuthContext = React.createContext()

export function useAuth(){
    return useContext(AuthContext)
}

export function AuthProvider({children}){
    const [currentUser, setCurrentUser] = useState();
    const [loading, setLoading] = useState(true);
    const [loginAttempts, setLoginAttempts] = useState(0);
    const MAX_LOGIN_ATTEMPTS = 3;


    function register(email, password, userName, dni) {
        return new Promise((resolve, reject) => {
            auth
                .createUserWithEmailAndPassword(email, password)
                .then((userCredential) => {
                    const user = userCredential.user;
                    return user
                        .updateProfile({
                            displayName: userName,
                        })
                        .then(() => {
                            const userRef = database.ref('users').child(user.uid);
                            return userRef
                                .set({
                                    documentNumber: dni,
                                    isOfficer: false, 
                                })
                                .then(() => {
                                    resolve(); // Registration successful
                                })
                                .catch((error) => {
                                    reject(error); 
                                });
                        })
                        .catch((error) => {
                            reject(error); 
                        });
                })
                .catch((error) => {
                    reject(error); 
                });
        });
    }



    async function checkIfDNIAlreadyExists(dni) {
        try {
            const snapshot = await database.ref('users').orderByChild('documentNumber').equalTo(dni).once('value');
            return snapshot.exists();
        } catch (error) {
            console.log('Error checking DNI:', error);
            return false;
        }
    }



    async function login(email, password) {
        try {
            const storedLoginAttempts = localStorage.getItem('loginAttempts');
            const storedAttempts = storedLoginAttempts ? parseInt(storedLoginAttempts, 10) : 0;
            if (storedAttempts >= MAX_LOGIN_ATTEMPTS) {
                throw new Error('Maximum login attempts reached. Please try again later.');
            }

            await auth.signInWithEmailAndPassword(email, password);
            setLoginAttempts(0); // Reset login attempts on successful login
            localStorage.removeItem('loginAttempts');
        } catch (error) {
            setLoginAttempts((prevAttempts) => {
                const updatedAttempts = prevAttempts + 1;
                localStorage.setItem('loginAttempts', updatedAttempts);
                return updatedAttempts;
            }); // Increment login attempts on failed login
            throw error;
        }
    }

    function logout() {
        return auth.signOut()
    }


    useEffect(() => {
        const storedLoginAttempts = localStorage.getItem('loginAttempts');
        const storedAttempts = storedLoginAttempts ? parseInt(storedLoginAttempts, 10) : 0;
        setLoginAttempts(storedAttempts);

        const unsubscribe = auth.onAuthStateChanged((user) => {
            setCurrentUser(user);
            setLoading(false);
        });
        return unsubscribe;
    }, []);


    const value = {
        currentUser,
        register,
        checkIfDNIAlreadyExists,
        login,
        logout
    }

    return(
    <AuthContext.Provider value={value}>
        {!loading && children}
    </AuthContext.Provider>
    )
}
