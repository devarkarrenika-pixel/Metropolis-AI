// Metropolis AI Command Center App Logic

document.addEventListener('DOMContentLoaded', () => {
  initClock();
  initNavigation();
  initDashboardCharts();
  initPredictiveEngine();
  initSatelliteMap();
  initMultimodalAI();
  initWorkflowEngine();
  initCommunityPortal();
  initADKMultiAgents();
  initPremiumFeatures();
  
  // Set initial default city data to San Francisco
  updateDashboardData('sf');
});

// ==========================================
// 0. TIMING & CLOCK
// ==========================================
function initClock() {
  const clockEl = document.getElementById('current-time');
  
  function updateTime() {
    const now = new Date();
    // Simulate year 2026 to match smart city context
    now.setFullYear(2026);
    
    const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false });
    const dateStr = now.toLocaleDateString([], { month: 'short', day: '2-digit', year: 'numeric' });
    clockEl.innerHTML = `<span style="color: var(--color-cyan)">${dateStr}</span> | ${timeStr}`;
  }
  
  setInterval(updateTime, 1000);
  updateTime();
}

// ==========================================
// 0.1 NAVIGATION SYSTEM
// ==========================================
function initNavigation() {
  const navItems = document.querySelectorAll('.nav-item');
  const viewPanels = document.querySelectorAll('.view-panel');
  const pageTitle = document.getElementById('page-title');
  const pageSubtitle = document.getElementById('page-subtitle');
  
  const headersMap = {
    'dashboard': { title: 'City Command Overview', subtitle: 'Real-time BigQuery data sync + Multi-agent automation' },
    'predictive': { title: 'Predictive Intelligence Engine', subtitle: 'Time-series forecasting models (LSTM / XGBoost)' },
    'satellite': { title: 'Satellite & Geo Intelligence', subtitle: 'Google Earth Engine multispectral analysis (Sentinel-2)' },
    'multimodal': { title: 'Multimodal AI Analysis', subtitle: 'Vertex AI Vision + Speech audio entity extraction' },
    'workflows': { title: 'Autonomous Workflow Operations', subtitle: 'Real-time automated incident dispatch pipelines' },
    'community': { title: 'Community Intelligence Layer', subtitle: 'Citizen feedback loops and policy generation' }
  };
  
  navItems.forEach(item => {
    item.addEventListener('click', () => {
      const target = item.getAttribute('data-target');
      
      // Update sidebar nav buttons
      navItems.forEach(i => i.classList.remove('active'));
      item.classList.add('active');
      
      // Update panels
      viewPanels.forEach(p => {
        p.classList.remove('active');
        p.style.opacity = '0';
      });
      
      const targetPanel = document.getElementById(`panel-${target}`);
      if (targetPanel) {
        targetPanel.classList.add('active');
        setTimeout(() => {
          targetPanel.style.opacity = '1';
        }, 50);
      }
      
      // Update Page Headers
      if (headersMap[target]) {
        pageTitle.innerText = headersMap[target].title;
        pageSubtitle.innerText = headersMap[target].subtitle;
      }
      
      // Trigger map resize if map tab selected
      if (target === 'satellite' && window.cityMap) {
        setTimeout(() => {
          window.cityMap.invalidateSize();
        }, 100);
      }
    });
  });
}

// ==========================================
// 1. DASHBOARD & OVERVIEW (Looker / BigQuery)
// ==========================================
let resourceChart;

function initDashboardCharts() {
  const ctx = document.getElementById('resourceChart').getContext('2d');
  
  const hours = Array.from({length: 24}, (_, i) => `${String(i).padStart(2, '0')}:00`);
  const powerLoadData = [1.1, 1.0, 0.9, 0.8, 0.75, 0.85, 1.0, 1.2, 1.35, 1.4, 1.45, 1.48, 1.42, 1.38, 1.35, 1.39, 1.45, 1.52, 1.6, 1.58, 1.48, 1.35, 1.25, 1.15];
  const waterConsumptionData = [72, 70, 68, 67, 68, 72, 85, 92, 94, 90, 88, 86, 85, 84, 83, 85, 90, 95, 98, 96, 92, 85, 78, 74];

  resourceChart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: hours,
      datasets: [
        {
          label: 'Grid Power Load (GW)',
          data: powerLoadData,
          borderColor: '#8B5CF6',
          backgroundColor: 'rgba(139, 92, 246, 0.05)',
          borderWidth: 2.5,
          tension: 0.4,
          yAxisID: 'yPower',
          fill: true
        },
        {
          label: 'Hourly Water Flow (kL/s)',
          data: waterConsumptionData,
          borderColor: '#06B6D4',
          backgroundColor: 'rgba(6, 182, 212, 0.05)',
          borderWidth: 2.5,
          tension: 0.4,
          yAxisID: 'yWater',
          fill: true
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          labels: {
            color: '#E5E7EB',
            font: { family: 'Outfit', size: 12 }
          }
        }
      },
      scales: {
        x: {
          grid: { color: 'rgba(255, 255, 255, 0.03)' },
          ticks: { color: '#9CA3AF', font: { size: 10 } }
        },
        yPower: {
          type: 'linear',
          position: 'left',
          grid: { color: 'rgba(255, 255, 255, 0.03)' },
          ticks: { color: '#8B5CF6' },
          title: { display: true, text: 'GW', color: '#8B5CF6', font: { weight: 'bold' } }
        },
        yWater: {
          type: 'linear',
          position: 'right',
          grid: { drawOnChartArea: false },
          ticks: { color: '#06B6D4' },
          title: { display: true, text: 'kL/s', color: '#06B6D4', font: { weight: 'bold' } }
        }
      }
    }
  });

  // Ticker to fluctuate metrics slightly
  setInterval(() => {
    // AQI
    const aqiValEl = document.getElementById('val-aqi');
    let currentAqi = parseInt(aqiValEl.innerText);
    currentAqi += Math.floor(Math.random() * 3) - 1;
    if(currentAqi < 30) currentAqi = 30;
    if(currentAqi > 70) currentAqi = 70;
    aqiValEl.innerHTML = `${currentAqi} <span class="unit">AQI</span>`;

    // Power Grid
    const powerValEl = document.getElementById('val-power');
    let currentPower = parseFloat(powerValEl.innerText);
    currentPower += (Math.random() * 0.06 - 0.03);
    powerValEl.innerHTML = `${currentPower.toFixed(2)} <span class="unit">GW</span>`;
  }, 5000);
}

// ==========================================
// 2. PREDICTIVE ENGINE (LSTM / XGBoost)
// ==========================================
let forecastChart;
const xaiFeaturesData = {
  traffic: [
    { name: 'Historical Volume', weight: 42 },
    { name: 'Rain Precipitation', weight: 28 },
    { name: 'Workday vs Holiday', weight: 20 },
    { name: 'Road Maintenance Block', weight: 10 }
  ],
  pollution: [
    { name: 'Vehicular Congestion', weight: 48 },
    { name: 'Wind Velocity', weight: 25 },
    { name: 'Urban Heat Island', weight: 15 },
    { name: 'Humidity Index', weight: 12 }
  ],
  hospital: [
    { name: 'Pollution Spikes (AQI)', weight: 35 },
    { name: 'Temperature Anomalies', weight: 30 },
    { name: 'Weekly Influenza Rates', weight: 22 },
    { name: 'Regional Age Demographics', weight: 13 }
  ],
  electricity: [
    { name: 'Air Conditioning Load (Temp)', weight: 52 },
    { name: 'Industrial Hours Cycle', weight: 25 },
    { name: 'Peak Grid Tariff Rates', weight: 13 },
    { name: 'Smart Inverter Reserves', weight: 10 }
  ]
};

