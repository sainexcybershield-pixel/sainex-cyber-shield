/**
 * Sainex Cyber Shield - Core Interactive JavaScript
 * Enterprise IT Infrastructure, Surveillance & Network Defense
 * Locations: Surat & Mandvi, Gujarat | Phone: +91 81605 10524
 */

function escapeHTML(str) {
  if (typeof str !== 'string') return '';
  return str.replace(/[&<>'"]/g, 
    tag => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[tag] || tag)
  );
}

document.addEventListener('DOMContentLoaded', () => {
  initMobileMenu();
  initHeroCanvas();
  initCounterStats();
  initIndustryTabs();
  initAMCCalculator();
  initContactForms();
  initModals();
  initScrollEffects();
  initAnalytics();
});

/* ==========================================================================
   1. Interactive Hero Background Canvas (Cyber Node Constellation)
   ========================================================================== */
function initHeroCanvas() {
  const canvas = document.getElementById('cyberHeroCanvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let width = (canvas.width = canvas.parentElement.offsetWidth);
  let height = (canvas.height = canvas.parentElement.offsetHeight);

  const particles = [];
  const particleCount = Math.min(Math.floor(width / 18), 70);
  const mouse = { x: null, y: null, radius: 120 };

  window.addEventListener('resize', () => {
    width = canvas.width = canvas.parentElement.offsetWidth;
    height = canvas.height = canvas.parentElement.offsetHeight;
  });

  window.addEventListener('mousemove', (e) => {
    const rect = canvas.getBoundingClientRect();
    mouse.x = e.clientX - rect.left;
    mouse.y = e.clientY - rect.top;
  });

  window.addEventListener('mouseleave', () => {
    mouse.x = null;
    mouse.y = null;
  });

  class Particle {
    constructor() {
      this.x = Math.random() * width;
      this.y = Math.random() * height;
      this.vx = (Math.random() - 0.5) * 0.75;
      this.vy = (Math.random() - 0.5) * 0.75;
      this.radius = Math.random() * 2 + 1.2;
      this.color = Math.random() > 0.3 ? '#00f0ff' : '#3b82f6';
    }

    update() {
      this.x += this.vx;
      this.y += this.vy;

      if (this.x < 0 || this.x > width) this.vx *= -1;
      if (this.y < 0 || this.y > height) this.vy *= -1;

      // Mouse gentle repulse/attract
      if (mouse.x !== null && mouse.y !== null) {
        const dx = mouse.x - this.x;
        const dy = mouse.y - this.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < mouse.radius) {
          const force = (mouse.radius - dist) / mouse.radius;
          this.x -= (dx / dist) * force * 2;
          this.y -= (dy / dist) * force * 2;
        }
      }
    }

    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      ctx.fillStyle = this.color;
      ctx.shadowBlur = 8;
      ctx.shadowColor = this.color;
      ctx.fill();
      ctx.shadowBlur = 0;
    }
  }

  for (let i = 0; i < particleCount; i++) {
    particles.push(new Particle());
  }

  function connect() {
    for (let a = 0; a < particles.length; a++) {
      for (let b = a + 1; b < particles.length; b++) {
        const dx = particles[a].x - particles[b].x;
        const dy = particles[a].y - particles[b].y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < 130) {
          const opacity = (1 - distance / 130) * 0.22;
          ctx.strokeStyle = `rgba(0, 240, 255, ${opacity})`;
          ctx.lineWidth = 0.8;
          ctx.beginPath();
          ctx.moveTo(particles[a].x, particles[a].y);
          ctx.lineTo(particles[b].x, particles[b].y);
          ctx.stroke();
        }
      }
    }
  }

  function animate() {
    ctx.clearRect(0, 0, width, height);
    for (let i = 0; i < particles.length; i++) {
      particles[i].update();
      particles[i].draw();
    }
    connect();
    requestAnimationFrame(animate);
  }

  animate();
}

/* ==========================================================================
   2. Mobile Navigation Drawer
   ========================================================================== */
function initMobileMenu() {
  const toggleBtn = document.getElementById('mobileMenuToggle');
  const closeBtn = document.getElementById('mobileMenuClose');
  const drawer = document.getElementById('mobileDrawer');
  const overlay = document.getElementById('mobileOverlay');
  const navLinks = document.querySelectorAll('.mobile-nav-link');

  function openMenu() {
    drawer.classList.remove('translate-x-full');
    overlay.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
  }

  function closeMenu() {
    drawer.classList.add('translate-x-full');
    overlay.classList.add('hidden');
    document.body.style.overflow = '';
  }

  if (toggleBtn) toggleBtn.addEventListener('click', openMenu);
  if (closeBtn) closeBtn.addEventListener('click', closeMenu);
  if (overlay) overlay.addEventListener('click', closeMenu);

  navLinks.forEach((link) => {
    link.addEventListener('click', closeMenu);
  });
}

/* ==========================================================================
   3. Animated Counter for Trust Badges
   ========================================================================== */
function initCounterStats() {
  const counters = document.querySelectorAll('.counter-val');
  let animated = false;

  function runCounters() {
    counters.forEach((counter) => {
      const target = parseFloat(counter.getAttribute('data-target'));
      const decimals = parseInt(counter.getAttribute('data-decimals') || '0', 10);
      const prefix = counter.getAttribute('data-prefix') || '';
      const suffix = counter.getAttribute('data-suffix') || '';
      const duration = 1800;
      const startTime = performance.now();

      function update(now) {
        const elapsed = now - startTime;
        const progress = Math.min(elapsed / duration, 1);
        // easeOutQuart
        const ease = 1 - Math.pow(1 - progress, 4);
        const current = target * ease;

        counter.textContent = prefix + (decimals > 0 ? current.toFixed(decimals) : Math.floor(current)) + suffix;

        if (progress < 1) {
          requestAnimationFrame(update);
        } else {
          counter.textContent = prefix + (decimals > 0 ? target.toFixed(decimals) : target) + suffix;
        }
      }
      requestAnimationFrame(update);
    });
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && !animated) {
          animated = true;
          runCounters();
        }
      });
    },
    { threshold: 0.3 }
  );

  const statsSection = document.getElementById('statsSection');
  if (statsSection) observer.observe(statsSection);
}

/* ==========================================================================
   3.5 Interactive Problem Diagnostic Tool (English Enterprise Solutions)
   ========================================================================== */
