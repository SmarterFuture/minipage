import { head, navbar } from "./const";

export function homePage() {
    return `
<!DOCTYPE html>
<html lang="en">
${head("Puzzle Home")}
<body>
    ${navbar()}
    <div class="container">
        <h1>Welcome</h1>
        <p>
        This is a small collection of ciphers/puzzles for people that are bored, like me.
        </p>
        <p>
        These are some fun ciphers and puzzles designed to get your mind racing. They’ll test
        your logic, your detective skills, and how good you are at digging up clues. The best part? 
        They’re even more fun when you team up with friends—two (or more) heads are always better than
        one! So grab your crew, put on your thinking caps, and let’s crack some codes!
        </p>
        <h2>Interested?</h2>
        <p>
        Try the first cipher! <a href="/1">Go!</a>
        </p>
        <h2>About keys/passwords</h2>
        <p>
        <ul>
        <li>All keys/passwords are case-sensitive.</li>
        <li>Use underlines as spaces.</li>
        <li>To enter key/password for checking enter URL as
            <a><code>https://miniture.org/&lt;id&gt;-&lt;key/password&gt;</code></a></li>
        <li>If you have entered correct key/password it show you the next cipher</li>
        <li>For more information check out this little <a href="/0">demo</a></li>
        </p>
        <p>
        For example:
        <a href="/0-this_is_KEY"><code>https://miniture.org/0-this_is_KEY</code></a>
        </p>
    </div>
    <script src="/js/home_page.js"></script>
</body>
</html>
`;}
