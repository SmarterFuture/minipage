import { errMessage } from "./extras.js";


document.getElementById("loginForm").addEventListener("submit", async (event) => {
    event.preventDefault();

    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;
    const message = document.getElementById("message");

    try {
        const res = await fetch("/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ email, password }),
        });

        const data = await res.json();

        if (res.ok) {
            alert("Login successful!");
            setTimeout(() => { window.location.href = "/"; }, 300);
        } else {
            errMessage(message, data.err || "Login failed");
        }
    } catch (err) {
        console.error("Error:", err);
        errMessage(message, "Network error");
    }
});