const problemData = {
  cctv_blur: {
    title: 'Night-Vision Number Plate & Facial Blur Diagnostic',
    severity: 'High Operational & Security Risk',
    rootCause: 'Standard 2MP cameras drop frame rates and light exposure in dark environments, causing infrared glare, dark shadows, and unreadable vehicle registration plates.',
    solutionSteps: [
      'Upgrade to Hikvision 4K AcuSense ColorVu cameras with f/1.0 super-aperture lenses capturing full daytime color even at 0.0005 Lux pitch darkness.',
      'Configure Motorized Varifocal Optical Zoom lenses specifically aligned to capture entry and exit gate speed bumps.',
      'Deploy 4K H.265+ NVRs loaded with Western Digital Purple Pro 24/7 surveillance hard drives in fault-tolerant RAID-5 arrays.'
    ],
    recommendedOEM: ['Hikvision 4K DarkFighter', 'CP Plus 4K AI Guard', 'Western Digital Purple Pro'],
    timeline: 'Site Inspection & Deployment completed within 24 to 48 Hours with zero plant disruption.',
    whatsappText: 'Hi Sainex Cyber Shield, I am facing blurry night CCTV footage and unreadable number plates. Please schedule a free 4K camera audit.'
  },
  tally_slow: {
    title: 'Tally Prime Multi-User Lag & Remote Branch Freeze Diagnostic',
    severity: 'Billing Disruption & Accounting Lock Risk',
    rootCause: 'Running shared company data folders on consumer desktop PCs bottlenecks when 5+ users post vouchers simultaneously, causing data locks and server latency.',
    solutionSteps: [
      'Deploy dedicated enterprise Windows / Linux server with Enterprise NVMe SSDs in hardware RAID-1 mirroring for instant read/write access.',
      'Implement multi-VLAN network segmentation prioritizing Tally traffic with ultra-low latency over local Wi-Fi.',
      'Configure automated Synology NAS snapshots backing up Tally data hourly to secure local storage and off-site cloud vaults.'
    ],
    recommendedOEM: ['Dell PowerEdge Server', 'Synology Enterprise NAS', 'Sophos XGS VPN'],
    timeline: 'Turnkey Server Setup & Migration completed within 24 Hours with zero data loss.',
    whatsappText: 'Hi Sainex Cyber Shield, our Tally Prime is slow and freezing during peak billing hours. Please suggest a dedicated server solution.'
  },
  wifi_drop: {
    title: 'Industrial Shed & Campus Wi-Fi Disconnect Diagnostic',
    severity: 'Logistics & Barcode Scanner Downtime',
    rootCause: 'High electromagnetic interference from industrial machinery, metal roofs, and lack of 802.11k/v/r seamless roaming protocols in ordinary access points.',
    solutionSteps: [
      'Install industrial Wi-Fi 6 mesh access points with beamforming technology penetrating dense textile machinery.',
      'Lay 6-core armored outdoor fiber optic backbones linking administrative offices to remote grey godowns and boiler blocks.',
      'Deploy Cisco / Ubiquiti UniFi Cloud Gateway providing centralized single-pane-of-glass management with isolated guest portals.'
    ],
    recommendedOEM: ['Ubiquiti UniFi 6 Pro', 'Cisco Catalyst Managed PoE', 'Finolex Armored Fiber'],
    timeline: 'Fiber Splicing & Wireless Mesh Commissioning in 1 to 2 Days with documented test reports.',
    whatsappText: 'Hi Sainex Cyber Shield, we have Wi-Fi disconnect issues in our factory/warehouse. Please schedule a wireless site survey.'
  },
  vendor_delay: {
    title: 'Delayed IT Support & Unscheduled Business Downtime Diagnostic',
    severity: 'Daily Revenue Loss & Frustration',
    rootCause: 'Freelance or uncertified IT technicians lack dedicated on-ground mobile vans, replacement spare units, and contractual SLA accountability.',
    solutionSteps: [
      'Enroll in Sainex Silver or Gold Comprehensive AMC with contractually committed 4-hour or 2-hour on-site arrival.',
      'Keep pre-configured hot-swap loaner routers, switches, and NVRs on standby in mobile technician vans for immediate temporary replacement.',
      'Receive quarterly preventative maintenance visits including thermal imaging of racks, cable health certification, and lens refocusing.'
    ],
    recommendedOEM: ['Sainex Dedicated Mobile Fleet', 'Standby Hot-Swap Hardware', 'Contractual SLA Guarantee'],
    timeline: 'Immediate AMC Onboarding with Same-Day Equipment Health Audit across Surat & Mandvi.',
    whatsappText: 'Hi Sainex Cyber Shield, our current IT vendor is unresponsive during downtime. Please share your enterprise AMC details.'
  }
};

