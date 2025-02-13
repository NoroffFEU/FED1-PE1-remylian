import { apiRequest } from '../api.js';
import { withErrorHandling } from '../errorhandling.js';
import { displayUserStatus } from '../userStatus.js';

document.addEventListener('DOMContentLoaded', () => {
	displayUserStatus();

	const postForm = document.getElementById('post-form');
	const errorMessageDiv = document.getElementById('error-message');
	const successMessageDiv = document.getElementById('success-message');

	// Get username from localStorage
	const username = localStorage.getItem('username');

	// Add event listener, wrap with withErrorHandling.
	postForm.addEventListener(
		'submit',
		withErrorHandling(async (event) => {
			event.preventDefault();
			errorMessageDiv.textContent = '';
			successMessageDiv.textContent = '';

			// Gather and trim form values
			const title = postForm.title.value.trim();
			const body = postForm.body.value.trim();

			const mediaUrl = postForm.mediaUrl ? postForm.mediaUrl.value.trim() : '';
			const mediaAlt = postForm.mediaAlt ? postForm.mediaAlt.value.trim() : '';

			// validation: Title
			if (!title) {
				throw new Error('Title is required.');
			}

			// payload for API request
			const payload = {
				title,
				...(body && { body }),
				...(mediaUrl && { media: { url: mediaUrl, alt: mediaAlt || '' } }),
			};

			//  API call to create a new post
			const token = localStorage.getItem('authToken');
			const response = await apiRequest(`/blog/posts/${username}`, 'POST', payload, token);

			console.log('Post created successfully:', response);
			successMessageDiv.textContent = 'Post published successfully!';

			// collect post ID from response
			const newPostId = response.data.id;

			// Redirect to post details
			setTimeout(() => {
				window.location.href = `../post/index.html?id=${newPostId}`;
			}, 1500);
		}, errorMessageDiv)
	);
});
