document.getElementById("signupForm").addEventListener("submit", async (e) => {
    e.preventDefault(); // Prevent normal form submission
    document.getElementById("errorMsgText").innerHTML = "";

    const email = document.getElementById("email").value;
    const username = document.getElementById("username").value
    const password = document.getElementById("password").value;

    try {
        const res = await fetch("/signup", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username, email, password }),
        });

        if (!res.ok) {
            const text = await res.text();
            document.getElementById("errorMsgText").innerHTML = text;
            return;
        }

        window.location.href = "/home"; // Redirect after login
    } catch (err) {
        console.error(err);
        alert("Login failed. Please try again.");
    }
});

(function () {
            'use strict';
            const form = document.querySelector('.needs-validation');

            form.addEventListener('submit', function (event) {
                // clear any custom validity first
                const pw = document.getElementById('password');
                pw.setCustomValidity('');

                // enforce password minimum of 4 characters (extra safety)
                if (pw.value.length < 4) {
                    pw.setCustomValidity('Password must be at least 4 characters.');
                    document.getElementById('passwordFeedback').textContent = pw.validationMessage;
                }

                if (!form.checkValidity()) {
                    event.preventDefault();
                    event.stopPropagation();
                }

                form.classList.add('was-validated');
            }, false);
        })();