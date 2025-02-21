import { apiRequest } from '../api.js';
import { handleError } from '../errorhandling.js';
import { navByUserStatus } from '../userStatus.js';
import { initShareButton } from '../share.js';

document.addEventListener('DOMContentLoaded', async () => {
	navByUserStatus();
	initShareButton();

	const errorContainer = document.getElementById('post-error-message');

	try {
		// Retrieve the 'id' and 'username' query parameters.
		const params = new URLSearchParams(window.location.search);
		const postId = params.get('id');
		const username = params.get('username') || 'MainUser';

		if (!postId) {
			throw new Error('No post ID provided in the URL.');
		}
		if (!username) {
			throw new Error('No username provided in the URL.');
		}

		// Call API to get the specific post.
		const response = await apiRequest(`/blog/posts/${username}/${postId}`);

		// Pass the post data (response.data) to the render function.
		renderPost(response.data);
	} catch (error) {
		handleError(error, errorContainer);
	}
});

function renderPost(post) {
	const postContainer = document.getElementById('post-content');
	if (!postContainer) {
		console.error('Post container element not found.');
		return;
	}

	postContainer.innerHTML = '';

	// Create and append the image banner, if available.
	if (post.media?.url) {
		const imageElem = document.createElement('img');
		imageElem.src = post.media.url;
		imageElem.alt = post.media.alt || post.title;
		imageElem.className = 'post-banner';
		postContainer.appendChild(imageElem);
	}

	// Create and append the post title.
	const titleElem = document.createElement('h1');
	titleElem.textContent = post.title;
	postContainer.appendChild(titleElem);

	// Create and append post meta information (author and publication date).
	const metaElem = document.createElement('p');
	metaElem.className = 'post-meta';
	// Use post.created to format the publication date.
	const publishedDate = new Date(post.created).toLocaleDateString();
	metaElem.textContent = `By ${post.author?.name || 'Unknown'} on ${publishedDate}`;
	postContainer.appendChild(metaElem);

	// Create and append the post body/content.
	const bodyElem = document.createElement('div');
	bodyElem.className = 'post-body';
	bodyElem.innerHTML = post.body;
	postContainer.appendChild(bodyElem);

	// Check if the logged-in user is the post owner to conditionally show the buttons.
	const loggedInUsername = localStorage.getItem('username');
	if (loggedInUsername && post.author && loggedInUsername === post.author.name) {
		// Create a container for the buttons.
		const buttonContainer = document.createElement('div');
		buttonContainer.className = 'post-button-container';

		// Create the "Edit Post" button.
		const editButton = document.createElement('button');
		editButton.textContent = 'Edit';
		editButton.className = 'edit-btn';
		editButton.addEventListener('click', () => {
			// Fix the URL (remove any duplicate .html)
			window.location.href = `/post/edit.html?username=${encodeURIComponent(post.author.name)}&id=${post.id}`;
		});
		buttonContainer.appendChild(editButton);

		// Create the "Delete Post" button.
		const deleteButton = document.createElement('button');
		deleteButton.textContent = 'Delete';
		deleteButton.className = 'delete-btn';
		deleteButton.addEventListener('click', async () => {
			if (confirm('Are you sure you want to DELETE this post? This action cannot be undone!')) {
				try {
					const token = localStorage.getItem('authToken');
					await apiRequest(`/blog/posts/${post.author.name}/${post.id}`, 'DELETE', null, token);
					alert('Post deleted successfully!');
					window.location.href = '/index.html';
				} catch (error) {
					alert('Error deleting post: ' + error.message);
				}
			}
		});
		buttonContainer.appendChild(deleteButton);

		// Append the button container to the post container.
		postContainer.appendChild(buttonContainer);
	}
}
