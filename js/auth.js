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
