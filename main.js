const state = {
  scenarios: {},
  currentSite: "campus",
  intensity: 50,
  pulseLevel: 75,
};

const elements = {
  pulseScore: document.querySelectorAll('[data-metric="pulseScore"]'),
  energySaved: document.querySelectorAll('[data-metric="energySavedKwh"]'),
  burnoutRisk: document.querySelectorAll('[data-metric="burnoutRiskPct"]'),
  hydration: document.querySelector('[data-meter="hydrationIndex"]'),
  focus: document.querySelector('[data-meter="focusIndex"]'),
  waste: document.querySelector('[data-metric="wasteReducedPct"]'),
  co2: document.querySelector('[data-metric="co2AvoidedTons"]'),
  siteName: document.querySelector('[data-field="site-name"]'),
  siteTagline: document.querySelector('[data-field="site-tagline"]'),
  impactSummary: document.querySelector('[data-field="impact-summary"]'),
  signals: document.querySelector('[data-list="signals"]'),
  zones: document.querySelector('[data-list="zones"]'),
  recommendations: document.querySelector('[data-list="recommendations"]'),
  journey: document.querySelector('[data-list="journey"]'),
  intensity: document.getElementById("intensity"),
  intensityValue: document.getElementById("intensityValue"),
  simulateButton: document.getElementById("simulateButton"),
  deployButton: document.getElementById("deployButton"),
};

const numberFormatter = new Intl.NumberFormat("en-US");

const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

const formatNumber = (value) => numberFormatter.format(Math.round(value));

const getScenario = (site) => state.scenarios[site];

const computeAdjusted = (scenario) => {
  const intensityShift = (state.intensity - 50) / 50;
  return {
    pulseScore: clamp(scenario.pulseScore - intensityShift * 14, 45, 98),
    energySavedKwh: clamp(scenario.energySavedKwh - intensityShift * 180, 400, 2000),
    burnoutRiskPct: clamp(scenario.burnoutRiskPct + intensityShift * 10, 8, 38),
    hydrationIndex: clamp(scenario.hydrationIndex - intensityShift * 6, 60, 96),
    focusIndex: clamp(scenario.focusIndex - intensityShift * 8, 55, 96),
    wasteReducedPct: clamp(scenario.wasteReducedPct - intensityShift * 4, 10, 45),
    co2AvoidedTons: clamp(scenario.co2AvoidedTons - intensityShift * 0.4, 0.6, 4.2),
  };
};

const updateTextGroup = (nodes, value) => {
  nodes.forEach((node) => {
    if (node) node.textContent = value;
  });
};

const renderSignals = (signals) => {
  elements.signals.innerHTML = "";
  signals.forEach((signal) => {
    const card = document.createElement("div");
    card.className = "signal-card";
    const meta = document.createElement("div");
    meta.className = "signal-meta";
    const label = document.createElement("span");
    label.className = "signal-label";
    label.textContent = signal.label;
    const trend = document.createElement("span");
    trend.className = "signal-trend";
    trend.textContent = `${signal.value} • ${signal.trend}`;
    meta.appendChild(label);
    meta.appendChild(trend);

    const status = document.createElement("span");
    status.className = `signal-status ${signal.status}`;
    status.textContent = signal.status === "good" ? "Stable" : "Alert";

    card.appendChild(meta);
    card.appendChild(status);
    elements.signals.appendChild(card);
  });
};

const renderZones = (zones) => {
  elements.zones.innerHTML = "";
  zones.forEach((zone) => {
    const card = document.createElement("div");
    card.className = "zone-card";
    const header = document.createElement("div");
    header.className = "zone-header";
    const name = document.createElement("span");
    name.className = "zone-name";
    name.textContent = zone.name;
    const status = document.createElement("span");
    status.className = "zone-status";
    status.textContent = zone.status;
    header.appendChild(name);
    header.appendChild(status);

    const meter = document.createElement("div");
    meter.className = "zone-meter";
    const fill = document.createElement("span");
    fill.style.setProperty("--score", zone.score);
    meter.appendChild(fill);

    card.appendChild(header);
    card.appendChild(meter);
    elements.zones.appendChild(card);
  });
};

const renderRecommendations = (recommendations) => {
  elements.recommendations.innerHTML = "";
  recommendations.forEach((item) => {
    const card = document.createElement("div");
    card.className = "action-card";
    const title = document.createElement("h4");
    title.textContent = item.title;
    const detail = document.createElement("p");
    detail.textContent = item.detail;
    const impact = document.createElement("span");
    impact.className = "impact-tag";
    impact.textContent = item.impact;
    card.appendChild(title);
    card.appendChild(detail);
    card.appendChild(impact);
    elements.recommendations.appendChild(card);
  });
};

