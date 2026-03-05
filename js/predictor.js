import { appState } from './state.js';

export const predictorState = {
    currentStep: 1,
    selectedBranches: []
};

export function calcPredictorCutoff() {
    const m = parseFloat(document.getElementById('predMaths').value) || 0;
    const p = parseFloat(document.getElementById('predPhysics').value) || 0;
    const c = parseFloat(document.getElementById('predChemistry').value) || 0;
    const cutoff = m + (p / 2) + (c / 2);
    const display = document.getElementById('predCutoffScore');
    if (display) {
        display.textContent = (m === 0 && p === 0 && c === 0) ? '—' : cutoff.toFixed(2);
    }
    return cutoff;
}

export function updatePredictorUI() {
    const step = predictorState.currentStep;
    document.querySelectorAll('.predictor-step').forEach(el => el.classList.remove('active'));
    const currentStepEl = document.getElementById('predStep' + step);
    if (currentStepEl) currentStepEl.classList.add('active');

}
    }

const pct = ((step - 1) / 3) * 100;
const fill = document.getElementById('progressFill');
if (fill) fill.style.width = pct + '%';
}