window.diagnoseProblem = function(key) {
  const data = problemData[key];
  const outputEl = document.getElementById('diagnosticOutput');
  if (!data || !outputEl) return;

  // Update pill active classes
  const pills = document.querySelectorAll('.problem-pill');
  pills.forEach((p) => {
    if (p.id === 'prob_' + key) {
      p.classList.add('active', 'border-orange-500/50', 'bg-orange-500/10');
      p.classList.remove('border-slate-800', 'bg-slate-900/60');
    } else {
      p.classList.remove('active', 'border-orange-500/50', 'bg-orange-500/10');
      p.classList.add('border-slate-800', 'bg-slate-900/60');
    }
  });

  const waLink = 'https://wa.me/918160510524?text=' + encodeURIComponent(data.whatsappText);

  outputEl.innerHTML = `
    <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
      <div class="lg:col-span-8 space-y-4">
        <div class="flex items-center gap-2">
          <span class="px-2.5 py-0.5 rounded-full text-[11px] font-mono font-bold uppercase bg-red-500/10 text-red-400 border border-red-500/20">
            ${data.severity}
          </span>
          <span class="text-xs font-mono text-slate-400">&bull; Verified Field Solution</span>
        </div>

        <h3 class="text-2xl font-bold text-white tracking-tight">${data.title}</h3>
        
        <div class="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-1">
          <span class="text-xs font-mono uppercase tracking-wider text-orange-400 font-bold block">Root Cause Analysis:</span>
          <p class="text-xs sm:text-sm text-slate-300 leading-relaxed">${data.rootCause}</p>
        </div>

        <div class="space-y-2 pt-1">
          <span class="text-xs font-mono uppercase tracking-wider text-slate-400 font-bold block">Sainex Engineered Solution:</span>
          <ul class="space-y-2.5 text-xs sm:text-sm text-slate-200">
            ${data.solutionSteps.map(step => `
              <li class="flex items-start gap-2.5">
                <span class="w-5 h-5 rounded-full bg-orange-500/20 text-orange-400 flex items-center justify-center shrink-0 mt-0.5 text-xs font-bold font-mono">✓</span>
                <span>${step}</span>
              </li>
            `).join('')}
          </ul>
        </div>
      </div>

      <div class="lg:col-span-4 space-y-4 lg:border-l lg:border-slate-800 lg:pl-6">
        <div class="p-4 rounded-xl bg-slate-950/70 border border-slate-800 space-y-2">
          <span class="text-xs font-mono text-slate-400 uppercase tracking-widest block font-bold">Recommended Hardware</span>
          <div class="flex flex-wrap gap-1.5">
            ${data.recommendedOEM.map(item => `
              <span class="text-xs font-mono px-2.5 py-1 rounded bg-slate-900 text-slate-300 border border-slate-800">
                ${item}
              </span>
            `).join('')}
          </div>
        </div>

        <div class="p-4 rounded-xl bg-orange-950/30 border border-orange-500/30 space-y-1">
          <span class="text-xs font-mono text-orange-400 uppercase tracking-widest block font-bold">Estimated SLA Window</span>
          <p class="text-xs text-slate-200 leading-relaxed">${data.timeline}</p>
        </div>

        <div class="space-y-2 pt-2">
          <a href="${waLink}" target="_blank" rel="noopener" class="w-full btn-whatsapp py-3 rounded-xl text-xs font-bold uppercase tracking-wider text-center flex items-center justify-center gap-2">
            WhatsApp an Engineer Now
          </a>
          <button onclick="openModal('surveyModal')" class="w-full btn-brand-primary py-3 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2">
            Schedule Free On-Site Inspection
          </button>
        </div>
      </div>
    </div>
  `;
};

function initDiagnosticTool() {
  diagnoseProblem('cctv_blur');
}

/* ==========================================================================
   4. Industry Tabs Switcher
   ========================================================================== */
const industryData = {
  textile: {
    title: 'Textile Mills & Dyeing Units (Surat & Mandvi Hubs)',
    tagline: 'High-dust, moisture-tolerant industrial networks & plant-wide perimeter surveillance',
    description:
      'Surat and Mandvi host India’s largest textile printing, weaving, and chemical processing complexes. These expansive multi-acre facilities suffer from lint dust, electrical noise, high temperatures, and vast cable runs between looms and administrative blocks.',
    solutions: [
      'Industrial IP67 weatherproof 4K bullet CCTV cameras with smart wiper lenses for high-lint loom sheds.',
      'Armored fiber optic backbone linking administrative blocks, weaving sheds, grey godowns, and boiler areas with zero packet drop.',
      'Biometric fingerprint & facial recognition terminals with moisture-resistant optical sensors for rough worker hand conditions.',
      'Centralized Security Operations Center (SOC) room in administrative office for live viewing of 64+ camera feeds.',
      'Bandwidth QoS prioritizing ERP / Tally billing data over general internet during high-volume dispatch hours.'
    ],
    recommendedOEM: ['Hikvision DarkFighter', 'Cisco Catalyst Industrial', 'Matrix Comsec Biometrics', 'D-Link Industrial Switches'],
    guarantee: '4-Hour Emergency Dispatch to Surat Ring Road, Pandesara, Sachin GIDC & Mandvi Industrial Belt.'
  },
  diamond: {
    title: 'Diamond Cutting, Polishing & Jewellery Units',
    tagline: 'Microscopic precision 4K zoom surveillance, vault biometrics & zero-leak data security',
    description:
      'Diamond processing facilities in Katargam, Varachha, and Mahidharpura require the highest echelon of loss-prevention surveillance, restricted access airlocks, and encrypted IT infrastructure to guard confidential trading data.',
    solutions: [
      'Ultra-HD 4K cameras with motorized optical varifocal lenses focused on sorting and grading tables with micro-clarity.',
      'Multi-factor authentication (Biometric Facial Scan + Mifare Smart Card) interlocking doors for diamond vault security.',
      'Sophos / Fortinet Next-Gen UTM Firewall with Zero-Trust Network Access (ZTNA) preventing unauthorized device data exfiltration.',
      'Redundant local NVR arrays with RAID-5 data security and cloud sync for 90-day mandated compliance video archiving.',
      'Anti-tamper sensor integration triggering instantaneous sirens and SMS/WhatsApp alerts upon lens blockage.'
    ],
    recommendedOEM: ['Sophos XGS Next-Gen Firewall', 'Hikvision 4K AcuSense', 'Matrix Door Interlocking', 'Western Digital Purple Pro'],
    guarantee: 'Mission-critical 2-Hour emergency SLA with standby hot-swap loaner hardware.'
  },
  corporate: {
    title: 'Corporate Offices & IT Tech Parks',
    tagline: 'High-speed gigabit mesh Wi-Fi, conference A/V networking & Fortinet/Sophos gateway defense',
    description:
      'Modern corporate headquarters, CA firms, export houses, and consulting agencies in Piplod, Vesu, and Adajan demand seamless Wi-Fi roaming, isolated guest networks, and rock-solid cyber defense against ransomware and phishing attacks.',
    solutions: [
      'Enterprise Wi-Fi 6 Mesh access points with seamless zero-handoff roaming between boardrooms and cubicles.',
      'Multi-VLAN network segmentation isolating internal finance servers, Tally clients, IoT printers, and guest visitor portals.',
      'Site-to-Site IPsec VPN connecting Surat corporate HQ to branch offices in Mandvi, Mumbai, or Ahmedabad.',
      'Dedicated Windows/Linux Application & Tally Prime server provisioning with scheduled automated NAS cloud backups.',
      'Automated employee attendance sync with cloud HRMS and motorized electromagnetic access control.'
    ],
    recommendedOEM: ['Ubiquiti UniFi 6', 'Fortinet FortiGate UTM', 'Synology Enterprise NAS', 'Cisco Managed Switches'],
    guarantee: 'Comprehensive AMC with proactive monthly vulnerability & speed health audits.'
  },
  retail: {
    title: 'Retail Showrooms & Multi-Store Supermarkets',
    tagline: 'Anti-theft cash-counter surveillance, footfall heatmaps & POS network redundancy',
    description:
      'Large retail stores and multi-chain showrooms along Ghod Dod Road, VIP Road, and Mandvi market need smart surveillance to prevent stock shrinkage, resolve billing disputes, and monitor customer foot traffic patterns.',
    solutions: [
      'Wide-angle 4K dome cameras with built-in audio recording overlooking cash counters and POS billing stations.',
      'AI heatmapping and customer demographic counters analyzing peak shopping hours and display engagement.',
      'Failover dual-WAN router automatically switching to 4G/5G backup when primary fiber drops, preventing POS billing halt.',
      'Centralized mobile viewing app allowing store owners to view all franchise branches simultaneously from any smartphone.',
      'Discreet anti-shoplifting camera placement across high-value aisles with night-vision perimeter patrol.'
    ],
    recommendedOEM: ['CP Plus 4K AI Guard', 'D-Link Smart Managed PoE', 'Dahua WizSense', 'Seagate SkyHawk AI'],
    guarantee: 'Doorstep preventative servicing within 12 hours including lens cleaning and storage health checks.'
  },
  township: {
    title: 'Gated Townships & Housing Societies',
    tagline: 'AI ANPR number plate recognition boom barriers, perimeter infrared beams & intercoms',
    description:
      'Premium residential societies, high-rises, and gated farmhouses in Surat & Mandvi require robust perimeter defense, automated resident vehicle entry, and foolproof visitor logging to ensure family peace of mind.',
    solutions: [
      'Automatic Number Plate Recognition (ANPR) cameras synced with automatic boom barriers for frictionless resident car entry.',
      'Perimeter infrared tripwire beams sounding alerts upon unauthorized fence crossing or boundary intrusion.',
      'Full clubhouse, lift lobby, and parking basement CCTV coverage with vandal-proof IK10 outdoor housings.',
      'IP Video Intercom integration enabling flat owners to see and speak to visitors at the main security gate via mobile app.',
      'Custom Society Maintenance Dashboard and display screen setup for security guard cabins.'
    ],
    recommendedOEM: ['Hikvision ANPR & Video Intercom', 'Matrix Boom Barriers', 'CP Plus Vandal-Proof Dome', 'Finolex Cat6 Cabling'],
    guarantee: 'Resident committee quarterly presentation, footage recovery assistance & 24/7 emergency guard support.'
  }
};