const renderJourney = (steps) => {
  elements.journey.innerHTML = "";
  steps.forEach((step) => {
    const item = document.createElement("li");
    item.textContent = step;
    elements.journey.appendChild(item);
  });
};

const updateScenario = (site) => {
  const scenario = getScenario(site);
  if (!scenario) return;

  const adjusted = computeAdjusted(scenario);
  updateTextGroup(elements.pulseScore, formatNumber(adjusted.pulseScore));
  updateTextGroup(elements.energySaved, formatNumber(adjusted.energySavedKwh));
  updateTextGroup(elements.burnoutRisk, formatNumber(adjusted.burnoutRiskPct));
  updateTextGroup(elements.waste ? [elements.waste] : [], formatNumber(adjusted.wasteReducedPct));
  updateTextGroup(elements.co2 ? [elements.co2] : [], adjusted.co2AvoidedTons.toFixed(1));

  if (elements.hydration) elements.hydration.style.setProperty("--value", adjusted.hydrationIndex);
  if (elements.focus) elements.focus.style.setProperty("--value", adjusted.focusIndex);

  if (elements.siteName) elements.siteName.textContent = scenario.name;
  if (elements.siteTagline) elements.siteTagline.textContent = scenario.tagline;
  if (elements.impactSummary) elements.impactSummary.textContent = scenario.impactSummary;

  renderSignals(scenario.signals);
  renderZones(scenario.zones);
  renderRecommendations(scenario.recommendations);
  renderJourney(scenario.journey);

  state.pulseLevel = adjusted.pulseScore;
};

const setActiveScenarioButton = (site) => {
  document.querySelectorAll("[data-site]").forEach((button) => {
    button.classList.toggle("active", button.dataset.site === site);
  });
};

const handleIntensity = (value) => {
  state.intensity = Number(value);
  if (elements.intensityValue) {
    elements.intensityValue.textContent = `${state.intensity}%`;
  }
  updateScenario(state.currentSite);
};

const bindEvents = () => {
  document.querySelectorAll("[data-site]").forEach((button) => {
    button.addEventListener("click", () => {
      state.currentSite = button.dataset.site;
      setActiveScenarioButton(state.currentSite);
      updateScenario(state.currentSite);
    });
  });

  if (elements.intensity) {
    elements.intensity.addEventListener("input", (event) => handleIntensity(event.target.value));
  }

  if (elements.simulateButton) {
    elements.simulateButton.addEventListener("click", () => {
      const nextIntensity = Math.floor(35 + Math.random() * 40);
      if (elements.intensity) elements.intensity.value = nextIntensity;
      handleIntensity(nextIntensity);
    });
  }

  if (elements.deployButton) {
    elements.deployButton.addEventListener("click", () => {
      document.querySelector("footer").scrollIntoView({ behavior: "smooth" });
    });
  }
};

const resizeCanvas = (canvas) => {
  const ratio = window.devicePixelRatio || 1;
  canvas.width = canvas.offsetWidth * ratio;
  canvas.height = canvas.offsetHeight * ratio;
};

const startPulseCanvas = () => {
  const canvas = document.getElementById("pulseCanvas");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  let time = 0;

  const render = () => {
    resizeCanvas(canvas);
    const { width, height } = canvas;
    ctx.clearRect(0, 0, width, height);
    ctx.lineWidth = 2 * (window.devicePixelRatio || 1);

    ctx.strokeStyle = "rgba(255, 255, 255, 0.08)";
    for (let x = 0; x < width; x += 80 * (window.devicePixelRatio || 1)) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();
    }

    const amplitude = (state.pulseLevel / 100) * (height / 3);
    ctx.strokeStyle = "rgba(255, 122, 26, 0.8)";
    ctx.beginPath();
    for (let x = 0; x <= width; x += 8) {
      const y =
        height / 2 +
        Math.sin(x / 120 + time) * amplitude +
        Math.sin(x / 40 + time * 1.2) * amplitude * 0.15;
      ctx.lineTo(x, y);
    }
    ctx.stroke();

    time += 0.02;
    requestAnimationFrame(render);
  };

  render();
};

const loadScenarios = async () => {
  const sources = ["/api/scenarios", "./data/scenarios.json"];
  for (const source of sources) {
    try {
      const response = await fetch(source, { cache: "no-store" });
      if (response.ok) {
        return await response.json();
      }
    } catch (error) {
      // ignore and fall back
    }
  }
  return {};
};

const init = async () => {
  state.scenarios = await loadScenarios();
  if (!Object.keys(state.scenarios).length) return;
  state.currentSite = Object.keys(state.scenarios)[0];
  setActiveScenarioButton(state.currentSite);
  handleIntensity(state.intensity);
  bindEvents();
  startPulseCanvas();
};

init();
