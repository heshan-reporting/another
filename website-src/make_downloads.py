#!/usr/bin/env python3
"""Builds the three lead-magnet PDFs (HTML -> PDF via Playwright/Chromium). Run once; outputs are committed to static/downloads/."""
import os, sys, subprocess, json, html
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from config import SITE
HERE = os.path.dirname(os.path.abspath(__file__))
SRC = os.path.join(HERE, "downloads-src"); os.makedirs(SRC, exist_ok=True)
OUT = os.path.join(HERE, "static", "downloads"); os.makedirs(OUT, exist_ok=True)
B = SITE["brand"]; URL = SITE["base_url"].replace("https://", ""); PH = SITE["phone_display"]; EM = SITE["email"]

CSS = """
@page{size:A4;margin:16mm 16mm 18mm}
*{box-sizing:border-box}body{font-family:Inter,Arial,Helvetica,sans-serif;color:#22314a;font-size:10.5pt;line-height:1.5;margin:0}
h1{font-size:24pt;color:#0f1b2d;margin:0 0 4mm;line-height:1.15}h2{font-size:15pt;color:#0f1b2d;margin:8mm 0 2mm;border-bottom:2px solid #f26b1d;padding-bottom:1mm}
h3{font-size:11.5pt;color:#0f1b2d;margin:5mm 0 1.5mm}p{margin:0 0 3mm}ul{margin:0 0 3mm;padding-left:5mm}li{margin-bottom:1.2mm}
.brand{display:flex;align-items:center;gap:4mm;margin-bottom:6mm;border-bottom:1px solid #dfe4ec;padding-bottom:3mm}
.mark{width:11mm;height:11mm;border-radius:2mm;background:#f26b1d;position:relative}.mark::after{content:"";position:absolute;left:3mm;top:-2mm;width:9mm;height:9mm;border-radius:2mm;background:#0f1b2d}
.brand strong{font-size:13pt;color:#0f1b2d}.brand small{display:block;color:#7a8699;letter-spacing:.08em;text-transform:uppercase;font-size:7.5pt}
.tag{display:inline-block;background:#fff1e8;color:#d55a12;font-weight:700;font-size:8pt;letter-spacing:.08em;text-transform:uppercase;padding:1mm 3mm;border-radius:99px;margin-bottom:3mm}
.check{list-style:none;padding:0}.check li{display:flex;gap:3mm;align-items:flex-start;padding:2.2mm 0;border-bottom:1px dashed #dfe4ec}.check li::before{content:"";flex:none;width:5mm;height:5mm;border:1.5px solid #0f1b2d;border-radius:1.2mm;margin-top:.6mm}
.check b{display:block;color:#0f1b2d}
table{border-collapse:collapse;width:100%;margin:2mm 0 4mm;font-size:9.5pt}th,td{border:1px solid #dfe4ec;padding:1.8mm 2.5mm;text-align:left;vertical-align:top}th{background:#f4f6fa;color:#0f1b2d}
.box{background:#f4f6fa;border-radius:3mm;padding:4mm 5mm;margin:3mm 0}.cta{background:#0f1b2d;color:#fff;border-radius:3mm;padding:5mm 6mm;margin-top:6mm}.cta b{color:#ffb98a}.cta a{color:#fff}
.foot{position:fixed;bottom:-10mm;left:0;right:0;font-size:8pt;color:#7a8699;display:flex;justify-content:space-between}
.pb{page-break-before:always}.grid2{display:grid;grid-template-columns:1fr 1fr;gap:5mm}
.die{border:1px solid #dfe4ec;border-radius:3mm;padding:4mm;margin-bottom:5mm;page-break-inside:avoid}.die svg{width:100%;height:auto}.die h3{margin-top:0}
.legend{font-size:8.5pt;color:#7a8699}.legend span{display:inline-block;width:8mm;border-top:2px solid #0f1b2d;vertical-align:middle;margin:0 1.5mm 0 3mm}.legend span.c{border-top:2px dashed #f26b1d}.legend span.g{border-top:6px solid #e9edf3}
"""
def shell(title, body, subtitle=""):
    return f"""<!DOCTYPE html><html><head><meta charset="utf-8"><title>{html.escape(title)}</title><style>{CSS}</style></head><body>
<div class="brand"><div class="mark"></div><div><strong>{html.escape(B)}</strong><small>Printing &amp; Packaging · Sri Lanka</small></div></div>
{body}
<div class="cta"><b>Need it printed?</b> Send this to {html.escape(B)} for a costed proposal within one working day, with a free dieline and sample for packaging.<br>{html.escape(PH)} · {html.escape(EM)} · {html.escape(URL)}</div>
<div class="foot"><span>© {html.escape(B)} · Free resource, share freely</span><span>{html.escape(URL)}</span></div>
</body></html>"""

