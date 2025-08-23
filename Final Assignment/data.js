// data.js - Handles localStorage data management

const STORAGE_KEY = "userProfiles";

/**
 * Save user profile to localStorage array.
 * @param {Object} profile - New profile object to store.
 */
function saveUserProfile(profile) {
  const profiles = getUserProfiles();
  profiles.push(profile);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(profiles));
}

/**
 * Load all user profiles from storage.
 * @returns {Object[]} - Array of profiles
 */
function getUserProfiles() {
  const data = localStorage.getItem(STORAGE_KEY);
  return data ? JSON.parse(data) : [];
}

