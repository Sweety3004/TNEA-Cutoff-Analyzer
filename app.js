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
    if (tabId === 'favorites') Auth.renderFavorites ? Auth.renderFavorites() : null;
    if (tabId === 'assessment' && State.currentAssessment.history.length === 0) Assessment.startAssessment();
};

window.toggleChat = Chatbot.toggleChat;
window.sendChatMessage = Chatbot.sendChatMessage;
window.quickChat = (msg) => Chatbot.quickChat(msg, Chatbot.sendChatMessage);
window.handleChatKey = (e) => Chatbot.handleChatKey(e, Chatbot.sendChatMessage);

window.handleLogin = Auth.handleLogin;
window.handleLogout = () => Auth.handleLogout(UI.renderUserArea, Auth.updateFavBadge, UI.renderCutoffTable);
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

window.startAssessment = Assessment.startAssessment;
window.setAcademicGroup = Assessment.setAcademicGroup;
window.selectOption = Assessment.handleAnswerSelection;

// Initialize App
async function initApp() {
    console.log("Starting App Initialization...");
    try {
        Auth.initAuth(UI.renderUserArea, Auth.updateFavBadge);
        console.log("Auth Initialized");

        // Show loading state
        const success = await Api.loadAllData(UI.generateSampleData);
        console.log("Data Load Success:", success);

        UI.renderAll();
        console.log("UI Rendered");

        UI.hideLoadingIndicator();
        console.log("Loading Indicator Hidden");

        console.log("TNEA Cutoff Analyzer Initialized Successfully");
    } catch (error) {
        console.error("CRITICAL Initialization Error:", error);
    }
}

window.addEventListener('load', initApp);

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
