// JS/post/create.js

import { apiRequest } from '../api.js';

document.addEventListener('DOMContentLoaded', () => {
	const postForm = document.getElementById('post-form');
	const errorMessageDiv = document.getElementById('error-message');
	const successMessageDiv = document.getElementById('success-message');

	// Replace with your actual username or retrieve it from session/localStorage.
	const username = 'Test_Adventurer';

	postForm.addEventListener('submit', async (event) => {
		event.preventDefault();
		errorMessageDiv.textContent = '';
		successMessageDiv.textContent = '';

		// Gather form data
		const title = postForm.title.value.trim();
		const body = postForm.body.value.trim();

		// Validate required field(s)
		if (!title) {
			errorMessageDiv.textContent = 'Title is required.';
			return;
		}

		// Build the payload following API documentation
		const payload = {
			title,
			...(body && { body }),
			...(tags.length > 0 && { tags }),
			...(mediaUrl && { media: { url: mediaUrl, alt: mediaAlt || '' } }),
		};

		try {
			// Make the POST request to create a new post:
			const response = await apiRequest(`/blog/posts/${username}`, 'POST', payload);
			console.log('Post created successfully:', response);
			successMessageDiv.textContent = 'Post published successfully!';

			// Extract the new post's id from the response
			const newPostId = response.data.id;

			// Redirect to the newly created post's detail page after a short delay
			setTimeout(() => {
				window.location.href = `../post/index.html?id=${newPostId}`;
			}, 1500);
		} catch (error) {
			console.error('Error creating post:', error);
			errorMessageDiv.textContent = error.message;
		}
	});
});
