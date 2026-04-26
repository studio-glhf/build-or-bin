# Build or Bin

A local-first founder idea filter for deciding whether to **build**, **prototype**, **monitor**, **park**, or **kill** a product idea before it eats your week.

**Live demo:** https://studio-glhf.github.io/build-or-bin/

## Why

Most idea evaluation tools are either:
- too vague to be useful,
- too enterprise to feel fast,
- or too AI-dependent to trust with your raw thinking.

Build or Bin is intentionally simple:
- frontend-only
- works on GitHub Pages
- stores data locally in your browser
- gives you a sharper decision, not a longer workflow

## Features

- guided product idea intake
- six-factor reality score
- explicit red-flag kill conditions
- verdict engine: Build Now / Prototype / Monitor / Park / Kill
- exportable summary
- save and reload idea snapshots
- local-first persistence via `localStorage`

## Run locally

Because this is a static app, you can open `index.html` directly, or serve it:

```bash
python3 -m http.server 4173
```

Then visit <http://localhost:4173/build-or-bin/> if served from the workspace root, or <http://localhost:4173/> if served from the project directory.

## Publish on GitHub Pages

1. Push this folder to a GitHub repository.
2. In GitHub, enable Pages from the default branch root.
3. Your app will be served as a static site, no backend required.

## Roadmap

- richer scoring rationale
- comparison view for multiple ideas
- portfolio mode
- better export formats
- cleaner landing/demo storytelling for organic GitHub discovery

## License

MIT
