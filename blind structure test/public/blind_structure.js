const firebaseConfig = {
    apiKey: "AIzaSyA6dLMgUpD9k_pOftb2Cd1JqCKaNhnR7cc",
    authDomain: "texas-holdem-timer.firebaseapp.com",
    projectId: "texas-holdem-timer",
    storageBucket: "texas-holdem-timer.appspot.com",
    messagingSenderId: "512330409634",
    appId: "1:512330409634:web:fe30a4072728479ce799fb"
};

firebase.initializeApp(firebaseConfig);

const db = firebase.firestore()
