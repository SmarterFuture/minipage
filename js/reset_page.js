import { errMessage } from "./extras.js";


document.getElementById("resetForm").addEventListener("submit", async (event) => {
    event.preventDefault();

    const params = new URLSearchParams(window.location.search);
    const token = params.get('token');

    const password = document.getElementById("password").value;
    const message = document.getElementById("message");

    try {
        const response = await fetch("/reset-password", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ token, password }),
        });

        const data = await response.json();

        if (response.ok) {
            alert("Password reset");
            setTimeout(() => { window.location.href = "/login"; }, 300);
        } else {
            errMessage(message, data.err || "Reset failed");
        }
    } catch (err) {
        console.error("Error:", err);
        errMessage(message, "Network error");
    }
});

