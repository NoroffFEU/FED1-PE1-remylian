import { apiRequest } from '../api.js';

document.addEventListener('DOMContentLoaded', () => {
	const registerForm = document.getElementById('register-form');
	const errorMessageDiv = document.getElementById('error-message');
	const successMessageDiv = document.getElementById('success-message');

	registerForm.addEventListener('submit', async (event) => {
		// Prevent form from submitting normally
		event.preventDefault();

		// Clear previous messages
		errorMessageDiv.textContent = '';
		successMessageDiv.textContent = '';

		// Collect form values
		const name = registerForm.name.value.trim();
		const email = registerForm.email.value.trim();
		const password = registerForm.password.value;
		const confirmPassword = registerForm.confirmPassword.value;

		// check for empty fields
		if (!name || !email || !password || !confirmPassword) {
			errorMessageDiv.textContent = 'All fields are required.';
			return;
		}

		// Password match validation
		if (password !== confirmPassword) {
			errorMessageDiv.textContent = 'Passwords do not match.';
			return;
		}

		try {
			const data = await apiRequest('/auth/register', 'POST', { name, email, password });

			// Log response for debugging
			console.log('Registration response:', data);

			// if successful, display success message
			successMessageDiv.textContent = data.message || 'Registration successful! Redirecting to log in.';

			// Redirect the user to the login page after a short delay:
			setTimeout(() => {
				window.location.href = './login.html';
			}, 2500);
		} catch (error) {
			errorMessageDiv.textContent = error.message;
		}
	});
});
