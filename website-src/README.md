# Printing & packaging website – source

A fast, SEO-focused, lead-generating static website for a printing and packaging company in Sri Lanka. Plain HTML, CSS and JavaScript on output; a small Python generator keeps 40+ pages consistent.

```
website-src/            ← edit here
  config.py             ← brand, contact details, domain, form endpoint, analytics IDs
  content/
    services.py         ← 13 service pages (copy, specs, FAQs, keywords)
    industries.py       ← 10 industry landing pages
    blog.py             ← guide articles
    pages.py            ← USPs, capabilities, process, testimonials, portfolio, FAQs, resources
    icons.py            ← inline SVG icon set
  templates/            ← Jinja2 templates (base layout, page types, macros)
  static/               ← css, js, images, downloadable PDFs
  build.py              ← generates ../website/
  make_assets.py        ← regenerates favicons + Open Graph image from config
  make_downloads.py     ← regenerates the three lead-magnet PDFs
website/                ← generated output: upload this folder to any host
```

## Rebrand in one file

Edit `config.py` (company name, phone, WhatsApp number, email, address, domain, opening hours, social links, stats) then run:

```bash
cd website-src
pip install jinja2 pillow          # once
python3 make_assets.py             # favicons + og-image.png with your name
python3 make_downloads.py          # PDFs with your name (needs Node + Playwright, optional)
python3 build.py                   # writes ../website
```

Copy updates to text live in `content/*.py`. Add a service or industry by appending a dictionary; the navigation, footer, sitemap, schema and internal links update automatically.

## Lead capture

- Every page carries a quote form (hero, sidebar or footer), a floating WhatsApp button and a sticky mobile call/WhatsApp/quote bar.
- Forms POST as JSON to `form_endpoint` in `config.py`. The default is a Formspree placeholder: create a free form at formspree.io and paste its endpoint. Any backend that accepts JSON (Netlify Forms, Basin, Web3Forms, your own API) works.
- If no endpoint is configured, submissions open a pre-filled WhatsApp chat so no lead is lost.
- Each submission includes the page it came from, the UTM parameters and referrer of the visit, and a `source` tag (e.g. `service-labels-stickers`, `industry-tea-exporters`, `lead-magnet`).
- Gated downloads on `/resources/` collect name, email and phone before the PDF starts.
- The box price estimator on `/quote/` gives a ballpark price and pre-fills the quote form. Tune the base prices in `static/js/main.js` (`base`, `sizeF`, `finishF`).
- Set `ga4_id` and/or `meta_pixel_id` to fire `generate_lead`, `click_call` and `click_whatsapp` events.

## SEO built in

Unique title and meta description per page; canonical URLs; Open Graph and Twitter cards; JSON-LD for Organization/LocalBusiness (NAP, geo, hours, areas served, offer catalog), Service, FAQPage, Article, HowTo, BreadcrumbList; semantic headings; internal linking between services, industries and guides; `sitemap.xml`; `robots.txt`; 404 page; no render-blocking frameworks; fonts loaded asynchronously; inline SVG icons.

Keyword targets: printing company Sri Lanka, packaging company Sri Lanka, printing services Colombo, box printing Sri Lanka, custom printed boxes Sri Lanka, corrugated boxes Sri Lanka, label printing Sri Lanka, rigid gift boxes Sri Lanka, brochure printing Sri Lanka, annual report printing Sri Lanka, paper bags Sri Lanka, tea packaging Sri Lanka and the industry variants.

## Deploy

The `website/` folder is fully static.

- **GitHub Pages (this repo)**: the existing workflow publishes the repository root, so the site is served at `https://<user>.github.io/<repo>/website/`. To serve it at the root instead, change `path: '.'` to `path: './website'` in `.github/workflows/static.yml`, or point a custom domain at Pages.
- **Netlify / Cloudflare Pages / Vercel**: publish directory `website`, no build command.
- **cPanel / shared hosting**: upload the contents of `website/` to `public_html`.

Set `base_url` in `config.py` to the live domain before the final build so canonical tags and the sitemap are correct.

## Launch checklist

1. Replace placeholder brand, address, phone, WhatsApp and email in `config.py`; rebuild.
2. Replace the placeholder testimonials, stats and portfolio captions in `content/pages.py` with real ones (add client photos to `static/img/` and reference them in the portfolio template).
3. Create the Formspree (or other) endpoint and test a submission from the live site.
4. Add GA4 and Meta Pixel IDs; verify the `generate_lead` event.
5. Submit `sitemap.xml` in Google Search Console and Bing Webmaster Tools; add the verification token to `google_site_verification`.
6. Create or claim the Google Business Profile with the identical name, address and phone (NAP) used in the footer.
7. Publish one new guide a month in `content/blog.py` targeting a buyer question (see the existing four for the pattern).
