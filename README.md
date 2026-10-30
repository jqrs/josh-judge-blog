# Josh Judge

A Markdown blog built with Eleventy, featuring a responsive layout, accessible navigation, RSS, and a sitemap. Starter posts are example content and can be edited or removed before announcing the site.

## Write a post

Add `src/articles/your-post-slug.md` in GitHub or locally:

```markdown
---
title: Your post title
description: A short summary for the homepage and feed.
date: 2026-10-29
---
Write your article in Markdown here.

## A section

Paragraphs, [links](https://example.com), **bold**, and lists work.
```

The filename determines `/articles/your-post-slug/`. Posts appear newest first. Set `draft: true` to exclude a post from the site, feed, and sitemap. Draft source still exists in the repository. Edit `src/index.njk` for the homepage introduction and `src/_data/site.js` for site metadata. The public site has no admin credentials or browser editing; GitHub's file editor is the publishing interface.

## Local development

Requires Node.js 22 or later.

```sh
npm ci
npm run dev
```

Visit http://localhost:8788. Run `npm run check` for a production build and output/link checks. Build output goes to `dist/`.

## Cloudflare Pages: native Git integration

In [Cloudflare Workers & Pages](https://dash.cloudflare.com/?to=/:account/workers-and-pages), choose Create application → Pages → Connect to Git, authorize GitHub, and choose this repository.

| Setting | Value |
| --- | --- |
| Production branch | `main` |
| Framework preset | Eleventy (or None with explicit settings below) |
| Build command | `npm run build` |
| Build output directory | `dist` |
| Root directory | Leave blank |
| Environment variable | `NODE_VERSION` = `22` |
| Environment variable | `SITE_URL` = your production URL, without a trailing slash |

Choose Save and Deploy. Every subsequent push to main is built and published by Cloudflare. Branches receive preview deployments. No GitHub Actions deployment token is needed with this integration.

If `SITE_URL` is absent, builds use `CF_PAGES_URL`, falling back to `https://josh-judge-blog.pages.dev` locally. Set `SITE_URL` for a custom domain to keep canonical links, RSS, and the sitemap consistent. Add custom domains through the Pages project's Custom domains tab.

Security headers are declared in `src/_headers`. A real `404.html` ensures unknown paths receive the missing-page screen instead of a single-page application fallback.
