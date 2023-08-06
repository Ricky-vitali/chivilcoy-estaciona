import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/database';


const app = firebase.initializeApp({
    apiKey: "AIzaSyDQUghI0jkKL3M_GxyxsM2B1lmAVZSnqFo",
    authDomain: "estaciona-chivilcoy-37816.firebaseapp.com",
    projectId: "estaciona-chivilcoy-37816",
    storageBucket: "estaciona-chivilcoy-37816.appspot.com",
    messagingSenderId: "1015095495272",
    appId: "1:1015095495272:web:4c7c891c58e2e6f1c649dd"
})

export const auth = app.auth()
export const database = app.database();
export default app