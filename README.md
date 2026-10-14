# Won Ads website (Astro)

This folder builds wonads.com. You edit simple text files, Astro turns them into the website, and you upload the result to Hostinger. Visitors see a normal, fast HTML site.

## The three buttons

| Double-click | What it does |
|---|---|
| **edit.bat** | Opens a live preview at http://localhost:4321. Every time you save a file, the page reloads on its own. Use this while editing. |
| **build.bat** | Builds the finished website into the `dist` folder and opens that folder. |
| **preview.bat** | Shows the built `dist` folder at http://127.0.0.1:8766, exactly as it will behave on Hostinger. |

Use VS Code to edit files. If a build fails, the error says which file and line is wrong. Nothing reaches the live site until you upload.

## Where things are

```
src/
  data/
    services-data.js    ← categories, packages, service names and PRICES
    site.mjs            ← business details: phone, email, address, social links, founder
  content/
    services/<category>/<service>.md   ← text for each of the 90 service pages
    guides/<name>.md                   ← each guide (page address: /guide-<name>)
    pages/<name>.html + <name>.json    ← home, about, contact, category and info pages
  components/
    SiteFooter.astro       ← the footer used on almost every page
    EditorialHeader.astro  ← the header on guides and info pages
    ServiceHeader.astro    ← the header on service and category pages
public/                    ← images, video, CSS, JS (copied to the site unchanged)
```

These are generated automatically, so never edit them by hand: `sitemap.xml` (with dates), `llms.txt` (the summary for AI assistants), and all the schema (JSON-LD) on every page.

## Common tasks

### Change a price
Open `src/data/services-data.js` and change the price:
- a service: `['Local SEO','₹15,000/mo']`
- a package: `{name:'Growth', price:'₹35,000', suffix:'/mo', ...}`

The build updates it everywhere it's shown:
- the service page, including its Google description, where `{price}` stands for the current price
- the price cards on the home, services and category pages
- the "Packages from" figures
- the "related services" cards
- `llms.txt`

Two figures are typed in by hand and don't update: the "Starting from ₹7,500 / project" headline on the services page (`src/content/pages/services.html`) and the budget options on the contact form.

### Improve a service page (most important for SEO)
Open, for example, `src/content/services/seo/local-seo.md`:

```
---
title: "Local SEO Services in Chandigarh | Won Ads"   ← Google title (keep it under 60 characters)
description: "..."                                    ← Google description (under 160 characters; {price} = the current price)
intro: "..."                                          ← text under the big heading
includes:                                             ← "Scope to discuss" bullet points
  - "Service areas, local landing pages and business listings"
updated: "2026-09-28"                                 ← change to today's date when you edit
extraEyebrow: "A practical starting point"            ← small label above the extra section
extraTitle: "Local SEO for businesses customers can actually reach"
---
Write the unique content here, in Markdown:

### A sub-heading
A paragraph. **Bold**, *italic*, [a link](contact).

- a bullet point
```

Only 4 of the 90 service pages have this extra section today. Adding 400–800 words of real, specific content to each one is the biggest SEO improvement available. To add the section to a page that lacks it, add `extraEyebrow` and `extraTitle` lines to the top section, then write below the second `---`.

### Edit or add a guide
Guides are in `src/content/guides/`. Each `## Heading` becomes a section, and tables are written like this:
```
| Question | SEO | Google Ads |
|---|---|---|
| ... | ... | ... |
```
To add a guide, copy an existing file, rename it (for example `instagram-for-clinics.md` becomes `/guide-instagram-for-clinics`) and change the text. It's added to the sitemap and `llms.txt` automatically. Link to it from `src/content/pages/resources.html` so visitors can find it.

### Add a new service
1. In `src/data/services-data.js`, add `['New service name','₹10,000/mo']` to the right category's `items`.
2. Create `src/content/services/<category>/<new-service-name>.md`, by copying another service file. The file name is the service name in lowercase, with dashes instead of spaces and `&` written as `and`.

If the file is missing, the build stops and names the file it expects.

### Change phone, address, email or social links
Edit `src/data/site.mjs`. The schema on all 120 pages and `llms.txt` update. Visible text in the footer is in `src/components/SiteFooter.astro`. Add your LinkedIn, Facebook and Google Business Profile URLs to `sameAs`; this helps Google and AI tools recognise your business.

### Edit the home page or other pages
Page text is in `src/content/pages/<name>.html` and the Google title and description are in `<name>.json`. Lines like `<!-- @SiteFooter -->` insert the shared footer or header, so leave them in place.

## Accessibility and naming conventions

Every `<section>` has an `aria-label` (usually its heading text) and a descriptive class + id named `<page>-<topic>`, e.g. `local-seo-process`, `home-team`, `seo-faq`. Every `<div>` has a class; new ones are named `<block>__<role>` (e.g. `seo-process__items`, `won-footer__lead-heading`). The original design classes (e.g. `category-process`) are kept, because the CSS and scripts depend on them; the new names were **added alongside** them.

- **Service pages and guides:** added automatically by the templates. A guide's `## Heading` becomes the section's `aria-label`, class and id (e.g. `seo-or-google-ads-what-to-measure`).
- **When you add a section to an `.html` page,** follow the same pattern:
  ```html
  <section class="about-awards" id="about-awards" aria-label="Awards and recognition">
    <h2>Awards and recognition</h2>
    <div class="about-awards__list">…</div>
  </section>
  ```
- **Never remove or rename an existing class or id.** The design and scripts use them. Add new names instead.
- **Images:** every content image needs `alt` text describing what it shows (under 125 characters). Decorative images and logos next to the company name use `alt=""`.

## Publishing to Hostinger

### Automatic (recommended): push to GitHub
Every push to the `main` branch builds the site on GitHub and uploads only the changed files to Hostinger (`.github/workflows/deploy.yml`). It's live about 1–2 minutes later.

```
git add -A
git commit -m "Update Local SEO price"
git push
```
Follow progress on GitHub in the **Actions** tab: a green tick means it's live, a red cross means it failed (click it to see why; the live site stays as it was). This needs the FTP secrets set up once (see the comments at the top of `deploy.yml`). Purge the cache in hPanel if you don't see a change.

### Manual
1. Double-click **build.bat**.
2. Optional: double-click **preview.bat** and check the site.
3. In Hostinger **hPanel → Websites → File Manager → public_html**, upload **everything inside** the `dist` folder (not the folder itself) and overwrite when asked. FileZilla over FTP works too.
4. **Do not delete** other files in `public_html`, especially **`.htaccess`**: it makes clean URLs like `/services` work. `dist` contains no `.htaccess`, so uploading never replaces it.
5. If pages changed, resubmit `https://wonads.com/sitemap.xml` in Google Search Console and Bing Webmaster Tools.

**First time on a new hosting account:** upload `hostinger/.htaccess` into `public_html` (or create a file named `.htaccess` there and paste its contents). Without it, only the home page works and every other page returns "404 Not Found". If `public_html` already has a `.htaccess` with other rules, paste these rules at the top instead of replacing it.

## If something goes wrong
- **Build fails:** read the red error. It usually names the file and line, often a missing `"` in a `.md` file's top section.
- **Page looks broken in the preview:** undo your last change (Ctrl+Z in VS Code) and save.
- **First run on a new computer:** install Node.js (LTS) from nodejs.org. The `.bat` files install everything else.
