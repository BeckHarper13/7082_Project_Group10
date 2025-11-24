document.getElementById("loginForm").addEventListener("submit", async (e) => {
    e.preventDefault(); // Prevent normal form submission

    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    try {
        const res = await fetch("/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password }),
        });

        if (!res.ok) {
            const text = await res.text();
            alert(text); // Show backend error message
            return;
        }

        window.location.href = "/home"; // Redirect after login
    } catch (err) {
        console.error(err);
        alert("Login failed. Please try again.");
    }
});

(function () {
            const form = document.getElementById('loginForm');
            const emailInput = document.getElementById('email');
            const passwordInput = document.getElementById('password');

            function validateField(input, minLen) {
                const val = input.value.trim();
                if (val.length < minLen) {
                    input.classList.add('is-invalid');
                    return false;
                } else {
                    input.classList.remove('is-invalid');
                    return true;
                }
            }

            // Remove invalid state on input
            [emailInput, passwordInput].forEach(input => {
                input.addEventListener('input', () => validateField(input, 4));
            });

            form.addEventListener('submit', function (e) {
                const emailOk = validateField(emailInput, 4);
                const passOk = validateField(passwordInput, 4);

                // Also rely on browser's email validity for email format
                if (!emailInput.checkValidity()) {
                    emailInput.classList.add('is-invalid');
                }

                if (!emailOk || !passOk || !emailInput.checkValidity()) {
                    e.preventDefault();
                    e.stopPropagation();
                    return;
                }

                // If valid, allow submit to proceed (your ../js/login.js can handle the submit)
            });
        })();