# 1. Checklist -------------------------------------------------------------
items = [
 ("Bleed", "Background colour and images extend 3 mm beyond the trim line on every side."),
 ("Safe zone", "Text, logos and barcodes sit at least 3–5 mm inside the trim line (10 mm on packaging folds)."),
 ("Resolution", "Images are 300 dpi at final size (150 dpi is acceptable for large-format print)."),
 ("Colour mode", "Everything is CMYK. Spot colours are named Pantone swatches. No RGB, no Lab."),
 ("Rich black", "Large black areas use C60 M40 Y40 K100. Small text and thin lines use K100 only."),
 ("Fonts", "All text converted to outlines, or fonts packaged with the file. Body text ≥ 6 pt, legal text ≥ 4 pt."),
 ("Dieline", "Artwork is placed on the printer's dieline on its own non-printing spot-colour layer, set to overprint."),
 ("Overprint", "Overprint preview checked. No white objects set to overprint. Knockouts where needed."),
 ("Barcodes", "EAN/UPC ≥ 80% magnification, quiet zones intact, dark bars on light background, verified."),
 ("Transparency", "Transparency and effects flattened or exported as PDF/X-4. No missing links."),
 ("Page setup", "Single pages in reading order, correct trim size, no marks inside the artwork area, spreads exported as single pages."),
 ("Export", "PDF/X-4 or PDF/X-1a, crop marks on, 3 mm bleed, fonts embedded, no security or passwords."),
]
body = '<span class="tag">Free checklist</span><h1>Print-Ready Artwork Checklist</h1><p>Tick every line before you send files to press. Nine out of ten delays happen in prepress, and this list prevents all of them.</p><ul class="check">'
body += "".join(f"<li><div><b>{i+1}. {html.escape(t)}</b>{html.escape(d)}</div></li>" for i, (t, d) in enumerate(items))
body += '</ul><h3>Packaging extras</h3><ul><li>Glue flaps are free of ink and varnish unless the printer confirms a glueable coating.</li><li>Artwork on adjacent panels reads correctly when folded; make a paper mock-up.</li><li>Window positions match the die; mandatory information fits the panel space.</li></ul>'
open(os.path.join(SRC, "checklist.html"), "w").write(shell("Print-Ready Artwork Checklist", body))