function initPredictiveEngine() {
  const ctx = document.getElementById('forecastChart').getContext('2d');
  
  // Elements
  const targetSelect = document.getElementById('predict-target-select');
  const modelSelect = document.getElementById('predict-model-select');
  const rainSlider = document.getElementById('slider-rain');
  const tempSlider = document.getElementById('slider-temp');
  const holidayToggle = document.getElementById('toggle-holiday');
  const runBtn = document.getElementById('run-simulation-btn');
  
  const labelRain = document.getElementById('val-rain-modifier');
  const labelTemp = document.getElementById('val-temp-modifier');
  const labelHoliday = document.getElementById('val-holiday-modifier');
  
  // Sync slider label updates
  rainSlider.addEventListener('input', () => labelRain.innerText = `${rainSlider.value} mm`);
  tempSlider.addEventListener('input', () => labelTemp.innerText = `${tempSlider.value >= 0 ? '+' : ''}${tempSlider.value}°C`);
  holidayToggle.addEventListener('change', () => labelHoliday.innerText = holidayToggle.checked ? 'Yes' : 'No');

  // Base generator function to simulate LSTM vs XGBoost differences
  function generateForecast(target, model, rain, temp, isHoliday) {
    const historical = [];
    const forecast = [];
    const labels = [];
    
    // Create hourly points
    for (let i = 0; i < 24; i++) {
      labels.push(`${String(i).padStart(2, '0')}:00`);
      
      let baseVal = 0;
      // Define base curves
      if (target === 'traffic') {
        // Double peak traffic curve
        baseVal = 20 + Math.sin((i - 5) / 2) * 15 + Math.sin((i - 15) / 2) * 20;
        if (baseVal < 10) baseVal = 10;
        
        // Modifiers
        baseVal += rain * 0.4;  // Rain slows down traffic
        if (isHoliday) baseVal *= 0.65; // Holidays have less rush hour
      } 
      else if (target === 'pollution') {
        // Environmental curve peaking late afternoon
        baseVal = 35 + Math.sin((i - 9) / 4) * 20 + (rain * -0.2); // rain washes away pollution
        if (baseVal < 15) baseVal = 15;
      }
      else if (target === 'hospital') {
        // Stable medical admissions curve
        baseVal = 15 + Math.sin((i - 12) / 6) * 5 + (temp * 0.2);
      }
      else if (target === 'electricity') {
        // Grid load curve peaking around evening
        baseVal = 800 + Math.sin((i - 14) / 4) * 300;
        // Hotter/colder days demand air conditioning / heating
        baseVal += Math.abs(temp) * 25; 
        if (isHoliday) baseVal *= 0.85;
      }
      
      // Historical data is up to index 14 (2:00 PM), forecast is 15 onwards
      if (i <= 14) {
        // Add minimal noise to historical data
        historical.push(baseVal + (Math.random() * 4 - 2));
        forecast.push(null);
      } else {
        // Differentiate algorithms
        let noiseFactor = (model === 'xgboost') ? (Math.sin(i * 1.5) * 3) : 0; // XGBoost is slightly more step/jagged
        let predictedVal = baseVal + noiseFactor;
        
        historical.push(null);
        forecast.push(predictedVal);
      }
    }
    
    // Set first point of forecast to overlap last point of historical
    forecast[14] = historical[14];
    
    return { labels, historical, forecast };
  }

  // Draw chart function
  function updateForecastChart() {
    const target = targetSelect.value;
    const model = modelSelect.value;
    const rain = parseFloat(rainSlider.value);
    const temp = parseFloat(tempSlider.value);
    const isHoliday = holidayToggle.checked;
    
    const data = generateForecast(target, model, rain, temp, isHoliday);
    
    // Update labels and dataset arrays
    forecastChart.data.labels = data.labels;
    forecastChart.data.datasets[0].data = data.historical;
    forecastChart.data.datasets[1].data = data.forecast;
    
    // Update chart aesthetics depending on targets
    let unitLabel = '';
    let themeColor = '#06B6D4';
    if (target === 'traffic') { unitLabel = 'Delay Index (min)'; themeColor = '#F59E0B'; }
    else if (target === 'pollution') { unitLabel = 'AQI Index'; themeColor = '#10B981'; }
    else if (target === 'hospital') { unitLabel = 'Emergency Admits'; themeColor = '#EF4444'; }
    else if (target === 'electricity') { unitLabel = 'Load (MW)'; themeColor = '#8B5CF6'; }
    
    forecastChart.data.datasets[0].borderColor = themeColor;
    forecastChart.data.datasets[0].label = `Historical ${unitLabel}`;
    forecastChart.data.datasets[1].borderColor = themeColor;
    forecastChart.data.datasets[1].label = `Forecasted ${unitLabel} (${model.toUpperCase()})`;
    
    forecastChart.update();
    
    // Update Model Metadata text
    const metaEl = document.getElementById('predict-model-meta');
    const accuracy = (model === 'lstm') ? '94.2%' : '88.6%';
    const modelVer = (model === 'lstm') ? 'LSTM Recurrent Node V5' : 'XGBoost Decision Tree V2';
    metaEl.innerHTML = `
      <span class="badge" style="border-color: ${themeColor}"><i class="fa-solid fa-microchip"></i> ${modelVer}</span>
      <span class="badge"><i class="fa-solid fa-bullseye"></i> R² Score: ${accuracy}</span>
    `;

    // Update XAI feature importance bars
    const xaiContainer = document.getElementById('xai-feature-bars');
    xaiContainer.innerHTML = '';
    const features = xaiFeaturesData[target];
    features.forEach(f => {
      let weightAdjusted = f.weight;
      // Adjust weights based on modifications to show interactivity!
      if (target === 'traffic' && f.name === 'Rain Precipitation' && rain > 30) weightAdjusted += 10;
      if (target === 'electricity' && f.name === 'Air Conditioning Load (Temp)' && Math.abs(temp) > 5) weightAdjusted += 8;
      
      const item = document.createElement('div');
      item.className = 'xai-feature-bar-item';
      item.innerHTML = `
        <div class="xai-feature-info">
          <span>${f.name}</span>
          <span>${weightAdjusted}%</span>
        </div>
        <div class="xai-bar-bg">
          <div class="xai-bar-fill" style="width: ${weightAdjusted}%; background-color: ${themeColor}"></div>
        </div>
      `;
      xaiContainer.appendChild(item);
    });

    // Dynamic integration check: if rainfall forecasts are severe, auto-trigger sluice gate workflow
    if (rain > 40 && document.getElementById('urgent-alert-banner').classList.contains('hidden')) {
      const triggerBtn = document.getElementById('btn-trigger-workflow');
      if (triggerBtn) {
        pushADKLog('System', 'Predictive Engine registers hazard rainfall forecast. Auto-triggering emergency pipeline.', 'sys');
        triggerBtn.click();
      }
    }
  }

  // Initialize forecast chart
  forecastChart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: [],
      datasets: [
        {
          label: 'Historical',
          data: [],
          borderColor: '#06B6D4',
          borderWidth: 2,
          tension: 0.35,
          fill: false
        },
        {
          label: 'Forecasted',
          data: [],
          borderColor: '#06B6D4',
          borderWidth: 2,
          borderDash: [5, 5],
          tension: 0.35,
          fill: false
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { labels: { color: '#E5E7EB', font: { family: 'Outfit' } } }
      },
      scales: {
        x: {
          grid: { color: 'rgba(255, 255, 255, 0.03)' },
          ticks: { color: '#9CA3AF' }
        },
        y: {
          grid: { color: 'rgba(255, 255, 255, 0.03)' },
          ticks: { color: '#9CA3AF' }
        }
      }
    }
  });

  // Event Listeners
  runBtn.addEventListener('click', updateForecastChart);
  targetSelect.addEventListener('change', updateForecastChart);
  modelSelect.addEventListener('change', updateForecastChart);
  
  // Initial draw
  updateForecastChart();
}

