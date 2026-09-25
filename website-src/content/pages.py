"""Content for standalone pages: about, capabilities, process, FAQ, resources, testimonials, portfolio."""

USPS = [
    {"icon": "clock", "title": "Quotes in 24 hours, print in days", "text": "Costed proposals within one working day. Digital print in 24–72 hours, packaging in 7–10 working days after artwork approval."},
    {"icon": "shield", "title": "Export-grade quality control", "text": "Colour-managed presses, Pantone matching, tested board grades and a documented quality process so your reorders match the first run."},
    {"icon": "layers", "title": "Everything under one roof", "text": "Structural design, prepress, offset and digital printing, die-cutting, finishing, gluing and delivery. One supplier, one point of accountability."},
    {"icon": "sample", "title": "Free dielines and samples", "text": "We create your dieline and supply a white sample before you commit, and a printed proof before we run the job."},
    {"icon": "leaf", "title": "Sustainable materials", "text": "FSC-certified board, water-based and low-migration inks, plastic-free options and recycled stocks on request."},
    {"icon": "truck", "title": "Island-wide delivery", "text": "Daily deliveries across Colombo and the Western Province, scheduled routes to BOI zones, the south, Kandy and beyond."},
]

CAPABILITIES = {
    "intro": "A modern print and packaging plant in Colombo with capacity for national brands and the flexibility for start-ups.",
    "groups": [
        {"title": "Prepress & design", "items": [
            "In-house structural design team, ArtiosCAD dielines",
            "Computer-to-plate (CTP) with colour management",
            "Contract colour proofing and physical white samples",
            "3D renders and plotter-cut mock-ups",
        ]},
        {"title": "Printing", "items": [
            "Sheet-fed offset presses, 4 and 5 colour, up to B1 (700 × 1000 mm)",
            "Production digital presses up to SRA3+ and 1.2 m banner sheets",
            "Digital label press for roll labels",
            "Flexographic printing for corrugated and paper bags",
            "Large-format eco-solvent and UV printers up to 3.2 m",
        ]},
        {"title": "Finishing & converting", "items": [
            "Thermal and wet lamination, aqueous and UV coating, spot UV",
            "Hot foil stamping, embossing and debossing",
            "Automatic die-cutting and stripping",
            "Folder-gluers for straight-line, crash-lock and 4/6-corner boxes",
            "Window patching",
            "Folding, saddle stitching, perfect (PUR) binding, case binding, wire-o",
            "Rigid box assembly line and hand finishing",
        ]},
        {"title": "Corrugated", "items": [
            "3-ply and 5-ply board, B/C/E/BC flute",
            "RSC, die-cut mailers, litho-laminated cartons, inserts",
            "ECT, BCT and bursting strength testing",
        ]},
        {"title": "Quality & compliance", "items": [
            "Documented quality management system aligned with ISO 9001 practices",
            "Food-contact materials with declarations of compliance",
            "Barcode verification, colour density control, 100% count on pharma",
            "Retained samples and job traceability",
        ]},
        {"title": "Logistics", "items": [
            "Own delivery fleet for Colombo and the Western Province",
            "Scheduled routes to BOI zones, Kandy, Galle, Negombo and Kurunegala",
            "Export packing, palletising and freight-forwarder coordination",
            "Branch-wise packing and distribution for multi-outlet clients",
        ]},
    ],
    "certs": ["FSC-certified paper and board available", "Food-safe, low-migration ink systems", "GS1 barcode compliance", "Registered supplier to leading exporters, banks and hospitality groups"],
}

PROCESS = [
    {"step": "1", "title": "Brief", "text": "Tell us what you need on the quote form, WhatsApp or a call. Product dimensions, quantity and a reference are enough to start."},
    {"step": "2", "title": "Proposal in 24 hours", "text": "You receive a costed proposal at up to three quantities with material and finish recommendations."},
    {"step": "3", "title": "Dieline & sample", "text": "For packaging we create the dieline free and send a white sample to test fit. For print we confirm sizes and stocks."},
    {"step": "4", "title": "Artwork & proof", "text": "Send your artwork or let our designers create it. We preflight, then send a soft proof or physical proof for approval."},
    {"step": "5", "title": "Production", "text": "Printing, finishing, die-cutting, gluing and quality checks in our plant, with progress updates."},
    {"step": "6", "title": "Delivery", "text": "Packed, labelled and delivered island-wide, or export-packed for your forwarder. Files archived for easy reorders."},
]

