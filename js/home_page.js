

document.addEventListener('DOMContentLoaded', () => {
    const params = new URLSearchParams(window.location.search);
    const success = params.get('verified');

    if (success === 'true') {
        alert("Successfully verified!");
    } else if (success === 'false') {
        alert("Verification failed.");
    }

    if (success) {
        window.history.replaceState({}, document.title, "/");
    }
});
