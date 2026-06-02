import { appState } from './state.js';

export async function fetchJson(url) {
    const r = await fetch(url);
    if (!r.ok) throw new Error('HTTP error ' + r.status);
    return r.json();
}

export async function loadAllData(generateSampleData) {
    try {
        const [cut24, cut23, courses, ranks] = await Promise.all([
            fetchJson('TNEA2024CutOff.json').catch(e => []),
            fetchJson('TNEA2023CutOff.json').catch(e => []),
            fetchJson('TNEAcourseInsights.json').catch(e => ({})),
            fetchJson('2024_TNEA_NIRF_Ranking.json').catch(e => [])
        ]);

        appState.cutoffData2024 = (cut24 && cut24.length) ? cut24 : generateSampleData();
        appState.cutoffData2023 = cut23 || [];
        appState.courseInsights = courses ? Object.entries(courses).map(([name, info]) => ({ name: name.trim(), ...info })) : [];
        appState.rankings = ranks || [];
        appState.currentData = appState.cutoffData2024;

        return true;
    } catch (e) {
        console.error("Data Load Error", e);
        appState.cutoffData2024 = generateSampleData();
        appState.currentData = appState.cutoffData2024;
        return false;
    }
}
