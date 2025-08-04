/**
 * This function retrieves values from the form inputs
 * and displays them in the output area on the page.
 */
function submitForm() {
    // Get values from input fields
    const username = document.getElementById('username').value;
    const weapons = document.getElementById('weapons').value;
    const health = document.getElementById('health').value;
    const points = document.getElementById('points').value;

    // Basic validation to ensure no empty fields
    if (!username || !weapons || !health || !points) {
        alert('Please fill in all fields before submitting.');
        return;
    }

    // Create formatted result text
    const resultText = `
        <strong>User Name:</strong> ${username}<br>
        <strong>Weapons:</strong> ${weapons}<br>
        <strong>Health/Damage:</strong> ${health}<br>
        <strong>Point Total:</strong> ${points}
    `;

    // Display the formatted text in the result paragraph
    document.getElementById('result').innerHTML = resultText;
}

/**
 * clearOutput()
 * Clears the output area when the Reset button is clicked.
 */
function clearOutput() {
    document.getElementById('result').innerHTML = 'No data entered yet.';
}