# 2. Buyer's guide ----------------------------------------------------------
g = '<span class="tag">Buyer\'s guide</span><h1>Packaging Buyer\'s Guide for Sri Lankan Brands</h1><p>A plain-language guide for marketing, procurement and founders who buy printed packaging: which structure to choose, what to specify, what drives cost, and how to brief a printer so the first run is right.</p>'
g += '<h2>1. The three families of boxes</h2><table><tr><th>Factor</th><th>Folding carton</th><th>Rigid box</th><th>Corrugated</th></tr><tr><td>Made from</td><td>250–450 gsm board, die-cut, glued, ships flat</td><td>1.5–3 mm greyboard wrapped in printed paper</td><td>Fluted board, 3-ply or 5-ply</td></tr><tr><td>Best for</td><td>Retail shelf: tea, cosmetics, pharma, food</td><td>Gifting, jewellery, premium tea, sets</td><td>Shipping, e-commerce, export, food delivery</td></tr><tr><td>Unit cost</td><td>Low</td><td>High</td><td>Low–medium</td></tr><tr><td>Minimum order</td><td>50 digital / 500 offset</td><td>100</td><td>100–500</td></tr><tr><td>Print</td><td>Excellent, any finish</td><td>Excellent, foil and textures</td><td>Flexo (good) or litho-laminated (excellent)</td></tr></table>'
g += '<h2>2. Choosing a folding carton style</h2><ul><li><b>Straight tuck end (STE):</b> both flaps tuck the same way. Cosmetics, pharma, electronics.</li><li><b>Reverse tuck end (RTE):</b> flaps tuck opposite ways, slightly cheaper. Everyday retail.</li><li><b>Crash-lock (auto) bottom:</b> base locks when opened. Heavier products, fast packing lines, bottles.</li><li><b>Sleeve and tray:</b> premium feel, easy to hand-pack. Tea, chocolates, gift sets.</li><li><b>Display / counter unit:</b> perforated tear-off front. Cash-and-carry and pharmacy counters.</li><li><b>Window carton:</b> PET or PLA window shows the product. Bakery, textiles, toys.</li></ul>'
g += '<h2>3. Board and material</h2><table><tr><th>Board</th><th>Use</th><th>Notes</th></tr><tr><td>FBB / SBS 250–350 gsm</td><td>Most retail cartons</td><td>White both sides, prints beautifully, food-safe virgin grades available</td></tr><tr><td>FBB 350–450 gsm</td><td>Heavier products, premium feel</td><td>Adds rigidity and cost</td></tr><tr><td>Duplex 250–400 gsm</td><td>Inner packs, budget cartons</td><td>Grey back, lower cost, not for food contact</td></tr><tr><td>Kraft 250–350 gsm</td><td>Natural / eco look</td><td>Brown, muted colours, pairs with one-colour print</td></tr><tr><td>E-flute corrugated</td><td>Cake boxes, pizza, mailers</td><td>Strong and light, print on white top liner</td></tr><tr><td>BC-flute 5-ply</td><td>Export master cartons</td><td>Specify ECT/BCT for freight</td></tr></table>'
g += '<h2>4. Finishes and what they cost</h2><ul><li><b>Aqueous / varnish:</b> low cost, light protection, matt or gloss.</li><li><b>Lamination:</b> scuff and moisture resistance; matt, gloss or soft-touch. Adds 10–20%.</li><li><b>Spot UV:</b> glossy highlights on a matt base. Adds a pass; economical at volume.</li><li><b>Hot foil:</b> gold, silver, holographic; needs a die. Premium signal.</li><li><b>Embossing / debossing:</b> raised or recessed logos; needs a die.</li><li><b>Window patching:</b> film applied inside the window; food-grade PLA available.</li></ul>'
g += '<h2 class="pb">5. What drives the price</h2><p>Print has high fixed costs (plates, make-ready, die) and low running costs, so unit price falls steeply with quantity. The five main levers:</p><ol><li><b>Quantity:</b> ask for prices at three quantities and pick the sweet spot.</li><li><b>Sheet utilisation:</b> a few millimetres can change how many boxes fit on a sheet.</li><li><b>Board weight and grade.</b></li><li><b>Colours:</b> CMYK is standard; each Pantone adds a plate; inside printing adds a pass.</li><li><b>Finishing:</b> each finish adds set-up and a machine pass.</li></ol><div class="box"><b>Typical 2026 ranges in Sri Lanka (4-colour, 300 gsm, excluding VAT):</b><br>Folding cartons LKR 25–120 · Labels LKR 2–20 · Corrugated mailers LKR 90–350 · Rigid boxes LKR 350–1,500. Real quotes depend on size, quantity and finish.</div>'
g += '<h2>6. Nine ways to cut cost without cutting quality</h2><ul><li>Order the annual quantity in two or three drops instead of monthly small runs.</li><li>Standardise box sizes across SKUs so one die serves many products.</li><li>Use CMYK plus one spot colour rather than three spot colours.</li><li>Print inside the box in one colour.</li><li>Use aqueous coating instead of lamination where scuffing is not an issue.</li><li>Drop 50 gsm if a crash-lock base gives the strength you need.</li><li>Ask about house-stock papers.</li><li>Approve artwork once, then reorder from archived files.</li><li>Launch on digital under 500 units, then switch to offset.</li></ul>'
g += '<h2>7. Compliance checklist</h2><ul><li><b>Food contact:</b> virgin board, low-migration inks, declaration of compliance for export.</li><li><b>Mandatory text:</b> product name, net weight, ingredients, origin, best-before, batch, manufacturer/importer, nutrition where required, SLS marks where applicable.</li><li><b>Barcodes:</b> GS1 EAN-13 on retail units, ITF-14 on shippers; verify before print.</li><li><b>Pharma:</b> NMRA-approved artwork, braille where required, batch/expiry areas, line clearance.</li><li><b>Tea:</b> Sri Lanka Tea Board Lion logo rules for pure Ceylon tea.</li><li><b>Sustainability claims:</b> only state FSC or recycled content if the material is certified.</li></ul>'
g += '<h2>8. How to brief a printer</h2><table><tr><th>Give</th><th>Why</th></tr><tr><td>Product dimensions or a sample</td><td>Determines the dieline and sheet utilisation</td></tr><tr><td>Quantity (or several)</td><td>Sets the print method and price curve</td></tr><tr><td>Deadline and delivery address</td><td>Schedules press time and freight</td></tr><tr><td>Reference images or competitor packs</td><td>Communicates the look faster than words</td></tr><tr><td>Artwork or brand guidelines</td><td>Lets prepress start immediately</td></tr><tr><td>Compliance needs</td><td>Food contact, export market, buyer spec</td></tr></table><h3>The process you should expect</h3><ol><li>Costed proposal within one working day</li><li>Free dieline and white sample to test fit</li><li>Artwork preflight and proof for approval</li><li>Production with quality checks</li><li>Delivery, files archived for reorder</li></ol>'
open(os.path.join(SRC, "buyers-guide.html"), "w").write(shell("Packaging Buyer's Guide for Sri Lankan Brands", g))

