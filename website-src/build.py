#!/usr/bin/env python3
"""
Static site generator for the printing & packaging website.

    python3 build.py            # builds ../website/
    python3 build.py --out DIR  # custom output folder

Everything is plain HTML/CSS/JS on output: host it on GitHub Pages, Netlify,
Cloudflare Pages, cPanel or any web server.
"""
import argparse, datetime, html, json, os, shutil, sys, time
from urllib.parse import quote

from jinja2 import Environment, FileSystemLoader, select_autoescape

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from config import SITE
from content.services import SERVICES, SERVICE_BY_SLUG
from content.industries import INDUSTRIES, INDUSTRY_BY_SLUG
from content.blog import POSTS
from content.pages import USPS, CAPABILITIES, PROCESS, TESTIMONIALS, PORTFOLIO, FAQS, RESOURCES
from content.icons import icon

HERE = os.path.dirname(os.path.abspath(__file__))
TODAY = datetime.date.today().isoformat()
YEAR = datetime.date.today().year
BUILD_ID = str(int(time.time()))[-6:]

env = Environment(loader=FileSystemLoader(os.path.join(HERE, "templates")), autoescape=select_autoescape(["html"]), trim_blocks=True, lstrip_blocks=True)

WA_TEXT = quote("Hi! I'd like a quote for printing / packaging. ")

def base_url(): return SITE["base_url"].rstrip("/") + SITE["site_root"].rstrip("/")
def absurl(path): return base_url() + "/" + path.lstrip("/")

def org_schema():
    s = SITE
    hours = [{"@type": "OpeningHoursSpecification", "dayOfWeek": h["days"], "opens": h["opens"], "closes": h["closes"]} for h in s["opening_hours_schema"]]
    return {
        "@context": "https://schema.org",
        "@type": ["Organization", "LocalBusiness", "ProfessionalService"],
        "@id": base_url() + "/#organization",
        "name": s["brand"], "legalName": s["legal_name"], "url": base_url() + "/",
        "logo": absurl("static/img/apple-touch-icon.png"), "image": absurl("static/img/og-image.png"),
        "description": s["description"], "foundingDate": s["founded"],
        "telephone": s["phone_tel"], "email": s["email"], "priceRange": "$$",
        "address": {"@type": "PostalAddress", "streetAddress": s["street"], "addressLocality": s["city"], "addressRegion": s["district"], "postalCode": s["postal"], "addressCountry": s["country_code"]},
        "geo": {"@type": "GeoCoordinates", "latitude": s["geo_lat"], "longitude": s["geo_lng"]},
        "openingHoursSpecification": hours,
        "areaServed": [{"@type": "Country", "name": "Sri Lanka"}] + [{"@type": "City", "name": c} for c in s["areas_served"]],
        "sameAs": [v for v in s["social"].values() if v],
        "contactPoint": [{"@type": "ContactPoint", "telephone": s["phone_tel"], "contactType": "sales", "areaServed": "LK", "availableLanguage": ["English", "Sinhala", "Tamil"]}],
        "hasOfferCatalog": {"@type": "OfferCatalog", "name": "Printing and packaging services", "itemListElement": [
            {"@type": "Offer", "itemOffered": {"@type": "Service", "name": sv["name"], "url": absurl(f"services/{sv['slug']}/")}} for sv in SERVICES]},
    }

def faq_schema(faqs):
    return {"@context": "https://schema.org", "@type": "FAQPage", "mainEntity": [
        {"@type": "Question", "name": q, "acceptedAnswer": {"@type": "Answer", "text": a}} for q, a in faqs]}

def breadcrumb_schema(crumbs):
    return {"@context": "https://schema.org", "@type": "BreadcrumbList", "itemListElement": [
        {"@type": "ListItem", "position": i + 1, "name": c["name"], "item": c["abs"]} for i, c in enumerate(crumbs)]}

PAGES = []  # (path, priority, changefreq) for sitemap

