"""
Site-wide configuration.  Edit this ONE file to rebrand the whole website,
then run `python3 build.py` from the website-src folder.
"""

SITE = {
    # ── Brand ──────────────────────────────────────────────────────────
    "brand": "PrintPack Lanka",                 # TODO: replace with your company name
    "brand_short": "PrintPack",
    "tagline": "Printing & Packaging Company in Sri Lanka",
    "legal_name": "PrintPack Lanka (Pvt) Ltd",  # TODO
    "founded": "2009",                          # TODO
    "description": (
        "PrintPack Lanka is a full-service printing and packaging company in Colombo, Sri Lanka. "
        "Offset and digital printing, custom printed boxes, corrugated cartons, labels, "
        "rigid gift boxes, brochures and large-format signage with fast turnaround and "
        "export-grade quality."
    ),

    # ── Domain / URLs (used for canonical tags, sitemap, Open Graph) ───
    "base_url": "https://www.printpacklanka.lk",   # TODO: your real domain, no trailing slash
    "site_root": "/",                              # keep "/" when served from the domain root

    # ── Contact (NAP – keep identical everywhere for local SEO) ───────
    "phone_display": "+94 11 234 5678",
    "phone_tel": "+94112345678",
    "whatsapp_number": "94771234567",           # digits only, international format
    "email": "hello@printpacklanka.lk",
    "street": "No. 120, Kandy Road",
    "city": "Colombo",
    "district": "Western Province",
    "postal": "01000",
    "country": "Sri Lanka",
    "country_code": "LK",
    "geo_lat": "6.9271",
    "geo_lng": "79.8612",
    "map_url": "https://maps.google.com/?q=Colombo,Sri+Lanka",
    "opening_hours_text": "Mon–Fri 8.30am–5.30pm, Sat 8.30am–1pm",
    "opening_hours_schema": [
        {"days": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"], "opens": "08:30", "closes": "17:30"},
        {"days": ["Saturday"], "opens": "08:30", "closes": "13:00"},
    ],

    # ── Social ────────────────────────────────────────────────────────
    "social": {
        "facebook": "https://www.facebook.com/",
        "instagram": "https://www.instagram.com/",
        "linkedin": "https://www.linkedin.com/company/",
        "youtube": "",
    },

    # ── Lead capture ──────────────────────────────────────────────────
    # Any form backend that accepts a POST with JSON works.  Formspree is the
    # zero-backend default: create a form at https://formspree.io and paste the
    # endpoint here.  Leave blank to fall back to WhatsApp + mailto only.
    "form_endpoint": "https://formspree.io/f/YOUR_FORM_ID",
    "thank_you_path": "thank-you/",

    # ── Analytics (leave blank to omit the snippet) ───────────────────
    "ga4_id": "",           # e.g. "G-XXXXXXXXXX"
    "meta_pixel_id": "",    # e.g. "1234567890"
    "google_site_verification": "",

    # ── Proof points shown on the site ────────────────────────────────
    "stats": [
        {"value": "15+", "label": "Years in print & packaging"},
        {"value": "1,200+", "label": "Brands and organisations served"},
        {"value": "48 hr", "label": "Digital print turnaround"},
        {"value": "ISO", "label": "Documented quality process"},
    ],
    "areas_served": [
        "Colombo", "Gampaha", "Kalutara", "Kandy", "Galle", "Negombo", "Kurunegala",
        "Katunayake", "Biyagama", "Jaffna", "Matara", "Ratnapura", "Anuradhapura",
    ],
}
