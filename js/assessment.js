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
    if (nav) nav.style.display = (screenId === 'interestQuiz') ? 'flex' : 'none';
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

export function jumpToQuestion(index) {
    if (!assessmentQuestions || index < 0 || index >= assessmentQuestions.length) return;
    currentAssessment.quizIndex = index;
    renderQuizQuestion();
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
                <div class="quiz-opt-letter-box">
                    <span class="quiz-opt-letter">${String.fromCharCode(65 + i)}</span>
                </div>
                <div class="quiz-opt-content">
                    <span class="quiz-opt-text">${opt.text || opt}</span>
                </div>
                <div class="quiz-opt-check">
                    ${currentAssessment.answers[idx] === i ? '✓' : ''}
                </div>
            </div>
        `).join('');
    }

    renderQuestionNav();
}

export function renderQuestionNav() {
    const navGrid = document.getElementById('quizNavGrid');
    const navContainer = document.getElementById('quizNavigationContainer');
    if (!navGrid || !assessmentQuestions) return;

    if (navContainer) navContainer.style.display = 'block';

    navGrid.innerHTML = assessmentQuestions.map((_, i) => {
        let statusClass = '';
        if (i === currentAssessment.quizIndex) statusClass = 'current';
        else if (currentAssessment.answers[i] !== null) statusClass = 'answered';

        return `<div class="quiz-nav-item ${statusClass}" onclick="jumpToQuestion(${i})">${i + 1}</div>`;
    }).join('');
}

export function showResults() {
    navigateToAssessmentScreen('resultContainer');

    const scores = currentAssessment.quizScores;
    if (!scores || Object.keys(scores).length === 0) return;

    const topBranch = Object.entries(scores).sort((a, b) => b[1] - a[1])[0];
    const branchKey = topBranch[0];
    const branchInfo = branchMapping ? branchMapping[branchKey] : null;
    
    if (!branchInfo) return;

    const resultBranch = document.getElementById('resultBranch');
    if (resultBranch) resultBranch.textContent = branchInfo.name || branchKey;

    // Hide quiz navigation elements
    const navContainer = document.getElementById('quizNavigationContainer');
    if (navContainer) navContainer.style.display = 'none';
    
    const backNav = document.getElementById('assessmentBackNav');
    if (backNav) backNav.style.display = 'none';

    // Personalized Greeting
    const userName = (currentAssessment.name) || "Student";
    const greetingTitle = document.getElementById('resultGreetingTitle');
    if (greetingTitle) greetingTitle.textContent = `"Hello, ${userName}! I've assigned your path..."`;

    const greetingDesc = document.getElementById('resultGreetingDesc');
    if (greetingDesc) {
        greetingDesc.textContent = branchInfo.desc || "Based on your interests and academic performance, this path is highly recommended.";
    }

    // Highlights
    const resultFuture = document.getElementById('resultFuture');
    if (resultFuture) resultFuture.textContent = branchInfo.future || "";

    const resultCareer = document.getElementById('resultCareer');
    if (resultCareer) resultCareer.textContent = branchInfo.career || "";

    const resultWhySuit = document.getElementById('resultWhySuit');
    if (resultWhySuit) resultWhySuit.textContent = branchInfo.suitability || "";

    // Deep Analysis
    const resultDeepAnalysis = document.getElementById('resultDeepAnalysis');
    if (resultDeepAnalysis) {
        const physicsEdge = currentAssessment.marks?.physics > 80 ? "your strong performance in Physics" : "your analytical approach";
        resultDeepAnalysis.textContent = `Hey ${userName}, let's look at your feedback. Based on ${physicsEdge} and your interest patterns, your profile suggests you're built for ${branchInfo.name}. Your quiz responses indicate a natural talent for this field.`;
    }

    // Key Edges (Tags)
    const tags = branchInfo.tags || [];
    ['resultKeyEdge', 'resultKeyEdge2', 'resultKeyEdge3'].forEach((id, i) => {
        const el = document.getElementById(id);
        if (el) {
            el.textContent = tags[i] ? tags[i].toUpperCase() : (i === 0 ? "CORE" : "");
            el.style.display = tags[i] ? 'inline-block' : (i === 0 ? 'inline-block' : 'none');
        }
    });

    // Pros List
    const prosList = document.getElementById('resultProsList');
    if (prosList && branchInfo.pros) {
        prosList.innerHTML = branchInfo.pros.map(pro => `<li>${pro}</li>`).join('');
    }

    // Related Courses
    const relatedContainer = document.getElementById('relatedCoursesContainer');
    if (relatedContainer && relatedCoursesData && relatedCoursesData[branchKey]) {
        relatedContainer.innerHTML = relatedCoursesData[branchKey].map(rel => {
            const relInfo = branchMapping[rel.key];
            return `
                <div class="related-course-card-new" style="position: relative;">
                    <span class="course-card-fav" onclick="toggleCourseFav('${rel.key}', this)">🤍</span>
                    <span class="course-badge">${rel.why}</span>
                    <h5>${relInfo ? relInfo.name : rel.key}</h5>
                    <p>"${rel.desc}"</p>
                    <div class="course-meta">${relInfo ? relInfo.desc.substring(0, 100) + '...' : ''}</div>
                    <button class="btn-link-new" onclick="viewRelatedGuidance('${rel.key}')">View Guidance</button>
                </div>
            `;
        }).join('');
    }

    // Fix Explore Course Button
    const exploreBtn = document.getElementById('exploreRecommended');
    if (exploreBtn) {
        exploreBtn.onclick = () => {
            import('./ui.js').then(m => m.switchTab('courses'));
        };
    }

    // Main Fav Btn logic
    const mainFavBtn = document.getElementById('mainFavBtn');
    if (mainFavBtn) {
        mainFavBtn.onclick = () => toggleMainFav(branchKey);
    }
}

window.viewRelatedGuidance = function(branchKey) {
    // Correctly reset quiz scores for the new branch to show results
    currentAssessment.quizScores = { [branchKey]: 100 };
    showResults();
    window.scrollTo({ top: 0, behavior: 'smooth' });
};

window.toggleMainFav = function(branchKey) {
    const btn = document.getElementById('mainFavBtn');
    if (!btn) return;
    const isActive = btn.classList.toggle('active');
    btn.textContent = isActive ? '❤️' : '🤍';
    // Potential integration with state.js favorites could go here
    console.log(`Toggled favorite for ${branchKey}: ${isActive}`);
};

window.toggleCourseFav = function(branchKey, el) {
    if (!el) return;
    const isActive = el.classList.toggle('active');
    el.textContent = isActive ? '❤️' : '🤍';
    console.log(`Toggled favorite for related ${branchKey}: ${isActive}`);
};
