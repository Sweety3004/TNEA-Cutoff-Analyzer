import { appState } from './state.js';
import { branchMapping } from './constants.js';

export const predictorState = {
    currentStep: 1,
    selectedBranches: [],
    cutoff: 0
};

export function calcPredictorCutoff() {
    const m = parseFloat(document.getElementById('predMaths')?.value) || 0;
    const p = parseFloat(document.getElementById('predPhysics')?.value) || 0;
    const c = parseFloat(document.getElementById('predChemistry')?.value) || 0;
    const cutoff = m + (p / 2) + (c / 2);
    predictorState.cutoff = cutoff;
    const display = document.getElementById('predCutoffScore');
    if (display) {
        display.textContent = (m === 0 && p === 0 && c === 0) ? '—' : cutoff.toFixed(2);
    }
    return cutoff;
}

export function updatePredictorUI() {
    const step = predictorState.currentStep;

    // Update steps
    document.querySelectorAll('.predictor-step').forEach(el => el.classList.remove('active'));
    const currentStepEl = document.getElementById('predStep' + step);
    if (currentStepEl) currentStepEl.classList.add('active');

    // Update progress bar
    const pct = ((step - 1) / 3) * 100;
    const fill = document.getElementById('progressFill');
    if (fill) fill.style.width = pct + '%';

    // Update progress step indicators
    document.querySelectorAll('.progress-step').forEach((el, i) => {
        el.classList.toggle('active', i + 1 <= step);
    });

    // Populate branch discovery grid when on step 3
    if (step === 3) {
        populateBranchDiscovery();
    }
}

export function filterBranchChips() {
    const term = (document.getElementById('branchSearch')?.value || '').toLowerCase();
    document.querySelectorAll('.branch-discovery-card').forEach(card => {
        const name = card.dataset.name || '';
        card.style.display = name.toLowerCase().includes(term) ? '' : 'none';
    });
}

function populateBranchDiscovery() {
    const grid = document.getElementById('branchDiscoveryGrid');
    if (!grid || !branchMapping) return;

    const cutoff = predictorState.cutoff;

    grid.innerHTML = Object.entries(branchMapping).map(([key, info]) => {
        const isSelected = predictorState.selectedBranches.includes(key);
        return `
        <div class="branch-discovery-card ${isSelected ? 'selected' : ''}"
             data-name="${info.name}"
             onclick="toggleBranchSelection('${key}', this)"
             style="cursor:pointer; padding:1rem; border:2px solid ${isSelected ? 'var(--primary)' : 'var(--border)'}; border-radius:12px; transition:all 0.2s; text-align:left; background:${isSelected ? 'var(--primary-light, #e8f0fe)' : 'var(--surface)'};">
            <div style="font-weight:600; margin-bottom:0.25rem;">${info.name}</div>
            <div style="font-size:0.8rem; color:var(--text-muted);">${info.tags ? info.tags.join(' · ') : ''}</div>
        </div>`;
    }).join('');
}

export function runPredictor() {
    predictorState.currentStep = 4;
    updatePredictorUI();

    const results = document.getElementById('predictorResults');
    if (!results) return;

    const cutoff = predictorState.cutoff || calcPredictorCutoff();
    const category = document.getElementById('predCategory')?.value || 'OC';
    const count = parseInt(document.getElementById('predResultCount')?.value || '50');
    const name = document.getElementById('predName')?.value || 'Student';
    const selectedBranches = predictorState.selectedBranches;

    // Filter cutoff data
    let data = appState.cutoffData2024 || [];
    if (selectedBranches.length > 0) {
        data = data.filter(d => selectedBranches.includes(d.brc?.toLowerCase()));
    }

    const eligible = data.filter(d => {
        const val = parseFloat(d[category]);
        return !isNaN(val) && cutoff >= val;
    }).sort((a, b) => parseFloat(b[category]) - parseFloat(a[category])).slice(0, count);

    const name_display = name || 'Student';

    if (eligible.length === 0) {
        results.innerHTML = `
        <div class="form-card" style="text-align:center;">
            <div style="font-size:3rem; margin-bottom:1rem;">😔</div>
            <h3>No Matching Colleges Found</h3>
            <p style="color:var(--text-muted);">Your cutoff of <strong>${cutoff.toFixed(2)}</strong> for <strong>${category}</strong> category didn't match any colleges in the data. Try selecting a different category or lower the requirements.</p>
        </div>`;
        return;
    }

    results.innerHTML = `
    <div class="form-card">
        <h3>🎉 Results for ${name_display}</h3>
        <p style="color:var(--text-muted); margin-bottom:1.5rem;">Your cutoff: <strong>${cutoff.toFixed(2)}</strong> | Category: <strong>${category}</strong> | Showing top <strong>${eligible.length}</strong> options</p>
        <div class="table-container">
            <table>
                <thead>
                    <tr><th>College</th><th>Branch</th><th>${category} Cutoff</th></tr>
                </thead>
                <tbody>
                    ${eligible.map(d => `
                    <tr>
                        <td>${d.con}</td>
                        <td><span class="branch-code">${d.brc}</span> ${d.brn}</td>
                        <td class="cutoff-value">${d[category]}</td>
                    </tr>`).join('')}
                </tbody>
            </table>
        </div>
    </div>`;
}
