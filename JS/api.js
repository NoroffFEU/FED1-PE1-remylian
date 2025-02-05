// JS/api.js

// Define your API base URL. You might change this later based on your environment.
const BASE_URL = 'https://v2.api.noroff.dev';

/**
 * Generic function to handle API requests.
 *
 * @param {string} endpoint - The API endpoint (e.g., '/auth/login')
 * @param {string} method - HTTP method (GET, POST, PUT, DELETE). Defaults to GET.
 * @param {object|null} data - Data to be sent as the request body (for POST/PUT). Defaults to null.
 * @param {string|null} token - Optional Bearer token for authenticated requests.
 * @returns {Promise<object>} - Parsed JSON response from the API.
 */
export async function apiRequest(endpoint, method = 'GET', data = null, token = null) {
	// Construct the full URL
	const url = `${BASE_URL}${endpoint}`;

	// Set up headers
	const headers = {
		'Content-Type': 'application/json',
	};

	// Include token if provided
	if (token) {
		headers['Authorization'] = `Bearer ${token}`;
	}

	// Set up the options object for fetch
	const options = {
		method,
		headers,
	};

	// If there's data to send, add it to the options
	if (data) {
		options.body = JSON.stringify(data);
	}

	try {
		const response = await fetch(url, options);

		// If the response is not OK, try to parse and throw the error message
		if (!response.ok) {
			const errorData = await response.json().catch(() => ({}));
			throw new Error(errorData.message || `API request failed with status ${response.status}`);
		}

		// Return the parsed JSON data
		return await response.json();
	} catch (error) {
		// Log the error for debugging
		console.error(`API Request Error (${method} ${url}):`, error);
		// Re-throw to let the caller handle it if needed
		throw error;
	}
}