function initIndustryTabs() {
  const tabButtons = document.querySelectorAll('.industry-tab-btn');
  const titleEl = document.getElementById('indTitle');
  const taglineEl = document.getElementById('indTagline');
  const descEl = document.getElementById('indDesc');
  const solutionsEl = document.getElementById('indSolutions');
  const oemEl = document.getElementById('indOEM');
  const guaranteeEl = document.getElementById('indGuarantee');

  if (!tabButtons.length || !titleEl) return;

  function setIndustry(key) {
    const data = industryData[key];
    if (!data) return;

    tabButtons.forEach((btn) => {
      if (btn.getAttribute('data-industry') === key) {
        btn.classList.add('active', 'border-cyan-400', 'bg-cyan-500/10', 'text-cyan-400');
        btn.classList.remove('border-slate-800', 'text-slate-400', 'bg-slate-900/60');
      } else {
        btn.classList.remove('active', 'border-cyan-400', 'bg-cyan-500/10', 'text-cyan-400');
        btn.classList.add('border-slate-800', 'text-slate-400', 'bg-slate-900/60');
      }
    });

    titleEl.textContent = data.title;
    taglineEl.textContent = data.tagline;
    descEl.textContent = data.description;

    solutionsEl.innerHTML = data.solutions
      .map(
        (sol) => `
      <li class="flex items-start gap-3">
        <span class="w-5 h-5 rounded-full bg-cyan-500/20 text-cyan-400 flex items-center justify-center shrink-0 mt-0.5 text-xs font-bold font-mono">✓</span>
        <span class="text-slate-300 text-sm md:text-base">${sol}</span>
      </li>`
      )
      .join('');

    oemEl.innerHTML = data.recommendedOEM
      .map(
        (brand) => `
      <span class="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium font-mono bg-blue-500/10 text-blue-300 border border-blue-500/30">
        ${brand}
      </span>`
      )
      .join('');

    guaranteeEl.textContent = data.guarantee;
  }

  tabButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      const key = btn.getAttribute('data-industry');
      setIndustry(key);
    });
  });

  // Default to textile
  setIndustry('textile');
}

/* ==========================================================================
   5. Interactive AMC & IT Infrastructure Scope Calculator
   ========================================================================== */
function initAMCCalculator() {
  const calcIndustry = document.getElementById('calcIndustry');
  const calcCameras = document.getElementById('calcCameras');
  const calcNodes = document.getElementById('calcNodes');
  const calcFirewall = document.getElementById('calcFirewall');
  const calcTier = document.getElementById('calcTier');

  const outSLA = document.getElementById('outSLA');
  const outVisits = document.getElementById('outVisits');
  const outLoaner = document.getElementById('outLoaner');
  const outSummary = document.getElementById('outSummary');
  const whatsappCalcBtn = document.getElementById('whatsappCalcBtn');
  const bookCalcBtn = document.getElementById('bookCalcBtn');

  if (!calcIndustry || !outSLA) return;

  function updateEstimate() {
    const industry = calcIndustry.options[calcIndustry.selectedIndex].text;
    const cams = calcCameras.value;
    const nodes = calcNodes.value;
    const fw = calcFirewall.value;
    const tier = calcTier.value;

    let sla = 'Next-Business-Day SLA (12-24h)';
    let visits = 'Quarterly (4 Audits/Year)';
    let loaner = 'Standard Bench Repair Protocol';
    let tierName = 'Bronze Standard Plan';

    if (tier === 'silver') {
      sla = 'Same-Day Priority SLA (4-6 Hours)';
      visits = 'Bi-Monthly (6 Audits/Year)';
      loaner = 'Critical Spares Standby (Router/Switch/Camera)';
      tierName = 'Silver Enterprise Plan';
    } else if (tier === 'gold') {
      sla = 'Rapid Priority SLA (2-4 Hours Operational)';
      visits = 'Monthly Comprehensive Audits (12/Year)';
      loaner = 'Full Hot-Swap Spares Standby (NVR/Firewall/Switch)';
      tierName = 'Gold 24x7 Mission-Critical';
    }

    outSLA.textContent = sla;
    outVisits.textContent = visits;
    outLoaner.textContent = loaner;

    const summaryText = `${industry} | ${cams} Cameras | ${nodes} Network Nodes | ${fw} Security | ${tierName}`;
    outSummary.textContent = summaryText;

    // Configure WhatsApp query link
    const waText = encodeURIComponent(
      `Hi Sainex Cyber Shield, I configured an IT & Surveillance requirement for my business:\n\n` +
      `• Industry: ${industry}\n` +
      `• Surveillance Scale: ${cams}\n` +
      `• IT Network Nodes: ${nodes}\n` +
      `• Security Gateway: ${fw}\n` +
      `• Preferred SLA Tier: ${tierName}\n` +
      `• Expected SLA: ${sla}\n\n` +
      `Please provide an official proposal and schedule a free doorstep audit in Surat / Mandvi.`
    );
    whatsappCalcBtn.href = `https://wa.me/918160510524?text=${waText}`;

    // Store in global window for Doorstep modal auto-fill
    window.lastCalculatedSetup = summaryText;
  }

  [calcIndustry, calcCameras, calcNodes, calcFirewall, calcTier].forEach((input) => {
    input.addEventListener('change', updateEstimate);
  });

  updateEstimate();

  if (bookCalcBtn) {
    bookCalcBtn.addEventListener('click', () => {
      openModal('surveyModal');
      const surveyNotes = document.getElementById('surveyNotes');
      if (surveyNotes && window.lastCalculatedSetup) {
        surveyNotes.value = `Configured Scope from Calculator: ${window.lastCalculatedSetup}`;
      }
    });
  }
}

