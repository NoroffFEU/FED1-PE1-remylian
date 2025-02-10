export function initCarousel(posts) {
	// Check if posts array is provided and not empty
	if (!posts || posts.length === 0) {
		console.warn('No posts provided for the carousel.');
		return;
	}

	// Get the carousel container element
	const carouselContainer = document.getElementById('carousel-container');
	if (!carouselContainer) {
		console.error('Carousel container element not found.');
		return;
	}

	// Initialize current index.
	let currentIndex = 0;

	// Function to render a post at a given index
	function renderPost(index) {
		const post = posts[index];
		// Use optional chaining for media; fall back to the title if no media is provided.
		carouselContainer.innerHTML = `
      <div class="carousel-item">
        <img src="${post.media?.url || ''}" alt="${post.media?.alt || post.title}" />
        <h2>${post.title}</h2>
      </div>
    `;
	}

	// Render the initial post.
	renderPost(currentIndex);

	// Set up event listeners for navigation buttons.
	const prevButton = document.getElementById('prev-btn');
	const nextButton = document.getElementById('next-btn');

	if (prevButton) {
		prevButton.addEventListener('click', () => {
			currentIndex = (currentIndex - 1 + posts.length) % posts.length;
			renderPost(currentIndex);
		});
	} else {
		console.warn('Previous button not found.');
	}

	if (nextButton) {
		nextButton.addEventListener('click', () => {
			currentIndex = (currentIndex + 1) % posts.length;
			renderPost(currentIndex);
		});
	} else {
		console.warn('Next button not found.');
	}
}
