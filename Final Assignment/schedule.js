// schedule.js — Builds weekly availability checkboxes

console.log("Schedule logic loaded");

// Define simple weekly availability blocks
export const WEEK_SLOTS = [
  "mon-am", "mon-pm", "mon-ev",
  "tue-am", "tue-pm", "tue-ev",
  "wed-am", "wed-pm", "wed-ev",
  "thu-am", "thu-pm", "thu-ev",
  "fri-am", "fri-pm", "fri-ev",
  "sat-am", "sat-pm", "sat-ev",
  "sun-am", "sun-pm", "sun-ev"
];

// Render checkboxes for all slots into a container
export function renderSchedule(container, selected = []) {
  container.innerHTML = '';
  WEEK_SLOTS.forEach(slot => {
    const label = document.createElement('label');
    label.style.display = 'block';
    label.innerHTML = `
      <input type="checkbox" value="${slot}" ${selected.includes(slot) ? "checked" : ""}/> ${slot}
    `;
    container.appendChild(label);
  });
}
