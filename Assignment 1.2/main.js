// main.js - Using JavaScript to dynamically populate student information

// Student data object
const student = {
    name: "Eric Merryman",
    major: "Game Programming",
    email: "erimerry@uat.edu",
    graduationDate: "2026"
};

// Display student info in the HTML
document.getElementById("name").textContent = student.name;
document.getElementById("major").textContent = student.major;
document.getElementById("email").textContent = student.email;
document.getElementById("gradDate").textContent = student.graduationDate;