// ==========================================
// 3. SATELLITE & GEO (Google Earth Engine)
// ==========================================
function initSatelliteMap() {
  const cityConfigs = {
    sf: { name: "San Francisco (USA)", coords: [37.7749, -122.4194], zoom: 12 },
    mumbai: { name: "Mumbai (India)", coords: [19.0760, 72.8777], zoom: 12 },
    tokyo: { name: "Tokyo (Japan)", coords: [35.6762, 139.6503], zoom: 12 },
    london: { name: "London (UK)", coords: [51.5074, -0.1278], zoom: 12 },
    sydney: { name: "Sydney (Australia)", coords: [-33.8688, 151.2093], zoom: 12 },
    saopaulo: { name: "São Paulo (Brazil)", coords: [-23.5505, -46.6333], zoom: 12 },
    cairo: { name: "Cairo (Egypt)", coords: [30.0444, 31.2357], zoom: 12 },
    global: { name: "Global View", coords: [20, 0], zoom: 2 }
  };

  let currentCityKey = 'sf';
  let currentCenter = cityConfigs[currentCityKey].coords;
  
  // Initialize map (allow full global view zooming out)
  const map = L.map('leaflet-map', {
    zoomControl: false,
    minZoom: 2,
    maxZoom: 18
  }).setView(currentCenter, cityConfigs[currentCityKey].zoom);
  window.cityMap = map;

  L.control.zoom({ position: 'bottomright' }).addTo(map);

  // Load CartoDB Dark Matter tiles (premium grid aesthetic)
  const baseTiles = L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
    attribution: '&copy; CartoDB &copy; OpenStreetMap contributors'
  }).addTo(map);

  // Custom Earth Engine overlay containers
  const floodRiskLayer = L.layerGroup();
  const cropHealthLayer = L.layerGroup();
  const heatZoneLayer = L.layerGroup();
  const sensorMarkersLayer = L.layerGroup().addTo(map);

  // Base configurations for local overlay circles
  const relativeFloodRiskZones = [
    { dy: -0.0037, dx: 0.0304, baseRadius: 400 },
    { dy: -0.0099, dx: 0.0344, baseRadius: 300 },
    { dy: -0.0469, dx: 0.0414, baseRadius: 500 }
  ];

  const relativeNdviZones = [
    { dy: -0.0055, dx: -0.0668, baseRadius: 850 },
    { dy: 0.0234, dx: -0.0472, baseRadius: 650 },
    { dy: -0.0499, dx: -0.0506, baseRadius: 550 }
  ];

  const relativeHeatZones = [
    { dy: 0.0136, dx: 0.0180, baseRadius: 600 },
    { dy: 0.0051, dx: 0.0074, baseRadius: 500 },
    { dy: -0.0199, dx: 0.0004, baseRadius: 450 }
  ];

  // Draw overlay layers helper
  function drawLayers(yearMultiplier = 1.0) {
    floodRiskLayer.clearLayers();
    cropHealthLayer.clearLayers();
    heatZoneLayer.clearLayers();

    if (currentCityKey === 'global') {
      // Global View: Draw small hazard icons on ALL world cities to show a "World Map Network"
      Object.keys(cityConfigs).forEach(k => {
        if (k === 'global') return;
        const config = cityConfigs[k];
        
        // Flood (Blue)
        L.circle(config.coords, {
          color: '#3B82F6', fillColor: '#3B82F6', fillOpacity: 0.4,
          radius: 35000 * yearMultiplier, weight: 1
        }).addTo(floodRiskLayer);

        // NDVI (Green)
        L.circle([config.coords[0] - 1.2, config.coords[1] - 1.2], {
          color: '#10B981', fillColor: '#10B981', fillOpacity: 0.35,
          radius: 40000 * (2 - yearMultiplier), weight: 1
        }).addTo(cropHealthLayer);

        // Heat (Red)
        L.circle([config.coords[0] + 0.9, config.coords[1] + 0.9], {
          color: '#EF4444', fillColor: '#EF4444', fillOpacity: 0.4,
          radius: 30000 * yearMultiplier, weight: 1
        }).addTo(heatZoneLayer);
      });
    } else {
      // Local City View: Draw relative circles around center
      const center = cityConfigs[currentCityKey].coords;

      // 1. Flood risk
      relativeFloodRiskZones.forEach(z => {
        const radius = z.baseRadius * (1 + (yearMultiplier - 1) * 0.15);
        L.circle([center[0] + z.dy, center[1] + z.dx], {
          color: '#3B82F6', fillColor: '#3B82F6', fillOpacity: 0.35, radius: radius, weight: 1.5
        }).addTo(floodRiskLayer);
      });

      // 2. Crop Health NDVI
      relativeNdviZones.forEach(z => {
        const radius = z.baseRadius * (1 - (yearMultiplier - 1) * 0.08);
        L.circle([center[0] + z.dy, center[1] + z.dx], {
          color: '#10B981', fillColor: '#10B981', fillOpacity: 0.35, radius: radius, weight: 1.5
        }).addTo(cropHealthLayer);
      });

      // 3. Urban Heat Zones
      relativeHeatZones.forEach(z => {
        const radius = z.baseRadius * (1 + (yearMultiplier - 1) * 0.2);
        L.circle([center[0] + z.dy, center[1] + z.dx], {
          color: '#EF4444', fillColor: '#EF4444', fillOpacity: 0.4, radius: radius, weight: 1.5
        }).addTo(heatZoneLayer);
      });
    }
  }

  // Draw dynamic sensor markers relative to active city
  function drawSensorMarkers() {
    sensorMarkersLayer.clearLayers();
    if (currentCityKey === 'global') return; // Hide markers in global overview

    const center = cityConfigs[currentCityKey].coords;

    const garbageIcon = L.divIcon({ className: 'map-sensor-marker garbage', iconSize: [16, 16] });
    const potholeIcon = L.divIcon({ className: 'map-sensor-marker pothole', iconSize: [16, 16] });
    const floodIcon = L.divIcon({ className: 'map-sensor-marker flood', iconSize: [16, 16] });

    // 1. Waste sensor near park entrance (Sector 3 relative)
    const markerGarbage = L.marker([center[0] - 0.0055, center[1] - 0.0268], { icon: garbageIcon, popupAnchor: [0, -10] });
    markerGarbage.bindPopup(`
      <div class="map-sensor-popup">
        <h4>Sensor #G-03 (Waste Volume)</h4>
        <p><strong>Status:</strong> 🔴 Critical Overflow (96.4%)<br><strong>Location:</strong> Sector 3 Park Entrance</p>
        <button class="map-popup-btn" id="btn-popup-garbage" data-type="garbage"><i class="fa-solid fa-magnifying-glass"></i> Inspect via Vision AI</button>
      </div>
    `, { className: 'map-sensor-popup' });
    sensorMarkersLayer.addLayer(markerGarbage);

    // 2. Road damage sensor (Sector 4 relative)
    const markerPothole = L.marker([center[0] + 0.0136, center[1] + 0.0114], { icon: potholeIcon, popupAnchor: [0, -10] });
    markerPothole.bindPopup(`
      <div class="map-sensor-popup">
        <h4>Sentry #R-04 (Acoustic Road Health)</h4>
        <p><strong>Status:</strong> 🔴 Severe Pothole Damage<br><strong>Location:</strong> Sector 4 Exit Ramp</p>
        <button class="map-popup-btn" id="btn-popup-pothole" data-type="pothole"><i class="fa-solid fa-circle-info"></i> Inspect Road Damage</button>
      </div>
    `, { className: 'map-sensor-popup' });
    sensorMarkersLayer.addLayer(markerPothole);

    // 3. Flood water level sensor (Sector 7 relative)
    const markerFlood = L.marker([center[0] - 0.0099, center[1] + 0.0344], { icon: floodIcon, popupAnchor: [0, -10] });
    markerFlood.bindPopup(`
      <div class="map-sensor-popup">
        <h4>Drainage Sentry #F-07 (Ultrasonic Level)</h4>
        <p><strong>Status:</strong> 🟡 Water rising (4.2m/s inflow)<br><strong>Location:</strong> Sector 7 Coastal Dock</p>
        <button class="map-popup-btn" id="btn-popup-flood"><i class="fa-solid fa-route"></i> Trigger Flood Sluice Workflow</button>
      </div>
    `, { className: 'map-sensor-popup' });
    sensorMarkersLayer.addLayer(markerFlood);
  }

  // Draw initial state
  drawLayers(1.0);
  drawSensorMarkers();

  // Layer buttons interaction
  const btnBase = document.getElementById('btn-layer-base');
  const btnFlood = document.getElementById('btn-layer-flood');
  const btnNdvi = document.getElementById('btn-layer-ndvi');
  const btnHeat = document.getElementById('btn-layer-heat');
  const insightsText = document.getElementById('geo-insights-text');
  const timelineSlider = document.getElementById('map-timeline');
  const citySelect = document.getElementById('map-city-select');

  // Deactivate all layers
  function resetLayerButtons() {
    [btnBase, btnFlood, btnNdvi, btnHeat].forEach(b => b.classList.remove('active'));
    map.removeLayer(floodRiskLayer);
    map.removeLayer(cropHealthLayer);
    map.removeLayer(heatZoneLayer);
  }

  btnBase.addEventListener('click', () => {
    resetLayerButtons();
    btnBase.classList.add('active');
    insightsText.innerText = "Base city vector mapping active. Road blocks, coastlines, and grids synchronizing from municipal metadata.";
  });

  btnFlood.addEventListener('click', () => {
    resetLayerButtons();
    btnFlood.classList.add('active');
    map.addLayer(floodRiskLayer);
    updateGeoInsights();
  });

  btnNdvi.addEventListener('click', () => {
    resetLayerButtons();
    btnNdvi.classList.add('active');
    map.addLayer(cropHealthLayer);
    updateGeoInsights();
  });

  btnHeat.addEventListener('click', () => {
    resetLayerButtons();
    btnHeat.classList.add('active');
    map.addLayer(heatZoneLayer);
    updateGeoInsights();
  });

  // Timeline slider interaction
  timelineSlider.addEventListener('input', () => {
    const year = parseInt(timelineSlider.value);
    
    // Update active label state in HTML
    const labels = document.querySelectorAll('.timeline-labels span');
    labels.forEach(l => l.classList.remove('active'));
    
    if (year === 2020) labels[0].classList.add('active');
    else if (year === 2022) labels[1].classList.add('active');
    else if (year === 2024) labels[2].classList.add('active');
    else if (year === 2026) labels[3].classList.add('active');

    // Calculate multiplier: 2020 is 1.0, 2026 is 1.3
    const multiplier = 1.0 + ((year - 2020) / 6) * 0.3;
    drawLayers(multiplier);
    updateGeoInsights();
  });

  // City Selector interaction
  citySelect.addEventListener('change', () => {
    currentCityKey = citySelect.value;
    const config = cityConfigs[currentCityKey];
    
    map.flyTo(config.coords, config.zoom, { duration: 1.5 });
    
    // Redraw relative layers and markers
    const year = parseInt(timelineSlider.value);
    const multiplier = 1.0 + ((year - 2020) / 6) * 0.3;
    
    drawLayers(multiplier);
    drawSensorMarkers();
    updateGeoInsights();
    
    // Update Dashboard Metrics and Chart dynamically based on focused city
    updateDashboardData(currentCityKey);
    
    pushADKLog('System', `GIS satellite focused on [${config.name}]. Centered coordinates: ${config.coords.join(', ')}.`, 'sys');
  });

  // Update Insights description depending on layers and timeline
  function updateGeoInsights() {
    const year = timelineSlider.value;
    const cityName = cityConfigs[currentCityKey].name;
    
    if (currentCityKey === 'global') {
      if (btnFlood.classList.contains('active')) {
        insightsText.innerHTML = `<strong>Global Flood Hazards (${year}):</strong><br>Showing SAR water-mass anomalies at a macro scale. Sea level risk indexes denote coastal cities Mumbai, San Francisco, and Tokyo are experiencing flood plain expansions of up to <strong>+5%</strong>.`;
      } else if (btnNdvi.classList.contains('active')) {
        insightsText.innerHTML = `<strong>Global NDVI Veg. Index (${year}):</strong><br>Global agricultural and forest indexes show relative stability in London/Sydney buffers, with localized canopy loss of <strong>-1.5%</strong> in rapid expansion zones.`;
      } else if (btnHeat.classList.contains('active')) {
        insightsText.innerHTML = `<strong>Global Urban Heat Anomalies (${year}):</strong><br>UHI macro bands indicate average land surface temperature anomalies exceeding <strong>+1.8°C</strong> in highly dense concrete city hubs.`;
      } else {
        insightsText.innerText = "Global map active. Pan and zoom into any region to explore city grids.";
      }
      return;
    }
    
    if (btnFlood.classList.contains('active')) {
      insightsText.innerHTML = `<strong>${cityName} Flood Vulnerability (${year}):</strong><br>
        Coastal zones show increased water levels. Synthetic Aperture Radar (SAR) sensors estimate local flood plain expansion at <strong>+${((year-2020)*2.4).toFixed(1)}%</strong> compared to 2020. Risk index: HIGH in drainage basins.`;
    } 
    else if (btnNdvi.classList.contains('active')) {
      insightsText.innerHTML = `<strong>${cityName} Crop Index - NDVI (${year}):</strong><br>
        Local forest and park canopy green density is indexed at <strong>${(0.72 - (year-2020)*0.015).toFixed(2)}</strong>. Urban expansion has slightly fragmented green buffer zones by <strong>-${((year-2020)*1.1).toFixed(1)}%</strong>.`;
    }
    else if (btnHeat.classList.contains('active')) {
      insightsText.innerHTML = `<strong>${cityName} UHI Anomaly (${year}):</strong><br>
        Thermal band analysis shows concrete/asphalt pavement temperatures peaking. High density sectors generate a UHI anomaly of <strong>+${(1.2 + (year-2020)*0.4).toFixed(1)}°C</strong> over surrounding natural baselines.`;
    } else {
      insightsText.innerHTML = `<strong>${cityName} Grid Active:</strong><br>Base vector layers loaded. Tap pulsing markers to inspect localized sensors via Vision AI or Workflows.`;
    }
  }

  // Handle popup action button event delegations inside Leaflet Map
  map.on('popupopen', () => {
    const btnG = document.getElementById('btn-popup-garbage');
    if (btnG) {
      btnG.addEventListener('click', () => {
        document.getElementById('nav-multi').click();
        document.getElementById('btn-sample-garbage').click();
      });
    }

    const btnP = document.getElementById('btn-popup-pothole');
    if (btnP) {
      btnP.addEventListener('click', () => {
        document.getElementById('nav-multi').click();
        document.getElementById('btn-sample-pothole').click();
      });
    }

    const btnF = document.getElementById('btn-popup-flood');
    if (btnF) {
      btnF.addEventListener('click', () => {
        document.getElementById('nav-flow').click();
        document.getElementById('btn-trigger-workflow').click();
      });
    }
  });
}

// ==========================================
// 4. MULTIMODAL AI (Vision / Voice / Video)
// ==========================================
const multimodalSamples = {
  garbage: {
    src: 'assets/garbage_overflow.png',
    boxes: [
      { top: '35%', left: '30%', width: '40%', height: '55%', label: 'GARBAGE BIN: OVERFLOWING (96.4%)', type: 'garbage' }
    ],
    summary: `<h4>AI Vision Inspection Analysis:</h4>
      <div class="analysis-stat-row"><span>Detected Class:</span><span class="val text-orange">Garbage Overflow</span></div>
      <div class="analysis-stat-row"><span>Confidence Score:</span><span class="val highlighted">96.4%</span></div>
      <div class="analysis-stat-row"><span>Sector Location:</span><span class="val">Sector 3 - Parkside Ave</span></div>
      <div class="analysis-stat-row"><span>Recommended Action:</span><span class="val">Automated dispatch of Waste management truck #14.</span></div>`
  },
  pothole: {
    src: 'assets/road_damage.png',
    boxes: [
      { top: '45%', left: '20%', width: '55%', height: '35%', label: 'POTHOLE: LEVEL 3 SEVERE (91.2%)', type: 'pothole' }
    ],
    summary: `<h4>AI Vision Inspection Analysis:</h4>
      <div class="analysis-stat-row"><span>Detected Class:</span><span class="val text-red">Asphalt Pothole</span></div>
      <div class="analysis-stat-row"><span>Confidence Score:</span><span class="val highlighted">91.2%</span></div>
      <div class="analysis-stat-row"><span>Sector Location:</span><span class="val">Sector 4 - Main Crossroads</span></div>
      <div class="analysis-stat-row"><span>Recommended Action:</span><span class="val">Schedule emergency patching crew within 24h. Reroute heavy buses.</span></div>`
  }
};

