

async function logout() {
    try {
        const response = await fetch('/logout', {
            method: 'POST',
            credentials: 'include'
        });
        
        if (response.ok) {
            alert("Succesfully logged out");
            setTimeout(loginLogout, 300);
        } else {
            alert('Logout failed. Please try again.');
        }
    } catch (error) {
        console.error('Logout error:', error);
        alert('Logout failed. Please try again.');
    }
}

function loginLogout() {
    const authLink = document.getElementById('auth-link');
    if (!authLink) return;
    
    const isAuth = document.cookie.includes('isauth=true');
    
    authLink.innerHTML = isAuth 
        ? `<a href="#" onclick="logout()" class="nav-link">Logout</a>`
        : `<a href="/login" class="nav-link">Login</a>`;
}

document.addEventListener('DOMContentLoaded', loginLogout);
