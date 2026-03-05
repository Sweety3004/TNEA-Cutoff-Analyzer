import { appState, chatState } from './state.js';

export function toggleChat() {
    const win = document.getElementById('chatWindow');
    if (!win) return;
    if (win.style.display === 'flex') {
        win.style.display = 'none';
        win.classList.remove('open');
    } else {
        win.style.display = 'flex';
        setTimeout(() => win.classList.add('open'), 10);
        const input = document.getElementById('chatInput');
        if (input) input.focus();
    }
}

export function sendChatMessage() {
    const input = document.getElementById('chatInput');
    if (!input) return;
    const msg = input.value.trim();
    if (!msg) return;

    addMessage(msg, 'user');
    input.value = '';

    const indicator = document.getElementById('typingIndicator');
    if (indicator) indicator.style.display = 'block';

    const body = document.getElementById('chatBody');
    if (body) body.scrollTop = body.scrollHeight;

    setTimeout(() => {
        const response = getBotResponse(msg);
        if (indicator) indicator.style.display = 'none';
        addMessage(response, 'bot');
    }, 1000 + Math.random() * 1000);
}

export function addMessage(text, sender) {
    const body = document.getElementById('chatBody');
    if (!body) return;
    const div = document.createElement('div');
    div.className = `message ${sender}`;
    div.innerHTML = text.replace(/\n/g, '<br>');

    const indicator = document.getElementById('typingIndicator');
    body.insertBefore(div, indicator);

    body.scrollTop = body.scrollHeight;
}

export function getBotResponse(input) {
    const s = input.toLowerCase();

    // 1. Context Detection
    const isRanking = s.includes('rank') || s.includes('top') || s.includes('best');
    const isCourse = s.includes('course') || s.includes('branch') || s.includes('career') || s.includes('demand');
    const isCutoff = s.includes('cutoff') || s.includes('mark') || s.includes('score') || s.includes('get into') || s.includes('eligibl');
    const isFees = s.includes('fee') || s.includes('cost') || s.includes('price');
    const isFollowUp = s.includes('this') || s.includes('it') || s.includes('that') || s.includes('they') || s.includes('offer') || s.includes('which college');

    // 2. Ranking Queries
    if (isRanking) {
        const foundRank = appState.rankings.find(r => s.includes(r.college.toLowerCase()));
        if (foundRank) {
            chatState.lastSubject = { type: 'college', name: foundRank.college, data: foundRank };
            return `Yes! **${foundRank.college}** is one of the top-rated institutions. It currently holds a **NIRF Ranking of #${foundRank.ranking}**. It's known for its academic excellence and infrastructure.`;
        }
        if (isFollowUp && chatState.lastSubject && chatState.lastSubject.type === 'college') {
            return `**${chatState.lastSubject.name}** is ranked **#${chatState.lastSubject.data.ranking}** in the NIRF 2024 rankings. Would you like to check its cutoffs?`;
        }
        if (s.includes('top') || s.includes('best')) {
            const top3 = appState.rankings.slice(0, 3);
            return `The top 3 engineering colleges in Tamil Nadu according to rankings are:\n1. ${top3[0]?.college}\n2. ${top3[1]?.college}\n3. ${top3[2]?.college}\nWould you like to know their cutoffs?`;
        }
    }

    // 3. Course Details
    const courseInsight = appState.courseInsights.find(c => s.includes(c.name.toLowerCase()) || c.name.toLowerCase().includes(s.replace('tell me about', '').trim()));
    if (courseInsight && (isCourse || s.length < 30)) {
        chatState.lastSubject = { type: 'course', name: courseInsight.name, data: courseInsight };
        return `**${courseInsight.name}** is a great choice!\n\n**Market Demand:** ${courseInsight['Market Demand']}\n**Salary (Entry):** ${courseInsight.Salary?.Entry || 'Variable'}\n\n**Quick Summary:** ${courseInsight['Course Description'].substring(0, 150)}...\n\nShould I check which colleges offer this course?`;
    }

    // 4. Follow-up
    if (isFollowUp && chatState.lastSubject && chatState.lastSubject.type === 'course') {
        if (s.includes('college') || s.includes('offer') || s.includes('where') || s.includes('instit')) {
            const searchName = chatState.lastSubject.name.toLowerCase();
            const relevantColleges = appState.cutoffData2024.filter(c =>
                c.brn.toLowerCase().includes(searchName) ||
                c.brc.toLowerCase() === searchName
            ).slice(0, 5);

            if (relevantColleges.length > 0) {
                const collegeNames = [...new Set(relevantColleges.map(c => c.con))];
                return `Top colleges offering **${chatState.lastSubject.name}** include:\n${collegeNames.map(name => `- ${name}`).join('\n')}\n\nYou can see more details and full cutoffs for these in the 'Search Cutoffs' tab!`;
            }
        }
    }

    // 5. Cutoff Prediction
    const scoreMatch = s.match(/\d+(\.\d+)?/);
    if (isCutoff && scoreMatch) {
        const score = parseFloat(scoreMatch[0]);
        const colleges = appState.cutoffData2024.filter(c => parseFloat(c.OC) <= score).slice(0, 3);
        if (colleges.length > 0) {
            return `With a cutoff of **${score}**, you have a good chance at several institutions for OC category, including:\n${colleges.map(c => `- ${c.con} (${c.brn})`).join('\n')}\n\nI recommend using the **Course Predictor** tab for a full, personalized analysis!`;
        } else {
            return `A cutoff of **${score}** might be tight for the top-tier college branches, but there are many great colleges in the next tier. Try searching for specific branches in the 'Search Cutoffs' tab!`;
        }
    }

    if (s.includes('hello') || s.includes('hi')) return "Hello! I'm your TNEA AI Assistant. I have access to rankings for 400+ colleges and detailed insights for 50+ courses. Ask me anything!";

    return "I'm not exactly sure about that, but I can help you with college rankings, course career paths, or predicting your college based on your cutoff score.";
}