# 3. Dieline templates ----------------------------------------------------
def svg(w, h, content): return f'<svg viewBox="0 0 {w} {h}" xmlns="http://www.w3.org/2000/svg" font-family="Arial" font-size="9">{content}</svg>'
CUT='stroke="#0f1b2d" stroke-width="1.2" fill="none"'; CR='stroke="#f26b1d" stroke-width="1" stroke-dasharray="5 3" fill="none"'; GL='fill="#e9edf3" stroke="none"'
def tuck():  # L=120 W=60 D=40 (proportional)
    L,W,D=110,60,40; x=20; y=60; c=""
    c+=f'<rect x="{x}" y="{y}" width="{W+D+W+D+15}" height="{L}" {CUT}/>'  # body outline approx
    for i,pw in enumerate([W,D,W,D]):
        xx=x+sum([W,D,W,D][:i]); c+=f'<line x1="{xx+pw}" y1="{y}" x2="{xx+pw}" y2="{y+L}" {CR}/>'
    c+=f'<rect x="{x+W+D+W+D}" y="{y}" width="15" height="{L}" {GL}/><line x1="{x+W+D+W+D}" y1="{y}" x2="{x+W+D+W+D}" y2="{y+L}" {CR}/>'
    # top/bottom tuck flaps on panel 1 and 3, dust flaps on 2 and 4
    for px in (x, x+W+D):
        c+=f'<path d="M{px} {y} v-{D} q0 -12 12 -12 h{W-24} q12 0 12 12 v{D}" {CUT}/><line x1="{px}" y1="{y-D}" x2="{px+W}" y2="{y-D}" {CR}/><line x1="{px}" y1="{y}" x2="{px+W}" y2="{y}" {CR}/>'
        c+=f'<path d="M{px} {y+L} v{D} q0 12 12 12 h{W-24} q12 0 12 -12 v-{D}" {CUT}/><line x1="{px}" y1="{y+L+D}" x2="{px+W}" y2="{y+L+D}" {CR}/><line x1="{px}" y1="{y+L}" x2="{px+W}" y2="{y+L}" {CR}/>'
    for px in (x+W, x+W+D+W):
        c+=f'<path d="M{px+2} {y} v-{D-8} l{D-4} 0 v{D-8}" {CUT}/><line x1="{px}" y1="{y}" x2="{px+D}" y2="{y}" {CR}/>'
        c+=f'<path d="M{px+2} {y+L} v{D-8} l{D-4} 0 v-{D-8}" {CUT}/><line x1="{px}" y1="{y+L}" x2="{px+D}" y2="{y+L}" {CR}/>'
    c+=f'<text x="{x+W/2}" y="{y+L/2}" text-anchor="middle" font-size="8">FRONT<tspan x="{x+W/2}" dy="10">W × L</tspan></text><text x="{x+W+D/2}" y="{y+L/2}" text-anchor="middle" font-size="7">SIDE D</text><text x="{x+W+D+W/2}" y="{y+L/2}" text-anchor="middle" font-size="8">BACK</text><text x="{x+W+D+W+D/2}" y="{y+L/2}" text-anchor="middle" font-size="7">SIDE</text><text x="{x+W+D+W+D+7}" y="{y+L/2}" text-anchor="middle" font-size="6" transform="rotate(90 {x+W+D+W+D+7} {y+L/2})">GLUE</text>'
    return svg(300, 260, c)
