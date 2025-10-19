import { head, navbar } from "./const"


export function puzzlePage(id, file, insight, solved = false, validKey = true) {
    const banner = !validKey
        ? `
<div class="banner error">
    Hmm... that password/key doesn’t seem quite right.<br>
    Take another look — maybe there’s a small hint you missed?
    <span class="close" onclick="this.parentElement.style.display='none'">✖</span>
</div>`
    : ''

    const success = solved
        ? `
<div class="success section">
    <h2>🎉🎉 YAY! You did it! 🎉🎉</h2>
    <p>
        Hopefully it was tastefully challenging. Here, enjoy the next one!
    </p>

    <button class="next-btn" onclick="location.href='/${id + 1}?next=true'">
        Next Puzzle
    </button>

    <h4>Author’s notes:</h4>
    <p>
        It wouldn’t be nearly as rewarding without these little endings,
        where authors share a bit of the story behind how they created
        the puzzles.
    </p>
    <p class="afterword">${insight}</p>
</div>`
        : ''

    return `
<!DOCTYPE html>
<html lang="en">
${head(`Puzzle ${id}`)}
<body>
    ${navbar()}
    ${banner}
        <div class="container">
        <h1>Puzzle ${id}</h1>
        ${success}
        <embed src="/static/${file}" type="application/pdf">
    </div>
</body>
</html>`
}

export function puzzlePageLast(id, valid = true) {
    const reason = valid
        ? "this one was the last one I have prepared."
        : "the cipher you tried to reach doesn’t exist."

    return `
<!DOCTYPE html>
<html lang="en">
${head(`Puzzle ${id}`)}
<body>
    ${navbar()}
    <div class="container">
    <h1>Puzzle ${id}</h1>

    <div class="info section">
        <h2>🧩 This cipher doesn’t exist or was the last one in the series.</h2>
    </div>

    <div class="last section">
        <p>Unfortunately, ${reason}</p>
    <p>
        I’ll try to make a new one every week —  
        so if you’d like, keep checking back here from time to time.
    </p>
    <p>Thanks for solving and being part of it 💫</p>
</div>
</div>
</body>
</html>`
}