function initMultimodalAI() {
  const container = document.getElementById('image-analyzer-container');
  const imgEl = document.getElementById('image-analyzer-img');
  const resultsEl = document.getElementById('image-analysis-results');
  
  const btnGarbage = document.getElementById('btn-sample-garbage');
  const btnPothole = document.getElementById('btn-sample-pothole');
  
  // Render Bounding Boxes
  function loadSample(type) {
    const data = multimodalSamples[type];
    imgEl.src = data.src;
    
    // Clear old boxes
    const oldBoxes = container.querySelectorAll('.bounding-box');
    oldBoxes.forEach(b => b.remove());
    
    // Append new boxes
    data.boxes.forEach(box => {
      const boxEl = document.createElement('div');
      boxEl.className = `bounding-box ${box.type}`;
      boxEl.style.top = box.top;
      boxEl.style.left = box.left;
      boxEl.style.width = box.width;
      boxEl.style.height = box.height;
      
      const labelEl = document.createElement('span');
      labelEl.className = 'box-label';
      labelEl.innerText = box.label;
      boxEl.appendChild(labelEl);
      
      container.appendChild(boxEl);
    });
    
    // Load text summary
    resultsEl.innerHTML = data.summary;
  }
  
  btnGarbage.addEventListener('click', () => {
    btnGarbage.classList.add('active');
    btnPothole.classList.remove('active');
    loadSample('garbage');
  });
  
  btnPothole.addEventListener('click', () => {
    btnPothole.classList.add('active');
    btnGarbage.classList.remove('active');
    loadSample('pothole');
  });
  
  // Initialize with garbage sample
  loadSample('garbage');

  // CCTV Video analyzer loop simulation (Bounding boxes updating)
  const videoContainer = document.getElementById('video-analyzer-container');
  const videoResults = document.getElementById('video-analysis-results');
  const btnCam04 = document.getElementById('btn-cam-04');
  const btnCam09 = document.getElementById('btn-cam-09');
  const videoImg = document.getElementById('video-analyzer-img');
  const videoBadge = document.getElementById('video-cam-badge');
  let activeCam = 'cam04';

  btnCam04.addEventListener('click', () => {
    btnCam04.classList.add('active');
    btnCam09.classList.remove('active');
    videoImg.style.filter = 'none';
    videoBadge.innerHTML = `<span class="rec-dot"></span> LIVE CCTV CAM 04 (PLAZA)`;
    activeCam = 'cam04';
    updateCCTVDetection();
    pushADKLog('Traffic Agent', 'Switched visual analytics feed to CCTV Cam 04 (Main Plaza).', 'traffic');
  });

  btnCam09.addEventListener('click', () => {
    btnCam09.classList.add('active');
    btnCam04.classList.remove('active');
    videoImg.style.filter = 'sepia(0.2) hue-rotate(50deg) brightness(0.9)';
    videoBadge.innerHTML = `<span class="rec-dot"></span> LIVE CCTV CAM 09 (METRO EXIT)`;
    activeCam = 'cam09';
    updateCCTVDetection();
    pushADKLog('Traffic Agent', 'Switched visual analytics feed to CCTV Cam 09 (Metro Exit Hub).', 'traffic');
  });

  function updateCCTVDetection() {
    // Clear old boxes
    const oldBoxes = videoContainer.querySelectorAll('.bounding-box');
    oldBoxes.forEach(b => b.remove());
    
    // Check parameters depending on cam
    const isCam04 = activeCam === 'cam04';
    const boxCount = isCam04 ? (5 + Math.floor(Math.random() * 5)) : (9 + Math.floor(Math.random() * 6));
    const pedCount = isCam04 ? (35 + Math.floor(Math.random() * 15)) : (75 + Math.floor(Math.random() * 20));
    
    // Draw pedestrian boxes
    for(let i=0; i<boxCount; i++) {
      const top = 15 + Math.floor(Math.random() * 65);
      const left = 10 + Math.floor(Math.random() * 75);
      const width = isCam04 ? (10 + Math.floor(Math.random() * 12)) : (7 + Math.floor(Math.random() * 8));
      const height = isCam04 ? (20 + Math.floor(Math.random() * 20)) : (14 + Math.floor(Math.random() * 14));
      
      const boxEl = document.createElement('div');
      boxEl.className = 'bounding-box person';
      boxEl.style.top = `${top}%`;
      boxEl.style.left = `${left}%`;
      boxEl.style.width = `${width}px`;
      boxEl.style.height = `${height}px`;
      
      const labelEl = document.createElement('span');
      labelEl.className = 'box-label';
      labelEl.innerText = `PEDESTRIAN (92%)`;
      boxEl.appendChild(labelEl);
      
      videoContainer.appendChild(boxEl);
    }
    
    const density = (pedCount / 50).toFixed(2);
    let colorClass = 'text-green';
    let statusText = 'Stable - Flow Normal';
    
    if (pedCount > 70) {
      colorClass = 'text-red';
      statusText = 'CRITICAL CONGESTION - Crowding Alert!';
    } else if (pedCount > 45) {
      colorClass = 'text-orange';
      statusText = 'Congested - Watch Trigger';
    }
    
    videoResults.innerHTML = `
      <div class="analysis-stat-row">
        <span>Detected Pedestrians:</span>
        <span class="val highlighted">${pedCount} individuals</span>
      </div>
      <div class="analysis-stat-row">
        <span>Crowd Density:</span>
        <span class="val ${colorClass}">${density} per m²</span>
      </div>
      <div class="analysis-stat-row">
        <span>Safety Status:</span>
        <span class="val ${colorClass}">${statusText}</span>
      </div>
    `;
  }

  setInterval(updateCCTVDetection, 4000);
  updateCCTVDetection();

  // Voice complaint simulated filing
  const voiceBtn = document.getElementById('voice-play-sample-btn');
  const waveEl = document.querySelector('.audio-wave');
  const transcriptEl = document.getElementById('voice-transcript');
  const parsedFieldsEl = document.getElementById('voice-parsed-fields');
  
  const sampleTranscript = "Hello, I am calling to file a complaint. There is a massive garbage overflow near the Sector 3 park gate. It is smelling horrible and blocking the main pathway for school kids. Can you please dispatch a truck immediately?";
  
  voiceBtn.addEventListener('click', () => {
    if(voiceBtn.disabled) return;
    
    voiceBtn.disabled = true;
    waveEl.classList.add('active');
    transcriptEl.innerHTML = "";
    parsedFieldsEl.innerHTML = "";
    
    let words = sampleTranscript.split(" ");
    let index = 0;
    
    // Typewrite words
    let interval = setInterval(() => {
      if(index < words.length) {
        transcriptEl.innerHTML += words[index] + " ";
        index++;
      } else {
        // Complete
        clearInterval(interval);
        waveEl.classList.remove('active');
        voiceBtn.disabled = false;
        
        // Show NLP Entities
        parsedFieldsEl.innerHTML = `
          <span class="tag success"><i class="fa-solid fa-tag"></i> Class: Waste Overflow</span>
          <span class="tag success"><i class="fa-solid fa-location-dot"></i> Location: Sector 3 Park Gate</span>
          <span class="tag alert"><i class="fa-solid fa-triangle-exclamation"></i> Urgency: High</span>
          <span class="tag"><i class="fa-solid fa-truck"></i> Action: Auto-routed to Sanit. System</span>
        `;
        
        // Trigger multi-agent dialogue log
        pushADKLog('Utility Agent', 'Recieved transcription payload for Sector 3 complaint. Processing logistics.', 'utility');
      }
    }, 180);
  });
}

// ==========================================
// 5. WORKFLOW OPERATIONS ENGINE
// ==========================================
function initWorkflowEngine() {
  const triggerBtn = document.getElementById('btn-trigger-workflow');
  const floodPipeline = document.getElementById('flow-flood');
  
  triggerBtn.addEventListener('click', () => {
    // Check if workflow is already running
    const statusLabel = floodPipeline.querySelector('.pipeline-status');
    if (statusLabel.classList.contains('running')) {
      alert("Flood mitigation workflow #109 is already executing.");
      return;
    }
    
    // Reset steps
    const node1 = document.getElementById('flood-node-1');
    const node2 = document.getElementById('flood-node-2');
    const node3 = document.getElementById('flood-node-3');
    
    const conn1 = document.getElementById('flood-conn-1');
    const conn2 = document.getElementById('flood-conn-2');
    
    node1.className = 'node pending';
    node2.className = 'node pending';
    node3.className = 'node pending';
    conn1.className = 'node-connector';
    conn2.className = 'node-connector';
    
    statusLabel.className = 'pipeline-status running';
    statusLabel.innerText = 'Executing';
    
    // Show urgent warning banner
    const alertBanner = document.getElementById('urgent-alert-banner');
    alertBanner.classList.remove('hidden');
    
    // Step 1 node: Sensor match
    setTimeout(() => {
      node1.className = 'node active pulsing';
      pushADKLog('Environment Agent', 'Rainfall sentinel registers 38.5mm/hr in Sector 7. Alerting systems.', 'env');
    }, 500);
    
    // Step 1 completed, link 1 active, Node 2 active
    setTimeout(() => {
      node1.className = 'node completed';
      conn1.className = 'node-connector completed';
      node2.className = 'node active pulsing';
      pushADKLog('System', 'Vertex Pub/Sub dispatching cellular alerts to Sector 7 citizens.', 'sys');
    }, 3000);

    // Step 2 completed, link 2 active, Node 3 active
    setTimeout(() => {
      node2.className = 'node completed';
      conn2.className = 'node-connector completed';
      node3.className = 'node active pulsing';
      pushADKLog('Utility Agent', 'Opening sluice gates 7A & 7B by 40% to release reservoir load.', 'utility');
    }, 6500);
    
    // Complete pipeline
    setTimeout(() => {
      node3.className = 'node completed';
      statusLabel.className = 'pipeline-status standby';
      statusLabel.innerText = 'Nominal / Resolved';
      pushADKLog('System', 'Mitigation pipeline #109 finished. Water discharge flows normal.', 'sys');
    }, 10000);
  });

  // Alert banner dismiss button
  document.getElementById('alert-dismiss-btn').addEventListener('click', () => {
    document.getElementById('urgent-alert-banner').classList.add('hidden');
  });
}

