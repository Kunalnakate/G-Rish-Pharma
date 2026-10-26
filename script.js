/**
 * G-RISH PHARMA PVT LTD - OFFICIAL SCRIPT
 * Standalone Vanilla JavaScript for Interactive UI, Canvas, Search, and Modals
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Initialize Molecular Network Canvas in Hero Section
  initMoleculeCanvas();

  // 2. Animated Stats Counters
  initCounterAnimations();

  // 3. Manufacturing Facility Hub Switcher
  initFacilityTabs();

  // 4. Catalog Switcher (APIs vs Formulations)
  initCatalogModeSwitcher();

  // 5. Official 30 APIs Master Explorer (CAS Search, Standards & Table)
  initApiExplorer();

  // 6. Therapeutic Formulations Explorer (Data, Search & Filtering)
  initFormulationsExplorer();

  // 7. Modern Dialog Modal with Light-Dismiss & Fallback
  initProductModal();

  // 8. Interactive RFQ & Facility Visit Form
  initInteractiveForm();

  // 9. Mobile Navigation Menu Toggle
  initMobileNav();

  // 10. Dynamic Copyright Year
  const yearEl = document.getElementById('currentYear');
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }
});

/* ==========================================================================
   1. Interactive Molecular Canvas
   ========================================================================== */