def crash():
    L,W,D=100,60,40; x=20; y=70; c=""
    xs=[x, x+W, x+W+D, x+W+D+W]; ws=[W,D,W,D]
    for xx,pw in zip(xs,ws): c+=f'<rect x="{xx}" y="{y}" width="{pw}" height="{L}" {CR}/>'
    c+=f'<rect x="{x}" y="{y}" width="{W+D+W+D}" height="{L}" {CUT}/><rect x="{x+W+D+W+D}" y="{y}" width="14" height="{L}" {GL}/><path d="M{x+W+D+W+D} {y} h14 v{L} h-14" {CUT}/>'
    # top: tuck flap + dust flaps
    c+=f'<path d="M{x} {y} v-{D} q0 -10 10 -10 h{W-20} q10 0 10 10 v{D}" {CUT}/><line x1="{x}" y1="{y-D}" x2="{x+W}" y2="{y-D}" {CR}/>'
    c+=f'<path d="M{x+W+2} {y} v-{D-8} h{D-4} v{D-8}" {CUT}/><path d="M{x+W+D+W+2} {y} v-{D-8} h{D-4} v{D-8}" {CUT}/><path d="M{x+W+D} {y} v-{D-14} h{W} v{D-14}" {CUT}/>'
    # bottom crash-lock: angled flaps
    c+=f'<path d="M{x} {y+L} v{D*0.55} l{W*0.55} {D*0.35} h{W*0.45} v-{D*0.9}" {CUT}/><line x1="{x}" y1="{y+L}" x2="{x+W*0.55}" y2="{y+L+D*0.9}" {CR}/>'
    c+=f'<path d="M{x+W} {y+L} v{D*0.7} h{D} v-{D*0.7}" {CUT}/>'
    c+=f'<path d="M{x+W+D} {y+L} v{D*0.55} l{W*0.55} {D*0.35} h{W*0.45} v-{D*0.9}" {CUT}/><line x1="{x+W+D}" y1="{y+L}" x2="{x+W+D+W*0.55}" y2="{y+L+D*0.9}" {CR}/>'
    c+=f'<path d="M{x+W+D+W} {y+L} v{D*0.7} h{D} v-{D*0.7}" {CUT}/>'
    c+=f'<text x="{x+W/2}" y="{y+L/2}" text-anchor="middle" font-size="8">FRONT</text><text x="{x+W+D+W/2}" y="{y+L/2}" text-anchor="middle" font-size="8">BACK</text><text x="{x+W/2}" y="{y+L+D*0.6}" text-anchor="middle" font-size="6">crash-lock base</text>'
    return svg(300, 240, c)