// ==========================================
// 6. COMMUNITY PORTAL
// ==========================================
const initialReports = [
  { id: 1, title: 'CCTV Camera broken at High Street', cat: 'Roads & Congestion', desc: 'The camera near post #4 is completely dark. Safety hazard.', upvotes: 42, time: '2h ago' },
  { id: 2, title: 'Frequent electricity outage in Sector 1', cat: 'Water & Utilities', desc: 'Short micro-blackouts occurring every afternoon. Demanding regulator checks.', upvotes: 118, time: '5h ago' },
  { id: 3, title: 'Pothole damaged tires on Sector 4 Main Rd', cat: 'Roads & Congestion', desc: 'Severe deep cracks at the exit ramp. Need immediate patching.', upvotes: 95, time: '8h ago' },
  { id: 4, title: 'Garbage dump smells near school gates', cat: 'Garbage & Hygiene', desc: 'The dumpsters overflow every Friday. Unhygienic for children.', upvotes: 72, time: '1d ago' }
];

function initCommunityPortal() {
  const container = document.getElementById('citizen-reports-container');
  const openModalBtn = document.getElementById('open-report-modal-btn');
  const closeModalBtn = document.getElementById('close-modal-btn');
  const modal = document.getElementById('report-modal');
  const form = document.getElementById('report-issue-form');
  
  const generatePolicyBtn = document.getElementById('generate-policy-btn');
  const policyContainer = document.getElementById('policy-output-container');
  const policyTextBody = document.getElementById('policy-text-body');
  
  // Render reports list
  function renderReports() {
    container.innerHTML = '';
    // Sort by upvotes descending
    const sorted = [...initialReports].sort((a,b) => b.upvotes - a.upvotes);
    
    sorted.forEach(r => {
      const card = document.createElement('div');
      card.className = 'report-card';
      card.innerHTML = `
        <div class="report-desc">
          <h4>${r.title}</h4>
          <p>${r.desc}</p>
          <div class="report-meta">
            <span class="tag"><i class="fa-solid fa-folder"></i> ${r.cat}</span>
            <span class="tag"><i class="fa-regular fa-clock"></i> ${r.time}</span>
          </div>
        </div>
        <button class="upvote-button" data-id="${r.id}">
          <i class="fa-solid fa-chevron-up"></i> ${r.upvotes}
        </button>
      `;
      container.appendChild(card);
    });
    
    // Add event listeners to upvote buttons
    document.querySelectorAll('.upvote-button').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const id = parseInt(btn.getAttribute('data-id'));
        const targetReport = initialReports.find(r => r.id === id);
        if (targetReport) {
          targetReport.upvotes += 1;
          renderReports();
        }
      });
    });
  }

  // Modal actions
  openModalBtn.addEventListener('click', () => modal.classList.add('open'));
  closeModalBtn.addEventListener('click', () => modal.classList.remove('open'));
  
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const title = document.getElementById('form-title').value;
    const cat = document.getElementById('form-category').value;
    const desc = document.getElementById('form-desc').value;
    
    const newReport = {
      id: initialReports.length + 1,
      title: title,
      cat: cat,
      desc: desc,
      upvotes: 1,
      time: 'Just now'
    };
    
    initialReports.push(newReport);
    renderReports();
    form.reset();
    modal.classList.remove('open');
    
    pushADKLog('System', `Citizen report filed: "${title}". Forwarded to relevant AI Agents.`, 'sys');

    // Dynamic ADK Multi-Agent reactions based on complaint category
    setTimeout(() => {
      if (cat === "Water & Utilities") {
        pushADKLog('Utility Agent', `Received citizen alert: "${title}". Flow rate anomalies evaluated.`, 'utility');
      } else if (cat === "Roads & Congestion") {
        pushADKLog('Traffic Agent', `Received road hazard report: "${title}". Querying localized transit grids.`, 'traffic');
      } else if (cat === "Garbage & Hygiene") {
        pushADKLog('Environment Agent', `Received sanitation report: "${title}". Dispatch pipeline synchronized.`, 'env');
      } else {
        pushADKLog('Health Agent', `Monitoring public report: "${title}". Checking for potential epidemiological vectors.`, 'health');
      }
    }, 1500);
  });

  // AI Policy Suggestion Draft
  generatePolicyBtn.addEventListener('click', () => {
    generatePolicyBtn.innerHTML = `<i class="fa-solid fa-spinner fa-spin"></i> Processing & Aggregating reports...`;
    
    setTimeout(() => {
      generatePolicyBtn.innerHTML = `<i class="fa-solid fa-gears"></i> Aggregate Feedback & Draft Policies`;
      policyContainer.classList.remove('hidden');
      
      // Calculate high categories
      policyTextBody.innerHTML = `
        <p><strong>Rationale:</strong> Based on <strong>118 votes</strong> concerning Sector 1 energy outages and <strong>95 votes</strong> regarding Sector 4 road infrastructure, the Vertex AI Policy Engine drafts the following guidelines:</p>
        <ul style="margin: 10px 0 10px 14px; display: flex; flex-direction: column; gap: 6px;">
          <li><strong>Directive 1 (Utilities):</strong> Restructure load shedding protocols for Sector 1. Mandate dynamic battery balancing storage arrays from 1:00 PM to 4:00 PM peaks.</li>
          <li><strong>Directive 2 (Transit):</strong> Reallocate municipal repair budget of $42,000 for immediate asphalt repaving of Sector 4 crossroads to prevent transit deterioration.</li>
        </ul>
        <p style="color: var(--text-muted)">Projected Sentiment Increase: <strong>+14%</strong> across affected sectors.</p>
      `;
    }, 1500);
  });

  document.getElementById('policy-accept-btn').addEventListener('click', () => {
    alert("Policy draft exported as PDF and dispatched to the Municipal Legislative Dashboard.");
    policyContainer.classList.add('hidden');
  });

  document.getElementById('policy-reject-btn').addEventListener('click', () => {
    policyContainer.classList.add('hidden');
  });

  renderReports();
}

// ==========================================
// 7. CONVERSATIONAL AI & EXPLAINABLE AI (XAI)
// ==========================================
const chatPresets = {
  "Best time to travel tomorrow?": {
    reply: "Based on our BigQuery traffic index history and real-time LSTM forecasting, the best time to travel tomorrow is between <strong>10:00 AM and 11:30 AM</strong>, or after <strong>8:00 PM</strong>.<br><br>Severe congestion is predicted on Sector 4 Main Arterial Road between 8:00 AM - 9:30 AM (estimated +35m delay) and 5:00 PM - 6:30 PM (estimated +42m delay). Traffic Agent suggests taking Highway 4 bypass which remains clear.",
    xai: {
      score: "96.2%",
      sources: [
        "BigQuery Table: `traffic_telemetry_historical_v4` (5.2M rows)",
        "Live Sensor: Sector 4 CCTV cameras (Cam 01-12)",
        "LSTM Model: `traffic_prediction_24h`"
      ],
      rationale: [
        "LSTM model weights heavily identify commute days (Tuesday forecast patterns).",
        "Rain modifier at 0mm suggests standard friction coefficient.",
        "RAG retrieval found matching past travel advisory #TA-449."
      ]
    }
  },
  "Why is water shortage increasing?": {
    reply: "Our Utility Agent telemetry logs show a sudden <strong>28% drop in supply pressure</strong> in Sector 3. This indicates a probable pipeline leak (specifically Pipeline Block #118 near Parkside).<br><br>Additionally, East Reservoir reserves are at <strong>72.5%</strong> (operating at -12% compared to historical averages) because high heat index readings (38°C) are driving crop irrigation demands in the rural belt. Utility Agent has queued an automated drone inspection.",
    xai: {
      score: "91.8%",
      sources: [
        "BigQuery Table: `water_flow_sensor_telemetry` (120ms latency)",
        "Satellite layer: Sentinel-2 NDVI vegetative cover indices",
        "Utility Agent: Flow discrepancy log"
      ],
      rationale: [
        "Anomaly detection algorithms flagged a flow input/output mismatch of 4.2 kL/s in Sector 3.",
        "Heat index correlates directly (0.87 correlation coefficient) with increased agricultural pumping."
      ]
    }
  },
  "What is the high risk zone right now?": {
    reply: "There are two active alerts in the system:<br><br>1. 🔴 <strong>Sector 4 (Traffic)</strong>: Delayed index is currently +42% above normal due to road potholes and lane restrictions. Rerouting is actively being handled by Traffic Agent.<br><br>2. 🟡 <strong>Sector 7 (Drainage)</strong>: Heavy precipitation forecast. Rainfall sensors are at 32mm/hr, triggers smart drainage gate operations simulation standby.",
    xai: {
      score: "98.5%",
      sources: [
        "Environment Agent: Weather radar feeds",
        "Traffic Agent: Live flow speeds dataset",
        "Municipal Asset Ledger (Risk sector mapping)"
      ],
      rationale: [
        "Active incident alerts are pulled from Pub/Sub queues.",
        "Sector 7 risk represents elevation terrain maps (water accumulation probability)."
      ]
    }
  }
};

const chatHistory = document.getElementById('chat-history-container');
const chatInput = document.getElementById('chat-user-input');
const chatSend = document.getElementById('chat-send-btn');
const xaiDrawer = document.getElementById('xai-drawer');
const xaiContent = document.getElementById('xai-drawer-content');

// Expand/Collapse XAI Drawer
document.getElementById('xai-drawer-toggle').addEventListener('click', () => {
  xaiDrawer.classList.toggle('open');
});

