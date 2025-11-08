# Miniture

A simple [website](https://miniture.org/) for me to post fun ciphers/puzzles online. It was born out of pure boredom during my first couple of months at uni.

## The Journey

It started as a quick-and-dirty pure JavaScript frontend with an Express/Node backend because why overcomplicate things? I also wasn't planning on adding features that would require more.

Then I wanted to add one more thing...

- **Rewrote the backend** with Bun + Hono (TypeScript) for speed (and also because I personally hate slow websites).
- **Added MongoDB** so I could leave it running as a Docker image somewhere without needing to rebuild it for each new cipher/puzzle.
- **Integrated Discord.js** so I can manage everything from my (private) Discord server—because opening a database GUI is too much work.
    - This was also partly because I wanted to create instant messaging for hints without exposing my personal info and without making users wait eons for a response.

Now it's a tiny pure JS frontend talking to a surprisingly robust backend that lets me (the admin) do everything via Discord bot commands. Why use a dashboard when you can use Discord?

[Coffee?](https://buymeacoffee.com/SmarterFuture)
