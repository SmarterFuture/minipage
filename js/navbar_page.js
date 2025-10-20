import { getCookie } from "./extras.js";


async function logout() {
    async function tryLogout(url) {
        const response = await fetch(url, {
            method: 'POST',
            credentials: 'include'
        });
        if (!response.ok) throw new Error(`Failed: ${url}`);
        return response;
    }

    try {
        await tryLogout('/logout');
        alert("Successfully logged out");
        setTimeout(loginLogout, 300);
    } catch (first) {
        console.warn('Strong logout failed, trying weak logout...', first);

        try {
            await tryLogout('/weak-logout');
            alert("Successfully logged out (weak)");
            setTimeout(loginLogout, 300);
        } catch (second) {
            console.error('Both logout attempts failed:', second);
            alert('Logout failed. Please try again.');
        }
    }
}

function loginLogout() {
    const authLink = document.getElementById('auth-link');
    if (!authLink) return;
    
    const isAuth = document.cookie.includes('isauth=true');
    
    authLink.innerHTML = isAuth 
        ? `<a href="#" id="logout-link" class="nav-link">Logout</a>`
        : `<a href="/login" class="nav-link">Login</a>`;
}

function nextPuzzle() {
    const homeLink = document.getElementById('home-link');
    if (!homeLink) return;
    
    const r_tonext = Number(getCookie("tonext"));
    const tonext = Number.isInteger(r_tonext) ? r_tonext : 0;

    const ishome = window.location.pathname === "/";
    
    homeLink.innerHTML = ishome 
        ? `<a href="/${tonext}?next=true" class="nav-link">Continue</a>`
        : `<a href="/" class="nav-link">Home</a>`;
}

document.addEventListener('DOMContentLoaded', () => { loginLogout(); nextPuzzle() });

document.getElementById('navbar').addEventListener('click', event => {
    if (event.target.matches('#logout-link')) {
        event.preventDefault();
        logout();
    }
});