/* ==========================================================================
   6. Contact Forms & WhatsApp Direct Forwarding
   ========================================================================== */
function initContactForms() {
  const mainContactForm = document.getElementById('mainContactForm');
  const directWhatsAppBtn = document.getElementById('directWhatsAppContactBtn');
  const serviceDropdown = document.getElementById('contactService');

  // Pre-fill service from Service Cards
  window.selectServiceAndScroll = function (serviceName) {
    if (serviceDropdown) {
      for (let i = 0; i < serviceDropdown.options.length; i++) {
        if (serviceDropdown.options[i].value.toLowerCase().includes(serviceName.toLowerCase())) {
          serviceDropdown.selectedIndex = i;
          break;
        }
      }
    }
    const contactSection = document.getElementById('contactSection');
    if (contactSection) {
      contactSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  if (directWhatsAppBtn && mainContactForm) {
    directWhatsAppBtn.addEventListener('click', (e) => {
      e.preventDefault();
      const honey = mainContactForm.querySelector('input[name="_gotcha_honey"]')?.value;
      if (honey) return; // Silent discard bot

      const name = document.getElementById('contactName')?.value?.trim() || 'Prospective Client';
      const company = document.getElementById('contactCompany')?.value?.trim() || 'Business in Surat/Mandvi';
      const phone = document.getElementById('contactPhone')?.value?.trim() || '';
      const service = serviceDropdown?.value || 'IT Infrastructure & Surveillance Solutions';
      const city = document.getElementById('contactCity')?.value || 'Surat / Mandvi';
      const message = document.getElementById('contactMessage')?.value?.trim() || 'Please schedule an on-site survey.';

      const phoneClean = phone.replace(/\D/g, '');
      const errBox = document.getElementById('contactFormError');
      if (phoneClean.length < 10) {
        if (errBox) {
          errBox.textContent = '⚠ Please enter a valid 10-digit contact number before launching WhatsApp.';
          errBox.classList.remove('hidden');
        }
        document.getElementById('contactPhone')?.focus();
        return;
      }
      if (errBox) errBox.classList.add('hidden');

      const waMessage = encodeURIComponent(
        `*New Inquiry via Sainex Cyber Shield Portal:*\n\n` +
        `👤 *Name:* ${name}\n` +
        `🏢 *Company:* ${company}\n` +
        `📞 *Phone:* ${phone}\n` +
        `📍 *Location:* ${city}\n` +
        `🛠️ *Service Required:* ${service}\n` +
        `📝 *Requirement:* ${message}\n\n` +
        `_Sent from sainexcybershield.online web console._`
      );

      // Use api.whatsapp.com for universal mobile app handoff
      window.open(`https://api.whatsapp.com/send?phone=918160510524&text=${waMessage}`, '_blank');
    });
  }

  if (mainContactForm) {
    let isSubmitting = false;

    mainContactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      if (isSubmitting) return;

      const honey = mainContactForm.querySelector('input[name="_gotcha_honey"]')?.value;
      if (honey) return; // Silent discard bot

      const submitBtn = mainContactForm.querySelector('button[type="submit"]');
      const errBox = document.getElementById('contactFormError');
      const originalText = submitBtn.innerHTML;

      const name = document.getElementById('contactName')?.value?.trim() || '';
      const phone = document.getElementById('contactPhone')?.value?.trim() || '';
      const phoneDigits = phone.replace(/\D/g, '');

      // Validation
      if (!name) {
        if (errBox) {
          errBox.textContent = '⚠ Please enter your full name.';
          errBox.classList.remove('hidden');
        }
        document.getElementById('contactName')?.focus();
        return;
      }

      if (phoneDigits.length < 10) {
        if (errBox) {
          errBox.textContent = '⚠ Please enter a valid 10-digit mobile number for doorstep dispatch.';
          errBox.classList.remove('hidden');
        }
        document.getElementById('contactPhone')?.focus();
        return;
      }

      if (errBox) errBox.classList.add('hidden');

      isSubmitting = true;
      submitBtn.disabled = true;
      submitBtn.innerHTML = `
        <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white inline-block" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
        </svg> Dispatching Request...`;

      setTimeout(() => {
        isSubmitting = false;
        submitBtn.disabled = false;
        submitBtn.innerHTML = `✓ Request Received!`;
        submitBtn.classList.remove('btn-securus-red');
        submitBtn.classList.add('bg-emerald-600', 'text-white');

        let statusAlert = document.getElementById('contactFormStatus');
        if (!statusAlert) {
          statusAlert = document.createElement('div');
          statusAlert.id = 'contactFormStatus';
          statusAlert.className = 'mt-4 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono leading-relaxed';
          mainContactForm.appendChild(statusAlert);
        }
        statusAlert.innerHTML = `<strong>✓ Inquiry Received:</strong> Our systems engineers in Surat & Mandvi have received your request. We will reach out within 30 minutes, or you can chat directly via WhatsApp.`;
        statusAlert.classList.remove('hidden');

        showNotification(
          'Inquiry Submitted Successfully!',
          'Our South Gujarat engineering team will contact you within 30 minutes. You can also chat immediately on WhatsApp.'
        );

        // Sync lead into ERP Admin Database (localStorage)
        syncLeadToERP({
          stage: 'enquiry',
          clientName: name,
          company: document.getElementById('contactCompany')?.value?.trim() || 'Direct Client',
          phone: phone,
          location: document.getElementById('contactCity')?.value || 'Surat / Mandvi',
          service: serviceDropdown?.value || 'General IT Infrastructure',
          notes: document.getElementById('contactMessage')?.value?.trim() || 'Inquiry submitted from Contact Form'
        });

        // GA4: Form submission tracked only upon confirmed validation & processing
        trackEvent('contact_form_submit', {
          form_id: 'mainContactForm',
          service_requested: serviceDropdown?.value || 'General IT Infrastructure',
          facility_location: document.getElementById('contactCity')?.value || 'Surat / Mandvi',
          status: 'success'
        });

        setTimeout(() => {
          mainContactForm.reset();
          submitBtn.innerHTML = originalText;
          submitBtn.classList.add('btn-securus-red');
          submitBtn.classList.remove('bg-emerald-600', 'text-white');
        }, 5000);
      }, 1000);
    });
  }

  // Survey Modal Form
  const surveyForm = document.getElementById('surveyForm');
  if (surveyForm) {
    // GA4: Track when visitor starts interacting with the survey form (debounced to 1 per session)
    let surveyFormStarted = false;
    const surveyInputs = surveyForm.querySelectorAll('input, select, textarea');
    surveyInputs.forEach((input) => {
      input.addEventListener('focus', () => {
        if (!surveyFormStarted) {
          surveyFormStarted = true;
          trackEvent('survey_form_start', {
            form_id: 'surveyForm',
            first_field: input.getAttribute('placeholder') || input.tagName.toLowerCase()
          });
        }
      }, { once: true });
    });

    surveyForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const honey = surveyForm.querySelector('input[name="_gotcha_honey"]')?.value;
      if (honey) return;

      const submitBtn = surveyForm.querySelector('button[type="submit"]');
      const errBox = document.getElementById('surveyFormError');
      const originalText = submitBtn.innerHTML;

      const phoneInput = document.getElementById('surveyPhone') || surveyForm.querySelector('input[type="tel"]');
      const phoneClean = (phoneInput?.value || '').replace(/\D/g, '');

      if (phoneClean.length < 10) {
        if (errBox) {
          errBox.textContent = '⚠ Please enter a valid 10-digit mobile number for site appointment.';
          errBox.classList.remove('hidden');
        }
        phoneInput?.focus();
        return;
      }
      if (errBox) errBox.classList.add('hidden');

      submitBtn.disabled = true;
      submitBtn.innerHTML = `Confirming Slot...`;

      setTimeout(() => {
        // Sync survey booking into ERP Admin Database (localStorage)
        const sName = document.getElementById('surveyName')?.value?.trim() || 'Survey Client';
        const sCompany = document.getElementById('surveyCompany')?.value?.trim() || 'Facility Client';
        const sLoc = document.getElementById('surveyLocation')?.value || 'Surat / Mandvi';
        const sTime = document.getElementById('surveyTime')?.value || '';
        const sReq = document.getElementById('surveyNotes')?.value?.trim() || '';

        syncLeadToERP({
          stage: 'site_survey',
          clientName: sName,
          company: sCompany,
          phone: phoneClean,
          location: sLoc,
          service: 'Doorstep Free Site Survey',
          notes: `Slot: ${sTime}. Notes: ${sReq}`
        });

        closeModal('surveyModal');
        showNotification(
          'Doorstep Site Audit Booked!',
          'A certified Sainex Systems Engineer has been assigned. You will receive an appointment SMS & WhatsApp confirmation shortly.'
        );

        // GA4: Verified Doorstep Survey Form Submission
        trackEvent('survey_form_submit', {
          form_id: 'surveyForm',
          status: 'success'
        });

        surveyForm.reset();
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalText;
      }, 1000);
    });
  }
}

