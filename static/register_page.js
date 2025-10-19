
const CLOSE = `<span class="close" onclick="this.parentElement.style.display='none'">✖</span>`

document.getElementById("registerForm").addEventListener("submit", async (event) => {
    event.preventDefault();

    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;
    const message = document.getElementById("message");

    try {
        const response = await fetch("/register", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ email, password }),
        });

        const data = await response.json();

        if (response.ok) {
            alert("Check your email for verification link!");
            setTimeout(() => { window.location.href = "/"; }, 300);
        } else {
            errMessage(message, data.err || "Registration failed");
        }
    } catch (err) {
        console.error("Error:", err);
        errMessage(message, "Network error");
    }
});

function errMessage(element, message) {
    element.style.display = "block";
    element.innerHTML = message + CLOSE;
}

