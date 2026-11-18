# Tune Hub website

Files:
- `index.html` – the page
- `style.css` – colours and layout
- `app.js` – player, favourites, search, sleep timer
- `songs.js` – **the song list (the only file you edit for new uploads)**
- `logo.png` – Tune Hub logo

## Add a new song
1. Open `songs.js`.
2. Copy one song line and paste it at the top of the `songs:` list.
3. Change `id` to the 11 characters after `watch?v=` in the YouTube link, and set `name`, `line` and `moods` (`romantic`, `sad`, `rain`, `healing`).
4. Remove `isNew: true` from the previous newest song.

The "All videos on the channel" section updates by itself from YouTube, so new uploads show there even before you edit `songs.js`.

## Put it online (free)
Upload this whole folder to any static host. Easiest options:
- **Netlify Drop**: go to app.netlify.com/drop and drag this folder in.
- **GitHub Pages**: create a repository, upload the files, then Settings → Pages → deploy from `main`.
- **Cloudflare Pages**: upload the folder as a new project.

Note: YouTube videos only play when the site is opened through `http://` or `https://` (a web host or local server), not by double-clicking `index.html`.
