import { appState, currentAssessment } from './state.js';
import { branchMapping, assessmentQuestions, relatedCoursesData } from './constants.js';

export function startAssessment() {
    currentAssessment.mode = 'discovery';
    currentAssessment.quizIndex = 0;
    currentAssessment.quizScores = {};
    currentAssessment.quizRef = [];
    currentAssessment.history = [];
    currentAssessment.answers = new Array(30).fill(null);
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
    currentAssessment.academic.group = group;
    const mathBtn = document.getElementById('groupMath');
    const csBtn = document.getElementById('groupCS');
    if (mathBtn) mathBtn.classList.toggle('active', group === 'math');
    if (csBtn) csBtn.classList.toggle('active', group === 'cs');
    const csField = document.getElementById('csMarkField');
    if (csField) csField.style.display = group === 'cs' ? 'block' : 'none';
}

export function handleAnswerSelection(optionIndex) {
    const q = assessmentQuestions[currentAssessment.quizIndex];
    const opt = q.options[optionIndex];

    currentAssessment.answers[currentAssessment.quizIndex] = optionIndex;

    // Update scores
    for (let branch in opt.scores) {
        currentAssessment.quizScores[branch] = (currentAssessment.quizScores[branch] || 0) + opt.scores[branch];
    }

    currentAssessment.quizRef.push(opt.personalize);

    if (currentAssessment.quizIndex < assessmentQuestions.length - 1) {
        currentAssessment.quizIndex++;
        renderQuizQuestion();
    } else {
        showResults();
    }
}

export function renderQuizQuestion() {
    const idx = currentAssessment.quizIndex;
    const q = assessmentQuestions[idx];
    const container = document.getElementById('interestQuiz');
    if (!container || !q) return;

    container.innerHTML = `
        <div class="quiz-card">
            <div class="quiz-progress">${idx + 1} / ${assessmentQuestions.length}</div>
            <h2>${q.text}</h2>
            <div class="quiz-options">
                ${q.options.map((opt, i) => `
                    <div class="quiz-opt" onclick="handleAnswerSelection(${i})">${opt.text}</div>
                `).join('')}
            </div>
        </div>
    `;
}

export function showResults() {
    navigateToAssessmentScreen('resultContainer');
    // Result calculation and rendering...
}
