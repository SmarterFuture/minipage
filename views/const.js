
export function head(title) {
    return ` 
<head>
    <meta charset="UTF-8">
    <title>${title}</title>
    <link rel="stylesheet" href="/static/styles.css">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
    `;
}

export function navbar() {
    return `
<nav class="navbar" id="navbar">
    <div class="nav-links">
        <div id="home-link">
            <a href="/" class="nav-link">Home</a>
        </div>
        <a href="/chats" class="nav-link">Chat</a>
        <div id="auth-link">
            <a href="/login" class="nav-link">Login</a>
        </div>
        <a href="https://buymeacoffee.com/SmarterFuture" class="nav-link" target="_blank" rel="noopener noreferrer">Coffee</a>
    </div>
</nav>
<script type="module" src="/js/navbar_page.js"></script>
    `;
}
