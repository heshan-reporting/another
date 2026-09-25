
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
(async () => {
  const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
  const p = await b.newPage();
  const jobs = [["checklist.html", "print-ready-artwork-checklist.pdf"], ["buyers-guide.html", "packaging-buyers-guide-sri-lanka.pdf"], ["dielines.html", "dieline-templates.pdf"]];
  for (const [src, out] of jobs) {
    await p.goto('file:///home/user/another/website-src/downloads-src/' + src, { waitUntil: 'load' });
    await p.pdf({ path: '/home/user/another/website-src/static/downloads/' + out, format: 'A4', printBackground: true, margin: { top: '14mm', bottom: '16mm', left: '14mm', right: '14mm' } });
    console.log('wrote', out);
  }
  await b.close();
})();
