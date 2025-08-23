// schedule.js - Basic compatibility check for scheduling

/**
 * Check if two users have compatible time slots
 * @param {string} userA
 * @param {string} userB
 * @returns {boolean}
 */
function isScheduleCompatible(userA, userB) {
  return userA === userB || userA === "Anytime" || userB === "Anytime";
}
