// utils.js — General utility functions

console.log("Utils loaded");

// Convert a comma-separated string into a trimmed, non-empty array
export function csvToArray(str) {
  return str.split(",")
    .map(s => s.trim())
    .filter(Boolean);
}

// DOM selector shortcut
export const $ = (selector) => document.querySelector(selector);
export const $$ = (selector) => Array.from(document.querySelectorAll(selector));

// LocalStorage save/load functions
export function save(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

export function load(key) {
  try {
    return JSON.parse(localStorage.getItem(key)) || {};
  } catch {
    return {};
  }
}