def sleeve():
    L,W,D=120,80,30; x=20;y=40;c=""
    xs=[x,x+W,x+W+D,x+W+D+W]; ws=[W,D,W,D]
    c+=f'<rect x="{x}" y="{y}" width="{W+D+W+D}" height="{L}" {CUT}/>'
    for xx,pw in zip(xs,ws): c+=f'<line x1="{xx+pw}" y1="{y}" x2="{xx+pw}" y2="{y+L}" {CR}/>'
    c+=f'<rect x="{x+W+D+W+D}" y="{y}" width="14" height="{L}" {GL}/><path d="M{x+W+D+W+D} {y} h14 v{L} h-14" {CUT}/>'
    c+=f'<circle cx="{x+W/2}" cy="{y+L/2}" r="10" {CUT}/><text x="{x+W/2}" y="{y+L/2+30}" text-anchor="middle" font-size="7">optional thumb hole</text>'
    c+=f'<text x="{x+W+D+W/2}" y="{y+L/2}" text-anchor="middle" font-size="8">SLEEVE BACK</text><text x="{x+W/2}" y="{y+L-10}" text-anchor="middle" font-size="8">SLEEVE FRONT</text>'
    c+=f'<text x="{x}" y="{y+L+25}" font-size="8">Tray: separate blank, W × L × D with four glued or locked corners (request tray dieline).</text>'
    return svg(300, 200, c)
def mailer():
    L,W,D=110,80,35; x=60;y=50;c=""
    c+=f'<rect x="{x}" y="{y}" width="{W}" height="{L}" {CR}/><text x="{x+W/2}" y="{y+L/2}" text-anchor="middle" font-size="8">BASE</text>'
    c+=f'<rect x="{x}" y="{y-D}" width="{W}" height="{D}" {CR}/><text x="{x+W/2}" y="{y-D/2+3}" text-anchor="middle" font-size="7">back wall</text>'
    c+=f'<rect x="{x}" y="{y-D-L}" width="{W}" height="{L}" {CR}/><text x="{x+W/2}" y="{y-D-L/2}" text-anchor="middle" font-size="8">LID</text>'
    c+=f'<path d="M{x} {y-D-L} v-{D} h{W} v{D}" {CUT}/><line x1="{x}" y1="{y-D-L}" x2="{x+W}" y2="{y-D-L}" {CR}/><text x="{x+W/2}" y="{y-D-L-D/2+3}" text-anchor="middle" font-size="7">tuck flap</text>'
    c+=f'<rect x="{x}" y="{y+L}" width="{W}" height="{D}" {CR}/><text x="{x+W/2}" y="{y+L+D/2+3}" text-anchor="middle" font-size="7">front wall</text>'
    c+=f'<path d="M{x} {y+L+D} v{D-6} h{W} v-{D-6}" {CUT}/><text x="{x+W/2}" y="{y+L+D+D/2}" text-anchor="middle" font-size="7">inner front (folds in)</text>'
    for sx,sign in ((x-D,-1),(x+W,1)):
        c+=f'<rect x="{sx}" y="{y}" width="{D}" height="{L}" {CR}/><text x="{sx+D/2}" y="{y+L/2}" text-anchor="middle" font-size="6" transform="rotate(90 {sx+D/2} {y+L/2})">side wall</text>'
        c+=f'<path d="M{sx} {y} v-{D} h{D} v{D}" {CUT}/><path d="M{sx} {y+L} v{D} h{D} v-{D}" {CUT}/>'
        ex = sx-D+2 if sign<0 else sx+D-2
        c+=f'<path d="M{sx if sign>0 else sx+D} {y+4} h{sign*(D-6)} v{L-8} h{-sign*(D-6)}" {CUT}/>'
        c+=f'<rect x="{x-D-D+8 if sign<0 else x+W+D+2}" y="{y-D}" width="{D-10}" height="{D}" {CUT}/><rect x="{x-D-D+8 if sign<0 else x+W+D+2}" y="{y+L}" width="{D-10}" height="{D}" {CUT}/>'
    c+=f'<path d="M{x-D} {y-D-L} v{D} h{D}" {CUT}/><path d="M{x+W+D} {y-D-L} v{D} h-{D}" {CUT}/><rect x="{x-D}" y="{y-D-L}" width="{D}" height="{L}" {CR}/><rect x="{x+W}" y="{y-D-L}" width="{D}" height="{L}" {CR}/>'
    c+=f'<text x="{x-D/2}" y="{y-D-L/2}" text-anchor="middle" font-size="6" transform="rotate(90 {x-D/2} {y-D-L/2})">lid side</text><text x="{x+W+D/2}" y="{y-D-L/2}" text-anchor="middle" font-size="6" transform="rotate(90 {x+W+D/2} {y-D-L/2})">lid side</text>'
    c+=f'<rect x="{x-D}" y="{y-D-L}" width="{W+2*D}" height="{L+D+L+D+D}" fill="none" stroke="none"/>'
    return svg(300, 330, c)
