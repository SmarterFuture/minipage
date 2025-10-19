document.getElementById("loginForm").addEventListener("submit", async (event) => {
    event.preventDefault(); // prevent normal form submission

    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;

    try {
        const response = await fetch("/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ email, password }),
        });

        const data = await response.json();

        if (response.ok) {
            document.getElementById("message").textContent = "Login successful!";
            console.log("Server response:", data);
        } else {
            document.getElementById("message").textContent = data.error || "Login failed.";
        }
    } catch (err) {
        console.error("Error:", err);
        document.getElementById("message").textContent = "Network error.";
    }
});

