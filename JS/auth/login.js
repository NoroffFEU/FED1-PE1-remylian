import { apiRequest } from '../api.js';
import { withErrorHandling } from '../errorHandling.js';
import { navByUserStatus } from '../userStatus.js';

document.addEventListener('DOMContentLoaded', () => {
	const loginForm = document.getElementById('login-form');
	const errorMessageDiv = document.getElementById('error-message');

	navByUserStatus();

	loginForm.addEventListener(
		'submit',
		withErrorHandling(async (event) => {
			event.preventDefault();
			errorMessageDiv.textContent = '';

			const email = loginForm.email.value.trim();
			const password = loginForm.password.value;
			if (!email || !password) {
				throw new Error('Both email and password are required.');
			}

			const response = await apiRequest('/auth/login', 'POST', { email, password });
			console.log('Login response:', response);

			const { data: userData } = response;
			localStorage.setItem('authToken', userData.accessToken);
			localStorage.setItem('username', userData.name);
			console.log(userData.name);

			window.location.href = '../index.html';
		}, errorMessageDiv)
	);
});
