import { apiRequest } from './api.js';
import { initCarousel } from './carousel.js';
import { handleError } from './errorhandling.js';
import { navByUserStatus } from './userStatus.js';

document.addEventListener('DOMContentLoaded', async () => {
	navByUserStatus();

	try {
		const username = localStorage.getItem('username') || 'MainUser';
		const response = await apiRequest(`/blog/posts/${username}`);
		const posts = response.data;

		const carouselPosts = posts.slice(0, 3); // initialize carousel (3 first posts)
		initCarousel(carouselPosts);

		// populate thumbnail grid (12 posts)
		const gridContainer = document.getElementById('thumbnail-grid');
		posts.slice(0, 12).forEach((post) => {
			const thumbnail = createThumbnail(post);
			gridContainer.appendChild(thumbnail);
		});
	} catch (error) {
		// If there is a specific error container in  HTML, use it.
		// Otherwise, errors will be displayed in the document body.
		const feedErrorContainer = document.getElementById('feed-error-message');
		handleError(error, feedErrorContainer || document.body);
	}
});

// function to create a thumbnail element for a given post.
function createThumbnail(post) {
	const thumb = document.createElement('div');
	thumb.classList.add('thumbnail');
	thumb.innerHTML = `<img class="thumb-img" src="${post.media?.url || ''}" alt="${post.media?.alt || post.title}" />
    <h2>${post.title}</h2>
  `;
	// Pass the username (from the post author)
	thumb.addEventListener('click', () => {
		const authorName = post.author?.name || localStorage.getItem('username') || 'MainUser';
		window.location.href = `/post/index.html?username=${encodeURIComponent(authorName)}&id=${post.id}`;
	});
	return thumb;
}
