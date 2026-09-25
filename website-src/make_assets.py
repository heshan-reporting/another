#!/usr/bin/env python3
"""Generates favicon PNGs and the Open Graph image from the brand config (run once, outputs are committed)."""
import os, sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from config import SITE
from PIL import Image, ImageDraw, ImageFont

IMG = os.path.join(os.path.dirname(os.path.abspath(__file__)), "static", "img")
os.makedirs(IMG, exist_ok=True)
INK, BRAND = (15, 27, 45), (242, 107, 29)

def font(size, bold=True):
    for p in ["/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf" if bold else "/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf",
              "/usr/share/fonts/truetype/liberation/LiberationSans-Bold.ttf"]:
        if os.path.exists(p): return ImageFont.truetype(p, size)
    return ImageFont.load_default()

def mark(size):
    im = Image.new("RGBA", (size, size), (0, 0, 0, 0)); d = ImageDraw.Draw(im); u = size / 40
    d.rounded_rectangle([4*u, 10*u, 28*u, 34*u], radius=3*u, fill=BRAND)
    d.rounded_rectangle([12*u, 4*u, 36*u, 28*u], radius=3*u, fill=INK + (235,))
    for y, w in [(16, 12), (21, 12), (26, 7)]:
        d.line([(18*u, y*u), ((18+w)*u, y*u)], fill="white", width=max(1, int(2.4*u)))
    return im

# favicon.svg
with open(os.path.join(IMG, "favicon.svg"), "w") as f:
    f.write('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 40"><rect x="4" y="10" width="24" height="24" rx="3" fill="#f26b1d"/><rect x="12" y="4" width="24" height="24" rx="3" fill="#0f1b2d" opacity=".92"/><path d="M18 16h12M18 21h12M18 26h7" stroke="#fff" stroke-width="2.4" stroke-linecap="round"/></svg>')
mark(32).save(os.path.join(IMG, "favicon-32.png"))
bg = Image.new("RGBA", (180, 180), (255, 255, 255, 255)); bg.alpha_composite(mark(150), (15, 15)); bg.convert("RGB").save(os.path.join(IMG, "apple-touch-icon.png"))

# OG image 1200x630
W, H = 1200, 630
im = Image.new("RGB", (W, H), INK); d = ImageDraw.Draw(im)
for x in range(0, W, 3):  # subtle gradient
    t = x / W; d.line([(x, 0), (x, H)], fill=(int(15 + 20*t), int(27 + 22*t), int(45 + 30*t)))
d.rectangle([0, H-14, W, H], fill=BRAND)
im.paste(mark(120), (80, 70), mark(120))
d.text((220, 82), SITE["brand"], font=font(58), fill="white")
d.text((222, 150), "PRINTING & PACKAGING · SRI LANKA", font=font(24, False), fill=(255, 185, 138))
d.text((80, 260), "Custom boxes, cartons, labels,", font=font(54), fill="white")
d.text((80, 325), "brochures & signage. Made in Colombo.", font=font(54), fill="white")
d.text((80, 430), "Quotes in 24 hours  ·  Free dielines & samples  ·  Island-wide delivery", font=font(26, False), fill=(207, 214, 226))
d.rounded_rectangle([80, 500, 420, 566], radius=33, fill=BRAND)
d.text((118, 517), "Get a quote  →", font=font(28), fill="white")
d.text((W-80-d.textlength(SITE["base_url"].replace("https://", ""), font=font(24, False)), 525), SITE["base_url"].replace("https://", ""), font=font(24, False), fill=(207, 214, 226))
im.save(os.path.join(IMG, "og-image.png"), optimize=True)
print("assets written to", IMG)
