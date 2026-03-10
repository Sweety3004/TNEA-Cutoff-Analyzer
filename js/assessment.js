import { appState, currentAssessment } from './state.js';
import { branchMapping, assessmentQuestions, relatedCoursesData } from './constants.js';

export function startAssessment() {
    currentAssessment.mode = 'discovery';
    currentAssessment.quizIndex = 0;
    currentAssessment.quizScores = {};
    currentAssessment.quizRef = [];
    currentAssessment.history = [];
    currentAssessment.answers = new Array(assessmentQuestions ? assessmentQuestions.length : 30).fill(null);
    navigateToAssessmentScreen('academicProfile');
}

export function navigateToAssessmentScreen(screenId) {
    const screens = ['academicProfile', 'modeSelection', 'goalSelection', 'interestQuiz', 'resultContainer', 'guidedCompareResults'];
    screens.forEach(s => {
        const el = document.getElementById(s);
        if (el) el.style.display = (s === screenId) ? 'block' : 'none';
    });

    const nav = document.getElementById('assessmentBackNav');
    if (nav) nav.style.display = (screenId === 'interestQuiz' || screenId === 'resultContainer') ? 'flex' : 'none';
}

export function setAcademicGroup(group) {
    // Fix: was reading non-existent currentAssessment.academic.group
    currentAssessment.group = group;
    const mathBtn = document.getElementById('groupMath');
    const csBtn = document.getElementById('groupCS');
    if (mathBtn) mathBtn.classList.toggle('active', group === 'math');
    if (csBtn) csBtn.classList.toggle('active', group === 'cs');
    const csField = document.getElementById('csMarkField');
    if (csField) csField.style.display = group === 'cs' ? 'block' : 'none';
}

export function proceedToDiscovery() {
    currentAssessment.marks = {
        math: parseFloat(document.getElementById('markMath')?.value) || 0,
        physics: parseFloat(document.getElementById('markPhysics')?.value) || 0,
        chemistry: parseFloat(document.getElementById('markChem')?.value) || 0,
        cs: parseFloat(document.getElementById('markCS')?.value) || 0,
        overall: parseFloat(document.getElementById('markOverall')?.value) || 0,
    };
    currentAssessment.quizIndex = 0;
    currentAssessment.quizScores = {};
    currentAssessment.quizRef = [];
    currentAssessment.answers = new Array(assessmentQuestions ? assessmentQuestions.length : 30).fill(null);
    navigateToAssessmentScreen('interestQuiz');
    renderQuizQuestion();
}

export function handleAssessmentBack() {
    const screenOrder = ['academicProfile', 'interestQuiz', 'resultContainer'];
    const currentScreen = screenOrder.find(s => {
        const el = document.getElementById(s);
        return el && el.style.display !== 'none';
    });
    const idx = screenOrder.indexOf(currentScreen);
    if (idx > 0) navigateToAssessmentScreen(screenOrder[idx - 1]);
}

export function handleAnswerSelection(optionIndex) {
    if (!assessmentQuestions) return;
    const q = assessmentQuestions[currentAssessment.quizIndex];
    if (!q) return;
    const opt = q.options[optionIndex];

    currentAssessment.answers[currentAssessment.quizIndex] = optionIndex;

    if (opt && opt.scores) {
        for (let branch in opt.scores) {
            currentAssessment.quizScores[branch] = (currentAssessment.quizScores[branch] || 0) + opt.scores[branch];
        }
    }

    if (opt && opt.personalize) currentAssessment.quizRef.push(opt.personalize);

    if (currentAssessment.quizIndex < assessmentQuestions.length - 1) {
        currentAssessment.quizIndex++;
        renderQuizQuestion();
    } else {
        showResults();
    }
}

export function renderQuizQuestion() {
    if (!assessmentQuestions) return;
    const idx = currentAssessment.quizIndex;
    const q = assessmentQuestions[idx];
    if (!q) return;

    const total = assessmentQuestions.length;
    const stepText = document.getElementById('quizStepText');
    const percentText = document.getElementById('quizPercentText');
    const progressBar = document.getElementById('quizProgressBar');
    if (stepText) stepText.textContent = `Question ${idx + 1} of ${total}`;
    if (percentText) percentText.textContent = `${Math.round((idx / total) * 100)}% Complete`;
    if (progressBar) progressBar.style.width = `${Math.round((idx / total) * 100)}%`;

    const qEl = document.getElementById('quizQuestion');
    const dEl = document.getElementById('quizDesc');
    if (qEl) qEl.textContent = q.text || q.question || '';
    if (dEl) dEl.textContent = q.description || q.desc || '';

    const optsContainer = document.getElementById('quizOptions');
    if (optsContainer && q.options) {
        optsContainer.innerHTML = q.options.map((opt, i) => `
            <div class="quiz-option-card ${currentAssessment.answers[idx] === i ? 'selected' : ''}"
                 onclick="handleAnswerSelection(${i})">
                <span class="quiz-opt-letter">${String.fromCharCode(65 + i)}</span>
                <span>${opt.text || opt}</span>
            </div>
        `).join('');
    }
}

export function showResults() {
    navigateToAssessmentScreen('resultContainer');

    const scores = currentAssessment.quizScores;
    if (!scores || Object.keys(scores).length === 0) return;

    const topBranch = Object.entries(scores).sort((a, b) => b[1] - a[1])[0];
    const branchKey = topBranch[0];
    const branchInfo = branchMapping ? branchMapping[branchKey] : null;
    const branchName = branchInfo ? (branchInfo.name || branchKey) : branchKey;

    const resultBranch = document.getElementById('resultBranch');
    if (resultBranch) resultBranch.textContent = branchName;

    const resultDesc = document.getElementById('resultDesc');
    if (resultDesc) {
        resultDesc.textContent = branchInfo ? (branchInfo.description || 'Based on your interests and academic performance.') : 'Based on your interests and academic performance.';
    }

    const resultTags = document.getElementById('resultTags');
    if (resultTags && branchInfo && branchInfo.careers) {
        resultTags.innerHTML = branchInfo.careers.slice(0, 5).map(c =>
            `<span class="result-tag">${c}</span>`).join('');
    }
}
