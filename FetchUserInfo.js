const db = require('./database');
const bcrypt = require("bcrypt");

// Simple email validator
const isValidEmail = (email) => {
    return typeof email === 'string' && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
};

// Comparing entered password with password in db
const checkPassword = async (plainPassword, hash) => {
    return await bcrypt.compare(plainPassword, hash);
};

async function fetchUser(req, email, password, res) {
    try {
        // Basic input validation
        if (!email || typeof email !== 'string' || !isValidEmail(email)) {
            return res.status(400).send('Invalid or missing email');
        }
        if (!password || typeof password !== 'string' || password.length < 4) {
            return res.status(400).send('Password must be at least 4 characters');
        }

        const trimmedEmail = email.trim();

        const usersRef = db.collection('users');
        const snapshot = await usersRef.where('email', '==', trimmedEmail).get();
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
            req.session.email = trimmedEmail;
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
        // Basic input validation
        if (!username || typeof username !== 'string' || !username.trim()) {
            return res.status(400).send('Username is required');
        }
        if (!email || typeof email !== 'string' || !isValidEmail(email)) {
            return res.status(400).send('Invalid or missing email');
        }
        // We expect the caller to validate raw password length before hashing.
        if (!passwordHash || typeof passwordHash !== 'string' || !passwordHash.trim()) {
            return res.status(400).send('Invalid password/hash');
        }

        const trimmedEmail = email.trim();

        const usersRef = db.collection('users');
        const existing = await usersRef.where('email', '==', trimmedEmail).get();
        if (!existing.empty) {
            return res.status(400).send('Email already in use');
        }

        const docRef = await usersRef.add({
            username: username.trim(),
            email: trimmedEmail,
            passwordHash,
            createdAt: new Date()
        });

        // Store username and userId in session for future checks
        if (req && req.session) {
            req.session.username = username.trim();
            req.session.userId = docRef.id;
        } else {
            console.warn('Session not available on request; skipping session store.');
        }

        console.log('User added with ID: ', docRef.id);
        res.redirect('/home');
    } catch (e) {
        console.error('Error adding user: ', e);
        res.status(500).send('Error signing up');
    }
}

// Hashing
const hashPassword = async (plainPassword) => {
    if (plainPassword.trim().length < 4) {
        return null;
    }
    const saltRounds = 10; // higher = more secure, but slower
    const hash = await bcrypt.hash(plainPassword, saltRounds);
    return hash;
};

async function getUserandCars(username) {
    try {
        if (!username || typeof username !== 'string' || !username.trim()) {
            throw new Error('Invalid or missing username');
        }
        const usersRef = db.collection('users');
        const snapshot = await usersRef.where('username', '==', username.trim()).get();
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
        if (!carId || typeof carId !== 'string' || !carId.trim()) {
            throw new Error('Invalid or missing carId');
        }
        if (!userId || typeof userId !== 'string' || !userId.trim()) {
            throw new Error('Invalid or missing userId');
        }

        const usersRef = db.collection('users');
        const carsRef = usersRef.doc(userId.trim()).collection('cars');
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

module.exports = { fetchUser, saveUser, hashPassword, getUserandCars, getCar };