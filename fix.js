const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

const newContent = `<div id="pillar-container"
              style="display:flex;gap:20px;border-top:1px solid var(--color-divider);padding-top:16px">
              <div id="pillar-buttons" style="flex:0 0 138px;display:flex;flex-direction:column;gap:3px">
              </div>
              <div id="pillar-chips"
                style="flex:1 1 auto;min-width:0;display:flex;flex-wrap:wrap;gap:9px;align-content:center;justify-content:flex-start">
              </div>
            </div>
            <script>
              const PILLARS = [
                { name: "Catalog", services: ["Product listings", "Catalog creation", "Image sourcing", "Price monitoring", "Portal QA", "Product tagging", "Attribute mapping", "Content uploads", "Competitor tracking"] },
                { name: "Data", services: ["Data enrichment", "Data cleansing", "Classification", "Vendor profiling", "Master data", "Deduplication", "Data validation", "Taxonomy design"] },
                { name: "Back office", services: ["Invoice matching", "ERP data entry", "Purchase orders", "Inventory tracking", "Vendor onboarding", "Payment tracking", "Order processing", "Reconciliation", "GRN entry"] },
                { name: "Documents", services: ["Form processing", "Document indexing", "Digitization", "Data capture", "Scan cleanup", "Archive migration", "Records tagging"] },
                { name: "Sales", services: ["Prospect data", "Account profiling", "Sales operations"] },
                { name: "Technology", services: ["Software builds", "L1 / L2 support", "Incident handling", "Access management", "Monitoring", "Report automation"] }
              ];

              let activePillarIndex = 0;
              let isMatrixHeld = false;

              function renderPillars() {
                const buttonsContainer = document.getElementById('pillar-buttons');
                const chipsContainer = document.getElementById('pillar-chips');
                if (!buttonsContainer || !chipsContainer) return;

                buttonsContainer.innerHTML = PILLARS.map((p, i) => {
                  const on = i === activePillarIndex;
                  const bar = on ? "var(--color-accent-800)" : "var(--color-divider)";
                  const bg = on ? "var(--color-accent)" : "transparent";
                  const color = on ? "#fff" : "var(--color-neutral-700)";
                  const countColor = on ? "#fff" : "var(--color-neutral-700)";
                  const weight = on ? 600 : 500;
                  const size = on ? "14.5px" : "13px";
                  const tracking = on ? "0.06em" : "0.04em";
                  
                  return \`<button type="button" onclick="selectPillar(\${i})"
                    style="display:flex;justify-content:space-between;align-items:baseline;gap:8px;text-align:left;cursor:pointer;border:none;border-left:3px solid \${bar};background:\${bg};color:\${color};font-family:var(--font-heading);font-size:\${size};font-weight:\${weight};letter-spacing:\${tracking};text-transform:uppercase;padding:10px 11px;transition:background .18s ease,color .18s ease">
                    <span>\${p.name}</span>
                    <span style="flex:none;font-size:10.5px;color:\${countColor};font-variant-numeric:tabular-nums">\${p.services.length}</span>
                  </button>\`;
                }).join('');

                const activeServices = PILLARS[activePillarIndex].services;
                chipsContainer.innerHTML = activeServices.map((n, i) => {
                  const delay = (i * 0.035).toFixed(3) + "s";
                  return \`<a class="qd-chip" href="#contact" title="Start a free trial project" style="animation:qd-chip-in .34s ease both;animation-delay:\${delay}">\${n}</a>\`;
                }).join('');
              }

              window.selectPillar = function(index) {
                activePillarIndex = index;
                renderPillars();
              }

              document.addEventListener("DOMContentLoaded", function () {
                const container = document.getElementById('pillar-container');
                if (container) {
                  container.addEventListener('mouseenter', () => { isMatrixHeld = true; });
                  container.addEventListener('mouseleave', () => { isMatrixHeld = false; });
                }
                renderPillars();
                setInterval(() => {
                  if (!isMatrixHeld) {
                    activePillarIndex = (activePillarIndex + 1) % PILLARS.length;
                    renderPillars();
                  }
                }, 4600);
              });
            </script>`;

const startStr = '<div sc-camel-on-mouse-enter="{{ holdMatrix }}"';
const index = html.indexOf(startStr);

if (index === -1) {
  console.log('Target string not found');
} else {
  const start = index;
  const endMarker = '<figcaption style="margin-top:14px">';
  const end = html.indexOf(endMarker, start);
  
  if (end !== -1) {
    html = html.slice(0, start) + newContent + '\n            ' + html.slice(end);
    fs.writeFileSync('index.html', html);
    console.log('Replaced successfully');
  } else {
    console.log('End marker not found');
  }
}
