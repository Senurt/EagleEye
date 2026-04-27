let map, markers = [];
let currentBaseLayer;

const TILES = {
    street: L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'),
    satellite: L.tileLayer('https://{s}.google.com/vt/lyrs=s&x={x}&y={y}&z={z}', { subdomains:['mt0','mt1','mt2','mt3'] }),
    hybrid: L.tileLayer('https://{s}.google.com/vt/lyrs=s,h&x={x}&y={y}&z={z}', { subdomains:['mt0','mt1','mt2','mt3'] })
};

const BOUNDS = {
    dist1: [[14.4600, 120.9777], [14.5222, 121.0150]], 
    dist2: [[14.4344, 121.0150], [14.5100, 121.0555]], 
    restricted: {
        naia: [[14.4980, 121.0000], [14.5160, 121.0250]],
        villamor: [[14.5220, 121.0150], [14.5420, 121.0350]]
    }
};

let incidents = [
    {
        id: 1, lat: 14.4850, lng: 121.0050, 
        district: "District 1", source: "BFP", 
        date: "Apr 17", time: "09:42 AM",
        situation: "Residential Structural Fire", victims: "12 Souls",
        urgency: "CRITICAL", video: "https://www.w3schools.com/html/mov_bbb.mp4" 
    },
    {
        id: 2, lat: 14.4950, lng: 121.0200, 
        district: "District 2", source: "PNP", 
        date: "Apr 17", time: "11:15 AM",
        situation: "Major Road Obstruction", victims: "3 Injured",
        urgency: "MEDIUM", video: "" 
    }
];

function initMap() {
    map = L.map('map', { zoomControl: false, attributionControl: false }).setView([14.4793, 121.0198], 14);
    currentBaseLayer = TILES.street;
    currentBaseLayer.addTo(map);

    L.rectangle(BOUNDS.dist1, {color: "#F97316", weight: 2, fillOpacity: 0.05}).addTo(map);
    L.rectangle(BOUNDS.dist2, {color: "#3b82f6", weight: 2, fillOpacity: 0.05}).addTo(map);
    Object.values(BOUNDS.restricted).forEach(area => {
        L.rectangle(area, {color: "#DC2626", weight: 3, fillOpacity: 0.2}).addTo(map);
    });

    renderIncidents();
    initTracking();

    setInterval(() => { 
        document.getElementById('live-clock').innerText = new Date().toLocaleTimeString('en-US', { hour12: true }); 
    }, 1000);
}

function switchMap(type) {
    map.removeLayer(currentBaseLayer);
    currentBaseLayer = TILES[type];
    currentBaseLayer.addTo(map);
}

function renderIncidents() {
    const feed = document.getElementById('incident-feed');
    const pCount = document.getElementById('count-pending');
    feed.innerHTML = "";
    
    // Safety check for pending count display
    if(pCount) pCount.innerText = incidents.length.toString().padStart(2, '0');
    
    markers.forEach(m => map.removeLayer(m));
    markers = [];

    incidents.forEach(inc => {
        const marker = L.circleMarker([inc.lat, inc.lng], {
            radius: 8, fillColor: "#F97316", color: "#fff", weight: 2, fillOpacity: 1
        }).addTo(map);

        marker.bindPopup(createPopupContent(inc));
        markers.push(marker);

        const item = document.createElement('div');
        item.className = 'incident-item';
        item.innerHTML = `<strong>[${inc.urgency}] ${inc.source}</strong><br><small>${inc.date} | ${inc.time}</small>`;
        item.onclick = () => {
            map.setView([inc.lat, inc.lng], 16);
            marker.openPopup();
        };
        feed.appendChild(item);
    });
}

function createPopupContent(inc) {
    const videoContent = inc.video 
        ? `<div class="pop-video-container"><video class="pop-video-feed" muted loop autoplay src="${inc.video}"></video></div>`
        : `<div class="no-footage">No available footage found</div>`;

    return `
        <div class="tactical-popup">
            <h3 class="text-orange">${inc.district} - ${inc.urgency}</h3>
            <p class="s-label">${inc.source} | ${inc.date} @ ${inc.time}</p>
            <p class="coords-text">${inc.lat}, ${inc.lng}</p>
            <hr class="pop-divider">
            <p><strong>Situation:</strong> ${inc.situation}</p>
            <p><strong>Victims:</strong> ${inc.victims}</p>
            ${videoContent}
            <div class="mission-actions">
                <button class="btn-mission success" onclick="resolveIncident(${inc.id}, 'success')">RESOLVED</button>
                <button class="btn-mission abort" onclick="resolveIncident(${inc.id}, 'abort')">ABORT</button>
            </div>
        </div>
    `;
}

function resolveIncident(id, status) {
    if (status === 'success' || confirm("Dismiss incident from map?")) {
        map.closePopup();
        incidents = incidents.filter(i => i.id !== id);
        renderIncidents();
    }
}

function initTracking() {
    navigator.geolocation.watchPosition(pos => {
        const coords = [pos.coords.latitude, pos.coords.longitude];
        const gpsEl = document.getElementById('user-gps');
        if(gpsEl) gpsEl.innerText = `${coords[0].toFixed(4)}, ${coords[1].toFixed(4)}`;
        
        const isRestricted = Object.values(BOUNDS.restricted).some(area => L.latLngBounds(area).contains(coords));
        const inBounds = L.latLngBounds(BOUNDS.dist1).contains(coords) || L.latLngBounds(BOUNDS.dist2).contains(coords);
        
        const warn = document.getElementById('out-of-bounds');
        if (isRestricted) {
            warn.innerText = "WARNING: RESTRICTED AIRPORT ZONE";
            warn.style.display = "block";
        } else if (!inBounds) {
            warn.innerText = "ALERT: OUTSIDE OPERATIONAL BOUNDARY";
            warn.style.display = "block";
        } else {
            warn.style.display = "none";
        }
    }, (err) => {
        const gpsEl = document.getElementById('user-gps');
        if (gpsEl) gpsEl.innerText = 'GPS Unavailable';
        console.warn('Geolocation watchPosition error:', err.message);
    });
}

function recenterMap() {
    navigator.geolocation.getCurrentPosition(pos => {
        map.setView([pos.coords.latitude, pos.coords.longitude], 15);
    }, (err) => {
        console.warn('Geolocation getCurrentPosition error:', err.message);
        alert('Unable to retrieve your location. Please check browser permissions.');
    });
}

document.addEventListener('DOMContentLoaded', () => {
    initMap();
    document.getElementById('menuBtn').onclick = () => document.getElementById('dropdownMenu').classList.toggle('show');
    // Close dropdown when clicking outside
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.nav-user')) {
            document.getElementById('dropdownMenu').classList.remove('show');
        }
    });
});