// Post assistant response and update XAI
function botResponse(queryText) {
  // Create message element
  const msg = document.createElement('div');
  msg.className = 'chat-msg system';
  msg.innerHTML = `<i class="fa-solid fa-spinner fa-spin"></i> Thinking...`;
  chatHistory.appendChild(msg);
  chatHistory.scrollTop = chatHistory.scrollHeight;

  setTimeout(() => {
    const cityKey = document.getElementById('map-city-select').value;
    const cityName = document.getElementById('map-city-select').options[document.getElementById('map-city-select').selectedIndex].text;
    
    // Check if preset query exists
    const matched = chatPresets[queryText];
    if (matched) {
      let replyText = matched.reply;
      
      // Override replies with city-specific details!
      if (queryText.includes("travel")) {
        if (cityKey === 'mumbai') {
          replyText = `For <strong>Mumbai</strong>, severe waterlogging congestion is predicted on the Western Express Highway between 8:00 AM - 10:30 AM (estimated +55m delay). Traffic Agent suggests taking Eastern Freeway bypass which remains clear. Best travel time is between <strong>12:00 PM and 2:00 PM</strong>.`;
        } else if (cityKey === 'tokyo') {
          replyText = `For <strong>Tokyo</strong>, transit is highly stable. Minor pedestrian crowding delays near Shibuya crossing at 6:30 PM (+10m delay). Autonomous train grids are operating at peak efficiency. Best travel time is <strong>any off-peak hours</strong>.`;
        } else if (cityKey === 'london') {
          replyText = `For <strong>London</strong>, traffic bottleneck delays are logged near Tower Bridge (+30m delay) due to maintenance. Best departure window tomorrow is between <strong>10:00 AM and 12:00 PM</strong>.`;
        } else if (cityKey === 'global') {
          replyText = `<strong>Global Transit Overview</strong>: Congestion spikes logged in Mumbai (+55m) and Sao Paulo (+45m). Tokyo and Sydney transit grids remain nominal. Recommendation: Use regional rail systems where active.`;
        }
      } else if (queryText.includes("water")) {
        if (cityKey === 'sydney') {
          replyText = `For <strong>Sydney</strong>, Reservoir levels at Warragamba Dam are down to <strong>65.8%</strong> capacity due to low summer inflows. Utility Agent has triggered Level 1 water restrictions. Solar balancing arrays are pumping auxiliary reserves.`;
        } else if (cityKey === 'saopaulo') {
          replyText = `For <strong>São Paulo</strong>, Cantareira water reserves stand at a critical low of <strong>58.2%</strong>. Utility Agent has drafted emergency allocations for agricultural belts. Citizen conservation alerts are active.`;
        } else if (cityKey === 'mumbai') {
          replyText = `For <strong>Mumbai</strong>, reservoir levels are optimal at <strong>92.5%</strong> due to monsoon rain discharge. Water pressure is normal, drainage gates are discharging excessive storage under Utility Agent control.`;
        } else if (cityKey === 'global') {
          replyText = `<strong>Global Utility Reserves Summary</strong>: Extreme drought watches active in Sao Paulo (58.2%) and Sydney (65.8%). Normal capacities verified across San Francisco and London.`;
        }
      } else if (queryText.includes("risk")) {
        const aqi = document.getElementById('val-aqi').innerText;
        replyText = `Active warnings for <strong>${cityName}</strong>:<br><br>`;
        if (cityKey === 'mumbai') {
          replyText += `🔴 <strong>Western Express</strong>: Severe Waterlogging. Traffic speeds reduced to 10 km/h.<br>🔴 <strong>Dharavi</strong>: Phase load surge. Utility Agent active.`;
        } else if (cityKey === 'saopaulo') {
          replyText += `🔴 <strong>Cantareira System</strong>: Drought Alert (58.2% storage).<br>🟡 <strong>Marginal Pinheiros</strong>: Traffic congestion.`;
        } else if (cityKey === 'tokyo') {
          replyText += `🟡 <strong>Shibuya Crossing</strong>: High pedestrian crowd density warning near station exit.<br>🟢 <strong>Minato</strong>: Smart grid balancing complete.`;
        } else if (cityKey === 'sf') {
          replyText += `🔴 <strong>Sector 4</strong>: Road damage delays (+40% transit time).<br>🟡 <strong>Sector 7</strong>: Drainage sentinel warning standby.`;
        } else {
          replyText += `🟢 Telemetry nominal. No high-level emergency indicators active for this sector. (Air Quality index: ${aqi}).`;
        }
      }

      msg.innerHTML = replyText;
      
      // Update XAI drawer and expand it
      let listItems = matched.xai.sources.map(s => `<li>${s}</li>`).join("");
      let rationaleItems = matched.xai.rationale.map(r => `<li>${r}</li>`).join("");
      
      // Build premium flowchart node details
      let nodeIn = "Sensor Feeds & User Query";
      let nodeProc = "RAG Similarity Match";
      let nodeOut = "Generate Decision Output";
      
      if (queryText.includes("travel")) {
        nodeIn = `${cityName} Transit History & CCTV`;
        nodeProc = "LSTM Forecasting (Rush hour weights)";
        nodeOut = "Optimal Travel Hours Suggestion";
      } else if (queryText.includes("water")) {
        nodeIn = `${cityName} Water Levels & Flow Discrepancies`;
        nodeProc = "Pressure Anomaly Detection Loop";
        nodeOut = "Trigger Drone + Leak Pipeline Block";
      } else if (queryText.includes("risk")) {
        nodeIn = `${cityName} Sensor Feeds & Incident Ledger`;
        nodeProc = "Risk Assessment Node Evaluation";
        nodeOut = "Emergency Warnings Dispatched";
      }

      xaiContent.innerHTML = `
        <div class="xai-data-grid">
          <div class="xai-row">
            <span class="label">AI Confidence Score:</span>
            <span class="val text-purple" style="font-weight: 800">${matched.xai.score}</span>
          </div>
          <div class="xai-row" style="flex-direction: column; gap: 4px;">
            <span class="label">Information Lineage (Data Sources):</span>
            <ul class="xai-bullet-list">${listItems}</ul>
          </div>
          <div class="xai-row" style="flex-direction: column; gap: 4px; margin-top: 4px;">
            <span class="label">Decision Logic (Rationale):</span>
            <ul class="xai-bullet-list">${rationaleItems}</ul>
          </div>
          
          <div class="divider" style="margin: 10px 0"></div>
          <span class="label" style="color: var(--color-purple)"><i class="fa-solid fa-sitemap"></i> Explainable AI Decision Tree Flow</span>
          <div class="xai-flowchart">
            <div class="xai-node input">
              <i class="fa-solid fa-arrow-right-to-bracket"></i>
              <div><strong>Input Layer</strong><br>${nodeIn}</div>
            </div>
            <div class="xai-node-connector-vert"></div>
            <div class="xai-node process">
              <i class="fa-solid fa-gears"></i>
              <div><strong>Processing Layer</strong><br>${nodeProc}</div>
            </div>
            <div class="xai-node-connector-vert"></div>
            <div class="xai-node output">
              <i class="fa-solid fa-circle-check"></i>
              <div><strong>Recommendation Layer</strong><br>${nodeOut}</div>
            </div>
          </div>
        </div>
      `;
      xaiDrawer.classList.add('open');
      
    } else {
      // General dynamic answer
      const aqiVal = document.getElementById('val-aqi').innerText;
      const powerVal = document.getElementById('val-power').innerText;
      const waterVal = document.getElementById('val-water').innerText;
      
      msg.innerHTML = `Currently, the city sensors index:<br>
        - Air Quality is <strong>${aqiVal}</strong>.<br>
        - Grid electricity usage stands at <strong>${powerVal}</strong>.<br>
        - Reservoir capacity is at <strong>${waterVal}</strong>.<br><br>
        Your custom query was queried via RAG. No exact matching emergency triggers were found. Please use the quick preset questions or formulate routing questions.`;
      
      xaiContent.innerHTML = `
        <div class="xai-data-grid">
          <div class="xai-row">
            <span class="label">AI Confidence Score:</span>
            <span class="val text-purple">74.5%</span>
          </div>
          <div class="xai-row">
            <span class="label">Sources:</span>
            <span class="val">Live Telemetry API</span>
          </div>
          <p class="xai-placeholder" style="padding: 10px 0 0 0">
            Fallback dynamic summary used. No specialized time-series forecasting model triggered for this question.
          </p>
        </div>
      `;
    }
    chatHistory.scrollTop = chatHistory.scrollHeight;
  }, 1000);
}

function handleUserMessage() {
  const queryText = chatInput.value.trim();
  if (!queryText) return;

  // Post User message
  const userMsg = document.createElement('div');
  userMsg.className = 'chat-msg user';
  userMsg.innerText = queryText;
  chatHistory.appendChild(userMsg);
  
  chatInput.value = '';
  chatHistory.scrollTop = chatHistory.scrollHeight;
  
  // Trigger Bot reply
  botResponse(queryText);
}

// Click presets
document.querySelectorAll('.preset-query-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const query = btn.getAttribute('data-query');
    chatInput.value = query;
    handleUserMessage();
  });
});

chatSend.addEventListener('click', handleUserMessage);
chatInput.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') handleUserMessage();
});

// ==========================================
// 8. ADK MULTI-AGENT LOGS
// ==========================================
const logQueue = [
  { agent: 'Traffic Agent', text: 'Optimizing flow at Sector 4 exit. Coordinated bus routes.', cls: 'traffic' },
  { agent: 'Environment Agent', text: 'Microclimate check: Carbon emissions index is steady at 38ppm.', cls: 'env' },
  { agent: 'Utility Agent', text: 'Pressure sensors active on Pipeline 88. Flow: 140L/s.', cls: 'utility' },
  { agent: 'Health Agent', text: 'Aggregating hospital patient logs. Asthmatic admissions low.', cls: 'health' },
  { agent: 'Traffic Agent', text: 'Commute delay detected Sector 3 due to garbage pickup. Alert sent.', cls: 'traffic' },
  { agent: 'Environment Agent', text: 'Satellite green NDVI buffer validation complete.', cls: 'env' },
  { agent: 'Utility Agent', text: 'West Reservoir water level fluctuates 0.2% due to irrigation flow.', cls: 'utility' }
];

const logBody = document.getElementById('adk-logs-body');

function pushADKLog(agent, text, cssClass) {
  const now = new Date();
  const timeStr = now.toTimeString().split(' ')[0];
  
  const line = document.createElement('div');
  line.className = 'terminal-line';
  line.innerHTML = `
    <span class="time">[${timeStr}]</span> 
    <span class="${cssClass}">[${agent}]</span> ${text}
  `;
  
  logBody.appendChild(line);
  logBody.scrollTop = logBody.scrollHeight;
  
  // Toggle badge glow
  const badgeEl = document.getElementById(`badge-agent-${cssClass === 'sys' ? 'traffic' : cssClass}`);
  if(badgeEl) {
    badgeEl.style.boxShadow = `0 0 10px var(--color-${cssClass})`;
    setTimeout(() => { badgeEl.style.boxShadow = 'none'; }, 1000);
  }
}

function initADKMultiAgents() {
  let logIndex = 0;
  
  // Random loop pushes log queue elements
  setInterval(() => {
    const item = logQueue[logIndex];
    pushADKLog(item.agent, item.text, item.cls);
    
    logIndex = (logIndex + 1) % logQueue.length;
  }, 7000);
}

