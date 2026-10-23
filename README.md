# Adnan Alvi — terminal CV portfolio

A terminal-style single-page CV built with Vue 3 + Vite (plain JS, no UI libraries): profile header, an ASCII portrait that turns into the real photo on hover, a top nav and a **CV** checkbox (all sections on one page vs one section at a time).

Navigation: click the nav, press `1`-`6`, or `←`/`→` (`h`/`l`). The prompt at the bottom accepts `help`, `about`, `experience`, `skills`, `projects`, `contact`, `cv`, `clear`. On touch devices tap the portrait to toggle the photo.

## Run locally

```bash
npm install && npm run dev
```

Build and preview the production bundle:

```bash
npm run build
npm run preview
```

## Photo and ASCII portrait

1. Drop your photo at `public/images/profile-picture.png` (a transparent cutout: head, hair and shoulders with the background removed, ~600px wide). A flat-background `public/images/profile-picture.jpg` also works as a fallback for the ASCII step, but the hover image is the PNG. To cut out a photo: `pip install rembg onnxruntime`, then `rembg i photo.png public/images/profile-picture.png` (add `-a` for alpha matting).
2. Run `npm run ascii`: this reads that photo (using its transparency as the mask) and regenerates `src/ascii-portrait.js` (~70 columns).
3. Rebuild (`npm run build`, or just reload `npm run dev`).

If the photo is missing, the site still works (a plain placeholder is shown, no hover). Tuning flags: `npm run ascii -- --eq 0.6 --gamma 1.2 --floor 0.2 --tolerance 30` (`--eq` contrast spread, `--gamma` brightness, `--floor` minimum density for dark areas, `--tolerance` background removal, `--cols`, `--zoom`, `--keep-bg`).

## Edit content

**Everything lives in `src/content.js`**: name, tagline, about text, skills, experience, education, projects, links and email.

- Projects: add entries to the `projects` array (the placeholder is marked as such).
- Email: set `email` in `src/content.js`. It is hidden while empty.
- Theme colours: CSS variables at the top of `src/style.css`.
- No analytics or trackers are included.

## Deploy to GitHub Pages

The workflow `.github/workflows/deploy.yml` builds the site and deploys it on every push to `main`.

1. Create a repo named `<your-username>.github.io` (root-served, matching `base: '/'` in `vite.config.js`) and push this project to the `main` branch.
2. In the repo go to **Settings → Pages → Build and deployment → Source** and choose **GitHub Actions**.
3. Push to `main` (or run the workflow manually from the Actions tab). The site goes live at `https://<your-username>.github.io/`.

If you deploy to a project repo instead (`user.github.io/repo-name/`), change `base` in `vite.config.js` to `'/repo-name/'` and the favicon link in `index.html` accordingly.

A custom domain can be added under Settings → Pages (or add a `public/CNAME` file).

## Notes

`index.html` includes a Content-Security-Policy meta tag allowing only self-hosted scripts plus Google Fonts (Fira Code). If you add third-party scripts or embeds, update it.
