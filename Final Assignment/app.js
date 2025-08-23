// app.js - Main logic to handle form submission and matching
document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("profileForm");
  const matchList = document.getElementById("matchList");

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    // Get user inputs
    const profile = {
      name: capitalizeWords(document.getElementById("name").value),
      role: capitalizeWords(document.getElementById("role").value),
      skillsOffered: parseCSV(document.getElementById("skillsOffered").value),
      skillsWanted: parseCSV(document.getElementById("skillsWanted").value),
      availability: document.getElementById("availability").value,
    };

    // Save user profile
    saveUserProfile(profile);
    localStorage.setItem("userProfile", JSON.stringify(profile));
    showMessage("Profile saved! Searching for matches...");

    // Show matches
    displayMatches(profile);
  });

  // Auto-load matches if profile already saved
  const savedProfile = JSON.parse(localStorage.getItem("userProfile"));
  if (savedProfile) {
    displayMatches(savedProfile);
  }

  /**
   * Display matched users based on skills + availability
   * @param {Object} currentUser - The profile of the logged-in user
   */
  function displayMatches(currentUser) {
    const allUsers = getUserProfiles();
    const others = allUsers.filter(u => u.name !== currentUser.name);

    const matches = others.filter(user => {
      const skillMatch = user.skillsOffered.some(skill =>
        currentUser.skillsWanted.includes(skill)
      );
      const scheduleMatch = isScheduleCompatible(user.availability, currentUser.availability);
      return skillMatch && scheduleMatch;
    });

    // Render matches in list
    matchList.innerHTML = matches.length > 0
      ? matches.map(m => `<li><strong>${m.name}</strong> (${m.role})<br>Offers: ${m.skillsOffered.join(", ")}</li>`).join("")
      : "<li>No matches found. Try broadening your search.</li>";
  }
});
