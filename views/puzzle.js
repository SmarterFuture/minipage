

export function puzzlePage(id, file, insight) {
    return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Puzzle ${id+1}</title>
    <link rel="stylesheet" href="/static/styles.css">
</head>
<body>
    <div class="container">
        <h1>Puzzle ${id+1}</h1>
        <a href="/">Home</a>
        <h2>🎉🎉 YAY! You did it! 🎉🎉</h2>
        <p>
        Hopegully it was tastefully challenging. Here, enjoy the next one
        </p>
        <embed src="/static/${file}" width="600" height="850" type="application/pdf">
        <h4>Previous puzzle -- Author's notes:</h4>
        <p>
        It wouldn’t be nearly as rewarding without these little endings, where authors share a bit of
        the story behind how they created the puzzles.
        </p>
        <p>
        ${insight}
        </p>
    </div>
</body>
</html>
`;}

export function puzzlePageLast(id, insight) {
    return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Puzzle ${id+1}</title>
    <link rel="stylesheet" href="/static/styles.css">
</head>
<body>
    <div class="container">
        <h1>Puzzle ${id+1}</h1>
        <a href="/">Home</a>
        <h2>🎉🎉 YAY! You did it! 🎉🎉</h2>
        <p>
        Hopegully it was tastefully challenging. Unfortunately this one is the last one I have prepared.
        I will try to make one every week, so if you want, keep checking.
        </p>
        <h4>Previous puzzle -- Author's notes:</h4>
        <p>
        It wouldn’t be nearly as rewarding without these little endings, where authors share a bit of
        the story behind how they created the puzzles.
        </p>
        <p>
        ${insight}
        </p>
    </div>
</body>
</html>
`;}
