import { appState, authState } from './state.js';

export function switchTab(tabId) {
    // Close mobile menu if open
    const navLinks = document.getElementById('navLinks');
    if (navLinks && navLinks.classList.contains('active')) {
        if (window.toggleMenu) window.toggleMenu();
    }

    if (appState.currentPageTab !== tabId) {
        appState.previousTab = appState.currentPageTab;
    }
    appState.currentPageTab = tabId;

    // Hide all sections
    document.querySelectorAll('.app-section').forEach(section => {
        section.classList.remove('active');
    });

    // Deactivate all links
    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
    });

    // Show active section
    const targetSection = document.getElementById(tabId);
    if (targetSection) {
        targetSection.classList.add('active');
    }

    // Set active link in main nav
    const targetLink = document.querySelector(`.nav-link[data-tab="${tabId}"]`);
    if (targetLink) {
        targetLink.classList.add('active');
    }

    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

export function hideLoadingIndicator() {
    const el = document.getElementById('js-loading-indicator');
    if (el) el.style.display = 'none';
}

export function renderUserArea() {
    const userArea = document.getElementById('userArea');
    if (!userArea) return;
    if (authState.isLoggedIn && authState.user) {
        userArea.innerHTML = `
            <div style="display:flex; align-items:center; gap:0.75rem;">
                <span style="font-size:0.9rem; color:var(--text-muted);">Hi, <strong>${authState.user.name || authState.user.username}</strong></span>
                <button class="btn-secondary" style="padding:0.4rem 1rem; font-size:0.85rem;" onclick="handleLogout()">Logout</button>
            </div>`;
    } else {
        userArea.innerHTML = `<button class="btn-primary" style="padding:0.5rem 1.25rem; font-size:0.9rem;" onclick="showLoginModal()">Login</button>`;
    }
}

export function updateFavBadge() {
    const badge = document.getElementById('favCountBadge');
    if (!badge) return;
    const users = JSON.parse(localStorage.getItem('tnea_users') || '{}');
    const favs = (authState.isLoggedIn && authState.user && users[authState.user.username])
        ? (users[authState.user.username].favorites || [])
        : [];
    if (favs.length > 0) {
        badge.textContent = favs.length;
        badge.style.display = 'inline';
    } else {
        badge.style.display = 'none';
    }
}

export function updateDashboardStats() {
    const data = appState.cutoffData2024;
    if (!data || data.length === 0) return;

    const colleges = new Set(data.map(d => d.con)).size;
    const branches = new Set(data.map(d => d.brc)).size;

    const dashColleges = document.getElementById('dashColleges');
    const dashBranches = document.getElementById('dashBranches');

    if (dashColleges) dashColleges.innerText = colleges;
    if (dashBranches) dashBranches.innerText = branches;
}

export function openLegalModal() {
    const modal = document.getElementById('legalModal');
    if (modal) {
        modal.classList.remove('hidden');
        document.body.style.overflow = 'hidden';
    }
}

export function closeLegalModal() {
    const modal = document.getElementById('legalModal');
    if (modal) {
        modal.classList.add('hidden');
        document.body.style.overflow = 'auto';
    }
}

export function renderAll() {
    console.log("Rendering all components...");
    try {
        populateBranchFilter();
        console.log("Branch Filter Populated");
        renderCutoffTable();
        console.log("Cutoff Table Rendered");
        renderCourseInsights();
        console.log("Course Insights Rendered");
        renderRankings();
        console.log("Rankings Rendered");
        updateDashboardStats();
        console.log("Dashboard Stats Updated");
    } catch (e) {
        console.error("Error during renderAll:", e);
    }
}

function populateBranchFilter() {
    const select = document.getElementById('branchFilter');
    if (!select) return;
    const branchMap = new Map();
    appState.currentData.forEach(d => {
        if (d.brc && d.brn && !branchMap.has(d.brc)) {
            branchMap.set(d.brc, d.brn);
        }
    });
    const sortedBranches = Array.from(branchMap.entries()).sort((a, b) => a[0].localeCompare(b[0]));
    select.innerHTML = '<option value="">All Branches</option>' +
        sortedBranches.map(([code, name]) => `<option value="${code}">${code} - ${name}</option>`).join('');
}

export function renderCutoffTable() {
    const tbody = document.getElementById('cutoffTable');
    if (!tbody) return;
    const searchCollege = (document.getElementById('searchCollegeInput')?.value || '').toLowerCase();
    const branch = document.getElementById('branchFilter')?.value;
    const sourceData = appState.currentData || [];

    const filtered = sourceData.filter(item => {
        const matchesSearch = !searchCollege || (item.con && item.con.toLowerCase().includes(searchCollege));
        const matchesBranch = !branch || item.brc === branch;
        return matchesSearch && matchesBranch;
    });

    const ITEMS_PER_PAGE = 25;
    const start = (appState.currentPage - 1) * ITEMS_PER_PAGE;
    const pageData = filtered.slice(start, start + ITEMS_PER_PAGE);

    if (pageData.length === 0) {
        tbody.innerHTML = `<tr><td colspan="11" style="text-align:center; padding: 2rem;">No results found</td></tr>`;
        return;
    }

    tbody.innerHTML = pageData.map(item => `
        <tr>
            <td><span class="branch-code">${item.brc || '-'}</span></td>
            <td title="${item.con}">${item.con}</td>
            <td>${item.brn}</td>
            <td class="cutoff-value">${item.OC || '-'}</td>
            <td class="cutoff-value">${item.BC || '-'}</td>
            <td class="cutoff-value">${item.BCM || '-'}</td>
            <td class="cutoff-value">${item.MBC || '-'}</td>
            <td class="cutoff-value">${item.SC || '-'}</td>
            <td class="cutoff-value">${item.SCA || '-'}</td>
            <td class="cutoff-value">${item.ST || '-'}</td>
            <td><button class="fav-btn" onclick="toggleFavorite('${item.con}||${item.brc}')">🤍</button></td>
        </tr>
    `).join('');
}

export function renderCourseInsights() {
    const grid = document.getElementById('courseGrid');
    if (!grid) return;
    const term = (document.getElementById('courseSearch')?.value || '').toLowerCase().trim();
    const displayData = appState.courseInsights.filter(c => c.name.toLowerCase().includes(term));

    grid.innerHTML = displayData.map(c => `
        <div class="course-card">
            <h3>${c.name}</h3>
            <p>${c.description || ''}</p>
        </div>
    `).join('');
}

export function renderRankings() {
    const list = document.getElementById('rankingsList');
    if (!list) return;
    const term = (document.getElementById('rankingSearch')?.value || '').toLowerCase();
    const filtered = appState.rankings.filter(r => r.college.toLowerCase().includes(term));

    list.innerHTML = filtered.slice(0, 50).map(r => `
        <div class="ranking-item">
            <span>${r.college}</span>
            <span class="rank-badge">#${r.ranking}</span>
        </div>
    `).join('');
}

export function generateSampleData() {
    return [
        { con: "Anna University - CEG", brc: "CS", brn: "Computer Science", OC: "199.5", BC: "198.5" },
        { con: "PSG College of Tech", brc: "CS", brn: "Computer Science", OC: "198.0", BC: "197.0" }
    ];
}
