export const appState = {
    cutoffData2024: [],
    cutoffData2023: [],
    courseInsights: [],
    rankings: [],
    currentData: [],
    currentPage: 1,
    year: '2024',
    currentPageTab: 'dashboard',
    previousTab: 'dashboard'
};

export const currentAssessment = {
    step: 1,
    marks: { math: '', physics: '', chemistry: '', vocational: '', cutOff: 0 },
    group: 'academic',
    answers: {},
    history: [],
    results: null
};

export const chatState = {
    lastSubject: null // { type: 'course'|'college', name: string, data: any }
};

export const authState = {
    isLoggedIn: false,
    user: null
};
