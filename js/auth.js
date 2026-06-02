import { authState } from './state.js';

export function initAuth(renderUserArea, updateFavBadge) {
    const savedUser = localStorage.getItem('tnea_current_user');
    if (savedUser) {
        authState.isLoggedIn = true;
        authState.user = JSON.parse(savedUser);
    }
    renderUserArea();
    updateFavBadge();
}

export function handleLogout(renderUserArea, updateFavBadge, renderCutoffTable) {
    authState.isLoggedIn = false;
    authState.user = null;
    localStorage.removeItem('tnea_current_user');
    renderUserArea();
    updateFavBadge();
    renderCutoffTable();
}

export function getFavorites() {
    if (!authState.isLoggedIn || !authState.user) return [];
    const users = JSON.parse(localStorage.getItem('tnea_users') || '{}');
    const u = users[authState.user.username];
    return u ? (u.favorites || []) : [];
}

export function saveFavorites(favs) {
    if (!authState.isLoggedIn || !authState.user) return;
    const users = JSON.parse(localStorage.getItem('tnea_users') || '{}');
    if (users[authState.user.username]) {
        users[authState.user.username].favorites = favs;
        localStorage.setItem('tnea_users', JSON.stringify(users));
    }
}

export function isFavorite(key) {
    const favs = getFavorites();
    return favs.some(f => f.key === key);
}

export function getFavoriteBranches() {
    if (!authState.isLoggedIn || !authState.user) return [];
    const users = JSON.parse(localStorage.getItem('tnea_users') || '{}');
    const u = users[authState.user.username];
    return u ? (u.favoriteBranches || []) : [];
}

export function isBranchFavorite(name) {
    return getFavoriteBranches().includes(name);
}

export function toggleBranchFavorite(name, updateUI) {
    if (!authState.isLoggedIn) {
        return false; // Signal that login is required
    }
    const users = JSON.parse(localStorage.getItem('tnea_users') || '{}');
    const u = users[authState.user.username];
    if (!u) return false;

    if (!u.favoriteBranches) u.favoriteBranches = [];
    const idx = u.favoriteBranches.indexOf(name);
    if (idx >= 0) {
        u.favoriteBranches.splice(idx, 1);
    } else {
        u.favoriteBranches.push(name);
    }
    localStorage.setItem('tnea_users', JSON.stringify(users));

    if (updateUI) updateUI(name);
    return true;
}

export function showLoginModal() {
    const modal = document.getElementById('loginModal');
    if (modal) {
        modal.classList.remove('hidden');
        document.body.style.overflow = 'hidden';
    }
}

export function closeLoginModal() {
    const modal = document.getElementById('loginModal');
    if (modal) {
        modal.classList.add('hidden');
        document.body.style.overflow = 'auto';
    }
}

export function toggleLoginMode() {
    const titleEl = document.getElementById('loginModalTitle');
    const subtitleEl = document.getElementById('loginModalSubtitle');
    const submitBtn = document.getElementById('loginSubmitBtn');
    const toggleText = document.getElementById('toggleText');
    const toggleLink = document.getElementById('toggleLink');
    const nameGroup = document.getElementById('loginNameGroup');
    const forgotWrapper = document.getElementById('forgotPwdWrapper');
    const authSep = document.getElementById('authSeparator');

    const isLoginMode = toggleLink && toggleLink.textContent === 'Register';
    if (isLoginMode) {
        // Switch to Register
        if (titleEl) titleEl.textContent = 'Create Account';
        if (subtitleEl) subtitleEl.textContent = 'Create a new account';
        if (submitBtn) submitBtn.textContent = 'Register';
        if (toggleText) toggleText.textContent = 'Already have an account? ';
        if (toggleLink) toggleLink.textContent = 'Login';
        if (nameGroup) nameGroup.style.display = 'block';
        if (forgotWrapper) forgotWrapper.style.display = 'none';
        if (authSep) authSep.style.display = 'none';
    } else {
        // Switch to Login
        if (titleEl) titleEl.textContent = 'Welcome Back';
        if (subtitleEl) subtitleEl.textContent = 'Login to save your favorite colleges';
        if (submitBtn) submitBtn.textContent = 'Login';
        if (toggleText) toggleText.textContent = "Don't have an account? ";
        if (toggleLink) toggleLink.textContent = 'Register';
        if (nameGroup) nameGroup.style.display = 'none';
        if (forgotWrapper) forgotWrapper.style.display = 'block';
        if (authSep) authSep.style.display = 'block';
    }
}

export function handleLogin() {
    const username = document.getElementById('loginUsername')?.value?.trim();
    const password = document.getElementById('loginPassword')?.value;
    const errorEl = document.getElementById('loginError');
    const fullName = document.getElementById('loginFullName')?.value?.trim();
    const isRegister = document.getElementById('loginSubmitBtn')?.textContent === 'Register';

    if (!username || !password) {
        if (errorEl) errorEl.textContent = 'Please fill in all fields.';
        return;
    }

    const users = JSON.parse(localStorage.getItem('tnea_users') || '{}');

    if (isRegister) {
        if (users[username]) {
            if (errorEl) errorEl.textContent = 'Username already exists.';
            return;
        }
        users[username] = { password, name: fullName || username, favorites: [] };
        localStorage.setItem('tnea_users', JSON.stringify(users));
        authState.isLoggedIn = true;
        authState.user = { username, name: fullName || username };
    } else {
        if (!users[username] || users[username].password !== password) {
            if (errorEl) errorEl.textContent = 'Invalid username or password.';
            return;
        }
        authState.isLoggedIn = true;
        authState.user = { username, name: users[username].name || username };
    }

    localStorage.setItem('tnea_current_user', JSON.stringify(authState.user));
    closeLoginModal();
    if (errorEl) errorEl.textContent = '';
    // Re-render UI
    if (window.renderCutoffTable) window.renderCutoffTable();
}

export function handleGoogleLogin() {
    alert('Google login is not configured for this local environment. Please use username/password.');
}

export function handleForgotPassword() {
    alert('Password reset: Please contact support or re-register with a new username.');
}

export function renderFavorites() {
    const list = document.getElementById('favoritesList');
    if (!list) return;
    const favs = getFavorites();
    if (!favs || favs.length === 0) {
        list.innerHTML = '<p style="text-align:center; color:var(--text-muted);">No favorites saved yet. Browse cutoffs and save colleges you like!</p>';
        return;
    }
    list.innerHTML = favs.map(f => `
        <div class="ranking-item" style="display:flex; justify-content:space-between; align-items:center;">
            <div>
                <strong>${f.key ? f.key.split('||')[0] : ''}</strong>
                <span style="color:var(--text-muted); font-size:0.85rem; margin-left:0.5rem;">${f.key ? f.key.split('||')[1] : ''}</span>
            </div>
            <button class="btn-secondary" style="font-size:0.8rem; padding:0.3rem 0.7rem;" onclick="removeFavorite('${f.key}')">Remove</button>
        </div>
    `).join('');
}

