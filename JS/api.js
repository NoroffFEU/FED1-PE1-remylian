//BRUK KODEN UNDER DENNE KOMMENTAREN

const BASE_URL = 'https://v2.api.noroff.dev';

//Function to handle API requests:

export async function apiRequest(endpoint, method = 'GET', data = null, token = null) {
	const url = `${BASE_URL}${endpoint}`;
	const headers = { 'Content-Type': 'application/json' };
	if (token) headers['Authorization'] = `Bearer ${token}`;

	const options = { method, headers };

	if (data) options.body = JSON.stringify(data);

	try {
		const response = await fetch(url, options);
		if (!response.ok) {
			const errorData = await response.json().catch(() => ({}));
			throw new Error(errorData.message || `API request failed with status ${response.status}`);
		}
		return await response.json();
	} catch (error) {
		console.error(`API Request Error (${method} ${url}):`, error);
		throw error;
	}
}
