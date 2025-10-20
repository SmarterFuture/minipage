import { head, navbar } from "./const";


export function loginPage(register = false) {
    
    const what = register ? "Register" : "Login";
    const lwhat = what.toLowerCase();

    const other_section = register ? 
        `Already a user? <a href="/login">Log in!</a>`
        :
        `New here? <a href="/register"> Register!</a>`

    return `
<!DOCTYPE html>
<html lang="en">
${head(what)}
<body>
    ${navbar()}
    <div class="banner error" id="message" style="display: none"></div>
    <div class="container">
        <h2>${what}</h2>

        <form id="${lwhat}Form" class="l-form">
            <label for="email" class="l-desc">Email:</label>
            <input type="email" id="email" name="email" required class="l-inp" />

            <label for="password" class="l-desc">Password:</label>
            <input type="password" id="password" name="password" required class="l-inp" />
            <a href="#" id="resetLink" class="tiny-a">Forgot password?</a> 

            <button type="submit" class="more-btn">${what}</button>
        </form>
        <div class="l-other">
            ${other_section}
        </div>
    </div>
    <script type="module" src="/js/${lwhat}_page.js"></script>
    <script type="module" src="/js/request_reset.js"></script>
</body>
</html>`;
}

export function resetPage() {
    return `
<!DOCTYPE html>
<html lang="en">
${head("Reset Password")}
<body>
    ${navbar()}
    <div class="banner error" id="message" style="display: none"></div>
    <div class="container">
        <h2>Reset password</h2>

        <form id="resetForm" class="l-form">
            <label for="password" class="l-desc">New password:</label>
            <input type="password" id="password" name="password" required class="l-inp" />

            <button type="submit" class="more-btn">Reset password</button>
        </form>
    </div>
    <script type="module" src="/js/reset_page.js"></script>
</body>
</html>`;
}
