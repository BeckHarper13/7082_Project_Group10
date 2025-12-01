// database.js (CI-safe Firestore config)
const admin = require("firebase-admin");

function initializeFirestore() {
    // CI mode → use Firestore Emulator
    if (process.env.CI === "true") {
        console.log("🔥 Running Firestore in EMULATOR MODE");

        admin.initializeApp({
            projectId: "demo-test-project" // any fake ID
        });

        process.env.FIRESTORE_EMULATOR_HOST = "localhost:8080";
        return admin.firestore();
    }

    // Local mode → use real service account
    console.log("🔐 Using LOCAL real Firestore credentials");

    const serviceAccount = require("./serviceAccountKey.json");

    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount)
    });

    return admin.firestore();
}

module.exports = initializeFirestore();
