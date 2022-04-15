const { initializeApp } = require("firebase/app");
const { getDatabase } = require("firebase/database");

// TODO: Replace with your app's Firebase project configuration
const firebaseConfig = {
    apiKey: "AIzaSyCQV8CSwFe5yR9FUvIv9JXDiwCbTBe7Yak",
    authDomain: "chat-realtime-ptitworks.firebaseapp.com",
    databaseURL: "https://chat-realtime-ptitworks-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "chat-realtime-ptitworks",
    storageBucket: "chat-realtime-ptitworks.appspot.com",
    messagingSenderId: "397556956305",
    appId: "1:397556956305:web:4c5145e7c887488444d330",
};

const app = initializeApp(firebaseConfig);

// Get a reference to the database service
const dbnoti = getDatabase(app);

module.exports = dbnoti;