# Mase Consulting Group Homepage Deployment

This repository is the static homepage-only build for Hostinger.

## Hostinger Git settings

- Framework preset: Static / HTML / Other
- Build command: leave empty
- Output directory: repository root
- Start command: leave empty

## Required server secret

The contact form posts to:

```text
/api/submit.php
```

That PHP file requires:

```text
/api/config.php
```

Do not commit `api/config.php`. Create it on Hostinger with the live `RESEND_API_KEY`.

## Included runtime files

- `index.html`
- `styles.css`
- `main.js`
- `assets/`
- `api/submit.php`
- `robots.txt`
- `sitemap.xml`
- `site.webmanifest`