def render(template, path, page, extra=None, crumbs=None, priority="0.7", changefreq="monthly"):
    """path: '' for home, 'services/', 'services/offset-printing/' ..."""
    depth = path.count("/")
    rel = "../" * depth
    canonical = absurl(path)
    ctx = {
        "site": SITE, "page": page, "rel": rel, "canonical": canonical, "abs": absurl, "ic": icon,
        "services": SERVICES, "industries": INDUSTRIES, "service_by": SERVICE_BY_SLUG, "industry_by": INDUSTRY_BY_SLUG,
        "posts": POSTS, "usps": USPS, "process": PROCESS, "testimonials": TESTIMONIALS, "resources": RESOURCES,
        "faqs": FAQS, "portfolio": PORTFOLIO, "capabilities": CAPABILITIES, "year": YEAR, "build_id": BUILD_ID,
        "wa_text": WA_TEXT, "org_schema": org_schema(),
    }
    if crumbs:
        full = [{"name": "Home", "href": rel, "abs": absurl("")}] + [dict(c, href=rel + c["path"], abs=absurl(c["path"])) for c in crumbs]
        ctx["breadcrumbs"] = full
        ctx["breadcrumb_schema"] = breadcrumb_schema(full)
    if extra: ctx.update(extra)
    out = env.get_template(template).render(**ctx)
    target = os.path.join(OUT, path, "index.html") if path != "404.html" else os.path.join(OUT, "404.html")
    os.makedirs(os.path.dirname(target), exist_ok=True)
    with open(target, "w", encoding="utf-8") as f: f.write(out)
    if path != "404.html" and not page.get("noindex"):
        PAGES.append((path, priority, changefreq))

def html_list(items): return "<ul class=\"ticks\">" + "".join(f"<li>{icon('check','ic sm')} {html.escape(i)}</li>" for i in items) + "</ul>"

def about_html():
    s = SITE
    return f"""
<h2>Who we are</h2>
<p>{html.escape(s['brand'])} is a family-run printing and packaging company in {html.escape(s['city'])}, Sri Lanka, founded in {s['founded']}. We started as a commercial offset printer serving Colombo businesses and have grown into a full packaging manufacturer supplying tea exporters, apparel factories, FMCG brands, pharmaceutical companies, banks, hotels and a new generation of online brands.</p>
<h2>What makes us different</h2>
{html_list([u['title'] + '. ' + u['text'] for u in USPS])}
<h2>Our values</h2>
<p><strong>Say what we will do, then do it.</strong> A quote within one working day, a delivery date we keep, a colour that matches the proof.</p>
<p><strong>Make it easy.</strong> Free dielines and samples, files archived for reorders, WhatsApp for quick answers, one account manager who knows your job.</p>
<p><strong>Print responsibly.</strong> FSC-certified board, water-based inks, waste board recycled, plastic-free options for every product.</p>
<h2>Who we serve</h2>
<p>Customers across Sri Lanka, from start-ups ordering their first 100 boxes to exporters shipping containers every month. See our <a href="../industries/">industry pages</a> for the sectors we know best, or <a href="../capabilities/">our capabilities</a> for the machinery behind the promises.</p>
"""

def capabilities_html():
    parts = [f"<p class=\"lead\">{html.escape(CAPABILITIES['intro'])}</p>"]
    for g in CAPABILITIES["groups"]:
        parts.append(f"<h2>{html.escape(g['title'])}</h2>" + html_list(g["items"]))
    parts.append("<h2>Quality, certifications and compliance</h2>" + html_list(CAPABILITIES["certs"]))
    parts.append("<h2>Capacity</h2><p>Two-shift production with the capacity to run monthly carton programmes for national brands alongside same-week digital jobs. Ask for a plant visit: we are happy to show procurement and quality teams around.</p>")
    return "\n".join(parts)