// Global ERP Sync Helper for localStorage
function syncLeadToERP(leadData) {
  try {
    let local = localStorage.getItem('sainex_erp_db');
    let currentDb = { pipeline: [], technicians: [] };
    if (local) {
      try {
        currentDb = JSON.parse(local);
      } catch (e) {
        currentDb = { pipeline: [], technicians: [] };
      }
    }
    const newRecord = {
      id: 'SNX-WEB-' + Math.floor(100 + Math.random() * 900),
      createdAt: new Date().toISOString(),
      stage: leadData.stage || 'enquiry',
      clientName: leadData.clientName || 'Website Client',
      company: leadData.company || 'Direct Inquiry',
      phone: leadData.phone || '',
      location: leadData.location || 'Surat / Mandvi',
      service: leadData.service || 'IT & CCTV Infrastructure',
      scopeSummary: leadData.notes || 'Online Website Enquiry',
      estimatedValue: leadData.estimatedValue || 45000,
      technician: 'Unassigned',
      notes: leadData.notes || 'Submitted via customer website form'
    };
    if (!Array.isArray(currentDb.pipeline)) currentDb.pipeline = [];
    currentDb.pipeline.unshift(newRecord);
    localStorage.setItem('sainex_erp_db', JSON.stringify(currentDb));
  } catch (err) {
    console.warn('ERP Sync Notice:', err);
  }
}

/* ==========================================================================
   7. Modals (Survey & Privacy)
   ========================================================================== */
function initModals() {
  window.openModal = function (modalId) {
    const modal = document.getElementById(modalId);
    if (!modal) return;
    modal.classList.remove('hidden');
    modal.classList.add('flex');
    document.body.style.overflow = 'hidden';
  };

  window.closeModal = function (modalId) {
    const modal = document.getElementById(modalId);
    if (!modal) return;
    modal.classList.add('hidden');
    modal.classList.remove('flex');
    document.body.style.overflow = '';
  };

  // Close with ESC key
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      const openModals = document.querySelectorAll('.modal-overlay:not(.hidden)');
      openModals.forEach((m) => closeModal(m.id));
    }
  });

  // Attach buttons
  const surveyTriggers = document.querySelectorAll('.open-survey-modal');
  surveyTriggers.forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      openModal('surveyModal');
    });
  });
}

