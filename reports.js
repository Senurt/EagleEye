document.addEventListener('DOMContentLoaded', () => {
    // 1. Dropdown Toggle
    const menuBtn = document.getElementById('menuBtn');
    const dropdownMenu = document.getElementById('dropdownMenu');
    if (menuBtn && dropdownMenu) {
        menuBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            dropdownMenu.classList.toggle('show');
        });
        document.addEventListener('click', () => dropdownMenu.classList.remove('show'));
    }

    // 2. Calendar Gen
    const calWrap = document.getElementById('calendar');
    if (calWrap) {
        for (let i = 1; i <= 31; i++) {
            const date = document.createElement('div');
            date.className = 'cal-date';
            date.innerText = i;
            if ([7, 10, 11, 15, 28].includes(i)) date.classList.add('freq-high');
            if ([2, 5, 8, 20, 22].includes(i)) date.classList.add('freq-med');
            calWrap.appendChild(date);
        }
    }

    // 3. Search
    const searchInput = document.getElementById('missionSearch');
    if (searchInput) {
        searchInput.addEventListener('input', function() {
            const val = this.value.toLowerCase();
            document.querySelectorAll("#missionData tr").forEach(row => {
                row.style.display = row.innerText.toLowerCase().includes(val) ? "" : "none";
            });
        });
    }
});

// 4. Sort
function sortTable(n) {
    const table = document.getElementById("missionTable");
    let switching = true, dir = "asc", count = 0;
    while (switching) {
        switching = false;
        let rows = table.rows;
        for (let i = 1; i < (rows.length - 1); i++) {
            let should = false;
            let x = rows[i].getElementsByTagName("TD")[n];
            let y = rows[i + 1].getElementsByTagName("TD")[n];
            if (dir == "asc" ? x.innerText.toLowerCase() > y.innerText.toLowerCase() : x.innerText.toLowerCase() < y.innerText.toLowerCase()) {
                should = true; break;
            }
        }
        if (should) { rows[i].parentNode.insertBefore(rows[i + 1], rows[i]); switching = true; count++; }
        else if (count == 0 && dir == "asc") { dir = "desc"; switching = true; }
    }
}

// 5. Export
function exportCSV() {
    let csv = "Ref No,Date,District,Saved,Status\n";
    document.querySelectorAll("#missionData tr").forEach(tr => {
        csv += Array.from(tr.children).map(td => `"${td.innerText.trim()}"`).join(",") + "\n";
    });
    const blob = new Blob([csv], { type: 'text/csv' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'reports.csv'; a.click();
}