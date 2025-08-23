// data.js — Manages persistent user data using localStorage

import { save, load } from './utils.js';

// Key name for localStorage
const STORAGE_KEY = "skillswap_data";

// Load existing state or initialize with empty values
export let state = load(STORAGE_KEY);

if (!state.user) {
  state.user = {
    name: "",
    role: "",
    skillsOffered: [],
    skillsWanted: [],
    availability: []
  };
  save(STORAGE_KEY, state);
}

// Function to update user object and save it
export function updateUser(data) {
  state.user = { ...state.user, ...data };
  save(STORAGE_KEY, state);
}