// ==========================================
// 9. PREMIUM WIDGETS & INTEGRATION
// ==========================================
function initPremiumFeatures() {
  // Theme Selector
  const themeSelect = document.getElementById('theme-preset-select');
  themeSelect.addEventListener('change', () => {
    const val = themeSelect.value;
    document.body.className = ''; // Reset classes
    if (val !== 'midnight') {
      document.body.classList.add(`theme-${val}`);
    }
    pushADKLog('System', `Visual theme shifted to [${themeSelect.options[themeSelect.selectedIndex].text}]. Updating color variables.`, 'sys');
  });

  // Timelapse Animation Loop
  const playTimelineBtn = document.getElementById('btn-play-timeline');
  const timelineSlider = document.getElementById('map-timeline');
  let timelineInterval = null;
  let isPlayingTimeline = false;

  playTimelineBtn.addEventListener('click', () => {
    if (isPlayingTimeline) {
      clearInterval(timelineInterval);
      playTimelineBtn.innerHTML = `<i class="fa-solid fa-play"></i>`;
      isPlayingTimeline = false;
      pushADKLog('System', 'Map timelapse animation paused.', 'sys');
    } else {
      isPlayingTimeline = true;
      playTimelineBtn.innerHTML = `<i class="fa-solid fa-pause"></i>`;
      pushADKLog('System', 'Map timelapse animation started. Looping years 2020 - 2026.', 'sys');
      
      timelineInterval = setInterval(() => {
        let currentYear = parseInt(timelineSlider.value);
        currentYear += 2;
        if (currentYear > 2026) {
          currentYear = 2020;
        }
        timelineSlider.value = currentYear;
        // Dispatch 'input' event to trigger Leaflet layer updates in app.js
        timelineSlider.dispatchEvent(new Event('input'));
      }, 1800);
    }
  });

  // Executive Report Generator Modal
  const genReportBtn = document.getElementById('btn-gen-report');
  const reportModal = document.getElementById('report-export-modal');
  const closeReportModalBtn = document.getElementById('close-report-modal-btn');
  const downloadReportBtn = document.getElementById('btn-download-pdf-sim');
  const reportDocBody = document.getElementById('report-doc-body');

  genReportBtn.addEventListener('click', () => {
    // Read current dashboard metric values from DOM
    const aqi = document.getElementById('val-aqi').innerText;
    const water = document.getElementById('val-water').innerText;
    const traffic = document.getElementById('val-traffic').innerText;
    const power = document.getElementById('val-power').innerText;
    
    // Generate Report content
    reportDocBody.innerHTML = `
      <div class="report-doc-header">
        <div class="report-doc-logo">METROPOLIS<span>AI</span></div>
        <div class="report-doc-title">CONFIDENTIAL CITY DIRECTIVE<br>DATE: ${new Date().toLocaleDateString()}<br>REF: SC-2026-X</div>
      </div>
      <div class="report-section">
        <h4>1. Executive Summary</h4>
        <p class="report-text">Metropolis AI Decision Intelligence compiled this document by executing real-time RAG semantic matching over BigQuery telemetry data logs. System metrics denote nominal operation with localized utility overload.</p>
      </div>
      <div class="report-section">
        <h4>2. Grid & Environmental Metrics</h4>
        <div class="report-grid-3">
          <div class="report-grid-card">
            <div class="lbl">Air Quality Index</div>
            <div class="val">${aqi}</div>
          </div>
          <div class="report-grid-card">
            <div class="lbl">Water Reserves</div>
            <div class="val">${water}</div>
          </div>
          <div class="report-grid-card">
            <div class="lbl">Electrical Grid Load</div>
            <div class="val">${power}</div>
          </div>
        </div>
        <div class="report-grid-card" style="margin-top: 10px; text-align: left; display: flex; justify-content: space-between; align-items: center;">
          <div>
            <div class="lbl" style="text-align: left">Average Transit Velocity</div>
            <div class="val" style="font-size: 14px; text-align: left; margin-top: 2px;">${traffic}</div>
          </div>
          <div style="font-size: 10px; color: #ef4444; font-weight: 700;"><i class="fa-solid fa-triangle-exclamation"></i> Sector 4 Congestion Alert</div>
        </div>
      </div>
      <div class="report-section">
        <h4>3. Multi-Agent System Diagnosis</h4>
        <p class="report-text"><strong>Environment Agent:</strong> AQI metrics optimal. Carbon concentrations standard.<br>
        <strong>Utility Agent:</strong> Grid reserves operating at 85% capacity. Water pressure drop of 28% logged in Sector 3 is actively flagged for pipeline repair dispatch.<br>
        <strong>Traffic Agent:</strong> Bus reroutes active to bypass Sector 4 asphalt pothole repairs.</p>
      </div>
      <div class="report-section">
        <h4>4. Digital Signature & Verification</h4>
        <p class="report-text" style="font-family: var(--font-mono); font-size: 9px; color: #64748b;">
          SHA-256 Checksum: f3e2a9b8c7d6e5a4f3b2c1d0e9a8f7b6c5d4e3f2a1b0c9d8e7f6a5b4c3d2e1f0
        </p>
      </div>
    `;
    
    reportModal.classList.add('open');
    pushADKLog('System', 'Smart City Executive Report generated successfully from live BigQuery telemetry data.', 'sys');
  });

  closeReportModalBtn.addEventListener('click', () => {
    reportModal.classList.remove('open');
  });

  downloadReportBtn.addEventListener('click', () => {
    downloadReportBtn.innerHTML = `<i class="fa-solid fa-spinner fa-spin"></i> Downloading Report...`;
    setTimeout(() => {
      downloadReportBtn.innerHTML = `<i class="fa-solid fa-download"></i> Download PDF Document`;
      alert("Executive PDF Report downloaded successfully to your local register!");
      reportModal.classList.remove('open');
    }, 1500);
  });

  // Markers handled dynamically in initSatelliteMap
}

// ==========================================
// 9. DYNAMIC CITY TELEMETRY DATA & SYNC
// ==========================================
const cityData = {
  sf: {
    aqi: 42,
    water: 84.2,
    traffic: 34,
    power: 1.42,
    chartPower: [1.1, 1.0, 0.9, 0.8, 0.75, 0.85, 1.0, 1.2, 1.35, 1.4, 1.45, 1.48, 1.42, 1.38, 1.35, 1.39, 1.45, 1.52, 1.6, 1.58, 1.48, 1.35, 1.25, 1.15],
    chartWater: [72, 70, 68, 67, 68, 72, 85, 92, 94, 90, 88, 86, 85, 84, 83, 85, 90, 95, 98, 96, 92, 85, 78, 74],
    risks: [
      { type: 'critical', badge: 'CRITICAL', title: 'Sector 4: Congestion Spike', desc: 'Delay time +40% at crossroads. Traffic Agent active.' },
      { type: 'warning', badge: 'WARNING', title: 'Sector 7: Impending Rain Peak', desc: 'Expected 42mm precipitation. Flood gate sensors on alert.' },
      { type: 'nominal', badge: 'NOMINAL', title: 'Sector 1: Utility Balancing', desc: 'Water distribution stable. Power grid reserve at 22%.' }
    ]
  },
  mumbai: {
    aqi: 122,
    water: 92.5,
    traffic: 18,
    power: 3.85,
    chartPower: [2.5, 2.4, 2.2, 2.0, 2.1, 2.4, 2.9, 3.2, 3.5, 3.8, 3.9, 3.8, 3.7, 3.6, 3.5, 3.7, 3.9, 4.2, 4.4, 4.3, 4.0, 3.5, 3.0, 2.7],
    chartWater: [120, 115, 110, 108, 112, 125, 140, 148, 150, 145, 142, 138, 135, 132, 130, 135, 142, 150, 155, 152, 145, 135, 128, 122],
    risks: [
      { type: 'critical', badge: 'CRITICAL', title: 'Western Express: Waterlogging', desc: 'Slight flooding near lowlands. Traffic speed dropped to 10 km/h.' },
      { type: 'critical', badge: 'CRITICAL', title: 'Dharavi: High Power Draw', desc: 'Transformer temperatures rising. Utility Agent balancing phase load.' },
      { type: 'nominal', badge: 'NOMINAL', title: 'Colaba: Reservoir Level', desc: 'Inflow at peak (95%). Drainage gate operation scheduled.' }
    ]
  },
  tokyo: {
    aqi: 28,
    water: 78.4,
    traffic: 48,
    power: 8.92,
    chartPower: [6.8, 6.5, 6.2, 6.0, 6.1, 6.5, 7.5, 8.2, 8.8, 9.2, 9.4, 9.2, 9.0, 8.8, 8.7, 8.9, 9.2, 9.6, 10.0, 9.8, 9.2, 8.5, 7.8, 7.2],
    chartWater: [55, 53, 52, 50, 52, 58, 65, 72, 75, 72, 70, 68, 67, 66, 65, 67, 70, 75, 78, 76, 72, 65, 60, 57],
    risks: [
      { type: 'warning', badge: 'WARNING', title: 'Shibuya Crossing: Pedestrian Peak', desc: 'Crowd density exceeded 1.2/m² near metro entrance.' },
      { type: 'nominal', badge: 'NOMINAL', title: 'Minato: Smart Grid Active', desc: '14,000 electric vehicles feeding grid reserves back to utility.' },
      { type: 'nominal', badge: 'NOMINAL', title: 'Arakawa Basin: Sluices', desc: 'Flood risk nominal. Water levels stable at 2.4m.' }
    ]
  },
  london: {
    aqi: 35,
    water: 89.1,
    traffic: 25,
    power: 2.15,
    chartPower: [1.6, 1.5, 1.4, 1.3, 1.35, 1.45, 1.7, 1.9, 2.1, 2.2, 2.25, 2.2, 2.15, 2.1, 2.05, 2.1, 2.2, 2.3, 2.4, 2.35, 2.2, 2.0, 1.8, 1.7],
    chartWater: [60, 59, 58, 57, 58, 62, 70, 75, 77, 75, 73, 71, 70, 69, 68, 70, 73, 76, 78, 77, 74, 69, 64, 61],
    risks: [
      { type: 'warning', badge: 'WARNING', title: 'Tower Bridge: Bottleneck', desc: 'Average transit speed dropped to 15 km/h due to lane closure.' },
      { type: 'nominal', badge: 'NOMINAL', title: 'Thames Barrier: Tidal Flow', desc: 'Tidal level at 4.2m (nominal). Closures not required.' },
      { type: 'nominal', badge: 'NOMINAL', title: 'Westminster: Carbon Grid', desc: 'AQI stable. Carbon emissions dropped 12% due to low emission zones.' }
    ]
  },
  sydney: {
    aqi: 22,
    water: 65.8,
    traffic: 42,
    power: 0.98,
    chartPower: [0.75, 0.7, 0.65, 0.6, 0.62, 0.7, 0.8, 0.9, 0.95, 0.98, 1.0, 0.98, 0.95, 0.92, 0.9, 0.92, 0.95, 1.0, 1.05, 1.02, 0.95, 0.88, 0.82, 0.78],
    chartWater: [45, 44, 43, 42, 43, 46, 52, 56, 58, 56, 54, 52, 51, 50, 49, 51, 54, 57, 59, 58, 55, 50, 47, 46],
    risks: [
      { type: 'warning', badge: 'WARNING', title: 'Warragamba Dam: Reserves Low', desc: 'Storage at 65.8% capacity. Utility Agent advises stage 1 restrictions.' },
      { type: 'nominal', badge: 'NOMINAL', title: 'Harbour Tunnel: Flow Optimal', desc: 'Vehicular transit stable. CO sensors nominal.' },
      { type: 'nominal', badge: 'NOMINAL', title: 'Paramatta: Solar Reserves', desc: 'Solar grid feeding +240MW to base stations.' }
    ]
  },
  saopaulo: {
    aqi: 88,
    water: 58.2,
    traffic: 22,
    power: 1.82,
    chartPower: [1.4, 1.3, 1.25, 1.2, 1.22, 1.3, 1.5, 1.65, 1.75, 1.82, 1.85, 1.8, 1.75, 1.72, 1.7, 1.72, 1.75, 1.85, 1.9, 1.88, 1.8, 1.65, 1.5, 1.42],
    chartWater: [35, 34, 33, 32, 33, 36, 42, 45, 47, 45, 43, 41, 40, 39, 38, 40, 43, 46, 48, 47, 44, 39, 36, 35],
    risks: [
      { type: 'critical', badge: 'CRITICAL', title: 'Cantareira System: Severe Drought', desc: 'Reserves dropped below 58%. Utility Agent drafting emergency allocations.' },
      { type: 'warning', badge: 'WARNING', title: 'Marginal Pinheiros: Traffic Spike', desc: 'Average travel speeds dropped below 15 km/h.' },
      { type: 'nominal', badge: 'NOMINAL', title: 'Paulista Avenue: Grid Stable', desc: 'Smart transformers load nominal.' }
    ]
  },
  cairo: {
    aqi: 145,
    water: 71.0,
    traffic: 30,
    power: 1.25,
    chartPower: [0.95, 0.9, 0.85, 0.8, 0.82, 0.9, 1.0, 1.1, 1.2, 1.25, 1.28, 1.25, 1.22, 1.2, 1.18, 1.2, 1.22, 1.28, 1.32, 1.3, 1.22, 1.12, 1.02, 0.98],
    chartWater: [50, 49, 48, 47, 48, 51, 56, 60, 62, 60, 58, 56, 55, 54, 53, 55, 58, 61, 63, 62, 59, 54, 51, 50],
    risks: [
      { type: 'critical', badge: 'CRITICAL', title: 'Giza Hub: High AQI Peak', desc: 'Fine particulate dust reading 145 AQI. Health Agent advises alerts.' },
      { type: 'warning', badge: 'WARNING', title: 'October Bridge: Delays', desc: 'Congestion vector active at center ramp.' },
      { type: 'nominal', badge: 'NOMINAL', title: 'Nile Delta Sluices: Flow', desc: 'Reservoir feed stable. Flow capacity nominal.' }
    ]
  },
  global: {
    aqi: 70,
    water: 77.0,
    traffic: 31,
    power: 20.39,
    chartPower: [15.5, 14.8, 14.1, 13.5, 13.7, 14.8, 17.2, 19.1, 20.3, 21.0, 21.4, 21.0, 20.4, 19.9, 19.5, 20.0, 21.0, 22.3, 23.2, 22.8, 21.4, 19.5, 17.8, 16.5],
    chartWater: [49.8, 48.5, 47.3, 46.7, 47.3, 50.6, 56.2, 60.3, 61.9, 60.3, 58.8, 57.1, 56.2, 55.3, 54.7, 56.2, 58.8, 61.9, 63.5, 62.7, 60.0, 56.2, 52.9, 51.1],
    risks: [
      { type: 'critical', badge: 'CRITICAL', title: 'Global Grid Demand: Peak', desc: 'Aggregate electrical demand reached 20.39 GW.' },
      { type: 'warning', badge: 'WARNING', title: 'São Paulo/Sydney: Reservoirs Low', desc: 'Water anomalies indicate drought risk in Southern Hemisphere.' },
      { type: 'nominal', badge: 'NOMINAL', title: 'Tokyo/London: Transit Normal', desc: 'Smart routing agents have successfully cleared metropolitan bottlenecks.' }
    ]
  }
};

