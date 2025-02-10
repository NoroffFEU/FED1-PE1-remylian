import { apiRequest } from '../api.js';
import { withErrorHandling } from '../errorhandling.js';

document.addEventListener('DOMContentLoaded', () => {
	const registerForm = document.getElementById('register-form');
	const errorMessageDiv = document.getElementById('error-message');
	const successMessageDiv = document.getElementById('success-message');

	registerForm.addEventListener(
		'submit',
		withErrorHandling(async (event) => {
			event.preventDefault();
			// Clear any previous messages
			errorMessageDiv.textContent = '';
			successMessageDiv.textContent = '';

			// Collect required form values
			const name = registerForm.name.value.trim();
			const email = registerForm.email.value.trim(); //lowercase, case insensitive
			const password = registerForm.password.value;
			const confirmPassword = registerForm.confirmPassword.value;

			// Basic validation for required fields
			if (!name || !email || !password || !confirmPassword) {
				throw new Error('All required fields must be filled in.');
			}
			if (password !== confirmPassword) {
				throw new Error('Passwords do not match.');
			}
			if (password.length < 8) {
				throw new Error('Password must be at least 8 characters long.');
			}

			// Build payload with only required fields
			const payload = {
				name,
				email,
				password,
			};

			// Send registration request
			const response = await apiRequest('/auth/register', 'POST', payload);
			console.log('Registration response:', response);

			// Display success message and redirect to login
			successMessageDiv.textContent = 'Registration successful! Redirecting to log in.';
			setTimeout(() => {
				window.location.href = './login.html';
			}, 2500);
		}, errorMessageDiv)
	);
});
