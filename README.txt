videos
======
videos have been made web compatible from the provided downloads with

```
ffmpeg -i hellacam/5.mov -qscale 0 hellacam/5.mp4`
```

keyframes to json
=================
every keyframes file (.txt file) has been converted to JSON using the script in `app/hellacam/to-json.js`.

This is run with `node to-json.js hole15.txt > hole15.json` where hole15 serves as an example.

app
===
app folder contains the actual demo application
actual logic in `js/overlay.js`

on the first time running the project be sure to install all dependencies with `npm install`

to create JS bundle run `npm run build`
to start development server (localhost:5000) run `npm start` -- this needs a JS bundle so run `npm run build` first

comments in `js/overlay.js` document the individual logic parts, so refer to comments for more details on the actual rendering logic
