// utils.js - Contains reusable helper functions

/**
 * Capitalize the first letter of every word
 * @param {string} str
 * @returns {string}
 */
function capitalizeWords(str) {
  return str.replace(/\b\w/g, c => c.toUpperCase());
}

/**
 * Split comma-separated values into trimmed array
 * @param {string} str
 * @returns {string[]}
 */
function parseCSV(str) {
  return str.split(",").map(s => s.trim()).filter(Boolean);
}

/**
 * Show alert message to user
 * @param {string} msg
 */
function showMessage(msg) {
  alert(msg);
}