/* ==========================================================================
   8. Scroll Effects & Floating Action Controls
   ========================================================================== */
function initScrollEffects() {
  const backToTop = document.getElementById('backToTopBtn');
  const navbar = document.getElementById('mainNavbar');

  window.addEventListener('scroll', () => {
    const scrolled = window.scrollY;

    // Header styling on scroll
    if (navbar) {
      if (scrolled > 50) {
        navbar.classList.add('bg-[#0c0c0c]/98', 'backdrop-blur-md', 'border-b', 'border-white/10', 'shadow-2xl');
      } else {
        navbar.classList.remove('bg-[#0c0c0c]/98', 'shadow-2xl');
      }
    }

    // Back to top visibility
    if (backToTop) {
      if (scrolled > 400) {
        backToTop.classList.add('visible');
      } else {
        backToTop.classList.remove('visible');
      }
    }
  });

  if (backToTop) {
    backToTop.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }
}

/* ==========================================================================
   9. Custom Notification Toast
   ========================================================================== */
function showNotification(title, message) {
  let toast = document.getElementById('cyberToast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'cyberToast';
    toast.className =
      'fixed top-6 right-6 z-[999] max-w-md w-full bg-[#141414]/98 border border-[#ff3b30]/80 text-white p-4 rounded-xl shadow-2xl backdrop-blur-xl transition-all duration-300 transform translate-y-[-20px] opacity-0 pointer-events-auto flex items-start gap-3';
    document.body.appendChild(toast);
  }

  const safeTitle = escapeHTML(title);
  const safeMsg = escapeHTML(message);

  toast.innerHTML = `
    <div class="w-8 h-8 rounded-lg bg-[#ff3b30]/20 text-[#ff3b30] flex items-center justify-center shrink-0 font-bold">
      ✓
    </div>
    <div class="flex-1">
      <h4 class="text-sm font-bold text-white font-mono tracking-wide">${safeTitle}</h4>
      <p class="text-xs text-zinc-300 mt-1 leading-relaxed">${safeMsg}</p>
    </div>
    <button onclick="this.parentElement.classList.add('opacity-0', 'translate-y-[-20px]')" class="text-zinc-400 hover:text-white text-sm">✕</button>
  `;

  // Animate in
  setTimeout(() => {
    toast.classList.remove('opacity-0', 'translate-y-[-20px]');
    toast.classList.add('opacity-100', 'translate-y-0');
  }, 50);

  // Auto dismiss after 6 seconds
  setTimeout(() => {
    toast.classList.add('opacity-0', 'translate-y-[-20px]');
    toast.classList.remove('opacity-100', 'translate-y-0');
  }, 6000);
}

/* ==========================================================================
   10. Official Instant Quotation Modal & Mobile-Friendly PDF Print
   ========================================================================== */
function printQuotationSheet() {
  const calcIndustry = document.getElementById('calcIndustry')?.selectedOptions[0]?.text || 'Enterprise Facility';
  const calcCameras = document.getElementById('calcCameras')?.value || '16-32 Cameras';
  const calcNodes = document.getElementById('calcNodes')?.value || '25-100 Nodes';
  const calcFirewall = document.getElementById('calcFirewall')?.value || 'Sophos / Fortinet UTM';
  const calcTier = document.getElementById('calcTier')?.selectedOptions[0]?.text || 'Enterprise Silver Plan';
  const outSLA = document.getElementById('outSLA')?.textContent || 'Same-Day Priority SLA (4-6 Hours)';
  const outVisits = document.getElementById('outVisits')?.textContent || 'Bi-Monthly (6/Year)';
  const outLoaner = document.getElementById('outLoaner')?.textContent || 'Critical Spares Standby';

  const quoteNo = 'SNX-EST-' + Math.floor(10000 + Math.random() * 90000);
  const today = new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });

  // Update In-Page Quotation Modal Elements
  const quoteModalNumber = document.getElementById('quoteModalNumber');
  const quoteModalDate = document.getElementById('quoteModalDate');
  const quoteModalFacility = document.getElementById('quoteModalFacility');
  const quoteModalTableBody = document.getElementById('quoteModalTableBody');
  const quoteModalSLA = document.getElementById('quoteModalSLA');
  const quoteModalVisits = document.getElementById('quoteModalVisits');
  const quoteModalLoaner = document.getElementById('quoteModalLoaner');
  const modalWhatsAppQuoteBtn = document.getElementById('modalWhatsAppQuoteBtn');

  if (quoteModalNumber) quoteModalNumber.textContent = `Quote No: ${quoteNo}`;
  if (quoteModalDate) quoteModalDate.textContent = `Date: ${today}`;
  if (quoteModalFacility) quoteModalFacility.textContent = calcIndustry;
  if (quoteModalSLA) quoteModalSLA.textContent = outSLA;
  if (quoteModalVisits) quoteModalVisits.textContent = outVisits;
  if (quoteModalLoaner) quoteModalLoaner.textContent = outLoaner;

  if (quoteModalTableBody) {
    quoteModalTableBody.innerHTML = `
      <tr class="hover:bg-zinc-50 border-b border-zinc-200">
        <td class="p-3 border border-zinc-300 font-mono text-center">01</td>
        <td class="p-3 border border-zinc-300 font-bold text-zinc-900">4K AI CCTV Surveillance System</td>
        <td class="p-3 border border-zinc-300">${escapeHTML(calcCameras)} (ColorVu Night Vision & AcuSense)</td>
        <td class="p-3 border border-zinc-300 text-zinc-600 font-mono text-[11px]">Hikvision / CP Plus</td>
      </tr>
      <tr class="hover:bg-zinc-50 border-b border-zinc-200">
        <td class="p-3 border border-zinc-300 font-mono text-center">02</td>
        <td class="p-3 border border-zinc-300 font-bold text-zinc-900">Structured Network & Industrial Mesh</td>
        <td class="p-3 border border-zinc-300">${escapeHTML(calcNodes)} (Cat6 / Armored Fiber Uplink)</td>
        <td class="p-3 border border-zinc-300 text-zinc-600 font-mono text-[11px]">Cisco / Ubiquiti UniFi</td>
      </tr>
      <tr class="hover:bg-zinc-50 border-b border-zinc-200">
        <td class="p-3 border border-zinc-300 font-mono text-center">03</td>
        <td class="p-3 border border-zinc-300 font-bold text-zinc-900">Gateway Cyber Security & Firewall</td>
        <td class="p-3 border border-zinc-300">${escapeHTML(calcFirewall)}</td>
        <td class="p-3 border border-zinc-300 text-zinc-600 font-mono text-[11px]">Sophos XGS / Fortinet</td>
      </tr>
      <tr class="hover:bg-zinc-50">
        <td class="p-3 border border-zinc-300 font-mono text-center">04</td>
        <td class="p-3 border border-zinc-300 font-bold text-zinc-900">Maintenance & SLA Coverage Plan</td>
        <td class="p-3 border border-zinc-300">${escapeHTML(calcTier)}</td>
        <td class="p-3 border border-zinc-300 text-zinc-600 font-mono text-[11px]">Contractual SLA</td>
      </tr>
    `;
  }

  // Pre-fill WhatsApp Proposal sharing link
  if (modalWhatsAppQuoteBtn) {
    const waQuoteText = encodeURIComponent(
      `*Official Infrastructure Quotation - Sainex Cyber Shield*\n` +
      `📄 *Quote No:* ${quoteNo} | *Date:* ${today}\n\n` +
      `🏢 *Facility:* ${calcIndustry}\n` +
      `📹 *Surveillance:* ${calcCameras}\n` +
      `🌐 *Networking:* ${calcNodes}\n` +
      `🛡️ *Firewall:* ${calcFirewall}\n` +
      `⚡ *SLA Tier:* ${calcTier} (${outSLA})\n\n` +
      `Please review this scope proposal and confirm our on-site survey schedule.`
    );
    modalWhatsAppQuoteBtn.href = `https://api.whatsapp.com/send?phone=918160510524&text=${waQuoteText}`;
  }

  // Track Quotation Generation Request ("quotation_request")
  trackEvent('quotation_request', {
    industry: calcIndustry,
    cameras: calcCameras,
    network_nodes: calcNodes,
    firewall: calcFirewall,
    amc_tier: calcTier,
    quote_number: quoteNo
  });

  // Open the modal smoothly on both desktop and mobile (no popup blocker)
  openModal('quotationPreviewModal');
}

