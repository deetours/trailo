document.addEventListener('DOMContentLoaded', () => {
  // Agent Demo Simulation Logic
  const pills = document.querySelectorAll('.agent-pill-btn');
  const consoleOutput = document.getElementById('agent-output');

  const simulationData = {
    hampta: [
      { time: 200, text: '🏔️ Target Identified: Hampta Pass Alpine Crossing (4,270m)' },
      { time: 600, text: '🛰️ Weather Telemetry: Clear skies window confirmed for July 12-16. Temp: -2°C to 14°C.' },
      { time: 1100, text: '🛡️ Girivah Trust Verify: Selected Certified Guide (ID: #GV-884, Wilderness EMT rated).' },
      { time: 1600, text: '⚡ Autonomous Route Generated: 4 campsites, porter oxygen reserve scheduled.' },
      { time: 2000, text: '✅ Itinerary Ready: Confidence Score 99.4%. No manual intervention required.' }
    ],
    spiti: [
      { time: 200, text: '🏍️ Target Identified: High-Altitude Spiti Valley Road Trial (1,100 km)' },
      { time: 600, text: '🛰️ Terrain & Pass Check: Kunzum Pass open; 2 river crossing advisories flagged.' },
      { time: 1100, text: '🛡️ Partner OS Pairing: 4x4 Support Convoy & Emergency Sat-Comm reserved.' },
      { time: 1600, text: '⚡ Dynamic Waypoints: Kaza homestay verified under Girivah safety index.' },
      { time: 2000, text: '✅ Itinerary Ready: Optimal fuel stop coordinates locked.' }
    ],
    coorg: [
      { time: 200, text: '🌲 Target Identified: Deep Forest & Coffee Estate Trial (Coorg Wilderness)' },
      { time: 600, text: '🛰️ Micro-Climate Scan: Gentle mist, humidity 74%, zero extreme rainfall alerts.' },
      { time: 1100, text: '🛡️ Homestay Verification: Verified sustainable eco-lodge with gourmet trail chef.' },
      { time: 1600, text: '⚡ Activity Synthesis: Sunset ridge hike + private nocturnal nature walk queued.' },
      { time: 2000, text: '✅ Itinerary Ready: Zero friction booking path unlocked.' }
    ]
  };

  function runSimulation(key) {
    if (!consoleOutput || !simulationData[key]) return;

    // Clear output and show computing state
    consoleOutput.innerHTML = `<div class="agent-log-step"><span class="step-icon">⏳</span> <span>Trailo Core AI is synthesizing terrain intelligence...</span></div>`;

    const steps = simulationData[key];
    
    steps.forEach((step, index) => {
      setTimeout(() => {
        if (index === 0) consoleOutput.innerHTML = ''; // wipe loading text
        const stepDiv = document.createElement('div');
        stepDiv.className = 'agent-log-step';
        const parts = step.text.split(': ');
        if (parts.length > 1) {
          stepDiv.innerHTML = `<span class="step-icon">⚡</span> <strong>${parts[0]}:</strong> &nbsp;${parts.slice(1).join(': ')}`;
        } else {
          stepDiv.innerHTML = `<span class="step-icon">👉</span> ${step.text}`;
        }
        consoleOutput.appendChild(stepDiv);
        consoleOutput.scrollTop = consoleOutput.scrollHeight;
      }, step.time);
    });
  }

  pills.forEach(pill => {
    pill.addEventListener('click', () => {
      pills.forEach(p => p.classList.remove('active'));
      pill.classList.add('active');
      const simKey = pill.getAttribute('data-sim');
      runSimulation(simKey);
    });
  });

  // Automatically kick off the first demo on load
  runSimulation('hampta');

  // Early Access Form Submission Handler
  const ctaForm = document.getElementById('early-access-form');
  const formFeedback = document.getElementById('form-feedback');

  if (ctaForm && formFeedback) {
    ctaForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const emailInput = document.getElementById('email-input');
      const email = emailInput ? emailInput.value : '';

      if (email && email.includes('@')) {
        formFeedback.style.color = 'var(--status-success)';
        formFeedback.innerHTML = `🚀 Telemetry activated! We've registered <b>${email}</b> for Trailo VIP onboarding.`;
        if (emailInput) emailInput.value = '';
      } else {
        formFeedback.style.color = 'var(--status-error)';
        formFeedback.innerHTML = `⚠️ Please enter a valid email address to initialize Trailo access.`;
      }
    });
  }

  // Smooth scroll for anchor links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId && targetId !== '#') {
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
          e.preventDefault();
          targetElement.scrollIntoView({ behavior: 'smooth' });
        }
      }
    });
  });
});
