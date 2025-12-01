// database.js (Firestore config)
const admin = require("firebase-admin");

function initializeFirestore() {
    const serviceAccount = require("./serviceAccountKey.json");

    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount)
    });
    console.log("Connected to Firestore Database");
    return admin.firestore();
}

module.exports = initializeFirestore();
