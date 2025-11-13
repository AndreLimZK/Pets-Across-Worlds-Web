// Import the functions you need from the SDKs you need

  import { initializeApp } from "https://www.gstatic.com/firebasejs/12.5.0/firebase-app.js";

  import { getAnalytics } from "https://www.gstatic.com/firebasejs/12.5.0/firebase-analytics.js";

  // TODO: Add SDKs for Firebase products that you want to use

  // https://firebase.google.com/docs/web/setup#available-libraries


  // Your web app's Firebase configuration

  // For Firebase JS SDK v7.20.0 and later, measurementId is optional

  const firebaseConfig = {

    apiKey: "AIzaSyCrJL5Wf2aYbJxraIil_Yz9TfTsimASnjs",

    authDomain: "petsacrossworlds.firebaseapp.com",

    databaseURL: "https://petsacrossworlds-default-rtdb.asia-southeast1.firebasedatabase.app",

    projectId: "petsacrossworlds",

    storageBucket: "petsacrossworlds.firebasestorage.app",

    messagingSenderId: "247220418271",

    appId: "1:247220418271:web:723622892e38f0e4ac9b6a",

    measurementId: "G-YJXMNE9CY6"

  };


  // Initialize Firebase

  const app = initializeApp(firebaseConfig);

  const analytics = getAnalytics(app);

  //inputs
const emailInput = document.getElementById('email').value;
const passwordInput = document.getElementById('password').value;
//submit button
const submitButton = document.getElementById('submit');
submitButton.addEventListener('click', function(event) {
    event.preventDefault();
    alert(5);
});