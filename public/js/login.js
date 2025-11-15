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

        const data = await res.json();
        // Store the Firestore userId in localStorage
        localStorage.setItem("userId", data.userId);

        window.location.href = "/home"; // Redirect after login
    } catch (err) {
        console.error(err);
        alert("Login failed. Please try again.");
    }
});