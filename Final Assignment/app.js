// app.js — Main functionality and interactivity

import { csvToArray, $, $$ } from './utils.js';
import { state, updateUser } from './data.js';
import { renderSchedule } from './schedule.js';

document.addEventListener("DOMContentLoaded", () => {
  // Dynamically insert the profile form into the DOM
  const container = document.createElement("div");

  container.innerHTML = `
    <h2>Set Up Your Profile</h2>
    <form id="profileForm">
      <label>Name:
        <input type="text" id="name" required />
      </label>
      <label>Role:
        <input type="text" id="role" />
      </label>
      <label>Skills Offered (comma separated):
        <input type="text" id="skillsOffered" />
      </label>
      <label>Skills Wanted (comma separated):
        <input type="text" id="skillsWanted" />
      </label>
      <fieldset>
        <legend>Select Your Weekly Availability</legend>
        <div id="availability"></div>
      </fieldset>
      <button type="submit">Save Profile</button>
    </form>
  `;

  document.body.appendChild(container);

  // Render checkboxes and pre-fill fields with saved data
  $("#name").value = state.user.name || "";
  $("#role").value = state.user.role || "";
  $("#skillsOffered").value = state.user.skillsOffered?.join(", ") || "";
  $("#skillsWanted").value = state.user.skillsWanted?.join(", ") || "";

  renderSchedule($("#availability"), state.user.availability || []);

  // Save profile when the form is submitted
  $("#profileForm").addEventListener("submit", (e) => {
    e.preventDefault();

    const updated = {
      name: $("#name").value.trim(),
      role: $("#role").value.trim(),
      skillsOffered: csvToArray($("#skillsOffered").value),
      skillsWanted: csvToArray($("#skillsWanted").value),
      availability: $$("#availability input:checked").map(cb => cb.value)
    };

    updateUser(updated);
    alert("✅ Profile saved successfully!");
  });
});
