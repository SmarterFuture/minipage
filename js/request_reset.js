import { errMessage } from "./extras.js";


document.getElementById('resetLink').addEventListener('click', async (e) => {
    e.preventDefault();
    const email = document.getElementById("email").value.trim();
    const message = document.getElementById("message");

    try {
        const res = await fetch("/request-reset", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ email }),
        });

        const data = await res.json();

        if (res.ok) {
            alert("Check your email for reset link");
            setTimeout(() => { window.location.href = "/"; }, 300);
        } else {
            errMessage(message, data.err || "Reset request failed");
        }
    } catch (err) {
        console.error("Error:", err);
        errMessage(message, "Network error");
    }
});
