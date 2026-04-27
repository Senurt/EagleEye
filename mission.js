let map, userMarker;

// initMap is declared on window so Google Maps async callback can find it
// regardless of script evaluation order relative to the Maps <script> tag.
window.initMap = function initMap() {
    const params = new URLSearchParams(window.location.search);
    const id = params.get('id');
    const targetIdDisplay = document.getElementById('target-id');

    if (id) targetIdDisplay.innerText = id;
    else document.getElementById('target-box').style.display = 'none';

    map = new google.maps.Map(document.getElementById('map'), {
        center: { lat: 14.4793, lng: 121.0198 },
        zoom: 16,
        disableDefaultUI: true,
        styles: [
            { elementType: 'geometry',        stylers: [{ color: '#121212' }] },
            { featureType: 'water',            stylers: [{ color: '#000'    }] },
            { featureType: 'road',             stylers: [{ color: '#1f1f1f' }] }
        ]
    });

    if (navigator.geolocation) {
        navigator.geolocation.watchPosition(
            (p) => {
                const pos = { lat: p.coords.latitude, lng: p.coords.longitude };
                if (!userMarker) {
                    userMarker = new google.maps.Marker({
                        position: pos,
                        map: map,
                        icon: {
                            path: google.maps.SymbolPath.CIRCLE,
                            scale: 6,
                            fillColor: '#3B82F6',
                            fillOpacity: 1,
                            strokeColor: '#fff',
                            strokeWeight: 2
                        }
                    });
                } else {
                    userMarker.setPosition(pos);
                }
            },
            (err) => {
                console.warn('Geolocation watchPosition error:', err.message);
            }
        );
    }

    enableTacticalControls(document.getElementById('draggableMap'), map);
};

function enableTacticalControls(el, gMap) {
    const MIN_W = 200;
    const MIN_H = 150;
    const EDGE  = 15;

    el.addEventListener('mousedown', function (e) {
        const rect    = el.getBoundingClientRect();
        const onRight  = e.clientX > rect.right  - EDGE;
        const onBottom = e.clientY > rect.bottom - EDGE;

        // ── RESIZE (corner / edge hit) ────────────────────────
        if (onRight || onBottom) {
            e.stopPropagation(); // prevent drag from also firing
            const startW = el.offsetWidth;
            const startH = el.offsetHeight;
            const startX = e.clientX;
            const startY = e.clientY;

            function doResize(re) {
                if (onRight) {
                    const newW = startW + (re.clientX - startX);
                    el.style.width = Math.max(newW, MIN_W) + 'px';
                }
                if (onBottom) {
                    const newH = startH + (re.clientY - startY);
                    el.style.height = Math.max(newH, MIN_H) + 'px';
                }
                google.maps.event.trigger(gMap, 'resize');
            }

            function stopResize() {
                window.removeEventListener('mousemove', doResize);
                window.removeEventListener('mouseup',   stopResize);
            }

            window.addEventListener('mousemove', doResize);
            window.addEventListener('mouseup',   stopResize);

        // ── DRAG (handle only) ────────────────────────────────
        } else if (e.target.closest('.drag-handle')) {
            // Resolve initial position: if element still uses bottom/right,
            // convert to top/left so offsetTop/offsetLeft are correct.
            if (!el.style.top) {
                const r = el.getBoundingClientRect();
                el.style.top   = r.top  + 'px';
                el.style.left  = r.left + 'px';
                el.style.bottom = 'auto';
                el.style.right  = 'auto';
            }

            let prevX = e.clientX;
            let prevY = e.clientY;

            function doDrag(de) {
                const dx = prevX - de.clientX;
                const dy = prevY - de.clientY;
                prevX = de.clientX;
                prevY = de.clientY;
                el.style.top  = (el.offsetTop  - dy) + 'px';
                el.style.left = (el.offsetLeft - dx) + 'px';
            }

            function stopDrag() {
                window.removeEventListener('mousemove', doDrag);
                window.removeEventListener('mouseup',   stopDrag);
            }

            window.addEventListener('mousemove', doDrag);
            window.addEventListener('mouseup',   stopDrag);
        }
    });
}

/* ── MODAL ──────────────────────────────────────────────────── */
function showConnectModal() { document.getElementById('connect-modal').style.display = 'flex'; }
function closeModal()       { document.getElementById('connect-modal').style.display = 'none'; }

async function startUplink() {
    closeModal();
    try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        document.getElementById('videoNormal').srcObject  = stream;
        document.getElementById('videoThermal').srcObject = stream;
        document.getElementById('dot').className = 'status-dot pulse-green';
        document.getElementById('link-btn-text').innerText = 'LIVE';
    } catch (err) {
        console.error('Camera access denied:', err.message);
    }
}

/* ── RECORDING CONTROLS ─────────────────────────────────────── */
function captureFrame() { alert('Snapshot Saved.'); }

let recording = false;
function toggleRec() {
    recording = !recording;
    const btn = document.getElementById('rec-btn');
    btn.innerHTML = recording
        ? '<i class="fa-solid fa-stop"></i>'
        : '<i class="fa-solid fa-circle text-red"></i>';
}

/* ── DROPDOWN TOGGLE ────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
    const menuBtn      = document.getElementById('menuBtn');
    const dropdownMenu = document.getElementById('dropdownMenu');

    // Guard: elements must exist before attaching handlers
    if (menuBtn && dropdownMenu) {
        document.addEventListener('click', (e) => {
            if (menuBtn.contains(e.target)) {
                dropdownMenu.classList.toggle('show');
            } else {
                dropdownMenu.classList.remove('show');
            }
        });
    }
});