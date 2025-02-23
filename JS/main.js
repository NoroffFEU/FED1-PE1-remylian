import { apiRequest } from './api.js';
import { initCarousel } from './carousel.js';
import { handleError } from './errorHandling.js';
import { navByUserStatus } from './userStatus.js';

document.addEventListener('DOMContentLoaded', async () => {
	navByUserStatus();

	try {
		const username = localStorage.getItem('username') || 'MainUser';
		const response = await apiRequest(`/blog/posts/${username}`);
		const posts = response.data;

		// Check if there are no posts.
		if (!posts || posts.length === 0) {
			// Display message in the carousel container.
			const carouselContainer = document.getElementById('carousel-container');
			carouselContainer.innerHTML = `<p class="no-posts-msg">You haven't told any stories yet.</p>`;

			// Display message in the thumbnail grid container.
			const gridContainer = document.getElementById('thumbnail-grid');
			gridContainer.innerHTML = `<p class="no-posts-msg">You have no stories on the storyboard</p>`;

			return;
		}

		const carouselPosts = posts.slice(0, 3); // initialize carousel (3 first posts)
		initCarousel(carouselPosts);

		// populate thumbnail grid (12 posts)
		const gridContainer = document.getElementById('thumbnail-grid');
		posts.slice(0, 12).forEach((post) => {
			const thumbnail = createThumbnail(post);
			gridContainer.appendChild(thumbnail);
		});
	} catch (error) {
		// use errorcontainer. If no container, display errors in document body.
		const feedErrorContainer = document.getElementById('feed-error-message');
		handleError(error, feedErrorContainer || document.body);
	}
});

// function to create a thumbnail element for a given post.
function createThumbnail(post) {
	const thumb = document.createElement('div');
	thumb.classList.add('thumbnail');
	thumb.innerHTML = `<img class="thumb-img" src="${post.media?.url || ''}" alt="${post.media?.alt || post.title}" loading="lazy" />
    <h4 class="thumb-title">${post.title}</h4>
  `;
	// Pass the username (from the post author)
	thumb.addEventListener('click', () => {
		const authorName = post.author?.name || localStorage.getItem('username') || 'MainUser';
		window.location.href = `post/index.html?username=${encodeURIComponent(authorName)}&id=${post.id}`;
	});
	return thumb;
}