TESTIMONIALS = [
    {"quote": "Our tea cartons for the Gulf market have been consistent across four reorders and the samples arrived within two days of the brief.", "name": "Export Manager", "org": "Ceylon tea exporter, Colombo"},
    {"quote": "They turned our annual report around in eight days including a late set of financial pages. The board dummy made sign-off simple.", "name": "Head of Corporate Communications", "org": "Listed finance company"},
    {"quote": "We started with 200 mailer boxes for our Instagram store and now order 5,000 a quarter. Same team, same quality.", "name": "Founder", "org": "Direct-to-consumer skincare brand"},
]

# NOTE: these are placeholder descriptions – replace with real client names and photos when ready.
PORTFOLIO = [
    {"title": "Premium tea gift range", "tag": "Rigid boxes · Foil · Inserts", "industry": "tea-exporters", "shape": "box"},
    {"title": "Export spice carton series", "tag": "Folding cartons · Window patch", "industry": "food-beverage", "shape": "carton"},
    {"title": "Skincare launch packaging", "tag": "Unit cartons · Soft touch · Labels", "industry": "cosmetics-ayurveda", "shape": "tube"},
    {"title": "E-commerce mailer programme", "tag": "Corrugated mailers · Inside print", "industry": "ecommerce-retail", "shape": "mailer"},
    {"title": "Integrated annual report", "tag": "Perfect bound · 160 pages", "industry": "corporate-finance", "shape": "book"},
    {"title": "Resort collateral suite", "tag": "Menus · Compendiums · Signage", "industry": "hotels-hospitality", "shape": "menu"},
    {"title": "Pharma carton line", "tag": "Braille · Batch coding", "industry": "pharmaceutical-healthcare", "shape": "carton"},
    {"title": "Apparel hang tags for EU buyer", "tag": "Tags · Variable barcodes", "industry": "apparel-garment", "shape": "tag"},
    {"title": "Property launch campaign", "tag": "Brochures · Hoardings · Standees", "industry": "real-estate-construction", "shape": "banner"},
]

FAQS = [
    ("What areas of Sri Lanka do you serve?", "We are based in Colombo and deliver island-wide, with daily routes across the Western Province and scheduled deliveries to BOI zones, Kandy, Galle, Negombo, Kurunegala and other major cities. Export orders are packed for your freight forwarder."),
    ("What is your minimum order quantity?", "It depends on the product. Digital print starts from a single piece, business cards from 100, labels from 250, folding cartons from 50 (digital) or 500 (offset), rigid boxes from 100 and corrugated mailers from 100."),
    ("How quickly can you deliver?", "Digital print in 24–72 hours, offset print in 5–7 working days and packaging in 7–10 working days after artwork approval. Rush service is available for many products."),
    ("Do you provide design services?", "Yes. Our in-house team handles structural design (dielines), packaging and label artwork, brochures and annual reports, and prepress checks on agency files."),
    ("How do I get a quote?", "Use the quote form, WhatsApp us or call. Share product dimensions or a reference, quantity and any finishes you have in mind. You will receive a costed proposal within one working day."),
    ("Can you match my brand colours exactly?", "Yes. We print Pantone spot colours and calibrate CMYK to industry targets. For critical colours we recommend a printed proof, which we provide before production."),
    ("Are your materials food safe and sustainable?", "We offer virgin food-grade board, low-migration inks, FSC-certified papers, recycled stocks and plastic-free finishes, with documentation for export."),
    ("Do you work with advertising agencies and resellers?", "Yes. We offer trade pricing, white-label delivery and dedicated account management for agencies, event companies and print brokers."),
    ("What file formats do you accept?", "Press-ready PDF (PDF/X-4 preferred), Adobe Illustrator, InDesign packages and Photoshop files. Every job receives a free preflight."),
    ("Can you store my files and reorder easily?", "Yes. Approved artwork and tooling are archived so reorders can be placed by email or WhatsApp in minutes."),
]

RESOURCES = [
    {"slug": "print-ready-checklist", "title": "Print-Ready Artwork Checklist", "type": "PDF · 1 page", "text": "The 12-point checklist our prepress team runs on every file. Give it to your designer and avoid reprints.", "file": "downloads/print-ready-artwork-checklist.pdf"},
    {"slug": "packaging-buyers-guide", "title": "Packaging Buyer's Guide for Sri Lankan Brands", "type": "PDF · 8 pages", "text": "Box styles, board grades, finishes, minimums and what drives cost, explained for marketing and procurement teams.", "file": "downloads/packaging-buyers-guide-sri-lanka.pdf"},
    {"slug": "dieline-templates", "title": "Standard Dieline Template Pack", "type": "PDF · 6 templates", "text": "Tuck-end, crash-lock, sleeve, mailer, pillow box and paper bag templates ready for your artwork.", "file": "downloads/dieline-templates.pdf"},
]
