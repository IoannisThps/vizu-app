
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-auth.js"




const firebaseConfig = {
    apiKey: "AIzaSyDkp6VZmVEUh5PgGcCLRO99OCJvU8F7RqU",
    authDomain: "vizu-e94d7.firebaseapp.com",
    projectId: "vizu-e94d7",
    storageBucket: "vizu-e94d7.firebasestorage.app",
    messagingSenderId: "595758892845",
    appId: "1:595758892845:web:8276ad2a81abcba6aa35a4"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth();


const submit = document.getElementById("submit");
submit.addEventListener("click", function (event) {
    event.preventDefault()

    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;


    createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            // Signed up 
            const user = userCredential.user;
            alert("Successfully Created Account!")
            // ...
        })
        .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            alert(errorMessage)
            // ..
        });

})