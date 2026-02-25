

            // Global State
            let appState = {
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

            // Remove loading indicator when done
            function hideLoadingIndicator() {
                const el = document.getElementById('js-loading-indicator');
                if (el) el.style.display = 'none';
            }

            const ITEMS_PER_PAGE = 25;

            // --- Navigation ---
            function switchTab(tabId) {
                if (appState.currentPageTab !== tabId) {
                    appState.previousTab = appState.currentPageTab;
                }
                appState.currentPageTab = tabId;
                // Update Nav UI
                document.querySelectorAll('.nav-link').forEach(link => {
                    link.classList.remove('active');
                    if (link.dataset.tab === tabId) link.classList.add('active');
                });

                // Update Section Visibility
                document.querySelectorAll('.app-section').forEach(section => {
                    section.classList.remove('active');
                });
                document.getElementById(tabId).classList.add('active');

                // Scroll to top
                window.scrollTo(0, 0);
            }

            function goBackInsights() {
                if (appState.previousTab && appState.previousTab !== 'courses') {
                    switchTab(appState.previousTab);
                } else {
                    switchTab('dashboard');
                }
            }

            // --- Data Loading ---
            async function loadData() {
                const showLoading = () => {
                    const tbl = document.getElementById('cutoffTable');
                    if (tbl) tbl.innerHTML = `<tr><td colspan="10"><div class="spinner"></div></td></tr>`;
                };
                showLoading();

                try {
                    const fetchJson = async (url) => {
                        const r = await fetch(url);
                        if (!r.ok) throw new Error(`HTTP error! status: ${r.status}`);
                        return r.json();
                    };

                    const [cut24, cut23, courses, ranks] = await Promise.all([
                        fetchJson('TNEA2024CutOff.json').catch(e => { console.error("2024 Cutoff Load Failed", e); return []; }),
                        fetchJson('TNEA2023CutOff.json').catch(e => { console.error("2023 Cutoff Load Failed", e); return []; }),
                        fetchJson('TNEAcourseInsights.json').catch(e => { console.error("Course Insights Load Failed", e); return {}; }),
                        fetchJson('2024_TNEA_NIRF_Ranking.json').catch(e => { console.error("Rankings Load Failed", e); return []; })
                    ]);

                    appState.cutoffData2024 = cut24 && cut24.length ? cut24 : generateSampleData();
                    appState.cutoffData2023 = cut23 || [];
                    appState.courseInsights = courses ? Object.entries(courses).map(([name, info]) => ({ name: name.trim(), ...info })) : [];
                    appState.rankings = ranks || [];

                    appState.currentData = appState.cutoffData2024;

                    renderAll();
                    hideLoadingIndicator(); // SUCCESS

                    if (appState.cutoffData2024.length > 0) {
                        try {
                            const el = document.getElementById('compareCutoff');
                            if (el) {
                                el.value = 180;
                                updateCompareBranches();
                            }
                        } catch (e) { console.warn("Compare update failed", e); }
                    }

                } catch (e) {
                    console.error("Initialization Failed", e);
                    alert("Initialization Failed: " + e.message);
                    appState.cutoffData2024 = generateSampleData();
                    appState.currentData = appState.cutoffData2024;
                    renderAll();
                    hideLoadingIndicator(); // FALBACK SUCCESS
                }
            }

            function generateSampleData() {
                // Fallback for demo if files missing
                const colleges = [
                    'University Departments of Anna University Chennai - CEG Campus',
                    'University Departments of Anna University Chennai - ACT Campus',
                    'University Departments of Anna University Chennai - MIT Campus',
                    'College of Engineering Guindy',
                    'PSG College of Technology',
                    'Coimbatore Institute of Technology'
                ];
                const data = [];
                colleges.forEach((c, i) => {
                    data.push({
                        con: c, brc: 'CS', brn: 'COMPUTER SCIENCE',
                        OC: 195 - i, BC: 190 - i, MBC: 185 - i
                    });
                });
                return data;
            }

            // --- Rendering ---
            function renderAll() {
                populateBranchFilter();
                renderCutoffTable();
                renderCourseInsights();
                renderRankings();
                updateDashboardStats(); // Important: Render dashboard stats
            }

            function updateDashboardStats() {
                const data = appState.cutoffData2024;
                if (!data || data.length === 0) return;

                // 1. Stats Cards
                const colleges = new Set(data.map(d => d.con)).size;
                const branches = new Set(data.map(d => d.brc)).size;

                document.getElementById('dashColleges').innerText = colleges;
                document.getElementById('dashBranches').innerText = branches;
            }

            // 1. Cutoff Table
            function renderCutoffTable() {
                const tbody = document.getElementById('cutoffTable');
                const searchCollege = document.getElementById('searchCollegeInput').value.toLowerCase();
                const category = document.getElementById('categoryFilter').value;
                const branch = document.getElementById('branchFilter').value;
                const year = appState.year;

                // Use correct dataset
                const sourceData = year === '2024' ? appState.cutoffData2024 : appState.cutoffData2023;

                // Filter
                const filtered = sourceData.filter(item => {
                    const s = searchCollege;
                    // Strict College Name 'Starts With' Search
                    const matchesSearch = !s || (item.con && item.con.toLowerCase().startsWith(s));
                    const matchesBranch = !branch || item.brc === branch;
                    return matchesSearch && matchesBranch;
                });

                // Pagination
                const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
                const start = (appState.currentPage - 1) * ITEMS_PER_PAGE;
                const pageData = filtered.slice(start, start + ITEMS_PER_PAGE);

                if (pageData.length === 0) {
                    tbody.innerHTML = `<tr><td colspan="11" style="text-align:center; padding: 2rem;">No results found</td></tr>`;
                    document.getElementById('pagination').innerHTML = '';
                    return;
                }

                tbody.innerHTML = pageData.map(item => {
                    const favKey = `${item.con}||${item.brc}`;
                    const isSaved = isFavorite(favKey);
                    return `
                <tr>
                    <td><span class="branch-code">${item.brc || '-'}</span></td>
                    <td title="${item.con}">${item.con}</td>
                    <td>${item.brn}</td>
                    <td class="cutoff-value ${getCutoffClass(item.OC)}">${item.OC || '-'}</td>
                    <td class="cutoff-value ${getCutoffClass(item.BC)}">${item.BC || '-'}</td>
                    <td class="cutoff-value ${getCutoffClass(item.BCM)}">${item.BCM || '-'}</td>
                    <td class="cutoff-value ${getCutoffClass(item.MBC)}">${item.MBC || '-'}</td>
                    <td class="cutoff-value ${getCutoffClass(item.SC)}">${item.SC || '-'}</td>
                    <td class="cutoff-value ${getCutoffClass(item.SCA)}">${item.SCA || '-'}</td>
                    <td class="cutoff-value ${getCutoffClass(item.ST)}">${item.ST || '-'}</td>
                    <td><button class="fav-btn ${isSaved ? 'saved' : ''}" onclick="toggleFavorite('${favKey.replace(/'/g, "\\'")}', this, ${JSON.stringify(item).replace(/"/g, '&quot;')})" title="${isSaved ? 'Remove from favorites' : 'Save to favorites'}">${isSaved ? '❤️' : '🤍'}</button></td>
                </tr>
            `}).join('');

                renderPagination(totalPages);
            }

            function getCutoffClass(val) {
                if (!val) return '';
                const n = parseFloat(val);
                if (n > 185) return 'high';
                if (n > 160) return 'medium';
                return 'low';
            }

            function renderPagination(total) {
                const el = document.getElementById('pagination');
                if (total <= 1) { el.innerHTML = ''; return; }

                const curr = appState.currentPage;
                let html = `
                <button class="btn" onclick="changePage(${curr - 1})" ${curr === 1 ? 'disabled' : ''}>Prev</button>
                <span style="display:flex; align-items:center; padding:0 1rem; color:var(--text-muted)">Page ${curr} of ${total}</span>
                <button class="btn" onclick="changePage(${curr + 1})" ${curr === total ? 'disabled' : ''}>Next</button>
            `;
                el.innerHTML = html;
            }

            function changePage(p) {
                appState.currentPage = p;
                renderCutoffTable();
            }

            // 2. Filters
            function populateBranchFilter() {
                const select = document.getElementById('branchFilter');
                // Create a map of code -> name to ensure unique branches
                const branchMap = new Map();
                appState.currentData.forEach(d => {
                    if (d.brc && d.brn && !branchMap.has(d.brc)) {
                        branchMap.set(d.brc, d.brn);
                    }
                });

                // Sort by branch code
                const sortedBranches = Array.from(branchMap.entries()).sort((a, b) => a[0].localeCompare(b[0]));

                select.innerHTML = '<option value="">All Branches</option>' +
                    sortedBranches.map(([code, name]) => `<option value="${code}">${code} - ${name}</option>`).join('');
            }

            function populateCollegeSelects() {
                const colleges = [...new Set(appState.currentData.map(d => d.con))].filter(Boolean).sort();
                const opts = '<option value="">Select College</option>' +
                    colleges.map(c => `<option value="${c}">${c}</option>`).join('');
                document.getElementById('college1').innerHTML = opts;
                document.getElementById('college2').innerHTML = opts;
            }

            // 3. Course Insights
            function renderCourseInsights() {
                const grid = document.getElementById('courseGrid');
                const termInput = document.getElementById('courseSearch');
                const term = termInput ? termInput.value.toLowerCase().trim() : '';

                let displayData = [];
                let isSearchMode = term.length > 0;

                if (!isSearchMode) {
                    // Default view: Show main branches from branchMapping
                    displayData = Object.keys(branchMapping).map(key => {
                        const b = branchMapping[key];
                        // Try to find matching data in appState.courseInsights for salary/metadata
                        const extra = appState.courseInsights.find(c =>
                            c.name.toLowerCase().includes(b.name.toLowerCase()) ||
                            b.name.toLowerCase().includes(c.name.toLowerCase())
                        ) || {};

                        return {
                            name: b.name,
                            key: key,
                            description: b.desc,
                            future: b.future,
                            career: b.career,
                            suitability: b.suitability,
                            demand: extra['Market Demand'] || 'Very High',
                            salary: extra['Salary'] ? (typeof extra['Salary'] === 'string' ? extra['Salary'] : extra['Salary']['Entry']) : 'Premium',
                            concepts: b.tags || [],
                            isAdvisor: true,
                            pros: b.pros || [],
                            cons: b.cons || []
                        };
                    });
                } else {
                    // Search mode: Merge both sources to ensure all 20+ branches are searchable
                    const branchMappingResults = Object.keys(branchMapping)
                        .filter(key => branchMapping[key].name.toLowerCase().includes(term) || key.includes(term))
                        .map(key => {
                            const b = branchMapping[key];
                            const extra = appState.courseInsights.find(c =>
                                c.name.toLowerCase().includes(b.name.toLowerCase()) ||
                                b.name.toLowerCase().includes(c.name.toLowerCase())
                            ) || {};
                            return {
                                name: b.name,
                                key: key,
                                description: b.desc,
                                future: b.future,
                                career: b.career,
                                suitability: b.suitability,
                                demand: extra['Market Demand'] || 'Very High',
                                salary: extra['Salary'] ? (typeof extra['Salary'] === 'string' ? extra['Salary'] : extra['Salary']['Entry']) : 'Premium',
                                concepts: b.tags || [],
                                isAdvisor: true,
                                pros: b.pros || [],
                                cons: b.cons || []
                            };
                        });

                    const insightResults = appState.courseInsights
                        .filter(c => c.name.toLowerCase().includes(term))
                        .filter(c => !branchMappingResults.some(br => br.name.toLowerCase() === c.name.toLowerCase()))
                        .map(c => {
                            const mappedKey = Object.keys(branchMapping).find(key =>
                                branchMapping[key].name.toLowerCase().includes(c.name.toLowerCase()) ||
                                c.name.toLowerCase().includes(branchMapping[key].name.toLowerCase())
                            );

                            return {
                                name: c.name,
                                key: mappedKey,
                                description: c['Course Description'] || 'No description available.',
                                future: mappedKey ? branchMapping[mappedKey].future : null,
                                career: mappedKey ? branchMapping[mappedKey].career : null,
                                demand: c['Market Demand'] || 'High',
                                salary: c['Salary'] ? (typeof c['Salary'] === 'string' ? c['Salary'] : c['Salary']['Entry']) : 'N/A',
                                concepts: c['Fundamental Concepts'] || [],
                                isAdvisor: !!mappedKey,
                                pros: mappedKey ? branchMapping[mappedKey].pros : [],
                                cons: mappedKey ? branchMapping[mappedKey].cons : []
                            };
                        });

                    displayData = [...branchMappingResults, ...insightResults];
                }


                grid.innerHTML = displayData.map(c => {
                    const isFav = isBranchFavorite(c.name);
                    return `
                    <div class="course-card" style="display:flex; flex-direction:column; height:100%; position:relative; overflow:hidden;">
                        ${c.isAdvisor ? `<div style="position:absolute; top:0; right:0; background:var(--primary); color:white; font-size:10px; padding:2px 8px; border-bottom-left-radius:8px; font-weight:bold; letter-spacing:0.5px;">ADVISOR CHOICE</div>` : ''}
                        
                        <div style="display:flex; justify-content:space-between; align-items:start; gap:0.75rem; margin-bottom:0.75rem; flex-wrap:wrap;">
                            <div style="flex:1;">
                                <h3 style="margin:0; font-size:1.1rem; line-height:1.3; color:var(--primary);">${c.name}</h3>
                                <div style="display:flex; gap:0.5rem; margin-top:0.4rem;">
                                    <span style="font-size:0.65rem; background:rgba(59, 130, 246, 0.15); color:var(--primary); padding:0.2rem 0.6rem; border-radius:12px; font-weight:700; border:1px solid rgba(59, 130, 246, 0.2);">${c.demand}</span>
                                    <span style="font-size:0.65rem; background:rgba(16, 185, 129, 0.1); color:var(--success); padding:0.2rem 0.6rem; border-radius:12px; font-weight:700;">₹ ${c.salary}</span>
                                </div>
                            </div>
                            <button class="fav-btn ${isFav ? 'saved' : ''}" 
                                    onclick="toggleBranchFavorite('${c.name.replace(/'/g, "\\'")}')" 
                                    style="padding:8px; display:inline-flex; align-items:center; justify-content:center; border:1px solid var(--border); border-radius:10px; background:var(--surface);"
                                    title="${isFav ? 'Remove from favorites' : 'Save to favorites'}">
                                ${isFav ? '❤️' : '🤍'}
                            </button>
                        </div>

                        <p style="font-size:0.85rem; color:var(--text-muted); line-height:1.5; margin-bottom:1rem;">${c.description}</p>

                        <div style="background:rgba(255,255,255,0.02); border:1px solid var(--border); border-radius:12px; padding:1rem; margin-bottom:1rem;">
                            <div style="font-size:0.75rem; font-weight:700; color:var(--primary); text-transform:uppercase; margin-bottom:0.75rem; letter-spacing:0.5px;">💡 Why choose this?</div>
                            <div style="display:flex; flex-direction:column; gap:0.5rem;">
                                ${c.pros.slice(0, 2).map(p => `
                                    <div style="display:flex; align-items:start; gap:0.5rem; font-size:0.8rem; color:var(--text);">
                                        <span style="color:var(--success);">Check</span> <span>${p}</span>
                                    </div>
                                `).join('')}
                                ${c.cons.slice(0, 1).map(cn => `
                                    <div style="display:flex; align-items:start; gap:0.5rem; font-size:0.8rem; color:var(--text-muted);">
                                        <span style="color:var(--accent);">Info</span> <span>Challenge: ${cn}</span>
                                    </div>
                                `).join('')}
                            </div>
                        </div>

                        ${c.future ? `
                        <div class="course-meta-section">
                            <div class="course-meta-title"><span>🔭</span> The Future Scope</div>
                            <div class="course-meta-text" style="font-size:0.8rem;">${c.future}</div>
                        </div>
                        ` : ''}

                        ${c.key && relatedCoursesData[c.key] ? `
                        <div class="course-meta-section" style="border-top:1px dashed var(--border); padding-top:0.75rem; margin-top:0.5rem;">
                            <div class="course-meta-title" style="color:var(--primary); font-size:0.75rem;"><span>🔗</span> Related Paths</div>
                            <div style="display:flex; flex-wrap:wrap; gap:0.3rem; margin-top:0.3rem;">
                                ${relatedCoursesData[c.key].map(rel => `
                                    <span style="font-size:0.7rem; background:rgba(59, 130, 246, 0.05); color:var(--text); padding:0.15rem 0.5rem; border-radius:4px; border:1px solid var(--border);">
                                        ${rel.why}: <strong>${branchMapping[rel.key] ? branchMapping[rel.key].name.split(' ')[0] : rel.key}</strong>
                                    </span>
                                `).join('')}
                            </div>
                        </div>
                        ` : ''}

                        <div style="margin-top:auto; padding-top:1rem; display:flex; justify-content:center;">
                            <button class="btn-primary" style="width:100%; padding:0.5rem; font-size:0.8rem; border-radius:8px;" onclick="toggleChatWithCourse('${c.name.replace(/'/g, "\\'")}')">
                                💬 Ask AI about this course
                            </button>
                        </div>
                    </div>
                    `;
                }).join('') || '<p style="text-align:center; grid-column:1/-1; padding:3rem; color:var(--text-muted);">No courses found matching your search.</p>';
            }


            function toggleChatWithCourse(courseName) {
                if (!document.getElementById('chatWindow').classList.contains('open')) {
                    toggleChat();
                }
                const input = document.getElementById('chatInput');
                input.value = `Tell me more about ${courseName}`;
                sendChatMessage();
            }

            // 4. Rankings
            function openLegalModal() {
                document.getElementById('legalModal').classList.remove('hidden');
                document.body.style.overflow = 'hidden';
            }

            function closeLegalModal() {
                document.getElementById('legalModal').classList.add('hidden');
                document.body.style.overflow = 'auto';
            }

            function renderRankings() {
                const list = document.getElementById('rankingsList');
                const term = document.getElementById('rankingSearch').value.toLowerCase();
                const filtered = appState.rankings.filter(r => r.college.toLowerCase().includes(term));

                if (!filtered.length) {
                    list.innerHTML = `<p style="text-align:center">No rankings found</p>`;
                    return;
                }

                // Sort by ranking (ascending)
                filtered.sort((a, b) => parseInt(a.ranking) - parseInt(b.ranking));

                list.innerHTML = filtered.slice(0, 50).map(r => `
                <div style="background:var(--surface); padding:1rem; border-bottom:1px solid var(--border); display:flex; justify-content:space-between; align-items:center;">
                    <div>
                        <div style="font-weight:600">${r.college}</div>
                        <div style="font-size:0.8rem; color:var(--text-muted)">State: ${r.state || 'TN'}</div>
                    </div>
                    <div style="background:var(--primary); color:white; padding:0.5rem 1rem; border-radius:8px; font-weight:bold;">#${r.ranking}</div>
                </div>
             `).join('');
            }


            // 5. Compare Logic - REFACTORED FLOW
            function updateCompareBranches() {
                const cutoff = parseFloat(document.getElementById('compareCutoff').value);
                const category = document.getElementById('compareCategory').value;
                const branchSelect = document.getElementById('compareBranch');
                const c1 = document.getElementById('college1');
                const c2 = document.getElementById('college2');

                if (isNaN(cutoff)) {
                    branchSelect.innerHTML = '<option value="">Enter cutoff first...</option>';
                    branchSelect.disabled = true;
                    c1.disabled = true;
                    c2.disabled = true;
                    return;
                }

                // Find all branches where student qualifies in at least one college
                const data = appState.cutoffData2024;
                const eligibleBranches = new Set();
                data.forEach(item => {
                    const itemCutoff = parseFloat(item[category]);
                    if (!isNaN(itemCutoff) && itemCutoff <= cutoff) {
                        eligibleBranches.add(`${item.brc}||${item.brn}`);
                    }
                });

                const sortedBranches = Array.from(eligibleBranches).sort();
                branchSelect.innerHTML = '<option value="">Select a Course</option>' +
                    sortedBranches.map(b => {
                        const [code, name] = b.split('||');
                        return `<option value="${code}">${code} - ${name}</option>`;
                    }).join('');

                branchSelect.disabled = false;
                c1.disabled = true;
                c2.disabled = true;
                document.getElementById('comparisonResult').innerHTML = '';
            }

            function updateCompareColleges() {
                const cutoff = parseFloat(document.getElementById('compareCutoff').value);
                const category = document.getElementById('compareCategory').value;
                const branchCode = document.getElementById('compareBranch').value;
                const c1 = document.getElementById('college1');
                const c2 = document.getElementById('college2');

                if (!branchCode) {
                    c1.disabled = true;
                    c2.disabled = true;
                    return;
                }

                // Find colleges offering this branch where student qualifies
                const data = appState.cutoffData2024.filter(item => {
                    const itemCutoff = parseFloat(item[category]);
                    return item.brc === branchCode && !isNaN(itemCutoff) && itemCutoff <= cutoff;
                });

                const uniqueColleges = [...new Set(data.map(d => d.con))].sort();
                const options = '<option value="">Select College</option>' +
                    uniqueColleges.map(c => `<option value="${c}">${c}</option>`).join('');

                c1.innerHTML = options;
                c2.innerHTML = options;
                c1.disabled = false;
                c2.disabled = false;
                document.getElementById('comparisonResult').innerHTML = '';
            }

            function updateComparison() {
                const c1 = document.getElementById('college1').value;
                const c2 = document.getElementById('college2').value;
                const branchCode = document.getElementById('compareBranch').value;
                const res = document.getElementById('comparisonResult');

                if (!c1 || !c2 || !branchCode) {
                    res.innerHTML = '';
                    return;
                }

                const data1 = appState.cutoffData2024.find(d => d.con === c1 && d.brc === branchCode);
                const data2 = appState.cutoffData2024.find(d => d.con === c2 && d.brc === branchCode);

                const categories = ['OC', 'BC', 'BCM', 'MBC', 'SC', 'SCA', 'ST'];
                const getCourseInsight = (branchName) => {
                    if (!branchName) return null;
                    const searchName = branchName.toUpperCase();
                    return appState.courseInsights.find(c =>
                        c.name === searchName ||
                        searchName.includes(c.name) ||
                        c.name.includes(searchName)
                    );
                };

                const renderCourseInfo = (insight) => {
                    if (!insight) return `<p style="color:var(--text-muted); font-size:0.85rem; text-align:center; padding:1rem;">Additional course details not available.</p>`;
                    return `
                    <div style="padding:1rem; background:rgba(255,255,255,0.02); border-radius:10px; margin-top:1rem; border:1px solid var(--border);">
                        <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:0.75rem;">
                            <span style="font-size:0.75rem; color:var(--text-muted); font-weight:700; text-transform:uppercase; letter-spacing:0.05em;">Course Insight</span>
                            <span class="tag" style="font-size:0.65rem; background:rgba(37,99,235,0.1); color:var(--primary); border:none;">${insight['Market Demand']} Demand</span>
                        </div>
                        <div style="margin-bottom:0.75rem;">
                            <span style="font-size:0.7rem; color:var(--primary); font-weight:700; text-transform:uppercase;">Fundamental Concepts</span>
                            <div style="display:flex; flex-wrap:wrap; gap:0.4rem; margin-top:0.4rem;">
                                ${(insight['Fundamental Concepts'] || []).slice(0, 5).map(c => `<span style="font-size:0.7rem; background:rgba(255,255,255,0.05); padding:0.2rem 0.5rem; border-radius:4px; border:1px solid var(--border);">${c}</span>`).join('')}
                            </div>
                        </div>
                        <div style="display:grid; grid-template-columns:1fr 1fr; gap:0.75rem;">
                            <div>
                                <span style="font-size:0.7rem; color:var(--primary); font-weight:700; text-transform:uppercase;">Demand</span>
                                <p style="font-size:0.85rem; font-weight:600; line-height:1.2;">${insight['Market Demand'] || 'N/A'}</p>
                            </div>
                            <div>
                                <span style="font-size:0.7rem; color:var(--primary); font-weight:700; text-transform:uppercase;">Avg Salary</span>
                                <p style="font-size:0.85rem; font-weight:600;">${insight['Salary'] ? (typeof insight['Salary'] === 'string' ? insight['Salary'] : insight['Salary']['Entry']) : 'N/A'}</p>
                            </div>
                        </div>
                    </div>
                `;
                };

                const renderStats = (data, name) => {
                    const insight = getCourseInsight(data.brn);
                    return `
                <div style="background:var(--surface); padding:1.5rem; border-radius:12px; border:1px solid var(--border); display:flex; flex-direction:column;">
                    <h4 style="margin-bottom:0.25rem; font-size:1.1rem; color:var(--primary); line-height:1.4;">${name}</h4>
                    <p style="color:var(--text-muted); margin-bottom:1.5rem; font-size:0.9rem;">${data.brn} (${data.brc})</p>
                    
                    <div style="display:grid; grid-template-columns: 1fr 1fr; gap:0.75rem;">
                        ${categories.map(cat => `
                            <div style="display:flex; justify-content:space-between; padding:0.5rem; background:rgba(255,255,255,0.03); border-radius:6px;">
                                <span style="color:var(--text-muted); font-size:0.9rem;">${cat}</span>
                                <span style="font-weight:600; font-family:'Courier New'; color:var(--accent);">${data[cat] || '-'}</span>
                            </div>
                        `).join('')}
                    </div>
                    ${renderCourseInfo(insight)}
                </div>
            `};

                res.innerHTML = `
                <div style="display:grid; grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); gap:1.5rem; margin-top:2rem;">
                    ${renderStats(data1, c1)}
                    ${renderStats(data2, c2)}
                </div>
            `;
            }

            // --- Chat Bot Logic ---
            let chatState = {
                lastSubject: null // { type: 'course'|'college', name: string, data: any }
            };

            function toggleChat() {
                const win = document.getElementById('chatWindow');
                if (win.style.display === 'flex') {
                    win.style.display = 'none';
                    win.classList.remove('open');
                } else {
                    win.style.display = 'flex';
                    setTimeout(() => win.classList.add('open'), 10);
                    document.getElementById('chatInput').focus();
                }
            }

            function handleChatKey(e) {
                if (e.key === 'Enter') sendChatMessage();
            }

            function quickChat(msg) {
                document.getElementById('chatInput').value = msg;
                sendChatMessage();
            }

            function sendChatMessage() {
                const input = document.getElementById('chatInput');
                const msg = input.value.trim();
                if (!msg) return;

                addMessage(msg, 'user');
                input.value = '';

                // Show "Thinking" animation
                const indicator = document.getElementById('typingIndicator');
                indicator.style.display = 'block';
                const body = document.getElementById('chatBody');
                body.scrollTop = body.scrollHeight;

                // Simulate Bot Response with variable delay
                setTimeout(() => {
                    const response = getBotResponse(msg);
                    indicator.style.display = 'none';
                    addMessage(response, 'bot');
                }, 1000 + Math.random() * 1000); // 1-2 second delay
            }

            function addMessage(text, sender) {
                const body = document.getElementById('chatBody');
                const div = document.createElement('div');
                div.className = `message ${sender}`;
                div.innerHTML = text.replace(/\n/g, '<br>'); // Allow multiline

                // If it's the bot, we might want to insert it before the typing indicator
                const indicator = document.getElementById('typingIndicator');
                body.insertBefore(div, indicator);

                body.scrollTop = body.scrollHeight;
            }

            function getBotResponse(input) {
                const s = input.toLowerCase();

                // 1. Context Detection (Keywords/Intents)
                const isRanking = s.includes('rank') || s.includes('top') || s.includes('best');
                const isCourse = s.includes('course') || s.includes('branch') || s.includes('career') || s.includes('demand');
                const isCutoff = s.includes('cutoff') || s.includes('mark') || s.includes('score') || s.includes('get into') || s.includes('eligibl');
                const isFees = s.includes('fee') || s.includes('cost') || s.includes('price');
                const isFollowUp = s.includes('this') || s.includes('it') || s.includes('that') || s.includes('they') || s.includes('offer') || s.includes('which college');

                // 2. Intelligence: Ranking Queries
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

                // 3. Intelligence: Course Details
                const courseInsight = appState.courseInsights.find(c => s.includes(c.name.toLowerCase()) || c.name.toLowerCase().includes(s.replace('tell me about', '').trim()));
                if (courseInsight && (isCourse || s.length < 30)) {
                    chatState.lastSubject = { type: 'course', name: courseInsight.name, data: courseInsight };
                    return `**${courseInsight.name}** is a great choice!\n\n**Market Demand:** ${courseInsight['Market Demand']}\n**Salary (Entry):** ${courseInsight.Salary?.Entry || 'Variable'}\n\n**Quick Summary:** ${courseInsight['Course Description'].substring(0, 150)}...\n\nShould I check which colleges offer this course?`;
                }

                // 4. Follow-up: Colleges for a Course
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

                // 4. Intelligence: Cutoff Prediction (Score-based)
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

                // 6. College Specific Queries
                const specificCollege = appState.cutoffData2024.find(c => s.includes(c.con.toLowerCase()));
                if (specificCollege && !isRanking) {
                    chatState.lastSubject = { type: 'college', name: specificCollege.con, data: specificCollege };
                    return `**${specificCollege.con}** is highly sought after. For **${specificCollege.brn}**, the typical cutoffs are quite high. You can view the full history for this college in the 'Search Cutoffs' tab by searching for "${specificCollege.con}".`;
                }

                // 6. Greetings & Fallbacks
                if (s.includes('hello') || s.includes('hi')) return "Hello! I'm your TNEA AI Assistant. I have access to rankings for 400+ colleges and detailed insights for 50+ courses. Ask me anything!";
                if (isFees) return "TNEA fees are regulated. Counseling costs ₹500 (Gen) / ₹250 (SC/ST). Semester fees for Govt colleges are around ₹10k-15k, while Private/Self-Financing colleges range from ₹50k to ₹1.5L+. Need more details?";

                return "I'm not exactly sure about that, but I can help you with college rankings, course career paths, or predicting your college based on your cutoff score. Try asking: 'What is the demand for AI?' or 'Best colleges for CSE'";
            }

            // --- Event Listeners ---
            document.getElementById('searchCollegeInput').addEventListener('input', () => { appState.currentPage = 1; renderCutoffTable(); });
            document.getElementById('categoryFilter').addEventListener('change', renderCutoffTable);
            document.getElementById('branchFilter').addEventListener('change', renderCutoffTable);
            document.querySelectorAll('.year-btn').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    document.querySelectorAll('.year-btn').forEach(b => b.classList.remove('active'));
                    e.target.classList.add('active');
                    appState.year = e.target.dataset.year;
                    appState.currentPage = 1;
                    renderCutoffTable();
                });
            });

            document.getElementById('courseSearch').addEventListener('input', renderCourseInsights);
            document.getElementById('rankingSearch').addEventListener('input', renderRankings);

            // ===== College Predictor Logic =====
            let predictorState = {
                currentStep: 1,
                selectedBranches: []
            };

            function calcPredictorCutoff() {
                const m = parseFloat(document.getElementById('predMaths').value) || 0;
                const p = parseFloat(document.getElementById('predPhysics').value) || 0;
                const c = parseFloat(document.getElementById('predChemistry').value) || 0;
                const cutoff = m + (p / 2) + (c / 2);
                const display = document.getElementById('predCutoffScore');
                if (m === 0 && p === 0 && c === 0) {
                    display.textContent = '—';
                } else {
                    display.textContent = cutoff.toFixed(2);
                }
            }

            function predNextStep(step) {
                // Validation for step 1 -> 2
                if (step === 2 && predictorState.currentStep === 1) {
                    const m = parseFloat(document.getElementById('predMaths').value);
                    const p = parseFloat(document.getElementById('predPhysics').value);
                    const c = parseFloat(document.getElementById('predChemistry').value);
                    if (isNaN(m) || isNaN(p) || isNaN(c) || m < 0 || p < 0 || c < 0 || m > 100 || p > 100 || c > 100) {
                        alert('Please enter valid marks (0-100) for Maths, Physics, and Chemistry.');
                        return;
                    }
                }
                predictorState.currentStep = step;
                updatePredictorUI();
            }

            // ===== Course Predictor Logic =====
            function updatePredictorUI() {
                // Update step visibility
                const step = predictorState.currentStep;
                document.querySelectorAll('.predictor-step').forEach(el => el.classList.remove('active'));
                const curentStepEl = document.getElementById('predStep' + step);
                if (curentStepEl) curentStepEl.classList.add('active');

                // Update progress indicators
                for (let i = 1; i <= 4; i++) {
                    const el = document.getElementById('pStep' + i);
                    if (el) {
                        el.classList.remove('active', 'completed');
                        if (i < step) el.classList.add('completed');
                        else if (i === step) el.classList.add('active');
                    }
                }

                // Update progress bar fill
                const pct = ((step - 1) / 3) * 100;
                const fill = document.getElementById('progressFill');
                if (fill) fill.style.width = pct + '%';

                // Populate branch discovery when entering step 3
                if (step === 3) {
                    const searchInput = document.getElementById('branchSearch');
                    if (searchInput) searchInput.value = '';
                    populateBranchDiscovery();
                }
            }

            function populateBranchDiscovery() {
                const container = document.getElementById('branchDiscoveryGrid');
                if (!container) return;

                const m = parseFloat(document.getElementById('predMaths').value) || 0;
                const p = parseFloat(document.getElementById('predPhysics').value) || 0;
                const c = parseFloat(document.getElementById('predChemistry').value) || 0;
                const cutoff = m + (p / 2) + (c / 2);
                const category = document.getElementById('predCategory').value;

                const branches = new Map();
                const data = appState.cutoffData2024;

                data.forEach(item => {
                    const branchCode = item.brc;
                    const branchName = item.brn;
                    const itemCutoff = parseFloat(item[category]);

                    if (!branches.has(branchCode)) {
                        branches.set(branchCode, {
                            code: branchCode,
                            name: branchName,
                            eligibleColleges: 0,
                            bestCollege: null,
                            bestCutoff: 0
                        });
                    }

                    if (!isNaN(itemCutoff) && itemCutoff <= cutoff) {
                        const b = branches.get(branchCode);
                        b.eligibleColleges++;
                        if (itemCutoff > b.bestCutoff) {
                            b.bestCutoff = itemCutoff;
                            b.bestCollege = item.con;
                        }
                    }
                });

                const branchArray = Array.from(branches.values())
                    .filter(b => b.eligibleColleges > 0)
                    .sort((a, b) => b.eligibleColleges - a.eligibleColleges);

                container.innerHTML = branchArray.map(b => {
                    const insight = appState.courseInsights.find(ci => ci.name === b.name || b.name.includes(ci.name));
                    const demand = insight ? insight['Market Demand'] : 'High';
                    const salary = insight ? (typeof insight['Salary'] === 'string' ? insight['Salary'] : insight['Salary']['Entry']) : 'N/A';
                    const isSelected = predictorState.selectedBranches.includes(b.code);
                    const isFav = isBranchFavorite(b.name); // Check if branch is favorite

                    return `
                    <div class="course-card ${isSelected ? 'selected' : ''}" 
                         style="cursor:pointer; border-color: ${isSelected ? 'var(--primary)' : 'var(--border)'}; border-width: ${isSelected ? '2px' : '1px'}" 
                         onclick="toggleBranchSelection(this, '${b.code}')">
                        <div style="display:flex; justify-content:space-between; margin-bottom:0.5rem;">
                            <span class="branch-code">${b.code}</span>
                            <div style="display:flex; gap:0.5rem; align-items:center;">
                                <button class="fav-btn ${isFav ? 'saved' : ''}" 
                                        onclick="event.stopPropagation(); toggleBranchFavorite('${b.name}'); this.classList.toggle('saved'); this.textContent = this.classList.contains('saved') ? '❤️' : '🤍';" 
                                        title="${isFav ? 'Remove from favorites' : 'Save to favorites'}"
                                        style="font-size:1.2rem; background:none; border:none; padding:0; cursor:pointer;">
                                    ${isFav ? '❤️' : '🤍'}
                                </button>
                                <button class="btn-icon" onclick="event.stopPropagation(); showCourseDetails('${b.name}')" title="Course Info">
                                    ℹ️ Info
                                </button>
                                <span class="tag" style="background:rgba(16, 185, 129, 0.1); color:var(--success); border:none;">
                                    ${b.eligibleColleges} Col
                                </span>
                            </div>
                        </div>
                        <h3 style="font-size:1rem; margin-bottom:1rem;">${b.name}</h3>
                        
                        <div style="font-size:0.8rem; color:var(--text-muted); margin-bottom:1rem;">
                            <div style="margin-bottom:0.25rem;">📊 Demand: <strong>${demand}</strong></div>
                            <div>💰 Avg Salary: <strong>${salary}</strong></div>
                        </div>

                        <div style="margin-top:auto; padding-top:0.75rem; border-top:1px solid var(--border); font-size:0.8rem;">
                            <div style="color:var(--primary); font-weight:600;">Best Avail:</div>
                            <div style="white-space:nowrap; overflow:hidden; text-overflow:ellipsis;" title="${b.bestCollege}">${b.bestCollege}</div>
                        </div>
                    </div>
                `;
                }).join('');
            }

            function toggleBranchSelection(el, code) {
                el.classList.toggle('selected');
                if (predictorState.selectedBranches.includes(code)) {
                    predictorState.selectedBranches = predictorState.selectedBranches.filter(b => b !== code);
                    el.style.borderColor = 'var(--border)';
                    el.style.borderWidth = '1px';
                } else {
                    predictorState.selectedBranches.push(code);
                    el.style.borderColor = 'var(--primary)';
                    el.style.borderWidth = '2px';
                }
            }

            function filterBranchChips() {
                const term = document.getElementById('branchSearch').value.toLowerCase();
                const cards = document.querySelectorAll('#branchDiscoveryGrid .course-card');
                cards.forEach(card => {
                    const text = card.textContent.toLowerCase();
                    if (text.includes(term)) {
                        card.style.display = 'flex';
                    } else {
                        card.style.display = 'none';
                    }
                });
            }


            // ===== Course Details Modal Logic =====
            function showCourseDetails(branchName) {
                const modal = document.getElementById('courseDetailModal');
                const content = document.getElementById('courseModalContent');
                const favBtn = document.getElementById('favBranchBtn');

                // Find insight for this branch
                const insight = appState.courseInsights.find(ci => ci.name === branchName || branchName.includes(ci.name));

                if (!insight) {
                    content.innerHTML = `<p>No detailed information available for ${branchName}.</p>`;
                    favBtn.style.display = 'none';
                } else {
                    favBtn.style.display = 'block';
                    const features = insight['Key Features'] || [];
                    const featuresHtml = features.map(f => `<li class="feature-item">${f}</li>`).join('');

                    // Update favorite button state
                    const isFav = isBranchFavorite(insight.name);
                    favBtn.innerHTML = isFav ? '❤️ Branch Saved' : '🤍 Save Branch to Favorites';
                    favBtn.onclick = () => toggleBranchFavorite(insight.name);

                    content.innerHTML = `
                    <div class="modal-info-header">
                        <div class="modal-info-title">${insight.name}</div>
                        <div class="tag" style="background:rgba(37,99,235,0.1); color:var(--primary); border:none;">${insight['Market Demand']} Demand</div>
                    </div>
                    
                    <div class="info-section">
                        <div class="info-label">Description</div>
                        <div class="info-content">${insight['Course Description']}</div>
                    </div>
                    
                    <div class="info-section">
                        <div class="info-label">Key Features & Specialties</div>
                        <ul class="feature-list">${featuresHtml}</ul>
                    </div>
                    
                    <div class="info-section">
                    // Find Related Courses (Simple logic: courses with same first word or "Engineering")
                    const relatedCourses = appState.courseInsights
                        .filter(ci => ci.name !== insight.name && (ci.name.includes(insight.name.split(' ')[0]) || (insight.name.includes('Eng') && ci.name.includes('Eng'))))
                        .slice(0, 3); // Take top 3

                    const relatedHtml = relatedCourses.length > 0 
                        ? `< div class="info-section" >
                            <div class="info-label">Related Courses</div>
                            <div class="related-courses-list" style="display:flex; gap:0.5rem; flex-wrap:wrap;">
                                ${relatedCourses.map(rc => `<span class="tag" style="cursor:pointer; background:var(--surface); border:1px solid var(--border);" onclick="showCourseDetails('${rc.name}')">${rc.name}</span>`).join('')}
                            </div>
                           </div > ` 
                        : '';

                    const roles = insight['Career Roles'] || insight['Job Positions'] || ['Various engineering roles in industry.'];
                    const rolesText = Array.isArray(roles) ? roles.join(', ') : roles;

                    content.innerHTML = `
                        < div class="modal-info-header" >
                        <div class="modal-info-title">${insight.name}</div>
                        <div class="tag" style="background:rgba(37,99,235,0.1); color:var(--primary); border:none;">${insight['Market Demand']} Demand</div>
                    </div >
                    
                    <div class="info-section">
                        <div class="info-label">Description</div>
                        <div class="info-content">${insight['Course Description']}</div>
                    </div>
                    
                    <div class="info-section">
                        <div class="info-label">Key Features & Specialties</div>
                        <ul class="feature-list">${featuresHtml}</ul>
                    </div>
                    
                    <div class="info-section">
                        <div class="info-label">Career Opportunities</div>
                        <div class="info-content">${rolesText}</div>
                    </div>
                    
                    <div class="info-section" style="background:rgba(16,185,129,0.05); padding:1rem; border-radius:12px; border:1px solid rgba(16,185,129,0.1);">
                        <div class="info-label" style="color:var(--success)">Salary Range</div>
                        <div class="info-content" style="font-weight:600; font-size:1.1rem; color:var(--success)">
                            ${typeof insight['Salary'] === 'string' ? insight['Salary'] : (insight['Salary'].Entry + ' to ' + (insight['Salary'].Experienced || insight['Salary'].Senior))}
                        </div>
                    </div>

                    ${ relatedHtml }
                    `;
                }

                modal.classList.remove('hidden');
            }

            function closeCourseModal() {
                document.getElementById('courseDetailModal').classList.add('hidden');
            }

            function runPredictor() {
                const maths = parseFloat(document.getElementById('predMaths').value) || 0;
                const physics = parseFloat(document.getElementById('predPhysics').value) || 0;
                const chemistry = parseFloat(document.getElementById('predChemistry').value) || 0;
                const cutoff = maths + (physics / 2) + (chemistry / 2);
                const category = document.getElementById('predCategory').value;
                const studentName = document.getElementById('predName').value || 'Student';
                const selectedBranches = predictorState.selectedBranches;
                const maxResults = parseInt(document.getElementById('predResultCount').value) || 50;

                // Filter matching colleges
                let matches = appState.cutoffData2024.filter(item => {
                    const collegeCutoff = parseFloat(item[category]);
                    if (isNaN(collegeCutoff) || collegeCutoff <= 0) return false;

                    // Student's cutoff must be >= the college cutoff for that category
                    if (cutoff < collegeCutoff) return false;

                    // Filter by preferred branches if selected
                    if (selectedBranches.length > 0 && !selectedBranches.includes(item.brc)) return false;

                    return true;
                });

                // Add NIRF ranking info to matches
                matches = matches.map(item => {
                    const rankInfo = appState.rankings.find(r => {
                        const rName = r.college.toLowerCase().trim();
                        const iName = item.con.toLowerCase().trim();
                        return rName.includes(iName.substring(0, 30)) || iName.includes(rName.substring(0, 30));
                    });
                    return {
                        ...item,
                        nirfRank: rankInfo ? rankInfo.ranking : null,
                        nirfRankNum: rankInfo ? (typeof rankInfo.ranking === 'number' ? rankInfo.ranking : parseInt(rankInfo.ranking) || 999) : 999,
                        margin: (cutoff - parseFloat(item[category])).toFixed(2)
                    };
                });

                // Sort: NIRF rank first, then by cutoff (higher cutoff = more competitive = better)
                matches.sort((a, b) => {
                    if (a.nirfRankNum !== b.nirfRankNum) return a.nirfRankNum - b.nirfRankNum;
                    return parseFloat(b[category]) - parseFloat(a[category]);
                });

                // Categorize into tiers
                const dreamColleges = []; // margin < 5 (competitive)
                const reachColleges = []; // margin 5-20
                const safeColleges = []; // margin > 20

                matches.forEach(m => {
                    const margin = parseFloat(m.margin);
                    if (margin < 5) dreamColleges.push(m);
                    else if (margin <= 20) reachColleges.push(m);
                    else safeColleges.push(m);
                });

                // Get unique branches and colleges count
                const uniqueColleges = new Set(matches.map(m => m.con)).size;
                const uniqueBranches = new Set(matches.map(m => m.brc)).size;

                // Render results
                const resultsDiv = document.getElementById('predictorResults');

                if (matches.length === 0) {
                    resultsDiv.innerHTML = `
                        < div class="no-results-msg" >
                <div class="emoji">😔</div>
                <h3>No matching colleges found</h3>
                <p>Your cutoff mark (${cutoff.toFixed(2)}) for ${category} category didn't match any colleges in our 2024 data.</p>
                <p>Try selecting different branches or check if your marks are entered correctly.</p>
            </div >
                        `;
                    predNextStep(4);
                    return;
                }

                const renderSuggestionCard = (item) => {
                    const favKey = `${ item.con }|| ${ item.brc } `;
                    const isSaved = isFavorite(favKey);
                    const safeItem = JSON.stringify({
                        con: item.con,
                        brc: item.brc,
                        brn: item.brn,
                        OC: item.OC || '',
                        BC: item.BC || '',
                        BCM: item.BCM || '',
                        MBC: item.MBC || '',
                        SC: item.SC || '',
                        SCA: item.SCA || '',
                        ST: item.ST || ''
                    }).replace(/"/g, '&quot;');
                    return `
                        < div class="suggestion-card" >
            <div class="suggestion-info">
                <div class="college-name">${item.con}</div>
                <div class="branch-name">${item.brc} - ${item.brn}</div>
            </div>
            <div class="suggestion-meta">
                <div class="meta-badge cutoff-badge">${item[category]}</div>
                ${item.nirfRank ? `<div class="meta-badge rank-badge-tag">#${item.nirfRank}</div>` : ''}
                <button class="fav-btn ${isSaved ? 'saved' : ''}" onclick="toggleFavoriteFromPredictor('${favKey.replace(/'/g, "\\'")}', '${safeItem}', this)" title="${isSaved ? 'Remove from favorites' : 'Save to favorites'}">${isSaved ? '❤️' : '🤍'}</button>
            </div >
        </div >
                        `};

                const renderTier = (title, emoji, tierClass, items, limit) => {
                    if (items.length === 0) return '';
                    const shown = items.slice(0, limit);
                    return `
                        < div class="results-section-title" > ${ emoji } ${ title } <span style="font-size:0.8rem;color:var(--text-muted);font-weight:400">(${items.length} options)</span></div >
                            <div class="tier-label ${tierClass}">${tierClass === 'dream' ? 'Competitive - margin < 5' : tierClass === 'reach' ? 'Good Chance - margin 5-20' : 'Safe - margin > 20'}</div>
            ${ shown.map(renderSuggestionCard).join('') }
            ${ items.length > limit ? `<p style="text-align:center;color:var(--text-muted);font-size:0.85rem;margin:0.5rem 0;">... and ${items.length - limit} more</p>` : '' }
                    `;
                };

                const summaryHtml = `
                        < div class="results-summary" >
            <div class="result-stat">
                <div class="result-num">${matches.length}</div>
                <div class="result-label">Total Options</div>
            </div>
            <div class="result-stat">
                <div class="result-num">${uniqueColleges}</div>
                <div class="result-label">Colleges</div>
            </div>
            <div class="result-stat">
                <div class="result-num">${uniqueBranches}</div>
                <div class="result-label">Branches</div>
            </div>
        </div >
                        `;

                resultsDiv.innerHTML = summaryHtml +
                    renderTier('Dream Choices', '✨', 'dream', dreamColleges, 15) +
                    renderTier('Reach Choices', '🎯', 'reach', reachColleges, 15) +
                    renderTier('Safe Options', '✅', 'safe', safeColleges, 15);

                predNextStep(4);
            }

            function printResults() {
                window.print();
            }

            // ===== Login / Auth System =====
            let authState = {
                isLoggedIn: false,
                user: null,
                isRegisterMode: false
            };

            function initAuth() {
                const savedUser = localStorage.getItem('tnea_current_user');
                if (savedUser) {
                    authState.isLoggedIn = true;
                    authState.user = JSON.parse(savedUser);
                }
                renderUserArea();
                updateFavBadge();
            }

            function renderUserArea() {
                const area = document.getElementById('userArea');
                if (authState.isLoggedIn && authState.user) {
                    const initials = authState.user.name ? authState.user.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) : 'U';
                    area.innerHTML = `
                        < div class="user-area" >
                        <div class="user-avatar">${initials}</div>
                        <span class="user-name">${authState.user.name || authState.user.username}</span>
                        <button class="logout-btn" onclick="handleLogout()">Logout</button>
                    </div >
                        `;

                    // Update Hero Greeting
                    const heroG = document.getElementById('heroGreetingContainer');
                    if (heroG) {
                        heroG.innerHTML = `< div class="hero-greeting" > Welcome, ${ authState.user.name || authState.user.username } 👋</div > `;
                    }
                } else {
                    area.innerHTML = `< button class="login-nav-btn" onclick = "showLoginModal()" >🔐 Login</button > `;
                    const heroG = document.getElementById('heroGreetingContainer');
                    if (heroG) heroG.innerHTML = '';
                }
            }

            function showLoginModal() {
                // Ensure we always start in Login mode
                if (authState.isRegisterMode) toggleLoginMode();

                document.getElementById('loginModal').classList.remove('hidden');
                document.getElementById('loginUsername').focus();
                document.getElementById('loginError').style.display = 'none';
            }

            function closeLoginModal() {
                document.getElementById('loginModal').classList.add('hidden');
            }

            function toggleLoginMode() {
                authState.isRegisterMode = !authState.isRegisterMode;
                const title = document.getElementById('loginModalTitle');
                const subtitle = document.getElementById('loginModalSubtitle');
                const btn = document.getElementById('loginSubmitBtn');
                const toggleText = document.getElementById('toggleText');
                const toggleLink = document.getElementById('toggleLink');
                const nameGroup = document.getElementById('loginNameGroup');
                const forgotPwd = document.getElementById('forgotPwdWrapper');
                const error = document.getElementById('loginError');
                error.style.display = 'none';

                if (authState.isRegisterMode) {
                    title.textContent = 'Create Account';
                    subtitle.textContent = 'Register to save your favorite colleges';
                    btn.textContent = 'Register';
                    toggleText.textContent = 'Already have an account? ';
                    toggleLink.textContent = 'Login';
                    nameGroup.style.display = 'block';
                    forgotPwd.style.display = 'none';
                } else {
                    title.textContent = 'Welcome Back';
                    subtitle.textContent = 'Login to save your favorite colleges';
                    btn.textContent = 'Login';
                    toggleText.textContent = "Don't have an account? ";
                    toggleLink.textContent = 'Register';
                    nameGroup.style.display = 'none';
                    forgotPwd.style.display = 'flex';
                }
            }

            function handleLogin() {
                const username = document.getElementById('loginUsername').value.trim();
                const password = document.getElementById('loginPassword').value.trim();
                const error = document.getElementById('loginError');

                if (!username || !password) {
                    error.textContent = 'Please enter both username and password.';
                    error.style.display = 'block';
                    return;
                }

                if (username.length < 3) {
                    error.textContent = 'Username must be at least 3 characters.';
                    error.style.display = 'block';
                    return;
                }

                // Get stored users
                const users = JSON.parse(localStorage.getItem('tnea_users') || '{}');

                if (authState.isRegisterMode) {
                    // REGISTER
                    if (users[username]) {
                        error.innerHTML = `Username already exists. < a href = "#" onclick = "toggleLoginMode()" style = "color:inherit; text-decoration:underline;" > Click here to Login instead.</a > `;
                        error.style.display = 'block';
                        return;
                    }
                    const fullName = document.getElementById('loginFullName').value.trim() || username;
                    users[username] = { password: password, name: fullName, favorites: [], favoriteBranches: [] };
                    localStorage.setItem('tnea_users', JSON.stringify(users));

                    authState.isLoggedIn = true;
                    authState.user = { username, name: fullName };
                    localStorage.setItem('tnea_current_user', JSON.stringify(authState.user));
                } else {
                    // LOGIN
                    if (!users[username]) {
                        error.innerHTML = `User not found. < a href = "#" onclick = "toggleLoginMode()" style = "color:inherit; text-decoration:underline;" > Click here to Create an Account.</a > `;
                        error.style.display = 'block';
                        return;
                    }
                    if (users[username].password !== password) {
                        error.textContent = 'Incorrect password. Please try again.';
                        error.style.display = 'block';
                        return;
                    }
                    authState.isLoggedIn = true;
                    authState.user = { username, name: users[username].name };
                    localStorage.setItem('tnea_current_user', JSON.stringify(authState.user));
                }

                closeLoginModal();
                renderUserArea();
                updateFavBadge();
                renderCutoffTable();
                // Clear form
                document.getElementById('loginUsername').value = '';
                document.getElementById('loginPassword').value = '';
                document.getElementById('loginFullName').value = '';
            }

            function handleLogout() {
                authState.isLoggedIn = false;
                authState.user = null;
                localStorage.removeItem('tnea_current_user');
                renderUserArea();
                updateFavBadge();
                renderCutoffTable();
            }

            function handleGoogleLogin() {
                // Simulate Google Sign-In
                const googleUsers = [
                    { username: 'google_user', name: 'Google User' },
                    { username: 'sweety_google', name: 'Sweety Jerome' }
                ];
                const user = googleUsers[1]; // Use a mock user

                authState.isLoggedIn = true;
                authState.user = user;
                localStorage.setItem('tnea_current_user', JSON.stringify(user));

                // Ensure user exists in storage
                const users = JSON.parse(localStorage.getItem('tnea_users') || '{}');
                if (!users[user.username]) {
                    users[user.username] = { password: 'google_oauth_protected', name: user.name, favorites: [], favoriteBranches: [] };
                    localStorage.setItem('tnea_users', JSON.stringify(users));
                }

                closeLoginModal();
                renderUserArea();
                updateFavBadge();
                renderCutoffTable();

                alert(`Successfully signed in with Google as ${ user.name } !`);
            }

            function handleForgotPassword() {
                const username = document.getElementById('loginUsername').value.trim();
                const error = document.getElementById('loginError');

                if (!username) {
                    error.textContent = 'Please enter your username first to reset password.';
                    error.style.display = 'block';
                    return;
                }

                const users = JSON.parse(localStorage.getItem('tnea_users') || '{}');
                if (!users[username]) {
                    error.textContent = 'Username not found.';
                    error.style.display = 'block';
                    return;
                }

                // In a real app, you'd send an email. Here we just show a "reset" alert
                // or tell them their password for this local-only demo.
                alert(`[Local Demo Only] Password for ${ username } is: ${ users[username].password } \n\nIn a live production app, a reset link would be sent to your email.`);
            }

            // ===== Favorites System =====
            function getFavorites() {
                if (!authState.isLoggedIn || !authState.user) return [];
                const users = JSON.parse(localStorage.getItem('tnea_users') || '{}');
                const u = users[authState.user.username];
                return u ? (u.favorites || []) : [];
            }

            function saveFavorites(favs) {
                if (!authState.isLoggedIn || !authState.user) return;
                const users = JSON.parse(localStorage.getItem('tnea_users') || '{}');
                if (users[authState.user.username]) {
                    users[authState.user.username].favorites = favs;
                    localStorage.setItem('tnea_users', JSON.stringify(users));
                }
            }

            function isFavorite(key) {
                const favs = getFavorites();
                return favs.some(f => f.key === key);
            }

            function toggleFavorite(key, btnEl, itemData) {
                if (!authState.isLoggedIn) {
                    showLoginModal();
                    return;
                }
                let favs = getFavorites();
                const exists = favs.findIndex(f => f.key === key);
                if (exists >= 0) {
                    favs.splice(exists, 1);
                    if (btnEl) {
                        btnEl.classList.remove('saved');
                        btnEl.textContent = '🤍';
                        btnEl.title = 'Save to favorites';
                    }
                } else {
                    favs.push({
                        key: key,
                        con: itemData.con,
                        brc: itemData.brc,
                        brn: itemData.brn,
                        OC: itemData.OC,
                        BC: itemData.BC,
                        BCM: itemData.BCM,
                        MBC: itemData.MBC,
                        SC: itemData.SC,
                        SCA: itemData.SCA,
                        ST: itemData.ST,
                        savedAt: new Date().toISOString()
                    });
                    if (btnEl) {
                        btnEl.classList.add('saved');
                        btnEl.textContent = '❤️';
                        btnEl.title = 'Remove from favorites';
                    }
                }
                saveFavorites(favs);
                updateFavBadge();
            }

            function toggleFavoriteFromPredictor(key, itemJSON, btnEl) {
                const itemData = JSON.parse(itemJSON);
                toggleFavorite(key, btnEl, itemData);
            }

            function removeFavorite(key) {
                let favs = getFavorites();
                favs = favs.filter(f => f.key !== key);
                saveFavorites(favs);
                updateFavBadge();
                renderFavorites();
                renderCutoffTable();
            }

            // Branch Favorites logic
            function getFavoriteBranches() {
                if (!authState.isLoggedIn || !authState.user) return [];
                const users = JSON.parse(localStorage.getItem('tnea_users') || '{}');
                const u = users[authState.user.username];
                return u ? (u.favoriteBranches || []) : [];
            }

            function isBranchFavorite(name) {
                return getFavoriteBranches().includes(name);
            }

            function toggleBranchFavorite(name) {
                if (!authState.isLoggedIn) {
                    closeCourseModal();
                    showLoginModal();
                    return;
                }
                const users = JSON.parse(localStorage.getItem('tnea_users') || '{}');
                const u = users[authState.user.username];
                if (!u) return;

                if (!u.favoriteBranches) u.favoriteBranches = [];
                const idx = u.favoriteBranches.indexOf(name);
                if (idx >= 0) {
                    u.favoriteBranches.splice(idx, 1);
                } else {
                    u.favoriteBranches.push(name);
                }
                localStorage.setItem('tnea_users', JSON.stringify(users));

                // Refresh UI
                const favBtn = document.getElementById('favBranchBtn');
                if (favBtn) {
                    const isFav = isBranchFavorite(name);
                    favBtn.innerHTML = isFav ? '❤️ Branch Saved' : '🤍 Save Branch to Favorites';
                }
                updateFavBadge();
                if (appState.currentPageTab === 'favorites') renderFavorites();
            }

            function updateFavBadge() {
                const badge = document.getElementById('favCountBadge');
                const favs = getFavorites();
                const branchFavs = getFavoriteBranches();
                const total = favs.length + branchFavs.length;
                if (total > 0) {
                    badge.textContent = total;
                    badge.style.display = 'inline-block';
                } else {
                    badge.style.display = 'none';
                }
            }

            function renderFavorites() {
                const container = document.getElementById('favoritesList');

                if (!authState.isLoggedIn) {
                    container.innerHTML = `
                        < div class="fav-empty" >
                        <div class="fav-empty-icon">🔐</div>
                        <h3>Login Required</h3>
                        <p style="margin-bottom:1rem;">Please login to view and save your favorite colleges.</p>
                        <button class="btn-primary" onclick="showLoginModal()" style="display:inline-block;">Login / Register</button>
                    </div >
                        `;
                    return;
                }

                const favs = getFavorites();
                const branchFavs = getFavoriteBranches();

                if (favs.length === 0 && branchFavs.length === 0) {
                    container.innerHTML = `
                        < div class="fav-empty" >
                        <div class="fav-empty-icon">💔</div>
                        <h3>No favorites yet</h3>
                        <p>Go to Search Cutoffs or Course Predictor and click the ❤️ button to save colleges or courses here.</p>
                    </div >
                        `;
                    return;
                }

                let html = '';
                if (branchFavs.length > 0) {
                    html += `
                        < h3 style = "margin:2rem 0 1rem; color:var(--primary);" >⭐️ Favorite Courses</h3 >
                            <div style="display:grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap:1rem; margin-bottom:2rem;">
                                ${branchFavs.map(name => {
                                    const insight = appState.courseInsights.find(ci => ci.name === name);
                                    return `
                            <div class="fav-card" style="border-left:4px solid var(--accent);">
                                <div class="fav-info">
                                    <div class="fav-college" style="font-size:1.1rem;">${name}</div>
                                    <div class="fav-branch">${insight ? insight['Market Demand'] : 'High'} Demand Course</div>
                                </div>
                                <button class="remove-fav-btn" onclick="toggleBranchFavorite('${name}')">🗑️ Remove</button>
                            </div>
                            `;
                                }).join('')}
                            </div>
                    `;
                }

                if (favs.length > 0) {
                    html += `
                        < h3 style = "margin:2rem 0 1rem; color:var(--primary);" >📍 Favorite Colleges</h3 >
                            <p style="color:var(--text-muted); margin-bottom:1rem;">You have <strong style="color:var(--primary)">${favs.length}</strong> saved college(s)</p>
                    ${
                        favs.map(f => `
                        <div class="fav-card">
                            <div class="fav-info">
                                <div class="fav-college">${f.con}</div>
                                <div class="fav-branch">${f.brc} - ${f.brn}</div>
                                <div class="fav-cutoffs">
                                    ${f.OC ? `<span class="fav-cutoff-tag">OC: ${f.OC}</span>` : ''}
                                    ${f.BC ? `<span class="fav-cutoff-tag">BC: ${f.BC}</span>` : ''}
                                    ${f.BCM ? `<span class="fav-cutoff-tag">BCM: ${f.BCM}</span>` : ''}
                                    ${f.MBC ? `<span class="fav-cutoff-tag">MBC: ${f.MBC}</span>` : ''}
                                    ${f.SC ? `<span class="fav-cutoff-tag">SC: ${f.SC}</span>` : ''}
                                </div>
                            </div>
                            <button class="remove-fav-btn" onclick="removeFavorite('${f.key.replace(/'/g, "\\'")}')">🗑️ Remove</button>
                        </div>
                    `).join('')
                    }
                    `;
                }
                container.innerHTML = html;
            }

            // Override switchTab to also render favorites
            const originalSwitchTab = switchTab;
            switchTab = function (tabId) {
                originalSwitchTab(tabId);
                if (tabId === 'favorites') {
                    renderFavorites();
                }
                if (tabId === 'assessment' && currentAssessment.history.length === 0) {
                    startAssessment();
                }
            };

            function initApp() {
                initAuth();
                loadData();
                updateFavBadge();
            }

            window.addEventListener('load', initApp);

            // Responsive Navbar Scroll Effect
            window.addEventListener('scroll', () => {
                const nav = document.querySelector('.navbar');
                if (window.scrollY > 50) {
                    nav.style.background = 'rgba(255, 255, 255, 0.95)';
                    nav.style.boxShadow = '0 5px 20px rgba(0,0,0,0.05)';
                } else {
                    nav.style.background = 'rgba(255, 255, 255, 0.9)';
                    nav.style.boxShadow = 'none';
                }
            });

            // ===== Assessment System =====
            const branchMapping = {
                cs: {
                    name: "Computer Science (Coding & Apps)",
                    tags: ["Software", "Apps", "Websites"],
                    desc: "It's all about telling computers what to do. You'll learn to build apps, games, and websites.",
                    future: "Every company needs software now. You will be the one building the tools everyone uses.",
                    career: "App Developer, Web Creator, Software Engineer, Data Analyst.",
                    suitability: "Great if you like solving puzzles and logic games.",
                    pros: ["Good starting salary", "Can work from anywhere", "Always plenty of jobs"],
                    cons: ["Sitting for long hours", "Need to keep learning new things", "Fast-paced work"]
                },
                it: {
                    name: "Information Technology (Systems & Web)",
                    tags: ["Web", "Security", "Data"],
                    desc: "Focuses on making sure computer systems and networks work smoothly for businesses.",
                    future: "The world runs on the internet. You'll keep the digital world connected and safe.",
                    career: "Network Manager, IT Support, Web Architect, Security Specialist.",
                    suitability: "Perfect if you like organizing things and fixing tech problems.",
                    pros: ["Jobs in every type of company", "Practical skills", "Steady career"],
                    cons: ["Can be repetitive", "Sometimes work odd hours", "Lots of screen time"]
                },
                ai: {
                    name: "AI & Data Science (Smart Machines)",
                    tags: ["ChatGPT", "Robots", "Data"],
                    desc: "Teach computers to think! Learn how things like ChatGPT, face ID, and recommendations work.",
                    future: "AI is the new electricity. You'll helping build the smart future.",
                    career: "AI Developer, Data Scientist, Machine Learning Engineer.",
                    suitability: "If you are curious about how 'Siri' or 'Google' actually knows the answers.",
                    pros: ["Very high demand", "Exciting new field", "High pay potential"],
                    cons: ["Requires good math skills", "Complex to learn initially", "Always changing"]
                },
                ec: {
                    name: "Electronics & Communication (Chips & 5G)",
                    tags: ["Chips", "Signals", "5G"],
                    desc: "Understand what's inside your phone and how Wi-Fi travels through the air.",
                    future: "From faster internet (6G) to smarter gadgets, you'll build the hardware of the future.",
                    career: "Chip Designer, IoT Engineer, Network Engineer, Telecom Expert.",
                    suitability: "If you wonder how gadgets work and like combining hardware with software.",
                    pros: ["Work with real devices", "Core engineering job", "Good for R&D"],
                    cons: ["Harder subjects", "Need to be very precise", "Slower initial growth than IT"]
                },
                ee: {
                    name: "Electrical & Electronics (Power & EVs)",
                    tags: ["Electric Cars", "Solar", "Power"],
                    desc: "Power the world! Learn about electricity, huge motors, and Electric Vehicles.",
                    future: "The world is going Electric. You'll build the chargers, batteries, and grids of tomorrow.",
                    career: "EV Engineer, Power Grid Manager, Solar Energy Expert.",
                    suitability: "If you want to work on big energy systems or green technology.",
                    pros: ["Green & Sustainable career", "Real physical results", "Many Government jobs"],
                    cons: ["Working with high voltage", "Field work (outdoors)", "Physically active"]
                },
                mech: {
                    name: "Mechanical Engineering (Machines & Robots)",
                    tags: ["Cars", "Robots", "Engines"],
                    desc: "Design and build anything that moves—from racing cars to giant robots.",
                    future: "Robots are taking over factories. You'll design the machines of the future.",
                    career: "Car Designer, Robotics Engineer, Aerospace Specialist.",
                    suitability: "If you love taking things apart to see how they work.",
                    pros: ["Very versatile degree", "Basis for robotics/EVs", "High job satisfaction"],
                    cons: ["Factory environment", "Heavy subjects", "Lower starting pay"]
                },
                civil: {
                    name: "Civil Engineering (Buildings & Cities)",
                    tags: ["Skyscrapers", "Bridges", "Cities"],
                    desc: "Build the world around us. Design skyscrapers, bridges, and smart cities.",
                    future: "We need smarter, greener cities. You'll design where people live and work.",
                    career: "Structural Designer, Site Manager, Urban Planner.",
                    suitability: "If you want to see your drawings turn into real, standing structures.",
                    pros: ["Leave a physical legacy", "Good for business", "Outdoor work"],
                    cons: ["Long project times", "Lots of rules/safety", "Weather-dependent"]
                },
                cyber: {
                    name: "Cyber Security (Digital Police)",
                    tags: ["Hackers", "Security", "Privacy"],
                    desc: "Be a digital detective. Protect people and banks from hackers and thieves.",
                    future: "As we go digital, safety is #1. You'll be the protector of the internet.",
                    career: "Ethical Hacker, Security Analyst, Privacy Officer.",
                    suitability: "If you are naturally suspicious and love finding loopholes.",
                    pros: ["Huge demand", "Exciting 'Detective' work", "High respect"],
                    cons: ["High stress", "Constant battle", "Always on alert"]
                },
                agri: {
                    name: "Agricultural Engineering (Smart Farming)",
                    tags: ["Farming", "Drones", "Water"],
                    desc: "Use technology to grow better food! Design drones and smart watering systems for farms.",
                    future: "We need more food for the world. You'll use tech to make farming easier and greener.",
                    career: "Smart Farm Manager, Agri-Tech Designer, Food Process Engineer.",
                    suitability: "If you love nature and want to use tech to help farmers and the planet.",
                    pros: ["High societal impact", "Combining nature with tech", "Unique career niche"],
                    cons: ["Lots of rural/village travel", "Seasonal work cycles", "Niche industry"]
                },
                robot: {
                    name: "Robotics & Automation (Future Workers)",
                    tags: ["Robots", "Sensors", "AI"],
                    desc: "Build machines that can move and think on their own! From factory arms to surgical robots.",
                    future: "Robots will do all the hard work. You'll be the one commanding them.",
                    career: "Robotics Designer, Automation Analyst, Control System Architect.",
                    suitability: "If you love sci-fi movies and want to make 'real' robots, pick this.",
                    pros: ["Cutting-edge innovation", "Extremely fun to build", "Fast growing field"],
                    cons: ["Requires deep multi-skill knowledge", "Expensive to build prototypes", "Intense learning curve"]
                },
                aero: {
                    name: "Aerospace Engineering (Planes & Space)",
                    tags: ["Rockets", "Planes", "Space"],
                    desc: "Design machines that fly! From fast jets to rockets going to Mars.",
                    future: "With private space companies rising, you could be building the first Mars colony.",
                    career: "Rocket Scientist, Aircraft Designer, Satellite Engineer.",
                    suitability: "If you've always looked at the stars or planes with wonder.",
                    pros: ["High prestige/Respect", "Work on space missions", "Elite engineering field"],
                    cons: ["Hardest math & physics", "Very high safety pressure", "Limited number of companies"]
                },
                biomed: {
                    name: "Biomedical Engineering (Health Tech)",
                    tags: ["Hospitals", "Gadgets", "Scanners"],
                    desc: "Dignity in technology! Design machines that save lives, like MRI scanners or bionic limbs.",
                    future: "Healthcare is going high-tech. You'll be the bridge between doctors and engineers.",
                    career: "Medical Device Designer, Health-Tech Consultant, Lab Instrument Expert.",
                    suitability: "If you want to help people and love biology along with machines.",
                    pros: ["Save lives with tech", "Fast growing health sector", "Meaningful work"],
                    cons: ["Strict hospital regulations", "Requires deep biology learning", "Complex safety testing"]
                },
                chem: {
                    name: "Chemical Engineering (Medicine & Fuels)",
                    tags: ["Medicines", "Fuels", "Perfumes"],
                    desc: "Transform raw materials into cool things like medicines, fuels, or even your favorite perfumes.",
                    future: "Sustainability and new materials are the key. You'll find cleaner ways to make products.",
                    career: "Medicine Maker, Energy Researcher, Material Scientist.",
                    suitability: "If you love chemistry labs and wondering how things are made in factories.",
                    pros: ["Critical for medicines/pharma", "Very high pay in energy sector", "Versatile knowledge"],
                    cons: ["Exposure to chemicals", "Strict safety gear needed", "Usually working in industrial zones"]
                },
                fashion: {
                    name: "Fashion Technology (Tech & Style)",
                    tags: ["Clothes", "Design", "Fabrics"],
                    desc: "Engineering for the style world! Combine high-tech fabrics with modern apparel design.",
                    future: "Smart clothes that track your health are coming. You'll design the future of style.",
                    career: "Apparel Designer, Textile Technologist, Fashion Brand Lead.",
                    suitability: "If you have style and want to use math and logic to make clothes better.",
                    pros: ["Creative & Logical mix", "Work in the fashion world", "Tangible everyday products"],
                    cons: ["Fast changing trends", "High competition", "Industrial factory visits"]
                },
                textile: {
                    name: "Textile Technology (Smart Fabrics)",
                    tags: ["Cloth", "Looms", "Colors"],
                    desc: "Learn how the clothes you wear are made, from cotton to high-tech threads.",
                    future: "Eco-friendly fabrics are the big goal. You'll make the world more sustainable through cloth.",
                    career: "Quality Control Lead, Textile Engineer, Sustainability Expert.",
                    suitability: "If you are interested in the massive industry that covers the world.",
                    pros: ["Huge global industry", "Core human necessity", "Many jobs in industrial hubs"],
                    cons: ["Traditional industry", "Factory-based work", "Loud environments"]
                },
                food: {
                    name: "Food Technology (Tasty Science)",
                    tags: ["Food", "Safety", "Nutrition"],
                    desc: "How do chips stay crunchy? How is ice cream made? Learn the science of the food you eat.",
                    future: "Making healthy, long-lasting food for billions of people is a huge challenge.",
                    career: "Food Quality Officer, Product Developer, Nutrition Analyst.",
                    suitability: "If you love food and are curious about what's listed on the back of the packet.",
                    pros: ["Recession-proof job (people always eat!)", "Creative product making", "Great for entrepreneurship"],
                    cons: ["Lots of food safety checks", "Standing in labs/factories", "Requires high hygiene"]
                },
                petro: {
                    name: "Petrochemicals (Fuel & Energy)",
                    tags: ["Energy", "Refineries", "Oil"],
                    desc: "Work with the energy that powers our world. Focus on oil, gas, and plastics.",
                    future: "Transitioning to cleaner energy from traditional oil is the next big challenge.",
                    career: "Refinery Engineer, Energy Analyst, Process Specialist.",
                    suitability: "If you want to work in a massive, high-stakes energy industry.",
                    pros: ["Highest salary potential", "International travel", "Deep technical learning"],
                    cons: ["Remote plant locations", "Challenging safety rules", "Work can be in harsh weather"]
                },
                auto: {
                    name: "Automobile Engineering (Cars & Bikes)",
                    tags: ["Supercars", "Racing", "Engines"],
                    desc: "Build the next sports car or superbike! Focus on design, speed, and safety.",
                    future: "Driverless cars and flying vehicles are coming. You'll be the one designing them.",
                    career: "Car Designer, Racing Analyst, Safety Engineer.",
                    suitability: "If you're a 'gearhead' who loves bikes and cars more than anything.",
                    pros: ["Work with your passion", "Thrilling field", "Focus on speed/cool design"],
                    cons: ["High pressure for safety", "Expensive parts", "Shift to electric changing everything"]
                },
                env: {
                    name: "Environmental Engineering (Planet Saving)",
                    tags: ["Water", "Green", "Earth"],
                    desc: "Save the Earth! Design systems to clean water, reduce pollution, and stop climate change.",
                    future: "The Earth needs you. Sustainable living is not a choice, it's a necessity.",
                    career: "Pollution Control Officer, Sustainability Expert, Water Project Designer.",
                    suitability: "If you're a nature lover who wants to use science to fix the planet.",
                    pros: ["Most meaningful career", "Global opportunities", "Highly respected work"],
                    cons: ["Lots of rules & laws", "Can be difficult to see progress", "Government-focused jobs"]
                },
                prod: {
                    name: "Production (The Factory Maestro)",
                    tags: ["Efficiency", "Factories", "Management"],
                    desc: "The 'Boss' of the factory! Optimize how things are made and delivered efficiently.",
                    future: "Smart factories (Industry 4.0) need managers who understand both machines and people.",
                    career: "Industrial Manager, Supply Chain Consultant, Quality Control Lead.",
                    suitability: "If you are very organized and love making systems faster and better.",
                    pros: ["Great bridge to Management (MBA)", "See the big picture", "Wide job options"],
                    cons: ["High stress environment", "24/7 factory cycles", "Metrics & target pressure"]
                }
            };


            let currentAssessment = {
                mode: 'discovery', // 'discovery', 'comparison', or 'goal'
                goal: null, // selected goal branch key
                selectedCompareBranches: [],
                academic: {
                    group: 'math',
                    marks: { math: 0, physics: 0, chem: 0, cs: 0, overall: 0 }
                },
                history: [] // Stack of screen IDs for back navigation
            };


            const relatedCoursesData = {
                cs: [
                    { key: 'it', why: 'Similar Role', desc: 'Information Technology offers almost identical career paths in software development with often slightly more accessible cutoffs.' },
                    { key: 'ai', why: 'Trending', desc: 'AI & Data Science is a specialized version of CS focusing on machine learning and big data analytics.' },
                    { key: 'ec', why: 'Hardware mix', desc: 'Electronics & Communication lets you work on both hardware design and software development.' }
                ],
                it: [
                    { key: 'cs', why: 'Core Software', desc: 'Computer Science is the broader foundation for all software and computing systems.' },
                    { key: 'ai', why: 'Data Focus', desc: 'If you enjoy the data management side of IT, AI & Data Science is a perfect next step.' },
                    { key: 'ec', why: 'Connectivity', desc: 'Network design and communication hardware are foundational to modern IT systems.' }
                ],
                ai: [
                    { key: 'cs', why: 'Foundation', desc: 'Provides the broad computing background that makes specialized AI knowledge even more powerful.' },
                    { key: 'it', why: 'Implementation', desc: 'Focuses on how to deploy and manage large scale information systems.' },
                    { key: 'ec', why: 'Robotics', desc: 'The physical brain for AI systems often lives in embedded electronic controllers.' }
                ],
                mech: [
                    { key: 'prod', why: 'Industry 4.0', desc: 'Production engineering focuses on manufacturing efficiency and modern industrial management.' },
                    { key: 'civil', why: 'Structural', desc: 'Both share foundations in mechanics and physical design across different scales.' },
                    { key: 'ee', why: 'Power/EVs', desc: 'The future of mechanical systems is increasingly electrical (EVs, Automation).' }
                ],
                civil: [
                    { key: 'mech', why: 'Mechanics', desc: 'Shares core physics principles regarding forces and material properties.' },
                    { key: 'chem', why: 'Materials', desc: 'Crucial for understanding cement, polymers, and advanced construction materials.' },
                    { key: 'ee', why: 'Smart Cities', desc: 'Electrical grids and renewable energy are the nervous system of modern urban planning.' }
                ],
                ec: [
                    { key: 'cs', why: 'Embedded', desc: 'Crucial if you want to write the software that runs on electronic hardware.' },
                    { key: 'ee', why: 'Power Electronics', desc: 'The base for working on power grids, motors, and high-voltage systems.' },
                    { key: 'it', why: 'Networking', desc: 'Electronic communication signals are the base of all Information Technology.' }
                ],
                ee: [
                    { key: 'ec', why: 'Electronics', desc: 'Focuses more on low-voltage signals, communication, and micro-processors.' },
                    { key: 'mech', why: 'Control Systems', desc: 'Perfect for working on robotics and automated machinery.' },
                    { key: 'cs', why: 'Automation', desc: 'Modern electrical grids are managed by sophisticated software and AI algorithms.' }
                ],
                chem: [
                    { key: 'bio', why: 'Life Sciences', desc: 'Biotechnology uses chemical principles to solve medical and biological challenges.' },
                    { key: 'mech', why: 'Process Plant', desc: 'Design the massive machines and systems used in chemical production.' },
                    { key: 'prod', why: 'Optimization', desc: 'Managing chemical manufacturing at scale requires deep understanding of industrial processes.' }
                ],
                bio: [
                    { key: 'chem', why: 'Molecular', desc: 'The fundamental chemistry behind biological processes and pharmaceutical design.' },
                    { key: 'it', why: 'Bioinformatics', desc: 'Big data and software are the tools used to map genomes and biological patterns.' }
                ],
                prod: [
                    { key: 'mech', why: 'Design', desc: 'Learn how to design the parts that your production lines will be manufacturing.' },
                    { key: 'it', why: 'ERP/Data', desc: 'Modern production relies heavily on data systems for logistics and supply chain.' },
                    { key: 'civil', why: 'Logistics', desc: 'Infrastructure planning is a key component of industrial and factory setup.' }
                ]
            };

            function setAcademicGroup(group) {
                currentAssessment.academic.group = group;
                document.getElementById('groupMath').classList.toggle('active', group === 'math');
                document.getElementById('groupCS').classList.toggle('active', group === 'cs');
                document.getElementById('csMarkField').style.display = group === 'cs' ? 'block' : 'none';
            }

            function updateAssessmentNav(currentScreen) {
                const nav = document.getElementById('assessmentBackNav');
                nav.style.display = currentScreen === 'academicProfile' ? 'none' : 'flex';

                // Update indicators
                const indicators = document.querySelectorAll('.step-indicator');
                const stepMap = { 'academicProfile': 0, 'goalSelection': 1, 'modeSelection': 2, 'branchSelector': 2, 'resultContainer': 3 };
                const currentStep = stepMap[currentScreen];

                indicators.forEach((ind, idx) => {
                    ind.className = 'step-indicator' + (idx < currentStep ? ' active' : '');
                    if (idx === currentStep - 1) ind.classList.add('active');
                });
            }

            function navigateToAssessmentScreen(screenId) {
                const screens = ['academicProfile', 'goalSelection', 'modeSelection', 'branchSelector', 'resultContainer'];
                screens.forEach(s => {
                    const el = document.getElementById(s);
                    if (el) el.style.display = s === screenId ? 'block' : 'none';
                });

                if (!currentAssessment.history.includes(screenId)) {
                    currentAssessment.history.push(screenId);
                }
                updateAssessmentNav(screenId);
            }

            function handleAssessmentBack() {
                if (currentAssessment.history.length > 1) {
                    currentAssessment.history.pop(); // Remove current
                    const prevScreen = currentAssessment.history[currentAssessment.history.length - 1];

                    // Specific cleanup if going back from results
                    if (prevScreen === 'modeSelection' && currentAssessment.mode === 'goal') {
                        // If we are in goal mode, modeSelection isn't really "back", goalSelection is.
                        handleAssessmentBack(); // Go back one more
                        return;
                    }

                    navigateToAssessmentScreen(prevScreen);
                }
            }

            function proceedToGoalSelection() {
                // Capture marks
                currentAssessment.academic.marks = {
                    math: parseInt(document.getElementById('markMath').value) || 0,
                    physics: parseInt(document.getElementById('markPhysics').value) || 0,
                    chem: parseInt(document.getElementById('markChem').value) || 0,
                    cs: parseInt(document.getElementById('markCS').value) || 0,
                    overall: parseInt(document.getElementById('markOverall').value) || 0
                };

                // Validate basic marks
                if (!currentAssessment.academic.marks.math || !currentAssessment.academic.marks.physics) {
                    alert("Please enter at least Mathematics and Physics marks.");
                    return;
                }

                renderGoalSelection();
                navigateToAssessmentScreen('goalSelection');
            }

            function renderGoalSelection() {
                const grid = document.getElementById('goalGrid');
                grid.innerHTML = '';

                for (let key in branchMapping) {
                    const item = document.createElement('div');
                    item.className = 'goal-item';
                    item.innerHTML = `
                        < div class="goal-item-icon" > ${ getGoalIcon(key) }</div >
                            <div class="goal-item-name">${branchMapping[key].name}</div>
                    `;
                    item.onclick = () => selectGoal(key);
                    grid.appendChild(item);
                }
            }

            function getGoalIcon(key) {
                const icons = {
                    cs: '💻', it: '🌐', ai: '🤖', ec: '📡', ee: '⚡', mech: '⚙️', civil: '🏗️', chem: '🧪',
                    cyber: '🛡️', agri: '🚜', robot: '🦾', aero: '🚀', biomed: '🩺', fashion: '👗',
                    textile: '🧵', food: '🍕', petro: '🛢️', auto: '🏎️', env: '🌍', prod: '🏭'
                };
                return icons[key] || '🎓';
            }


            function selectGoal(key) {
                currentAssessment.goal = key;
                currentAssessment.mode = 'goal';
                showAssessmentResults();
            }

            function proceedToModeSelection() {
                currentAssessment.goal = null;
                navigateToAssessmentScreen('modeSelection');
            }

            function selectAssessmentMode(mode) {
                currentAssessment.mode = mode;
                if (mode === 'comparison') {
                    showBranchSelector();
                } else {
                    showAssessmentResults();
                }
            }

            function showBranchSelector() {
                const cont = document.getElementById('comparisonBranchChips');
                cont.innerHTML = '';

                for (let key in branchMapping) {
                    const chip = document.createElement('div');
                    chip.className = 'branch-chip-input';
                    chip.innerText = branchMapping[key].name;
                    chip.onclick = () => toggleComparisonBranch(key, chip);
                    cont.appendChild(chip);
                }

                updateStartComparisonBtn();
                navigateToAssessmentScreen('branchSelector');
            }

            function toggleComparisonBranch(key, el) {
                const idx = currentAssessment.selectedCompareBranches.indexOf(key);
                if (idx >= 0) {
                    currentAssessment.selectedCompareBranches.splice(idx, 1);
                    el.classList.remove('selected');
                } else {
                    if (currentAssessment.selectedCompareBranches.length < 3) {
                        currentAssessment.selectedCompareBranches.push(key);
                        el.classList.add('selected');
                    } else {
                        alert("Please select up to 3 branches for comparison.");
                    }
                }
                updateStartComparisonBtn();
            }

            function updateStartComparisonBtn() {
                const btn = document.getElementById('startComparisonBtn');
                const count = currentAssessment.selectedCompareBranches.length;
                btn.disabled = count < 2;
                btn.innerText = count < 2 ? 'Select at least 2 branches' : 'Show Comparison Guidance';
            }

            function backToModeSelection() {
                currentAssessment.selectedCompareBranches = [];
                navigateToAssessmentScreen('modeSelection');
            }

            function toggleDetailCard(element) {
                const panel = element.querySelector('.detailed-info-panel');
                const isVisible = panel.style.display === 'block';

                // Close all other panels first
                document.querySelectorAll('.detailed-info-panel').forEach(p => p.style.display = 'none');

                if (!isVisible) {
                    panel.style.display = 'block';
                }
            }

            function showAssessmentResults() {
                navigateToAssessmentScreen('resultContainer');

                const marks = currentAssessment.academic.marks;
                const mode = currentAssessment.mode;
                const goal = currentAssessment.goal;

                // TNEA Cutoff Calculation: Math + Phys/2 + Chem/2 (Total 200)
                const userCutoff = marks.math + (marks.physics / 2) + (marks.chem / 2);

                const scores = {};
                for (let k in branchMapping) scores[k] = 0;

                // Software/Digital
                scores.cs += marks.math * 0.4 + marks.cs * 0.6;
                scores.ai += marks.math * 0.6 + marks.cs * 0.4;
                scores.it += marks.math * 0.3 + marks.cs * 0.7;
                scores.cyber += marks.math * 0.5 + marks.cs * 0.5;

                // Hardware/Signals
                scores.ec += marks.math * 0.5 + marks.physics * 0.5;
                scores.ee += marks.math * 0.4 + marks.physics * 0.6;

                // Design/Build
                scores.mech += marks.physics * 0.7 + marks.math * 0.3;
                scores.civil += marks.physics * 0.6 + marks.math * 0.4;
                scores.auto += marks.physics * 0.8 + marks.math * 0.2;
                scores.aero += marks.math * 0.8 + marks.physics * 0.2;
                scores.robot += marks.math * 0.6 + marks.physics * 0.4;

                // Process/Bio
                scores.chem += marks.chem * 0.8 + marks.math * 0.2;
                scores.food += marks.chem * 0.7 + marks.math * 0.3;
                scores.petro += marks.chem * 0.6 + marks.math * 0.4;
                scores.biomed += marks.chem * 0.5 + marks.physics * 0.5;
                scores.agri += marks.math * 0.4 + (marks.physics + marks.chem) / 4;

                // Production/Materials
                scores.prod += marks.math * 0.5 + marks.physics * 0.5;
                scores.fashion += marks.math * 0.3 + marks.physics * 0.3 + 40;
                scores.textile += marks.math * 0.3 + marks.physics * 0.3 + 40;
                scores.env += marks.chem * 0.4 + marks.physics * 0.4 + marks.math * 0.2;


                let bestKey = goal || 'cs';
                if (!goal) {
                    let maxScore = -1;
                    if (mode === 'comparison') {
                        currentAssessment.selectedCompareBranches.forEach(key => {
                            if (scores[key] > maxScore) { maxScore = scores[key]; bestKey = key; }
                        });
                    } else {
                        for (let key in scores) {
                            if (scores[key] > maxScore) { maxScore = scores[key]; bestKey = key; }
                        }
                    }
                }

                const rec = branchMapping[bestKey] || branchMapping.cs;
                document.getElementById('resultBranch').innerText = goal ? `Goal Analysis: ${ rec.name } ` : rec.name;


                const topSubject = Object.entries({ Math: marks.math, Physics: marks.physics, Chemistry: marks.chem, CS: marks.cs })
                    .sort((a, b) => b[1] - a[1])[0][0];

                // --- PERSONA BASED ENHANCEMENT ---
                const userName = authState.user ? (authState.user.name || authState.user.username) : "Student";
                const resultDesc = document.getElementById('resultDesc');

                resultDesc.innerHTML = `
                        < div class="advisor-card" >
                        <div class="advisor-avatar-container">
                            <div class="advisor-avatar">👩‍🏫</div>
                        </div>
                        <div class="advisor-content">
                            <h4>Career Guidance Advisor</h4>
                            <div class="advisor-greeting">"Hello, ${userName}! I've analyzed your path..."</div>
                            <p class="advisor-text">
                                ${goal ? `I see you are interested in ${rec.name}. Here is a simple take on why this is a good choice:` :
                        `Based on your marks, I think ${rec.name} is a great match. Here's why:`}
                            </p>
                        </div>
                    </div >

                    <div class="course-detail-grid">
                        <div class="detail-card" onclick="toggleDetailCard(this)">
                            <h5><span class="detail-icon">🔭</span> The Future</h5>
                            <p class="detail-text">${rec.future}</p>
                            <div class="detailed-info-panel">
                                <strong>What to expect:</strong> ${rec.future} This field is growing fast. Simplest way to think about it: You'll be building the things people use every day.
                            </div>
                        </div>
                        <div class="detail-card" onclick="toggleDetailCard(this)">
                            <h5><span class="detail-icon">💼</span> Career Path</h5>
                            <p class="detail-text">${rec.career}</p>
                            <div class="detailed-info-panel">
                                <strong>Growth:</strong> You usually start as a junior engineer, then become a senior/lead in 3-5 years. The more you learn, the higher you go!
                            </div>
                        </div>
                        <div class="detail-card" onclick="toggleDetailCard(this)">
                            <h5><span class="detail-icon">🎯</span> Why You?</h5>
                            <p class="detail-text">${rec.suitability}</p>
                            <div class="detailed-info-panel">
                                <strong>Your Match:</strong> Since you did well in ${topSubject}, you have the right mindset for this. It plays to your strengths!
                            </div>
                        </div>
                    </div>

                    <div class="balance-section">
                        <h4 style="color:var(--primary); margin-bottom:0.5rem; display:flex; align-items:center; gap:0.75rem;">
                            <span style="font-size:1.5rem;">⚖️</span> Why this path? (Pros & Cons)
                        </h4>
                        <p style="color:var(--text-muted); font-size:0.9rem; margin-bottom:1.5rem;">Every choice has trade-offs. Here is a balanced view of ${rec.name}.</p>
                        
                        <div class="balance-grid">
                            <div class="balance-column">
                                <h6 class="pros-title"><span>🌟</span> Positive Aspects</h6>
                                <ul class="balance-list pros-list">
                                    ${(rec.pros || []).map(p => `<li>${p}</li>`).join('')}
                                </ul>
                            </div>
                            <div class="balance-column">
                                <h6 class="cons-title"><span>⚠️</span> Potential Challenges</h6>
                                <ul class="balance-list cons-list">
                                    ${(rec.cons || []).map(c => `<li>${c}</li>`).join('')}
                                </ul>
                            </div>
                        </div>
                    </div>
                    `;

                // Breakdown for Comparison
                if (mode === 'comparison') {
                    // ... (keep breakdown logic)
                    document.getElementById('comparisonBreakdown').style.display = 'block';
                    const list = document.getElementById('breakdownList');
                    list.innerHTML = '';
                    const sortedCompare = [...currentAssessment.selectedCompareBranches].sort((a, b) => scores[b] - scores[a]);
                    const totalSelectedScore = sortedCompare.reduce((sum, k) => sum + (scores[k] || 0), 0) || 1;

                    sortedCompare.forEach(key => {
                        const score = scores[key];
                        const percentage = Math.round((score / totalSelectedScore) * 100);
                        const item = document.createElement('div');
                        item.className = 'breakdown-item';
                        item.innerHTML = `
                        < div class="breakdown-header" >
                                <span class="breakdown-label">${branchMapping[key].name}</span>
                                <span class="breakdown-percentage">${percentage}% Alignment</span>
                            </div >
                        <div class="breakdown-bar-bg">
                            <div class="breakdown-bar-fill" style="width: ${percentage}%"></div>
                        </div>
                    `;
                        list.appendChild(item);
                    });
                } else {
                    document.getElementById('comparisonBreakdown').style.display = 'none';
                }


                // 2. Improvement Tips
                const tipsList = document.getElementById('improvementTipsList');
                tipsList.innerHTML = '';
                const tips = generateImprovementTips(userCutoff, topSubject, bestKey);
                tips.forEach(t => {
                    const div = document.createElement('div');
                    div.className = 'tip-item';
                    div.innerHTML = `< span class="tip-bullet" >•</span > <span>${t}</span>`;
                    tipsList.appendChild(div);
                });

                // 3. Related Courses - Personalized Tone
                const relatedCont = document.getElementById('relatedCoursesList');
                relatedCont.innerHTML = '';
                const related = relatedCoursesData[bestKey] || [];
                related.forEach(rel => {
                    const course = branchMapping[rel.key];
                    if (!course) return;
                    const card = document.createElement('div');
                    card.className = 'related-course-card';
                    card.innerHTML = `
                        < div class="related-course-header" >
                            <span class="related-course-name">${course.name}</span>
                            <span class="related-why-tag">${rel.why}</span>
                        </div >
                        <p class="related-desc" style="font-style: italic; color: #475569; margin-bottom: 1rem;">"${rel.desc}"</p>
                        <p style="font-size: 0.85rem; color: var(--text-muted); margin-bottom: 1.5rem;">Think of this as ${rec.name}'s sibling—similar DNA, but a different personality. It shares a common foundation but explores different applications.</p>
                        <button class="btn-icon" onclick="selectGoal('${rel.key}')">View Guidance</button>
                    `;
                    relatedCont.appendChild(card);
                });

                const exploreBtn = document.getElementById('exploreRecommended');
                exploreBtn.onclick = () => {
                    switchTab('courses');
                    document.getElementById('courseSearch').value = rec.name;
                    renderCourseInsights();
                };
            }

            function generateImprovementTips(cutoff, topSubject, targetBranch) {
                const tips = [];
                const isTopTier = cutoff > 190;

                if (isTopTier) {
                    tips.push("Your current cutoff is excellent! You are likely to get top colleges like CEG or MIT.");
                    tips.push("Focus on maintaining consistency and preparing for counselling procedures.");
                } else if (cutoff > 175) {
                    tips.push(`Your cutoff(${ cutoff.toFixed(2) }) is good.To reach top - tier colleges for ${ branchMapping[targetBranch].name }, aim for 190 + marks.`);
                    tips.push(`Strengthen your ${ topSubject === 'Math' ? 'Physics' : 'Math' } to boost your composite score significantly.`);
                } else {
                    tips.push(`A cutoff of ${ cutoff.toFixed(2) } means you should focus on medium - tier private colleges or university regional campuses.`);
                    tips.push("Intensive practice in Mathematics is recommended as it has 50% weightage in TNEA calculation.");
                }

                if (topSubject !== 'Math') {
                    tips.push("Pro-tip: Since Math is 100% weightage while Physics/Chemistry are 50% each, improving Math by 1 mark equals improving P+C by 2 marks!");
                }

                return tips;
            }

            function renderInterestQuiz() {
                const q = assessmentQuestions[currentQuizStep];
                document.getElementById('quizQuestion').innerText = q.text;
                document.getElementById('quizDesc').innerText = q.desc;

                const optionsCont = document.getElementById('quizOptions');
                optionsCont.innerHTML = q.options.map((opt, idx) => `
                        < div class="quiz-option" onclick = "selectQuizOption(${idx})" >
                        <h5>${opt.text}</h5>
                        <p>${opt.desc}</p>
                    </div >
                        `).join('');

                const progress = ((currentQuizStep) / assessmentQuestions.length) * 100;
                document.getElementById('quizProgressBar').style.width = `${ progress }%`;
            }

            function selectQuizOption(optionIdx) {
                const q = assessmentQuestions[currentQuizStep];
                const selected = q.options[optionIdx];

                // Add scores
                for (let key in selected.score) {
                    currentAssessment.interests[key] += selected.score[key];
                }

                currentQuizStep++;
                if (currentQuizStep < assessmentQuestions.length) {
                    renderInterestQuiz();
                } else {
                    document.getElementById('quizProgressBar').style.width = '100%';
                    setTimeout(() => {
                        navigateToAssessmentScreen('modeSelection');
                    }, 300);
                }
            }

            function startAssessment() {
                currentAssessment.history = [];
                currentAssessment.selectedCompareBranches = [];
                currentAssessment.goal = null;
                navigateToAssessmentScreen('academicProfile');
            }

            // Initialize App
            window.addEventListener('DOMContentLoaded', () => {
                loadData();
            });

        