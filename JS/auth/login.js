import { apiRequest } from '../api.js';

document.addEventListener('DOMContentLoaded', () => {
	// Select the form and error message container
	const loginForm = document.getElementById('login-form');
	const errorMessageDiv = document.getElementById('error-message');

	loginForm.addEventListener('submit', async (event) => {
		event.preventDefault();
		errorMessageDiv.textContent = '';

		// Collect form data
		const email = loginForm.email.value.trim();
		const password = loginForm.password.value;

		// Simple validation: Ensure both fields are filled
		if (!email || !password) {
			errorMessageDiv.textContent = 'Both email and password are required.';
			return;
		}

		try {
			// Call the API to log in.
			const data = await apiRequest('/auth/login', 'POST', { email, password });

			const token = data.token;

			// Save the token to localStorage (for future API requests)
			localStorage.setItem('authToken', token);

			// Redirect the user after successful login.
			window.location.href = '../index.html';
		} catch (error) {
			// If error occurs, display thematic error message
			errorMessageDiv.textContent =
				'Your feeble lockpicking skills are no match for our dwarven smiths! Please obtain proper access before attempting to regain access';
		}
	});
});