def process_html():
    out = ["<ol class=\"steps\">"]
    for p in PROCESS:
        out.append(f"<li><span class=\"step-n\">{p['step']}</span><h3>{html.escape(p['title'])}</h3><p>{html.escape(p['text'])}</p></li>")
    out.append("</ol>")
    out.append("<h2>What we need from you</h2>" + html_list(["Product dimensions or a physical sample (for packaging)", "Quantity, or a few quantities to compare", "Deadline and delivery address", "Artwork files or brand guidelines, or a brief for our designers", "Any compliance needs: food contact, export markets, buyer specifications"]))
    out.append("<h2>Reorders</h2><p>Approved artwork, dielines and cutting dies are archived under your account. To reorder, WhatsApp or email the job name and quantity. No new setup, same colour, faster delivery.</p>")
    return "\n".join(out)

def privacy_html():
    s = SITE
    return f"""
<p>This policy explains how {html.escape(s['legal_name'])} ("we") handles personal information collected through this website.</p>
<h2>What we collect</h2><p>When you request a quote, download a resource or contact us, we collect the details you provide: name, company, phone number, email address and the details of your enquiry. We also collect standard analytics data (pages visited, device type, approximate location) through cookies if analytics is enabled.</p>
<h2>How we use it</h2><p>To respond to your enquiry, prepare quotations and samples, deliver downloads you requested, and send occasional updates about our services. You can unsubscribe from marketing emails at any time.</p>
<h2>Sharing</h2><p>We do not sell personal data. We use trusted service providers (form processing, email, analytics) who process data on our behalf. Data may be processed outside Sri Lanka by those providers.</p>
<h2>Retention and your rights</h2><p>Enquiry data is kept while we have a business relationship and for a reasonable period afterwards. You may ask us to access, correct or delete your data by emailing <a href="mailto:{s['email']}">{s['email']}</a>.</p>
<h2>Contact</h2><p>{html.escape(s['legal_name'])}, {html.escape(s['street'])}, {html.escape(s['city'])}, {html.escape(s['country'])}.</p>
"""

