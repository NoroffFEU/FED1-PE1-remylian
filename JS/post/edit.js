import { apiRequest } from '../api.js';
import { withErrorHandling, handleError } from '../errorhandling.js';
import { navByUserStatus } from '../userStatus.js';

document.addEventListener('DOMContentLoaded', async () => {
	navByUserStatus();

	const errorMessageDiv = document.getElementById('error-message');
	const successMessageDiv = document.getElementById('success-message');
	const postForm = document.getElementById('post-form');
	const deleteButton = document.getElementById('delete-button');

	// Retrieve query parameters: postId and username.
	const params = new URLSearchParams(window.location.search);
	const postId = params.get('id');
	const username = params.get('username');

	// Validate that we have parameters.
	if (!postId) {
		handleError(new Error('No post ID provided in the URL.'), errorMessageDiv);
		return;
	}
	if (!username) {
		handleError(new Error('No username provided in the URL.'), errorMessageDiv);
		return;
	}

	// Fetch existing post data to pre-fill the form.
	try {
		const { data: postData } = await apiRequest(`/blog/posts/${username}/${postId}`);

		// Pre-fill form fields.
		postForm.title.value = postData.title;
		postForm.body.value = postData.body || '';

		if (postForm.mediaUrl) {
			postForm.mediaUrl.value = postData.media ? postData.media.url : '';
		}
		if (postForm.mediaAlt) {
			postForm.mediaAlt.value = postData.media ? postData.media.alt : '';
		}
	} catch (error) {
		handleError(error, errorMessageDiv);
		return;
	}

	postForm.addEventListener(
		'submit',
		withErrorHandling(async (event) => {
			event.preventDefault();
			errorMessageDiv.textContent = '';
			successMessageDiv.textContent = '';

			// Gather form data.
			const title = postForm.title.value.trim();
			const body = postForm.body.value.trim();
			const tags = postForm.tags
				? postForm.tags.value
						.trim()
						.split(',')
						.map((tag) => tag.trim())
						.filter((tag) => tag)
				: [];
			const mediaUrl = postForm.mediaUrl ? postForm.mediaUrl.value.trim() : '';
			const mediaAlt = postForm.mediaAlt ? postForm.mediaAlt.value.trim() : '';

			// Basic validation: title
			if (!title) {
				throw new Error('Title is required.');
			}

			// Build payload for update
			const payload = {
				title,
				...(body && { body }),
				...(tags.length > 0 && { tags }),
				...(mediaUrl && { media: { url: mediaUrl, alt: mediaAlt || '' } }),
			};

			// get token from localStorage
			const token = localStorage.getItem('authToken');
			if (!token) {
				throw new Error('No authentication token found. Please log in again');
			}

			// Send update to the API
			const response = await apiRequest(`/blog/posts/${username}/${postId}`, 'PUT', payload, token);
			console.log('Post updated successfully:', response);
			successMessageDiv.textContent = 'Post updated successfully!';

			// Redirect to post details.
			setTimeout(() => {
				window.location.href = `/post/index.html?username=${username}&id=${postId}`;
			}, 1500);
		}, errorMessageDiv)
	);

	// event listener for delete button
	if (deleteButton) {
		deleteButton.addEventListener(
			'click',
			withErrorHandling(async () => {
				// Confirm deletion from user.
				if (!confirm('Are you sure you want to DELETE this post? This action cannot be undone!')) {
					return;
				}

				// get token from localStorage
				const token = localStorage.getItem('authToken');
				if (!token) {
					throw new Error('No authentication token found. Please log in');
				}

				// Call API to delete the post
				const response = await apiRequest(`/blog/posts/${username}/${postId}`, 'DELETE');
				console.log('Post deleted successfully:', response);
				successMessageDiv.textContent = 'Post deleted successfully!';

				// Redirect to blog feed after deletion
				setTimeout(() => {
					window.location.href = '/index.html';
				}, 2500);
			}, errorMessageDiv)
		);
	}
});