function initMoleculeCanvas() {
  const canvas = document.getElementById('moleculeCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let width = (canvas.width = canvas.offsetWidth);
  let height = (canvas.height = canvas.offsetHeight);

  const particles = [];
  const particleCount = Math.floor((width * height) / 14000);
  const maxDistance = 140;

  let mouse = { x: null, y: null, radius: 160 };

  window.addEventListener('resize', () => {
    width = canvas.width = canvas.offsetWidth;
    height = canvas.height = canvas.offsetHeight;
  });

  canvas.addEventListener('mousemove', (e) => {
    const rect = canvas.getBoundingClientRect();
    mouse.x = e.clientX - rect.left;
    mouse.y = e.clientY - rect.top;
  });

  canvas.addEventListener('mouseleave', () => {
    mouse.x = null;
    mouse.y = null;
  });

  // Particle Class
  class Particle {
    constructor() {
      this.x = Math.random() * width;
      this.y = Math.random() * height;
      this.vx = (Math.random() - 0.5) * 0.7;
      this.vy = (Math.random() - 0.5) * 0.7;
      this.radius = Math.random() * 2.2 + 1.2;
      this.baseColor = Math.random() > 0.4 ? 'rgba(0, 245, 212, ' : 'rgba(0, 180, 216, ';
      this.alpha = Math.random() * 0.5 + 0.3;
    }

    update() {
      this.x += this.vx;
      this.y += this.vy;

      if (this.x < 0 || this.x > width) this.vx = -this.vx;
      if (this.y < 0 || this.y > height) this.vy = -this.vy;

      // Mouse interactive push
      if (mouse.x !== null && mouse.y !== null) {
        const dx = mouse.x - this.x;
        const dy = mouse.y - this.y;
        const dist = Math.hypot(dx, dy);
        if (dist < mouse.radius) {
          const force = (mouse.radius - dist) / mouse.radius;
          this.x -= (dx / dist) * force * 1.5;
          this.y -= (dy / dist) * force * 1.5;
        }
      }
    }

    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      ctx.fillStyle = this.baseColor + this.alpha + ')';
      ctx.shadowBlur = 10;
      ctx.shadowColor = '#00f5d4';
      ctx.fill();
      ctx.shadowBlur = 0;
    }
  }

  for (let i = 0; i < particleCount; i++) {
    particles.push(new Particle());
  }

  function animate() {
    ctx.clearRect(0, 0, width, height);

    // Draw connecting lines between particles
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.hypot(dx, dy);

        if (dist < maxDistance) {
          const opacity = (1 - dist / maxDistance) * 0.22;
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(0, 245, 212, ${opacity})`;
          ctx.lineWidth = 1;
          ctx.stroke();
        }
      }
    }

    particles.forEach((p) => {
      p.update();
      p.draw();
    });

    requestAnimationFrame(animate);
  }

  animate();
}

/* ==========================================================================
   2. Animated Metrics Counters
   ========================================================================== */
function initCounterAnimations() {
  const counters = document.querySelectorAll('.counter');
  let hasAnimated = false;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && !hasAnimated) {
          hasAnimated = true;
          counters.forEach((counter) => {
            const target = +counter.getAttribute('data-target');
            const duration = 1800;
            const startTime = performance.now();

            function updateCount(currentTime) {
              const elapsed = currentTime - startTime;
              const progress = Math.min(elapsed / duration, 1);
              // Ease out quad
              const easeOut = 1 - Math.pow(1 - progress, 3);
              const current = Math.floor(easeOut * target);

              counter.textContent = current;

              if (progress < 1) {
                requestAnimationFrame(updateCount);
              } else {
                counter.textContent = target;
              }
            }

            requestAnimationFrame(updateCount);
          });
        }
      });
    },
    { threshold: 0.3 }
  );

  const heroMetrics = document.querySelector('.hero-metrics-grid');
  if (heroMetrics) {
    observer.observe(heroMetrics);
  }
}

/* ==========================================================================
   3. Manufacturing Facility Hub Switcher
   ========================================================================== */
function initFacilityTabs() {
  const tabs = document.querySelectorAll('.facility-tab');
  const titleEl = document.getElementById('hubTitle');
  const descEl = document.getElementById('hubDesc');
  const featuresBox = document.querySelector('.hub-features');

  const hubData = {
    mumbai: {
      title: 'Navi Mumbai & Maharashtra Hub',
      desc: 'Our corporate headquarters at Vashi, Navi Mumbai directs global supply operations, client audits, and formulation distribution. Advanced facilities in Maharashtra house high-output tableting, capsule filling, and quality assurance labs.',
      features: ['Tablets & Capsules', 'Dry Syrups', 'Global Documentation Center']
    },
    gujarat: {
      title: 'Gujarat High-Capacity Manufacturing Hub',
      desc: 'Sophisticated dedicated units for Cephalosporin and Betalactam antibiotic formulations, automated liquid/dry injectable vial filling, and sterile eye/ear drops adhering to stringent WHO-GMP guidelines.',
      features: ['Liquid & Dry Injections', 'Cephalosporin Dedicated Block', 'Lyophilized Vials']
    },
    hyderabad: {
      title: 'Hyderabad Biotech & Active Pharmaceutical Ingredients (APIs)',
      desc: 'Premier synthesis and pelletization center producing high-purity Active Pharmaceutical Ingredients (APIs), sustained-release pellets, and veterinary formulations with comprehensive analytical documentation.',
      features: ['API Synthesis', 'Modified Release Pellets', 'Veterinary Formulations']
    }
  };

  tabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      tabs.forEach((t) => t.classList.remove('active'));
      tab.classList.add('active');

      const hubKey = tab.getAttribute('data-hub');
      const data = hubData[hubKey];
      if (data) {
        titleEl.textContent = data.title;
        descEl.textContent = data.desc;
        featuresBox.innerHTML = data.features
          .map((f) => `<span class="pill-feat">${f}</span>`)
          .join('');
      }
    });
  });

  // Action button to scroll down to book visit
  const btnMfgVisit = document.getElementById('btnMfgVisit');
  if (btnMfgVisit) {
    btnMfgVisit.addEventListener('click', () => {
      const tabVisit = document.getElementById('tabVisit');
      if (tabVisit) tabVisit.click();
      const contactSection = document.getElementById('contact');
      if (contactSection) contactSection.scrollIntoView({ behavior: 'smooth' });
    });
  }
}

/* ==========================================================================
   4. Catalog Mode Switcher (APIs vs Formulations)
   ========================================================================== */
function initCatalogModeSwitcher() {
  const btnApis = document.getElementById('modeApis');
  const btnFormulations = document.getElementById('modeFormulations');
  const viewApis = document.getElementById('viewApis');
  const viewFormulations = document.getElementById('viewFormulations');

  if (!btnApis || !btnFormulations || !viewApis || !viewFormulations) return;

  btnApis.addEventListener('click', () => {
    btnApis.classList.add('active');
    btnFormulations.classList.remove('active');
    viewApis.style.display = 'block';
    viewFormulations.style.display = 'none';
  });

  btnFormulations.addEventListener('click', () => {
    btnFormulations.classList.add('active');
    btnApis.classList.remove('active');
    viewFormulations.style.display = 'block';
    viewApis.style.display = 'none';
  });
}

/* ==========================================================================
   5. Official 30 Active Pharmaceutical Ingredients (APIs) Master Dataset
   ========================================================================== */
const APIS_DATA = [
  {
    name: 'Piroxicam',
    type: 'API',
    category: 'nsaid',
    categoryLabel: 'NSAID',
    cas: '36322-90-4',
    standards: ['IP', 'BP', 'EP', 'USP'],
    indication: 'Nonsteroidal anti-inflammatory drug for osteoarthritis and rheumatoid arthritis relief.'
  },
  {
    name: 'Meloxicam',
    type: 'API',
    category: 'nsaid',
    categoryLabel: 'NSAID',
    cas: '71125-38-7',
    standards: ['IP', 'BP', 'EP', 'USP'],
    indication: 'Potent COX-2 preferential NSAID for chronic joint inflammation and pain.'
  },
  {
    name: 'Lidocaine base',
    type: 'API',
    category: 'anesthetic',
    categoryLabel: 'Local Anesthetic',
    cas: '137-58-6',
    standards: ['IP', 'BP', 'EP', 'USP'],
    indication: 'High-purity local anesthetic base for dermal creams, ointments, and pharmaceutical patches.'
  },
  {
    name: 'Lidocaine hydrochloride',
    type: 'API',
    category: 'anesthetic',
    categoryLabel: 'Local Anesthetic',
    cas: '73-78-9',
    standards: ['IP', 'BP', 'EP', 'USP'],
    indication: 'Water-soluble local anesthetic salt for sterile injections, dental cartridges, and mucosal solutions.'
  },
  {
    name: 'Alendronate Sodium Trihydrate',
    type: 'API',
    category: 'cns-other',
    categoryLabel: 'Osteoporosis / Bone Metabolism',
    cas: '121268-17-5',
    standards: ['BP', 'EP', 'USP'],
    indication: 'Bisphosphonate medication strengthening bone mineral density in osteoporosis.'
  },
  {
    name: 'Sodium Picosulfate',
    type: 'API',
    category: 'gastro',
    categoryLabel: 'Laxative / Colon Cleanser',
    cas: '10040-45-6',
    standards: ['BP', 'EP', 'USP'],
    indication: 'Contact stimulant laxative for constipation management and diagnostic bowel preparation.'
  },
  {
    name: 'Bisacodyl',
    type: 'API',
    category: 'gastro',
    categoryLabel: 'Laxative',
    cas: '603-50-9',
    standards: ['IP', 'BP', 'EP', 'USP'],
    indication: 'Stimulant laxative acting on colonic mucosa for tablets and suppositories.'
  },
  {
    name: 'Lornoxicam',
    type: 'API',
    category: 'nsaid',
    categoryLabel: 'NSAID / Oxicam Class',
    cas: '70374-39-9',
    standards: ['INH'],
    indication: 'Potent analgesic and anti-inflammatory oxicam for severe surgical and musculoskeletal pain.'
  },
  {
    name: 'Benzocaine',
    type: 'API',
    category: 'anesthetic',
    categoryLabel: 'Local Anesthetic',
    cas: '94-09-7',
    standards: ['IP', 'BP', 'EP', 'USP'],
    indication: 'Surface local anesthetic for throat lozenges, sprays, and topical pain gels.'
  },
  {
    name: 'Prilocaine base',
    type: 'API',
    category: 'anesthetic',
    categoryLabel: 'Local Anesthetic',
    cas: '721-50-6',
    standards: ['IP', 'BP', 'EP', 'USP'],
    indication: 'Amino-amide local anesthetic base used in eutectic topical anesthesia creams (EMLA).'
  },
  {
    name: 'Prilocaine hydrochloride',
    type: 'API',
    category: 'anesthetic',
    categoryLabel: 'Local Anesthetic',
    cas: '1786-81-8',
    standards: ['IP', 'BP', 'EP', 'USP'],
    indication: 'Sterile injectable local anesthetic salt for dental and regional nerve block anesthesia.'
  },
  {
    name: 'Phenyramidol Hydrochloride',
    type: 'API',
    category: 'nsaid',
    categoryLabel: 'Analgesic / Muscle Relaxant',
    cas: '553-69-5',
    standards: ['IP'],
    indication: 'Dual-action centrally acting analgesic and smooth/skeletal muscle relaxant.'
  },
  {
    name: 'Bromhexine HCl',
    type: 'API',
    category: 'cns-other',
    categoryLabel: 'Antiasthmatic / Mucolytic',
    cas: '611-75-6',
    standards: ['BP', 'EP', 'IP'],
    indication: 'Mucolytic bronchodilator for respiratory disorders with excessive bronchial mucus.'
  },
  {
    name: 'Moxifloxacin HCl',
    type: 'API',
    category: 'cns-other',
    categoryLabel: 'Anti-Bacterial (Fluoroquinolone)',
    cas: '186826-86-8',
    standards: ['USP', 'BP', 'IP'],
    indication: '4th generation broad-spectrum fluoroquinolone for severe respiratory, skin, and eye infections.'
  },
  {
    name: 'Glibenclamide [Glyburide]',
    type: 'API',
    category: 'diabetic',
    categoryLabel: 'Anti-Diabetic (Sulfonylurea)',
    cas: '10238-21-8',
    standards: ['IP', 'BP', 'USP'],
    indication: 'Second-generation sulfonylurea for glycemic control in Type 2 Diabetes Mellitus.'
  },
  {
    name: 'Amlodipine Besilate',
    type: 'API',
    category: 'cardio',
    categoryLabel: 'Anti-Hypertensive (CCB)',
    cas: '111470-99-6',
    standards: ['IP', 'BP', 'USP'],
    indication: 'Long-acting dihydropyridine calcium channel blocker for systemic hypertension & angina.'
  },
  {
    name: 'S-Amlodipine Besylate [Leva Amlodipine Besylate]',
    type: 'API',
    category: 'cardio',
    categoryLabel: 'Anti-Hypertensive (Active Enantiomer)',
    cas: '150566-71-5',
    standards: ['INH', 'IP'],
    indication: 'Chirally pure pharmacologically active (S)-enantiomer offering lower peripheral edema.'
  },
  {
    name: 'Glimepiride',
    type: 'API',
    category: 'diabetic',
    categoryLabel: 'Anti-Diabetic (3rd Gen Sulfonylurea)',
    cas: '93479-97-1',
    standards: ['USP', 'IP', 'EP'],
    indication: 'Third-generation sulfonylurea for effective blood glucose management.'
  },
  {
    name: 'Celecoxib',
    type: 'API',
    category: 'nsaid',
    categoryLabel: 'Anti-inflammatory & Antiarthritic',
    cas: '169590-42-5',
    standards: ['USP', 'IP', 'EP'],
    indication: 'Selective COX-2 inhibitor minimizing gastrointestinal bleeding in arthritis therapy.'
  },
  {
    name: 'Etoricoxib',
    type: 'API',
    category: 'nsaid',
    categoryLabel: 'Rheumatoid Arthritis / COX-2',
    cas: '202409-33-4',
    standards: ['IP', 'BP', 'INH'],
    indication: 'High-selectivity COX-2 inhibitor for acute gouty arthritis and ankylosing spondylitis.'
  },
  {
    name: 'Febuxostat',
    type: 'API',
    category: 'cns-other',
    categoryLabel: 'Anti-Gout / Xanthine Oxidase Inhibitor',
    cas: '144060-53-7',
    standards: ['IP', 'USP', 'INH'],
    indication: 'Non-purine selective inhibitor of xanthine oxidase lowering serum uric acid levels.'
  },
  {
    name: 'Mebendazole',
    type: 'API',
    category: 'cns-other',
    categoryLabel: 'Anthelmintic (Broad-Spectrum)',
    cas: '31431-39-7',
    standards: ['IP', 'EP', 'BP', 'USP'],
    indication: 'Broad-spectrum anthelmintic treating pinworm, roundworm, and hookworm infestations.'
  },
  {
    name: 'Dibucaine',
    type: 'API',
    category: 'anesthetic',
    categoryLabel: 'Topical Local Anesthetic',
    cas: '85-79-0',
    standards: ['USP'],
    indication: 'Highly potent amide local anesthetic base for hemorrhoidal and dermatological relief.'
  },
  {
    name: 'Dibucaine Hydrochloride/Cinchocaine Hydrochloride',
    type: 'API',
    category: 'anesthetic',
    categoryLabel: 'Topical Local Anesthetic Salt',
    cas: '61-12-1',
    standards: ['USP', 'BP', 'EP'],
    indication: 'Water-soluble cinchocaine salt for spinal anesthesia and mucosal anti-pruritic formulations.'
  },
  {
    name: 'Aripiprazole',
    type: 'API',
    category: 'cns-other',
    categoryLabel: 'Atypical Antipsychotic',
    cas: '129722-12-9',
    standards: ['USP', 'IP'],
    indication: 'Dopamine D2 and 5-HT1A receptor partial agonist for schizophrenia and bipolar I disorder.'
  },
  {
    name: 'Trihexyphenidyl Hydrochloride/Benzhexol Hydrochloride',
    type: 'API',
    category: 'cns-other',
    categoryLabel: 'Anti-Parkinson / Anticholinergic',
    cas: '52-49-3',
    standards: ['USP', 'BP', 'EP', 'IP'],
    indication: 'Anticholinergic agent for Parkinson tremor and drug-induced extrapyramidal symptoms.'
  },
  {
    name: 'Ondensetron Hydrochloride',
    type: 'API',
    category: 'cns-other',
    categoryLabel: 'Antiemetic (5-HT3 Antagonist)',
    cas: '103639-04-9',
    standards: ['USP', 'BP', 'EP', 'IP'],
    indication: 'Selective 5-HT3 receptor antagonist preventing chemotherapy and post-operative nausea/vomiting.'
  },
  {
    name: 'Ondensetron Base',
    type: 'API',
    category: 'cns-other',
    categoryLabel: 'Antiemetic (Base Form)',
    cas: '116002-70-2',
    standards: ['USP', 'IP'],
    indication: 'Pure base form for orally disintegrating tablets (ODT) and specialized delivery systems.'
  },
  {
    name: 'Carvedilol',
    type: 'API',
    category: 'cardio',
    categoryLabel: 'Antihypertensive, Beta Blocker',
    cas: '72956-09-3',
    standards: ['USP', 'BP', 'EP', 'IP'],
    indication: 'Non-selective beta-adrenoreceptor and alpha-1 blocker for congestive heart failure and hypertension.'
  },
  {
    name: 'Sevelamer Carbonate',
    type: 'API',
    category: 'cns-other',
    categoryLabel: 'Phosphate Binder',
    cas: '845273-93-0',
    standards: ['INH'],
    indication: 'Non-calcium phosphate binder controlling serum phosphorus in chronic kidney disease (CKD) on dialysis.'
  }
];

function initApiExplorer() {
  const tableBody = document.getElementById('apiTableBody');
  const searchInput = document.getElementById('apiSearchInput');
  const clearBtn = document.getElementById('clearApiSearch');
  const standardChips = document.querySelectorAll('.std-chip');
  const categoryBtns = document.querySelectorAll('#apiCategoryFilters .cat-btn');
  const resultsCountEl = document.getElementById('apiResultsCount');

  if (!tableBody || !searchInput) return;

  let searchQuery = '';
  let currentStandard = 'all';
  let currentCategory = 'all';

  function renderTable() {
    tableBody.innerHTML = '';

    const filtered = APIS_DATA.filter((item) => {
      const matchCategory = currentCategory === 'all' || item.category === currentCategory;
      const matchStandard =
        currentStandard === 'all' ||
        item.standards.some((std) => std.toUpperCase().includes(currentStandard.toUpperCase()));
      const matchSearch =
        searchQuery === '' ||
        item.name.toLowerCase().includes(searchQuery) ||
        item.cas.toLowerCase().includes(searchQuery) ||
        item.categoryLabel.toLowerCase().includes(searchQuery) ||
        item.indication.toLowerCase().includes(searchQuery);

      return matchCategory && matchStandard && matchSearch;
    });

    if (resultsCountEl) {
      resultsCountEl.textContent = `Showing ${filtered.length} of 30 Active Pharmaceutical Ingredients`;
    }

    if (filtered.length === 0) {
      tableBody.innerHTML = `
        <tr>
          <td colspan="5" class="text-center" style="padding: 40px 20px;">
            <h4 style="margin-bottom: 8px;">No APIs found matching "${escapeHtml(searchQuery)}"</h4>
            <p style="color: var(--text-muted); font-size: 0.9rem; margin-bottom: 16px;">
              Looking for a custom API synthesis or alternate CAS number? Contact our technical sourcing team.
            </p>
            <button type="button" class="btn btn-primary" onclick="autoFillFormWithMolecule('Custom API Sourcing')">
              Inquire Custom API
            </button>
          </td>
        </tr>
      `;
      return;
    }

    filtered.forEach((item) => {
      const tr = document.createElement('tr');

      // Badges for standards
      const standardBadges = item.standards
        .map((std) => {
          const upper = std.toUpperCase();
          let cls = 'std-badge-inh';
          if (upper.includes('USP')) cls = 'std-badge-usp';
          else if (upper.includes('BP')) cls = 'std-badge-bp';
          else if (upper.includes('EP')) cls = 'std-badge-ep';
          else if (upper.includes('IP')) cls = 'std-badge-ip';
          return `<span class="std-badge ${cls}">${std}</span>`;
        })
        .join('');

      tr.innerHTML = `
        <td>
          <div class="api-molecule-col">
            <span class="api-molecule-name">${escapeHtml(item.name)}</span>
            <span class="api-type-tag">● ${escapeHtml(item.type)} &bull; ${escapeHtml(item.categoryLabel)}</span>
          </div>
        </td>
        <td>
          <span style="font-size: 0.88rem; color: #cbd5e1;">${escapeHtml(item.indication)}</span>
        </td>
        <td>
          <span class="cas-badge">CAS: ${escapeHtml(item.cas)}</span>
        </td>
        <td>
          <div class="std-badges-list">
            ${standardBadges}
          </div>
        </td>
        <td class="text-right">
          <button type="button" class="btn btn-primary btn-inquire-api" 
            data-name="${escapeHtml(item.name)}" 
            data-cas="${escapeHtml(item.cas)}" 
            data-standards="${escapeHtml(item.standards.join('/'))}"
            style="padding: 7px 14px; font-size: 0.8rem;">
            Request CoA & Quote
          </button>
        </td>
      `;

      tableBody.appendChild(tr);
    });

    // Attach click listeners to all Quote buttons
    tableBody.querySelectorAll('.btn-inquire-api').forEach((btn) => {
      btn.addEventListener('click', () => {
        const name = btn.getAttribute('data-name');
        const cas = btn.getAttribute('data-cas');
        const standards = btn.getAttribute('data-standards');
        autoFillFormWithMolecule(name, cas, standards ? standards.split('/') : []);
      });
    });
  }

  // Standards filter clicks
  standardChips.forEach((chip) => {
    chip.addEventListener('click', () => {
      standardChips.forEach((c) => c.classList.remove('active'));
      chip.classList.add('active');
      currentStandard = chip.getAttribute('data-standard');
      renderTable();
    });
  });

  // Category filter clicks
  categoryBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      categoryBtns.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');
      currentCategory = btn.getAttribute('data-api-cat');
      renderTable();
    });
  });

  // Search input
  let apiSearchTimeout;
  searchInput.addEventListener('input', (e) => {
    clearTimeout(apiSearchTimeout);
    searchQuery = e.target.value.trim().toLowerCase();
    if (clearBtn) clearBtn.style.display = searchQuery ? 'block' : 'none';
    apiSearchTimeout = setTimeout(() => {
      renderTable();
    }, 150);
  });

  if (clearBtn) {
    clearBtn.addEventListener('click', () => {
      searchInput.value = '';
      searchQuery = '';
      clearBtn.style.display = 'none';
      renderTable();
    });
  }

  // Initial render
  renderTable();
}

/* ==========================================================================
   6. Formulations Database & Explorer (Search, Filter & Modal Triggers)
   ========================================================================== */
const FORMULATIONS_DATA = [
  {
    id: 'f-1',
    name: 'Cefixime Trihydrate Formulations',
    category: 'cephalosporins',
    categoryLabel: 'Cephalosporin (3rd Gen)',
    dosages: ['tablets', 'syrups'],
    dosageLabel: 'Tablets (100mg / 200mg) & Dry Syrup',
    indication: 'Potent treatment for respiratory tract infections, typhoid fever, UTI, and otitis media.',
    specs: ['WHO-GMP Certified', 'USP / BP / IP', 'Alu-Alu & HDPE Bottles', 'eCTD Ready']
  },
  {
    id: 'f-2',
    name: 'Ceftriaxone Sodium Sterile Injection',
    category: 'injectables',
    categoryLabel: 'Cephalosporin Injection',
    dosages: ['injections'],
    dosageLabel: 'Dry Powder Injection (250mg, 500mg, 1g, 2g)',
    indication: 'Broad spectrum sterile antibiotic for bacterial meningitis, sepsis, and surgical prophylaxis.',
    specs: ['Sterile Lyophilized Vial', 'WFI Included Option', 'Zone IVb Stability', 'Full CTD Dossier']
  },
  {
    id: 'f-3',
    name: 'Amoxicillin & Potassium Clavulanate',
    category: 'betalactams',
    categoryLabel: 'Betalactam Antibiotic',
    dosages: ['tablets', 'syrups', 'injections'],
    dosageLabel: 'Tablets (625mg, 1g), Dry Syrup & Injection',
    indication: 'Combats beta-lactamase producing strains in sinusitis, pneumonia, skin and dental infections.',
    specs: ['Moisture-Proof Alu-Alu', 'Pediatric Dry Drops Available', 'High Bioavailability']
  },
  {
    id: 'f-4',
    name: 'Meropenem Trihydrate Injection',
    category: 'injectables',
    categoryLabel: 'Critical Care Carbapenem',
    dosages: ['injections'],
    dosageLabel: 'Dry Powder for Injection (500mg, 1000mg)',
    indication: 'Indicated for severe nosocomial infections, intra-abdominal infections, and febrile neutropenia.',
    specs: ['Class 100 Aseptic Filling', 'Endotoxin Tested', 'Lyophilized Sterile Vial']
  },
  {
    id: 'f-5',
    name: 'Telmisartan & Amlodipine Formulations',
    category: 'cardio-diabetic',
    categoryLabel: 'Cardiovascular Care',
    dosages: ['tablets'],
    dosageLabel: 'Tablets (40mg/5mg, 80mg/5mg)',
    indication: 'Essential dual therapy for systemic hypertension and cardiovascular risk reduction.',
    specs: ['USP / EP Quality', 'Bilingual Export Packaging', 'High Dissolution Rate']
  },
  {
    id: 'f-6',
    name: 'Metformin HCl & Glimepiride Tablets',
    category: 'cardio-diabetic',
    categoryLabel: 'Anti-Diabetic Care',
    dosages: ['tablets'],
    dosageLabel: 'Sustained Release Tablets (500mg/1mg, 500mg/2mg)',
    indication: 'Comprehensive glycemic control for Type-2 Diabetes Mellitus with sustained action.',
    specs: ['SR Matrix Formulation', 'Zone IVb Accelerated Tested', 'Blister / Bulk Packs']
  },
  {
    id: 'f-7',
    name: 'Pantoprazole Sodium & Domperidone',
    category: 'gastro-respiratory',
    categoryLabel: 'Anti-Ulcerant & GERD',
    dosages: ['tablets', 'capsules', 'injections'],
    dosageLabel: 'Enteric Coated Tablets, DSR Capsules & IV Inj (40mg)',
    indication: 'Rapid relief and mucosal healing for gastroesophageal reflux, erosive esophagitis & peptic ulcers.',
    specs: ['Enteric Polymer Coated', 'Instant IV Vial Available', 'Zero Gastric Irritation']
  },
  {
    id: 'f-8',
    name: 'Montelukast Sodium & Levocetirizine',
    category: 'gastro-respiratory',
    categoryLabel: 'Anti-Allergic & Respiratory',
    dosages: ['tablets', 'syrups'],
    dosageLabel: 'Tablets (10mg/5mg) & Kid Syrups',
    indication: 'Effective relief for allergic rhinitis, chronic urticaria, and perennial bronchial asthma.',
    specs: ['Non-Drowsy Formula', 'Pleasant Flavored Syrups', 'Export Alu-Alu Packaging']
  },
  {
    id: 'f-9',
    name: 'Imatinib Mesylate Capsules & Tablets',
    category: 'oncology-anti-infective',
    categoryLabel: 'Oncology / Anti-Cancer',
    dosages: ['tablets', 'capsules'],
    dosageLabel: 'Capsules / Tablets (100mg, 400mg)',
    indication: 'Targeted tyrosine kinase inhibitor for Philadelphia chromosome-positive CML and GIST tumors.',
    specs: ['High Chemical Purity', 'Dedicated Containment Suite', 'Full Pharmacovigilance File']
  },
  {
    id: 'f-10',
    name: 'Fluconazole & Itraconazole Pellets',
    category: 'oncology-anti-infective',
    categoryLabel: 'Anti-Fungal Therapy',
    dosages: ['capsules', 'injections', 'apis'],
    dosageLabel: 'Capsules (100mg, 200mg), IV Infusion & Pellets',
    indication: 'Systemic antifungal agent treating candidiasis, aspergillosis, and dermatophytic infections.',
    specs: ['Neutral Core Sugar Pellets', 'High Stability In Humid Tropics', 'CTD Ready']
  },
  {
    id: 'f-11',
    name: 'Calcium Carbonate, Calcitriol & Vit D3',
    category: 'nutraceuticals',
    categoryLabel: 'Nutraceuticals & Calcium',
    dosages: ['tablets', 'capsules'],
    dosageLabel: 'Softgel Capsules & Film Coated Tablets',
    indication: 'Strengthens bone density, prevents osteoporosis, and replenishes essential vitamin deficiencies.',
    specs: ['Premium Grade Excipients', 'No Fishy Aftertaste', 'High Absorption Efficiency']
  },
  {
    id: 'f-12',
    name: 'Herbal Pain Relieving Oil & Ointments',
    category: 'nutraceuticals',
    categoryLabel: 'Topical & Herbal Care',
    dosages: ['ointments'],
    dosageLabel: 'Roll-on Oils (50ml, 100ml) & Ointments / Creams',
    indication: 'Fast-penetrating herbal formulation for arthritic joint pain, muscle stiffness, and sciatica.',
    specs: ['100% Herbal Extracts', 'Non-Greasy Rapid Absorption', 'Aromatic Therapeutic Grade']
  },
  {
    id: 'f-13',
    name: 'Ciprofloxacin & Dexamethasone Drops',
    category: 'betalactams',
    categoryLabel: 'Ophthalmic & Otic Formulations',
    dosages: ['drops'],
    dosageLabel: 'Sterile Eye / Ear Drops (5ml, 10ml)',
    indication: 'Antibacterial and anti-inflammatory combination for conjunctivitis and acute otitis media.',
    specs: ['Sterile BFS Packaging', 'Buffered Isotonic pH', 'Dropper Dispenser Bottles']
  },
  {
    id: 'f-14',
    name: 'Veterinary Albendazole & Ivermectin',
    category: 'veterinary',
    categoryLabel: 'Veterinary Pharmaceuticals',
    dosages: ['tablets', 'syrups'],
    dosageLabel: 'Bolus Tablets (1.5g, 3g) & Oral Suspensions',
    indication: 'Broad spectrum anthelmintic and parasiticide for livestock, cattle, and companion animals.',
    specs: ['High Potency Veterinary Grade', 'Break-Resistant Packaging', 'WHO-GMP Compliant']
  },
  {
    id: 'f-15',
    name: 'Active Pharmaceutical Ingredients & Pellets',
    category: 'veterinary',
    categoryLabel: 'APIs & Modified-Release Pellets',
    dosages: ['apis'],
    dosageLabel: 'Bulk API Powders & Sustained Release Pellets',
    indication: 'Pure active pharmaceutical raw ingredients and intermediate pellets for global formulation manufacturers.',
    specs: ['USP / BP Certified Specs', 'CoA for Every Consignment', 'Custom Particle Sizing']
  }
];

function initFormulationsExplorer() {
  const grid = document.getElementById('formulationsGrid');
  const searchInput = document.getElementById('formulationSearch');
  const clearBtn = document.getElementById('clearSearch');
  const catButtons = document.querySelectorAll('.cat-btn');
  const dosagePills = document.querySelectorAll('.dosage-pill');

  let currentCategory = 'all';
  let currentDosage = 'all';
  let searchQuery = '';

  function renderGrid() {
    grid.innerHTML = '';

    const filtered = FORMULATIONS_DATA.filter((item) => {
      const matchCategory = currentCategory === 'all' || item.category === currentCategory;
      const matchDosage = currentDosage === 'all' || item.dosages.includes(currentDosage);
      const matchSearch =
        searchQuery === '' ||
        item.name.toLowerCase().includes(searchQuery) ||
        item.indication.toLowerCase().includes(searchQuery) ||
        item.dosageLabel.toLowerCase().includes(searchQuery) ||
        item.categoryLabel.toLowerCase().includes(searchQuery);

      return matchCategory && matchDosage && matchSearch;
    });

    if (filtered.length === 0) {
      grid.innerHTML = `
        <div class="no-results-box">
          <h4>No formulations found matching "${escapeHtml(searchQuery)}"</h4>
          <p>We synthesize custom pharmaceutical molecules upon request. Click below to inquire about your desired formulation.</p>
          <button type="button" class="btn btn-primary" style="margin-top: 18px;" onclick="document.getElementById('btnOpenRfq').click()">
            Inquire Custom Formulation
          </button>
        </div>
      `;
      return;
    }

    filtered.forEach((item) => {
      const card = document.createElement('div');
      card.className = 'product-card';
      card.innerHTML = `
        <div class="card-top-meta">
          <span class="product-category-tag">${item.categoryLabel}</span>
          <span class="product-dosage-badge">${item.dosages.join(' / ').toUpperCase()}</span>
        </div>
        <h3 class="product-name">${item.name}</h3>
        <p class="product-indication">${item.indication}</p>
        <div class="product-details-pills">
          <span class="product-pill">💊 ${item.dosageLabel}</span>
          <span class="product-pill">📋 eCTD Available</span>
        </div>
        <div class="card-actions">
          <button type="button" class="btn btn-outline btn-card-action btn-view-specs" data-id="${item.id}">
            View Technical Specs
          </button>
          <button type="button" class="btn btn-primary btn-card-action btn-inquire-item" data-name="${escapeHtml(item.name)}">
            Request Quote
          </button>
        </div>
      `;
      grid.appendChild(card);
    });

    // Attach event listeners to new cards
    attachCardListeners();
  }

  function attachCardListeners() {
    // Specs modal trigger
    document.querySelectorAll('.btn-view-specs').forEach((btn) => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-id');
        const formulation = FORMULATIONS_DATA.find((f) => f.id === id);
        if (formulation) {
          openProductModal(formulation);
        }
      });
    });

    // Direct RFQ button
    document.querySelectorAll('.btn-inquire-item').forEach((btn) => {
      btn.addEventListener('click', () => {
        const name = btn.getAttribute('data-name');
        autoFillFormWithMolecule(name);
      });
    });
  }

  // Category Filter clicks
  catButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      catButtons.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');
      currentCategory = btn.getAttribute('data-category');
      renderGrid();
    });
  });

  // Dosage Filter clicks
  dosagePills.forEach((pill) => {
    pill.addEventListener('click', () => {
      dosagePills.forEach((p) => p.classList.remove('active'));
      pill.classList.add('active');
      currentDosage = pill.getAttribute('data-dosage');
      renderGrid();
    });
  });

  // Search input with debounce
  let searchTimeout;
  searchInput.addEventListener('input', (e) => {
    clearTimeout(searchTimeout);
    searchQuery = e.target.value.trim().toLowerCase();
    clearBtn.style.display = searchQuery ? 'block' : 'none';
    searchTimeout = setTimeout(() => {
      renderGrid();
    }, 180);
  });

  clearBtn.addEventListener('click', () => {
    searchInput.value = '';
    searchQuery = '';
    clearBtn.style.display = 'none';
    renderGrid();
  });

  // Custom formulation button trigger
  const btnCustomFormulation = document.getElementById('btnCustomFormulation');
  if (btnCustomFormulation) {
    btnCustomFormulation.addEventListener('click', () => {
      autoFillFormWithMolecule('Custom Formulation / Molecule Synthesis');
    });
  }

  // Initial render
  renderGrid();
}

/* ==========================================================================
   5. Modern Dialog Modal with Light-Dismiss & Safari Fallback
   ========================================================================== */
let activeProductForModal = null;

function initProductModal() {
  const modal = document.getElementById('productModal');
  if (!modal) return;

  const closeBtn = document.getElementById('modalCloseBtn');
  const dismissBtn = document.getElementById('modalDismissBtn');
  const inquireBtn = document.getElementById('modalInquireBtn');

  if (closeBtn) {
    closeBtn.addEventListener('click', () => modal.close());
  }

  if (dismissBtn) {
    dismissBtn.addEventListener('click', () => modal.close());
  }

  if (inquireBtn) {
    inquireBtn.addEventListener('click', () => {
      modal.close();
      if (activeProductForModal) {
        autoFillFormWithMolecule(activeProductForModal.name);
      }
    });
  }

  // Fallback for browsers without native `closedby="any"` light-dismiss support (e.g. Safari)
  if (!('closedBy' in HTMLDialogElement.prototype)) {
    modal.addEventListener('click', (event) => {
      if (event.target !== modal) return;
      const rect = modal.getBoundingClientRect();
      const isDialogContent =
        rect.top <= event.clientY &&
        event.clientY <= rect.top + rect.height &&
        rect.left <= event.clientX &&
        event.clientX <= rect.left + rect.width;

      if (isDialogContent) return;
      modal.close();
    });
  }
}

function openProductModal(formulation) {
  activeProductForModal = formulation;
  const modal = document.getElementById('productModal');
  if (!modal) return;

  document.getElementById('modalProductTitle').textContent = formulation.name;
  document.getElementById('modalCategoryTag').textContent = formulation.categoryLabel;
  document.getElementById('modalDosageVal').textContent = formulation.dosageLabel;
  document.getElementById('modalIndicationVal').textContent = formulation.indication;

  const overviewEl = document.getElementById('modalOverviewText');
  overviewEl.textContent = `${formulation.name} is formulated under strict WHO-GMP cleanroom standards utilizing certified active substances. Suitable for global hospital tenders, private distribution networks, and governmental healthcare programs.`;

  modal.showModal();
}

function autoFillFormWithMolecule(moleculeName, casNumber, standards) {
  const contactSection = document.getElementById('contact');
  const msgInput = document.getElementById('inquiryMessage');
  const tabRfq = document.getElementById('tabRfq');

  if (tabRfq) tabRfq.click();

  if (msgInput) {
    let details = `[${moleculeName}]`;
    if (casNumber) details += `\nCAS Registry No.: ${casNumber}`;
    if (standards && standards.length > 0) details += `\nPharmacopoeial Standards: ${Array.isArray(standards) ? standards.join('/') : standards}`;

    msgInput.value = `Hello G-Rish Pharma Export & Technical Team,\n\nI am requesting official commercial pricing, Certificate of Analysis (CoA), minimum batch quantity, and technical dossier data for:\n${details}\n\nTarget market requirements and packaging preferences:`;
    msgInput.focus();
  }

  if (contactSection) {
    contactSection.scrollIntoView({ behavior: 'smooth' });
  }
}

/* ==========================================================================
   6. Interactive RFQ & Facility Visit Form
   ========================================================================== */
function initInteractiveForm() {
  const form = document.getElementById('contactForm');
  const formTypeInput = document.getElementById('formTypeInput');
  const tabRfq = document.getElementById('tabRfq');
  const tabVisit = document.getElementById('tabVisit');
  const statusEl = document.getElementById('formStatus');
  const submitBtn = document.getElementById('btnSubmitForm');

  // Hero CTAs & Header Buttons
  const btnOpenRfq = document.getElementById('btnOpenRfq');
  const btnHeroSourcing = document.getElementById('btnHeroSourcing');
  const btnScheduleVisit = document.getElementById('btnScheduleVisit');
  const btnRequestDossier = document.getElementById('btnRequestDossier');

  const btnMfgVisit = document.getElementById('btnMfgVisit');

  if (tabRfq && tabVisit) {
    tabRfq.addEventListener('click', () => {
      tabRfq.classList.add('active');
      tabVisit.classList.remove('active');
      formTypeInput.value = 'rfq';
      submitBtn.querySelector('span').textContent = 'Send Product Quotation Request';
    });

    tabVisit.addEventListener('click', () => {
      tabVisit.classList.add('active');
      tabRfq.classList.remove('active');
      formTypeInput.value = 'visit';
      submitBtn.querySelector('span').textContent = 'Book Facility Inspection Visit';
    });
  }

  if (btnOpenRfq) {
    btnOpenRfq.addEventListener('click', () => {
      if (tabRfq) tabRfq.click();
      document.getElementById('contact').scrollIntoView({ behavior: 'smooth' });
    });
  }

  if (btnHeroSourcing) {
    btnHeroSourcing.addEventListener('click', () => {
      document.getElementById('services').scrollIntoView({ behavior: 'smooth' });
    });
  }

  if (btnScheduleVisit) {
    btnScheduleVisit.addEventListener('click', () => {
      if (tabVisit) tabVisit.click();
      document.getElementById('contact').scrollIntoView({ behavior: 'smooth' });
    });
  }

  if (btnMfgVisit) {
    btnMfgVisit.addEventListener('click', () => {
      if (tabVisit) tabVisit.click();
      document.getElementById('contact').scrollIntoView({ behavior: 'smooth' });
    });
  }

  if (btnRequestDossier) {
    btnRequestDossier.addEventListener('click', () => {
      autoFillFormWithMolecule('CTD / ACTD / eCTD Regulatory Dossier Request');
    });
  }

  // Handle Form Submission: Pre-fill and launch email client
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();

      const fullName = document.getElementById('fullName').value.trim();
      const company = document.getElementById('companyName').value.trim();
      const email = document.getElementById('emailAddress').value.trim();
      const phone = document.getElementById('phoneNumber').value.trim();
      const country = document.getElementById('destinationCountry').value.trim();
      const categorySelect = document.getElementById('interestCategory');
      const categoryText = categorySelect.options[categorySelect.selectedIndex]?.text || 'General Formulation Inquiry';
      const message = document.getElementById('inquiryMessage').value.trim();
      const isVisit = formTypeInput.value === 'visit';

      // Recipient & Subject
      const recipient = 'pooja.b@g-rishpharma.com';
      const subject = isVisit
        ? `[Facility Visit Request] - ${company} (${country})`
        : `[Pharmaceutical Quotation] - ${company} (${country}) - ${categoryText}`;

      // Formatted Email Body
      const emailBody = [
        `Dear G-Rish Pharma Export & Technical Team,`,
        ``,
        `I would like to submit the following pharmaceutical inquiry:`,
        ``,
        `==================================================`,
        `CLIENT & COMPANY DETAILS:`,
        `==================================================`,
        `Full Name: ${fullName}`,
        `Organization / Company: ${company}`,
        `Official Email Address: ${email}`,
        `Phone / WhatsApp: ${phone}`,
        `Target Market / Destination Country: ${country}`,
        ``,
        `==================================================`,
        `INQUIRY SPECIFICATIONS:`,
        `==================================================`,
        `Inquiry Type: ${isVisit ? 'Facility Inspection Visit (Navi Mumbai / Gujarat / Hyderabad)' : 'Product Quotation & Sourcing Request'}`,
        `Therapeutic Category / Service: ${categoryText}`,
        ``,
        `Detailed Requirements / Specifications:`,
        `${message || '(No additional comments provided)'}`,
        ``,
        `==================================================`,
        `Submitted via G-Rish Pharma Pvt. Ltd. Web Portal`,
        `Headquarters: 337-338, Commodity Exchange Building, Sector - 19A, Vashi, Navi Mumbai - 400705, INDIA`,
        `Website: G-Rish Pharma Pvt. Ltd.`
      ].join('\r\n');

      submitBtn.disabled = true;
      submitBtn.querySelector('span').textContent = 'Opening Your Email...';

      // Construct mailto link
      const mailtoUrl = `mailto:${encodeURIComponent(recipient)}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(emailBody)}`;

      // 1. Trigger the mailto protocol to launch default mail app (Outlook, Apple Mail, Thunderbird, Gmail)
      window.location.href = mailtoUrl;

      // 2. Display confirmed guidance box with fallback button and copy button
      setTimeout(() => {
        submitBtn.disabled = false;
        submitBtn.querySelector('span').textContent = isVisit
          ? 'Book Facility Inspection Visit'
          : 'Send Product Quotation Request';

        statusEl.className = 'form-status success';
        statusEl.style.display = 'block';
        statusEl.innerHTML = `
          <div style="margin-bottom: 8px;">
            <strong style="font-size: 1.05rem;">✉️ Opening Your Email Client...</strong>
          </div>
          <p>We've pre-filled your entire inquiry addressed to <strong>${recipient}</strong>.</p>
          <p style="margin-top: 6px; color: #cbd5e1; font-size: 0.86rem;">
            Please check your opened email client (such as Outlook, Apple Mail, or webmail) and click <strong>Send</strong> to dispatch it directly to our team.
          </p>
          <div style="margin-top: 14px; display: flex; gap: 10px; flex-wrap: wrap;">
            <a href="${mailtoUrl}" class="btn btn-primary" style="padding: 7px 16px; font-size: 0.82rem; text-decoration: none;">
              Re-open Email App
            </a>
            <button type="button" class="btn btn-outline" id="btnCopyEmailText" style="padding: 7px 16px; font-size: 0.82rem;">
              📋 Copy Inquiry Details
            </button>
          </div>
        `;

        // Wire up copy button
        const copyBtn = document.getElementById('btnCopyEmailText');
        if (copyBtn) {
          copyBtn.addEventListener('click', () => {
            navigator.clipboard.writeText(emailBody).then(() => {
              copyBtn.textContent = '✔ Copied to Clipboard!';
              setTimeout(() => {
                copyBtn.textContent = '📋 Copy Inquiry Details';
              }, 2500);
            });
          });
        }
      }, 500);
    });
  }
}

/* ==========================================================================
   7. Mobile Navigation Toggle & Quick Actions Controller
   ========================================================================== */
function initMobileNav() {
  const toggle = document.getElementById('mobileToggle');
  const navMenu = document.getElementById('navMenu');
  const backdrop = document.getElementById('navBackdrop');
  const btnMobileVisit = document.getElementById('btnMobileVisit');
  const btnMobileRfq = document.getElementById('btnMobileRfq');
  const btnStickyRfq = document.getElementById('btnStickyRfq');

  if (!toggle || !navMenu) return;

  function closeMenu() {
    navMenu.classList.remove('open');
    toggle.classList.remove('open');
    toggle.setAttribute('aria-expanded', 'false');
    if (backdrop) backdrop.classList.remove('open');
    document.body.classList.remove('menu-open');
  }

  function openMenu() {
    navMenu.classList.add('open');
    toggle.classList.add('open');
    toggle.setAttribute('aria-expanded', 'true');
    if (backdrop) backdrop.classList.add('open');
    document.body.classList.add('menu-open');
  }

  function toggleMenu() {
    if (navMenu.classList.contains('open')) {
      closeMenu();
    } else {
      openMenu();
    }
  }

  toggle.addEventListener('click', (e) => {
    e.stopPropagation();
    toggleMenu();
  });

  // Tap on blurred backdrop closes drawer
  if (backdrop) {
    backdrop.addEventListener('click', () => {
      closeMenu();
    });
  }

  // Tap on any navigation link closes drawer and navigates
  document.querySelectorAll('.nav-link').forEach((link) => {
    link.addEventListener('click', () => {
      closeMenu();
    });
  });

  // Mobile Drawer Action: Schedule Plant Visit
  if (btnMobileVisit) {
    btnMobileVisit.addEventListener('click', () => {
      closeMenu();
      const tabVisit = document.getElementById('tabVisit');
      if (tabVisit) tabVisit.click();
      const contactSection = document.getElementById('contact');
      if (contactSection) {
        contactSection.scrollIntoView({ behavior: 'smooth' });
      }
    });
  }

  // Mobile Drawer Action: Request Fast Quote
  if (btnMobileRfq) {
    btnMobileRfq.addEventListener('click', () => {
      closeMenu();
      const tabRfq = document.getElementById('tabRfq');
      if (tabRfq) tabRfq.click();
      const contactSection = document.getElementById('contact');
      if (contactSection) {
        contactSection.scrollIntoView({ behavior: 'smooth' });
      }
    });
  }

  // Floating Bottom Sticky Dock: Fast Quote
  if (btnStickyRfq) {
    btnStickyRfq.addEventListener('click', () => {
      closeMenu();
      const tabRfq = document.getElementById('tabRfq');
      if (tabRfq) tabRfq.click();
      const contactSection = document.getElementById('contact');
      if (contactSection) {
        contactSection.scrollIntoView({ behavior: 'smooth' });
      }
    });
  }

  // Close drawer on ESC key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && navMenu.classList.contains('open')) {
      closeMenu();
    }
  });
}

/* Helper to prevent XSS in client-rendered text */
function escapeHtml(str) {
  if (!str) return '';
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}