/* ==========================================================================
   11. Google Analytics 4 (GA4) Central Event Dispatcher & Tracking
   ========================================================================== */
function trackEvent(eventName, eventParams = {}) {
  const isLocal = Boolean(
    window.location.hostname === 'localhost' ||
    window.location.hostname === '127.0.0.1' ||
    window.location.protocol === 'file:'
  );

  // In local development: log to console with styled badges so developer can verify events without polluting GA4
  if (isLocal) {
    console.log(
      `[GA4 Event - Dev Mode] %c${eventName}`,
      'color: #ffffff; background: #ff3b30; font-weight: bold; padding: 2px 6px; border-radius: 4px;',
      eventParams
    );
  }

  // Safe gtag dispatch in production
  if (typeof window.gtag === 'function') {
    window.gtag('event', eventName, eventParams);
  }
}

function initAnalytics() {
  function getElementContext(el) {
    if (!el) return 'page_body';
    if (el.closest('header') || el.closest('#mainNavbar')) return 'navbar_header';
    if (el.closest('footer')) return 'footer';
    if (el.closest('#hero')) return 'hero_section';
    if (el.closest('.cta-crimson-banner')) return 'cta_crimson_banner';
    if (el.closest('#services')) return 'services_section';
    if (el.closest('#amc')) return 'amc_section';
    if (el.closest('#industries')) return 'industries_section';
    if (el.closest('#contact')) return 'contact_section';
    if (el.closest('.securus-chat-pill')) return 'floating_chat_pill';
    if (el.closest('aside[aria-label="Mobile Quick Bar"]')) return 'mobile_quickbar';
    if (el.closest('#surveyModal')) return 'survey_modal';
    if (el.closest('#quotationPreviewModal')) return 'quotation_modal';
    return 'page_body';
  }

  // 1. Track WhatsApp Clicks ("whatsapp_click")
  const waSelectors = [
    'a[href*="wa.me"]',
    'a[href*="api.whatsapp.com"]',
    '#directWhatsAppContactBtn',
    '#whatsappCalcBtn',
    '.btn-whatsapp',
    '.securus-chat-pill'
  ];
  document.querySelectorAll(waSelectors.join(', ')).forEach((btn) => {
    btn.addEventListener('click', () => {
      trackEvent('whatsapp_click', {
        cta_location: getElementContext(btn),
        destination: 'whatsapp_direct',
        page_location: window.location.pathname
      });
    });
  });

  // 2. Track Phone Hotline Clicks ("phone_click")
  document.querySelectorAll('a[href^="tel:"]').forEach((btn) => {
    btn.addEventListener('click', () => {
      trackEvent('phone_click', {
        cta_location: getElementContext(btn),
        phone_number: '+918160510524',
        page_location: window.location.pathname
      });
    });
  });

  // 3. Track Book Survey Modal Open Clicks ("book_survey_click")
  const surveyOpenButtons = document.querySelectorAll(
    '.open-survey-modal, #bookCalcBtn, button[onclick*="surveyModal"], a[href*="surveyModal"]'
  );
  surveyOpenButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      trackEvent('book_survey_click', {
        cta_location: getElementContext(btn),
        button_text: btn.textContent.trim().substring(0, 40)
      });
    });
  });

  // 4. Track Contact Intent Clicks ("contact_click")
  const contactButtons = document.querySelectorAll(
    'button[onclick*="selectServiceAndScroll"], a[href="#contact"], .btn-securus-red[href="#contact"], #mainNavbar a[href="#contact"]'
  );
  contactButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      trackEvent('contact_click', {
        cta_location: getElementContext(btn),
        button_label: btn.textContent.trim().substring(0, 40)
      });
    });
  });

  // 5. Track Service Section Views ("service_page_view")
  const serviceSections = document.querySelectorAll('#services, #industries, #amc, #advantage');
  const viewedSections = new Set();

  if ('IntersectionObserver' in window && serviceSections.length) {
    const sectionObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !viewedSections.has(entry.target.id)) {
            viewedSections.add(entry.target.id);
            const heading = entry.target.querySelector('h2, h3')?.textContent?.trim() || entry.target.id;
            trackEvent('service_page_view', {
              service_section: entry.target.id,
              section_title: heading,
              page_path: window.location.pathname
            });
          }
        });
      },
      { threshold: 0.35 }
    );
    serviceSections.forEach((sec) => sectionObserver.observe(sec));
  }
}
