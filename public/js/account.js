// Initialize modals
const emailModal = new bootstrap.Modal(document.getElementById('emailModal'));
const passModal = new bootstrap.Modal(document.getElementById('passModal'));

// Get buttons
const emailBtn = document.getElementById('emailBtn');
const passBtn = document.getElementById('passBtn');
const saveEmailBtn = document.getElementById('saveEmailBtn');
const savePasswordBtn = document.getElementById('savePasswordBtn');

// Get input fields
const newEmail = document.getElementById('newEmail');
const confirmEmail = document.getElementById('confirmEmail');
const newPassword = document.getElementById('newPassword');
const confirmPassword = document.getElementById('confirmPassword');

// change email modal
emailBtn.addEventListener('click', function () {
    emailModal.show();
});

// change password modal
passBtn.addEventListener('click', function () {
    passModal.show();
});

// Save email changes
saveEmailBtn.addEventListener('click', async function () {
    const email = newEmail.value.trim();
    const confirmEmailVal = confirmEmail.value.trim();

    if (!email || !confirmEmailVal) {
        alert('Please fill in both fields.');
        return;
    }

    if (email !== confirmEmailVal) {
        alert('Emails do not match. Please try again.');
        return;
    }

    // POST
    try {
        const response = await fetch('/account/change-email', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: email })
        });

        if (!response.ok) {
            throw new Error(`${response.status} ${response.statusText}`);
        }

        alert('success!');
        emailModal.hide();
        newEmail.value = '';
        confirmEmail.value = '';
        location.reload();
    } catch (error) {
        console.error('Error changing email:', error);
        alert(`Error changing email: ${error.message}`);
    }
});

// Save password changes
savePasswordBtn.addEventListener('click', async function () {
    const password = newPassword.value;
    const confirmPasswordVal = confirmPassword.value;

    if (!password || !confirmPasswordVal) {
        alert('Please fill in both fields.');
        return;
    }

    if (password !== confirmPasswordVal) {
        alert('Passwords do not match. Please try again.');
        return;
    }

    // POST
    try {
        const response = await fetch('/account/change-password', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ password: password })
        });

        if (!response.ok) {
            throw new Error(`${response.status} ${response.statusText}`);
        }

        alert('success!');
        passModal.hide();
        newPassword.value = '';
        confirmPassword.value = '';
    } catch (error) {
        console.error('Error changing password:', error);
        alert(`Error changing password: ${error.message}`);
    }
});