def pillow():
    W,L=90,150; x=40;y=30;c=""
    c+=f'<rect x="{x}" y="{y}" width="{W}" height="{L}" {CR}/><rect x="{x+W}" y="{y}" width="{W}" height="{L}" {CR}/>'
    c+=f'<rect x="{x+2*W}" y="{y}" width="14" height="{L}" {GL}/><path d="M{x} {y} h{2*W+14} v{L} h-{2*W+14} z" {CUT}/>'
    for px in (x, x+W):
        c+=f'<path d="M{px} {y} q{W/2} 28 {W} 0" {CR}/><path d="M{px} {y+L} q{W/2} -28 {W} 0" {CR}/>'
        c+=f'<path d="M{px} {y} q{W/2} -30 {W} 0" {CUT}/><path d="M{px} {y+L} q{W/2} 30 {W} 0" {CUT}/>'
    c+=f'<text x="{x+W/2}" y="{y+L/2}" text-anchor="middle" font-size="8">FRONT</text><text x="{x+W+W/2}" y="{y+L/2}" text-anchor="middle" font-size="8">BACK</text>'
    return svg(300, 220, c)
def bag():
    W,G,H=80,35,120; x=20;y=30;c=""
    xs=[x,x+W,x+W+G,x+W+G+W]; ws=[W,G,W,G]
    c+=f'<rect x="{x}" y="{y}" width="{2*W+2*G}" height="{H}" {CUT}/>'
    for xx,pw in zip(xs,ws): c+=f'<line x1="{xx+pw}" y1="{y}" x2="{xx+pw}" y2="{y+H}" {CR}/>'
    c+=f'<rect x="{x+2*W+2*G}" y="{y}" width="12" height="{H}" {GL}/><path d="M{x+2*W+2*G} {y} h12 v{H} h-12" {CUT}/>'
    c+=f'<line x1="{x+W+G/2}" y1="{y}" x2="{x+W+G/2}" y2="{y+H}" {CR}/><line x1="{x+2*W+G+G/2}" y1="{y}" x2="{x+2*W+G+G/2}" y2="{y+H}" {CR}/>'
    c+=f'<rect x="{x}" y="{y-18}" width="{2*W+2*G+12}" height="18" {CUT}/><line x1="{x}" y1="{y}" x2="{x+2*W+2*G+12}" y2="{y}" {CR}/><text x="{x+W/2}" y="{y-6}" text-anchor="middle" font-size="7">top turnover + handle patch</text>'
    c+=f'<path d="M{x} {y+H} v{G} h{2*W+2*G+12} v-{G}" {CUT}/><line x1="{x}" y1="{y+H+G/2}" x2="{x+2*W+2*G+12}" y2="{y+H+G/2}" {CR}/><text x="{x+W/2}" y="{y+H+G/2+3}" text-anchor="middle" font-size="7">bottom fold (block bottom)</text>'
    c+=f'<text x="{x+W/2}" y="{y+H/2}" text-anchor="middle" font-size="8">FRONT W</text><text x="{x+W+G/2}" y="{y+H/2}" text-anchor="middle" font-size="6">GUSSET</text><text x="{x+W+G+W/2}" y="{y+H/2}" text-anchor="middle" font-size="8">BACK</text>'
    c+=f'<circle cx="{x+W/2-15}" cy="{y-9}" r="2" {CUT}/><circle cx="{x+W/2+15}" cy="{y-9}" r="2" {CUT}/>'
    return svg(300, 210, c)