function updateDashboardData(cityKey) {
  const data = cityData[cityKey];
  if (!data) return;

  const aqiEl = document.getElementById('val-aqi');
  const waterEl = document.getElementById('val-water');
  const trafficEl = document.getElementById('val-traffic');
  const powerEl = document.getElementById('val-power');

  if (aqiEl) aqiEl.innerHTML = `${data.aqi} <span class="unit">AQI</span>`;
  if (waterEl) waterEl.innerHTML = `${data.water} <span class="unit">%</span>`;
  if (trafficEl) trafficEl.innerHTML = `${data.traffic} <span class="unit">km/h</span>`;
  if (powerEl) powerEl.innerHTML = `${data.power} <span class="unit">${cityKey === 'global' ? 'GW' : 'GW'}</span>`; 

  // AQI Glow
  if (aqiEl) {
    const aqiCard = aqiEl.closest('.metric-card');
    if (aqiCard) {
      const aqiIcon = aqiCard.querySelector('.metric-header i');
      const aqiFooter = aqiCard.querySelector('.metric-footer');
      aqiCard.className = 'metric-card';
      if (aqiIcon) aqiIcon.className = 'fa-solid fa-wind';
      
      if (data.aqi < 50) {
        aqiCard.classList.add('card-glow-green');
        if (aqiIcon) aqiIcon.classList.add('text-green');
        if (aqiFooter) {
          aqiFooter.className = 'metric-footer text-green';
          aqiFooter.innerHTML = `<i class="fa-solid fa-caret-down"></i> Optimal air index`;
        }
      } else if (data.aqi < 100) {
        aqiCard.classList.add('card-glow-orange');
        if (aqiIcon) aqiIcon.classList.add('text-orange');
        if (aqiFooter) {
          aqiFooter.className = 'metric-footer text-orange';
          aqiFooter.innerHTML = `<i class="fa-solid fa-triangle-exclamation"></i> Moderate index`;
        }
      } else {
        aqiCard.classList.add('card-glow-red');
        if (aqiIcon) aqiIcon.classList.add('text-red');
        if (aqiFooter) {
          aqiFooter.className = 'metric-footer text-red';
          aqiFooter.innerHTML = `<i class="fa-solid fa-triangle-exclamation"></i> Poor air quality (Sensitive Alert)`;
        }
      }
    }
  }

  // Water Storage Glow
  if (waterEl) {
    const waterCard = waterEl.closest('.metric-card');
    if (waterCard) {
      const waterIcon = waterCard.querySelector('.metric-header i');
      const waterFooter = waterCard.querySelector('.metric-footer');
      waterCard.className = 'metric-card';
      if (waterIcon) waterIcon.className = 'fa-solid fa-droplet';
      
      if (data.water > 75) {
        waterCard.classList.add('card-glow-blue');
        if (waterIcon) waterIcon.classList.add('text-blue');
        if (waterFooter) {
          waterFooter.className = 'metric-footer text-blue';
          waterFooter.innerHTML = `<i class="fa-solid fa-circle-check"></i> Normal supply pressure`;
        }
      } else if (data.water > 60) {
        waterCard.classList.add('card-glow-orange');
        if (waterIcon) waterIcon.classList.add('text-orange');
        if (waterFooter) {
          waterFooter.className = 'metric-footer text-orange';
          waterFooter.innerHTML = `<i class="fa-solid fa-triangle-exclamation"></i> Low reservoir caution`;
        }
      } else {
        waterCard.classList.add('card-glow-red');
        if (waterIcon) waterIcon.classList.add('text-red');
        if (waterFooter) {
          waterFooter.className = 'metric-footer text-red';
          waterFooter.innerHTML = `<i class="fa-solid fa-triangle-exclamation"></i> Critical drought watch!`;
        }
      }
    }
  }

  // Traffic Speed Glow
  if (trafficEl) {
    const trafficCard = trafficEl.closest('.metric-card');
    if (trafficCard) {
      const trafficIcon = trafficCard.querySelector('.metric-header i');
      const trafficFooter = trafficCard.querySelector('.metric-footer');
      trafficCard.className = 'metric-card';
      if (trafficIcon) trafficIcon.className = 'fa-solid fa-car-side';
      
      if (data.traffic > 35) {
        trafficCard.classList.add('card-glow-green');
        if (trafficIcon) trafficIcon.classList.add('text-green');
        if (trafficFooter) {
          trafficFooter.className = 'metric-footer text-green';
          trafficFooter.innerHTML = `<i class="fa-solid fa-circle-check"></i> Transit flow optimal`;
        }
      } else if (data.traffic > 22) {
        trafficCard.classList.add('card-glow-orange');
        if (trafficIcon) trafficIcon.classList.add('text-orange');
        if (trafficFooter) {
          trafficFooter.className = 'metric-footer text-orange';
          trafficFooter.innerHTML = `<i class="fa-solid fa-triangle-exclamation"></i> Local bottleneck delays`;
        }
      } else {
        trafficCard.classList.add('card-glow-red');
        if (trafficIcon) trafficIcon.classList.add('text-red');
        if (trafficFooter) {
          trafficFooter.className = 'metric-footer text-red';
          trafficFooter.innerHTML = `<i class="fa-solid fa-triangle-exclamation"></i> Heavy traffic gridlock!`;
        }
      }
    }
  }

  // Update Looker Line Charts dynamically
  if (resourceChart) {
    resourceChart.data.datasets[0].data = data.chartPower;
    resourceChart.data.datasets[1].data = data.chartWater;
    
    if (cityKey === 'global') {
      resourceChart.data.datasets[0].label = 'Global Grid Load (GW)';
      resourceChart.data.datasets[1].label = 'Global Reservoirs (kL/s)';
    } else {
      resourceChart.data.datasets[0].label = 'Grid Power Load (GW)';
      resourceChart.data.datasets[1].label = 'Hourly Water Flow (kL/s)';
    }
    resourceChart.update();
  }

  // Update Sector Risk Analysis List in Overview Dashboard
  const riskListEl = document.querySelector('.risk-list');
  if (riskListEl) {
    riskListEl.innerHTML = '';
    data.risks.forEach(r => {
      const riskItem = document.createElement('div');
      riskItem.className = `risk-item ${r.type}`;
      riskItem.innerHTML = `
        <div class="risk-badge">${r.badge}</div>
        <div class="risk-info">
          <h4>${r.title}</h4>
          <p>${r.desc}</p>
        </div>
      `;
      riskListEl.appendChild(riskItem);
    });
  }
}
