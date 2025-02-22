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
		//if response status is 204 (no content), return empty object. This prevents function from trying to parse empty body.
		if (response.status === 204) {
			return {};
		}

		//if response status is not 204, return parsed JSON data.
		return await response.json();
	} catch (error) {
		console.error(`API Request Error (${method} ${url}):`, error);
		throw error;
	}
}
