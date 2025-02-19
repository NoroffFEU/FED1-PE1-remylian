export function initCarousel(posts) {
	if (!posts || posts.length === 0) {
		console.warn('No posts provided for the carousel.');
		return;
	}

	const carouselContainer = document.getElementById('carousel-container');
	if (!carouselContainer) {
		console.error('Carousel container element not found.');
		return;
	}

	let currentIndex = 0;

	// Function to render a post at a given index.
	function renderPost(index) {
		const post = posts[index];
		// Build the carousel item HTML.
		carouselContainer.innerHTML = `
			<button class="carousel-read-more">Read More</button>
      <div class="carousel-item">
			<img src="${post.media?.url || ''}" alt="${post.media?.alt || post.title}" />
			<h2>${post.title}</h2>
      </div>
    `;

		// Attach a click event listener to the "Read More" button.
		const readMoreButton = carouselContainer.querySelector('.carousel-read-more');
		if (readMoreButton) {
			readMoreButton.addEventListener('click', () => {
				const authorName = post.author?.name || localStorage.getItem('username') || 'MainUser';
				window.location.href = `/post/index.html?username=${encodeURIComponent(authorName)}&id=${post.id}`;
			});
		}
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