def build():
    global OUT
    if os.path.isdir(OUT): shutil.rmtree(OUT)
    os.makedirs(OUT)
    shutil.copytree(os.path.join(HERE, "static"), os.path.join(OUT, "static"))

    # ---- Home
    home_schema = {"@context": "https://schema.org", "@type": "WebSite", "name": SITE["brand"], "url": base_url() + "/", "publisher": {"@id": base_url() + "/#organization"}}
    render("home.html", "", {"id": "home", "title": f"{SITE['brand']} | {SITE['tagline']}", "no_brand_suffix": True,
        "meta": "Printing and packaging company in Colombo, Sri Lanka: custom printed boxes, corrugated cartons, labels, brochures and signage. Quotes in 24 hours.",
        "keywords": ["printing company Sri Lanka", "packaging company Sri Lanka", "printing services Colombo", "box printing Sri Lanka", "label printing Sri Lanka", "packaging manufacturer Sri Lanka"],
        "schema": [home_schema, faq_schema(FAQS[:6])]}, priority="1.0", changefreq="weekly")

    # ---- Services
    render("listing.html", "services/", {"id": "services", "kind": "services", "eyebrow": "Services", "h1": "Printing & packaging services in Sri Lanka",
        "title": "Printing & Packaging Services in Sri Lanka",
        "meta": "Custom boxes, corrugated cartons, labels, rigid gift boxes, offset and digital printing, brochures, stationery, signage and design from one Colombo plant.",
        "intro": "Thirteen services, one supplier. Every product below is designed, printed, finished and delivered by our own team.",
        "body": ["We combine a commercial printing press and a packaging factory under one roof, so a brand can source its retail cartons, shipping boxes, labels, brochures and signage from one accountable partner. That means one artwork approval, consistent colour across every item and one delivery.",
                 "Not sure which service fits? Send us the product or the brief and we will recommend the right structure, material and print method with pricing at several quantities."]},
        crumbs=[{"name": "Services", "path": "services/"}], priority="0.9", changefreq="monthly")
    for s in SERVICES:
        schema = [{"@context": "https://schema.org", "@type": "Service", "name": s["name"], "serviceType": s["name"], "description": s["meta"], "url": absurl(f"services/{s['slug']}/"),
                   "provider": {"@id": base_url() + "/#organization"}, "areaServed": {"@type": "Country", "name": "Sri Lanka"},
                   "hasOfferCatalog": {"@type": "OfferCatalog", "name": s["name"], "itemListElement": [{"@type": "Offer", "itemOffered": {"@type": "Service", "name": b}} for sec in s["sections"] if sec.get("bullets") for b in sec["bullets"][:6]]}},
                  faq_schema(s["faqs"])]
        render("service.html", f"services/{s['slug']}/", {"id": f"service-{s['slug']}", "title": s["title"], "meta": s["meta"], "keywords": s["keywords"], "schema": schema},
               extra={"s": s}, crumbs=[{"name": "Services", "path": "services/"}, {"name": s["name"], "path": f"services/{s['slug']}/"}], priority="0.9")

    # ---- Industries
    render("listing.html", "industries/", {"id": "industries", "kind": "industries", "eyebrow": "Industries", "h1": "Packaging and print solutions by industry",
        "title": "Industries We Serve | Packaging & Print, Sri Lanka",
        "meta": "Packaging and printing for tea exporters, apparel, food and FMCG, pharma, cosmetics, hotels, e-commerce, banks, education and real estate in Sri Lanka.",
        "intro": "Every sector has its own specifications, deadlines and compliance rules. These pages show what we produce for each and how we make it easier.",
        "body": ["From buyer tech packs in the apparel zones to AGM deadlines in Colombo boardrooms, we have learned the rhythms of each industry we serve. Choose your sector to see typical products, common challenges and how we solve them.",
                 "Don't see your industry? We almost certainly print for it. Send us a brief."]},
        crumbs=[{"name": "Industries", "path": "industries/"}], priority="0.8")
    for i in INDUSTRIES:
        schema = [{"@context": "https://schema.org", "@type": "Service", "name": f"Printing and packaging for {i['name']}", "description": i["meta"], "url": absurl(f"industries/{i['slug']}/"),
                   "provider": {"@id": base_url() + "/#organization"}, "audience": {"@type": "BusinessAudience", "name": i["name"]}, "areaServed": {"@type": "Country", "name": "Sri Lanka"}},
                  faq_schema(i["faqs"])]
        render("industry.html", f"industries/{i['slug']}/", {"id": f"industry-{i['slug']}", "title": i["title"], "meta": i["meta"], "schema": schema},
               extra={"i": i}, crumbs=[{"name": "Industries", "path": "industries/"}, {"name": i["name"], "path": f"industries/{i['slug']}/"}], priority="0.8")

    # ---- Static pages
    render("page.html", "about/", {"id": "about", "eyebrow": "About us", "h1": f"About {SITE['brand']}", "title": f"About {SITE['brand']} | Printing Company, Colombo",
        "meta": f"{SITE['brand']} is a printing and packaging company in Colombo, Sri Lanka, founded in {SITE['founded']}. The team behind export-grade cartons, labels and print.",
        "intro": "A Colombo print and packaging plant with the mindset of a partner: honest quotes, kept deadlines and colour that matches.", "html": about_html(),
        "schema": {"@context": "https://schema.org", "@type": "AboutPage", "name": f"About {SITE['brand']}", "url": absurl("about/"), "mainEntity": {"@id": base_url() + "/#organization"}}},
        crumbs=[{"name": "About", "path": "about/"}], priority="0.6")
    render("page.html", "capabilities/", {"id": "capabilities", "eyebrow": "Capabilities", "h1": "Capabilities, machinery and quality", "title": "Printing & Packaging Capabilities & Machinery",
        "meta": "Our Colombo plant: 4 and 5 colour offset to B1, digital presses, label press, flexo, large format to 3.2 m, foil, embossing, die-cutting and binding.",
        "intro": "The machinery, finishing and quality systems behind every promise on this website.", "html": capabilities_html()},
        crumbs=[{"name": "Capabilities", "path": "capabilities/"}], priority="0.7")
    render("page.html", "process/", {"id": "process", "eyebrow": "How we work", "h1": "From brief to delivery in six steps", "title": "How We Work | Print & Packaging Ordering Process",
        "meta": "How to order printing and packaging from us: brief, 24-hour proposal, free dieline and sample, proof approval, production and island-wide delivery.",
        "intro": "A clear process so you always know what happens next.", "html": process_html(),
        "schema": {"@context": "https://schema.org", "@type": "HowTo", "name": "How to order printed packaging", "step": [{"@type": "HowToStep", "name": p["title"], "text": p["text"]} for p in PROCESS]}},
        crumbs=[{"name": "How we work", "path": "process/"}], priority="0.5")
    render("page.html", "faq/", {"id": "faq", "eyebrow": "FAQ", "h1": "Frequently asked questions", "title": "FAQ | Printing & Packaging in Sri Lanka",
        "meta": "Answers to common questions about minimum orders, turnaround, delivery areas, design services, file formats, colour matching and sustainable materials.",
        "intro": "Quick answers about ordering print and packaging in Sri Lanka.", "html": "<p>If your question is not answered below, WhatsApp or call us and a specialist will help.</p>", "faqs": FAQS, "schema": faq_schema(FAQS)},
        crumbs=[{"name": "FAQ", "path": "faq/"}], priority="0.6")
    render("page.html", "privacy/", {"id": "privacy", "eyebrow": "Legal", "h1": "Privacy policy", "title": "Privacy Policy", "meta": f"How {SITE['brand']} collects and uses personal information submitted through this website.", "html": privacy_html(), "robots": "noindex, follow", "noindex": True},
        crumbs=[{"name": "Privacy", "path": "privacy/"}])
    render("portfolio.html", "portfolio/", {"id": "portfolio", "h1": "Our work", "title": "Our Work | Packaging & Print Portfolio",
        "meta": "Examples of packaging and print produced for tea, food, cosmetics, pharma, apparel, hospitality, finance and e-commerce brands in Sri Lanka.",
        "intro": "A selection of the kind of work leaving our plant every week. Filter by industry."},
        crumbs=[{"name": "Our work", "path": "portfolio/"}], priority="0.6")
    render("resources.html", "resources/", {"id": "resources", "h1": "Free guides, checklists and dieline templates", "title": "Free Packaging Guides & Dieline Templates",
        "meta": "Download free packaging resources: print-ready artwork checklist, packaging buyer's guide for Sri Lankan brands and standard dieline templates.",
        "intro": "Practical tools from our prepress and packaging teams. Free to download."},
        crumbs=[{"name": "Resources", "path": "resources/"}], priority="0.7")
    render("quote.html", "quote/", {"id": "quote", "h1": "Request a printing or packaging quote", "title": "Request a Quote | Printing & Packaging Prices",
        "meta": "Get a costed proposal for printed boxes, labels, brochures or signage within one working day. Use the instant box price estimator for a ballpark figure.",
        "intro": "Costed proposal within one working day, free dieline and sample for packaging."},
        crumbs=[{"name": "Request a quote", "path": "quote/"}], priority="0.9", changefreq="weekly")
    render("contact.html", "contact/", {"id": "contact", "h1": f"Contact {SITE['brand']}", "title": "Contact Us | Printing Company in Colombo, Sri Lanka",
        "meta": f"Contact {SITE['brand']} in Colombo: phone, WhatsApp, email and directions to our printing and packaging plant. Island-wide delivery across Sri Lanka.",
        "intro": "Talk to a print or packaging specialist. We reply within one working day.",
        "schema": {"@context": "https://schema.org", "@type": "ContactPage", "name": "Contact", "url": absurl("contact/"), "mainEntity": {"@id": base_url() + "/#organization"}}},
        crumbs=[{"name": "Contact", "path": "contact/"}], priority="0.8")
    render("thankyou.html", SITE["thank_you_path"], {"id": "thank-you", "title": "Thank you", "meta": "Your request has been received.", "robots": "noindex, nofollow", "noindex": True})
    render("404.html", "404.html", {"id": "404", "title": "Page not found", "meta": "The page you requested could not be found.", "robots": "noindex, nofollow", "noindex": True})

    # ---- Blog
    for p in POSTS:
        p["date_h"] = datetime.date.fromisoformat(p["date"]).strftime("%-d %b %Y")
    render("blog_index.html", "blog/", {"id": "blog", "h1": "Printing & packaging guides for Sri Lankan brands", "title": "Printing & Packaging Guides for Sri Lankan Brands",
        "meta": "Practical guides on packaging costs in Sri Lanka, print-ready artwork, choosing box styles and tea packaging design from a Colombo printing company.",
        "intro": "Plain-language guides from our production team."}, crumbs=[{"name": "Guides", "path": "blog/"}], priority="0.7", changefreq="weekly")
    for p in POSTS:
        schema = {"@context": "https://schema.org", "@type": "Article", "headline": p["title"], "alternativeHeadline": p.get("seo_title", p["title"]), "description": p["meta"], "datePublished": p["date"], "dateModified": p["date"],
                  "author": {"@type": "Organization", "name": SITE["brand"], "url": base_url() + "/"}, "publisher": {"@id": base_url() + "/#organization"},
                  "image": absurl("static/img/og-image.png"), "mainEntityOfPage": absurl(f"blog/{p['slug']}/"), "articleSection": p["category"]}
        render("article.html", f"blog/{p['slug']}/", {"id": f"post-{p['slug']}", "title": p.get("seo_title", p["title"]), "meta": p["meta"], "og_type": "article", "schema": schema},
               extra={"p": p}, crumbs=[{"name": "Guides", "path": "blog/"}, {"name": p["title"], "path": f"blog/{p['slug']}/"}], priority="0.7")

    # ---- Sitemap, robots, manifest
    with open(os.path.join(OUT, "sitemap.xml"), "w", encoding="utf-8") as f:
        f.write('<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n')
        for path, pr, cf in PAGES:
            f.write(f"  <url><loc>{html.escape(absurl(path))}</loc><lastmod>{TODAY}</lastmod><changefreq>{cf}</changefreq><priority>{pr}</priority></url>\n")
        f.write("</urlset>\n")
    with open(os.path.join(OUT, "robots.txt"), "w") as f:
        f.write(f"User-agent: *\nAllow: /\nDisallow: /{SITE['thank_you_path']}\n\nSitemap: {absurl('sitemap.xml')}\n")
    with open(os.path.join(OUT, "site.webmanifest"), "w") as f:
        json.dump({"name": SITE["brand"], "short_name": SITE["brand_short"], "start_url": SITE["site_root"], "display": "browser", "background_color": "#ffffff", "theme_color": "#0f1b2d",
                   "icons": [{"src": "static/img/apple-touch-icon.png", "sizes": "180x180", "type": "image/png"}]}, f, indent=2)
    with open(os.path.join(OUT, ".nojekyll"), "w") as f: f.write("")
    print(f"Built {len(PAGES)} indexable pages (+ 404, thank-you) into {OUT}")

if __name__ == "__main__":
    ap = argparse.ArgumentParser(); ap.add_argument("--out", default=os.path.join(HERE, "..", "website"))
    OUT = os.path.abspath(ap.parse_args().out)
    build()
