 const db = require('./database');
 const bcrypt = require("bcrypt");
 

// Comparing
const checkPassword = async (plainPassword, hash) => {
    return await bcrypt.compare(plainPassword, hash);
};

async function fetchUser(req, email, password, res) {
    try {
        const usersRef = db.collection('users');
        const snapshot = await usersRef.where('email', '==', email).get();
        if (snapshot.empty) {
            return res.status(400).send('Invalid email or password');
        }

        let userData;
        let userId;
        snapshot.forEach(doc => {
            userData = doc.data();
            userId = doc.id;
        });

        const passwordMatch = await checkPassword(password, userData.passwordHash);
        if (!passwordMatch) {
            return res.status(400).send('Invalid email or password');
        }

        console.log('User fetched successfully: ', userData.username);
        // Store username and userId in session for future checks
        if (req && req.session) {
            req.session.username = userData.username;
            req.session.userId = userId;
        } else {
            console.warn('Session not available on request; skipping session store.');
        }

        // Successful login
        return res.json({
            message: 'Login successful!',
            userId: userId
        });
    } catch (e) {
        console.error('Error fetching user: ', e);
        res.status(500).send('Error logging in');
    }
}

// Save user to Firestore
async function saveUser(req, username, email, passwordHash, res) {
    try {
        const docRef = await db.collection('users').add({
            username,
            email,
            passwordHash,
            createdAt: new Date()
        });

        // Store username and userId in session for future checks
        if (req && req.session) {
            req.session.username = username;
            req.session.userId = docRef.id;
        } else {
            console.warn('Session not available on request; skipping session store.');
        }

        console.log('User added with ID: ', docRef.id);
        res.send('Signup successful!');
    } catch (e) {
        console.error('Error adding user: ', e);
        res.status(500).send('Error signing up');
    }
}

async function getUserandCars(username) {
    try {
        const usersRef = db.collection('users');
        const snapshot = await usersRef.where('username', '==', username).get();
        if (snapshot.empty) {
            throw new Error('User not found');
        }
        const userData = snapshot.docs[0].data();
        const userId = snapshot.docs[0].id;

        const carsRef = usersRef.doc(userId).collection('cars');
        const carsSnapshot = await carsRef.get();
        const cars = [];
        carsSnapshot.forEach(doc => {
            cars.push({ id: doc.id, ...doc.data() });
        });

        return { user: userData, cars: cars };
    } catch (e) {
        console.error('Error fetching user and cars: ', e);
        throw e;
    }
}

async function getCar(carId, userId) {
    try {
        const usersRef = db.collection('users');
        const carsRef = usersRef.doc(userId).collection('cars');
        const carsSnapshot = await carsRef.get();
        let foundCar = null;

        for (const doc of carsSnapshot.docs) {          
            if (doc.id.trim() === carId.trim()) { 
                foundCar = doc.data();
                return foundCar;
            }
        }
        console.error('Error: car not found with id: ', carId);
        return; 

    } catch (e) {
        console.error('Error fetching user and cars: ', e);
        throw e;
    }
}

module.exports = { fetchUser, saveUser, getUserandCars, getCar };