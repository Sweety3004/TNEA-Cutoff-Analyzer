import * as State from './js/state.js';
import * as Constants from './js/constants.js';
import * as Api from './js/api.js';
import * as UI from './js/ui.js';
import * as Auth from './js/auth.js';
import * as Assessment from './js/assessment.js';
import * as Predictor from './js/predictor.js';
import * as Chatbot from './js/chatbot.js';

// Global Exposure for HTML onclick handlers
window.switchTab = (tabId) => {
    UI.switchTab(tabId);
    if (tabId === 'favorites') UI.renderFavoritesList ? UI.renderFavoritesList() : null;
    if (tabId === 'assessment' && State.currentAssessment.history.length === 0) Assessment.startAssessment();
};

window.toggleChat = Chatbot.toggleChat;
window.sendChatMessage = Chatbot.sendChatMessage;
window.quickChat = (msg) => Chatbot.quickChat(msg, Chatbot.sendChatMessage);
window.handleChatKey = (e) => Chatbot.handleChatKey(e, Chatbot.sendChatMessage);

window.handleLogin = Auth.handleLogin;
window.handleLogout = () => Auth.handleLogout(UI.renderUserArea, UI.updateFavBadge, UI.renderCutoffTable);
window.showLoginModal = Auth.showLoginModal;
window.closeLoginModal = Auth.closeLoginModal;
window.toggleLoginMode = Auth.toggleLoginMode;
window.handleGoogleLogin = Auth.handleGoogleLogin;
window.handleForgotPassword = Auth.handleForgotPassword;

window.calcPredictorCutoff = Predictor.calcPredictorCutoff;
window.predNextStep = (step) => {
    Predictor.predictorState.currentStep = step;
    Predictor.updatePredictorUI();
};
window.runPredictor = Predictor.runPredictor;
window.filterBranchChips = Predictor.filterBranchChips || function () { };
window.printResults = () => window.print();

window.startAssessment = Assessment.startAssessment;
window.setAcademicGroup = Assessment.setAcademicGroup;
window.selectOption = Assessment.handleAnswerSelection;
window.handleAnswerSelection = Assessment.handleAnswerSelection;
window.proceedToDiscovery = Assessment.proceedToDiscovery || function () { Assessment.navigateToAssessmentScreen('interestQuiz'); Assessment.renderQuizQuestion(); };
window.handleAssessmentBack = Assessment.handleAssessmentBack || function () { Assessment.navigateToAssessmentScreen('academicProfile'); };

window.setGCAcademicGroup = Assessment.setGCAcademicGroup || function () { };
window.proceedToGCBranchSelector = Assessment.proceedToGCBranchSelector || function () { };
window.showGCResults = Assessment.showGCResults || function () { };
window.handleGCBack = Assessment.handleGCBack || function () { };
window.resetGuidedCompare = Assessment.resetGuidedCompare || function () { };

window.openLegalModal = UI.openLegalModal;
window.closeLegalModal = UI.closeLegalModal;
window.closeCourseModal = () => { const m = document.getElementById('courseDetailModal'); if (m) m.classList.add('hidden'); };
window.toggleFavorite = (key) => { import('./js/auth.js').then(A => { const favs = A.getFavorites(); /* toggle logic */ }); };
window.goBackInsights = () => window.history.back();

window.renderCutoffTable = UI.renderCutoffTable;
window.renderCourseInsights = UI.renderCourseInsights;
window.switchCompareMode = (mode) => {
    document.getElementById('collegeCompareUI').style.display = mode === 'college' ? '' : 'none';
    document.getElementById('branchCompareUI').style.display = mode === 'branch' ? '' : 'none';
    document.querySelectorAll('.compare-toggle-btn').forEach((b, i) => b.classList.toggle('active', (i === 0 && mode === 'college') || (i === 1 && mode === 'branch')));
};
window.updateCompareBranches = () => { };
window.updateCompareColleges = () => { };
window.updateComparison = () => { };
window.runBranchComparison = () => { };

// Initialize App
async function initApp() {
    console.log("Starting App Initialization...");
    const errorDisplay = document.getElementById('error-display');
    const retryButton = document.getElementById('retry-button');

    // Set a timeout for initialization
    const timeout = setTimeout(() => {
        if (errorDisplay) {
            errorDisplay.textContent = "Initialization is taking longer than expected. Please check your internet connection or the server status.";
            errorDisplay.style.display = 'block';
        }
        if (retryButton) retryButton.style.display = 'block';
    }, 10000);

    try {
        Auth.initAuth(UI.renderUserArea, UI.updateFavBadge);
        console.log("Auth Initialized");

        const success = await Api.loadAllData(UI.generateSampleData);
        console.log("Data Load Success:", success);

        UI.renderAll();
        console.log("UI Rendered");

        clearTimeout(timeout);
        console.log("TNEA Cutoff Analyzer Initialized Successfully");
    } catch (error) {
        console.error("CRITICAL Initialization Error:", error);
        clearTimeout(timeout);
        if (errorDisplay) {
            errorDisplay.textContent = "Critical Error: " + error.message;
            errorDisplay.style.display = 'block';
        }
        if (retryButton) retryButton.style.display = 'block';
    } finally {
        // Only hide if there was NO terminal error displayed
        if (!errorDisplay || errorDisplay.style.display === 'none') {
            UI.hideLoadingIndicator();
            console.log("Loading Indicator Hidden");
        }
    }
}

// Start initialization when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initApp);
} else {
    initApp();
}

// Scroll effects
window.addEventListener('scroll', () => {
    const nav = document.querySelector('.navbar');
    if (!nav) return;
    if (window.scrollY > 50) {
        nav.style.background = 'rgba(255, 255, 255, 0.95)';
        nav.style.boxShadow = '0 5px 20px rgba(0,0,0,0.05)';
    } else {
        nav.style.background = 'rgba(255, 255, 255, 0.9)';
        nav.style.boxShadow = 'none';
    }
});