dies = [
 ("Straight tuck end carton (STE)", "The most common retail carton. Both tuck flaps close from the same side. Specify W × D × L (width × depth × length). Typical board 300–350 gsm FBB.", tuck()),
 ("Crash-lock (auto-bottom) carton", "Base locks automatically when the carton is squared up. Ideal for heavier products, bottles and fast hand or machine packing.", crash()),
 ("Sleeve (with separate tray)", "An open-ended sleeve slides over a tray. Premium feel for tea, chocolates and gift sets. Thumb hole optional. Tray is a second blank.", sleeve()),
 ("E-flute mailer box (roll-end tuck front)", "The e-commerce standard. Made in one piece from E-flute corrugated, ships flat, no glue. Printable inside and out.", mailer()),
 ("Pillow box", "Two curved creases form a pillow shape. Fast to assemble, great for small gifts, cosmetics, favours and vouchers.", pillow()),
 ("Paper carry bag (block bottom, twisted handle)", "Standard kraft or art-paper bag. Specify W × G × H (width × gusset × height). Handle patches reinforce the top turnover.", bag()),
]
d = '<span class="tag">Template pack</span><h1>Standard Dieline Template Pack</h1><p>Six of the most requested packaging structures, drawn as proportional guides so your designer can plan artwork panels, and so you can visualise the structure before we produce an exact dieline for your product.</p><p class="legend"><span></span>Cut line <span class="c"></span>Crease / fold <span class="g"></span>Glue area</p><div class="box"><b>Important:</b> these are proportional guides, not production dielines. Panel sizes depend on your product, board thickness and machine. Send us your product dimensions and we will supply an exact, production-ready dieline free of charge with any packaging order.</div>'
for t, desc, s in dies: d += f'<div class="die"><h3>{html.escape(t)}</h3><p>{html.escape(desc)}</p>{s}</div>'
d += '<h2>How to use a dieline</h2><ul><li>Place the dieline on its own layer in Illustrator or InDesign, set the layer to non-printing and the stroke colour to a spot swatch named "Dieline" set to overprint.</li><li>Extend artwork 3 mm beyond every cut line. Keep text 5 mm inside creases.</li><li>Keep glue areas free of ink and varnish.</li><li>Print a paper mock-up, cut, fold and check panel orientation before sending files.</li><li>Export as PDF/X-4 with the dieline layer included but marked non-printing.</li></ul>'
open(os.path.join(SRC, "dielines.html"), "w").write(shell("Standard Dieline Template Pack", d))

# Render with Playwright (Node) -------------------------------------------
js = f"""
const {{ chromium }} = require('/opt/node22/lib/node_modules/playwright');
(async () => {{
  const b = await chromium.launch({{ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' }});
  const p = await b.newPage();
  const jobs = {json.dumps([["checklist.html","print-ready-artwork-checklist.pdf"],["buyers-guide.html","packaging-buyers-guide-sri-lanka.pdf"],["dielines.html","dieline-templates.pdf"]])};
  for (const [src, out] of jobs) {{
    await p.goto('file://{SRC}/' + src, {{ waitUntil: 'load' }});
    await p.pdf({{ path: '{OUT}/' + out, format: 'A4', printBackground: true, margin: {{ top: '14mm', bottom: '16mm', left: '14mm', right: '14mm' }} }});
    console.log('wrote', out);
  }}
  await b.close();
}})();
"""
open(os.path.join(SRC, "render.js"), "w").write(js)
subprocess.run(["node", os.path.join(SRC, "render.js")], check=True)
