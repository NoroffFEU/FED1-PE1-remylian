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
		<div class="carousel-item fade">
		<h2 class="carousel-title">${post.title}</h2>
		<img class="carousel-image" src="${post.media?.url || ''}" alt="${post.media?.alt || post.title}" loading="lazy" />
		<button class="carousel-read-more">Read More</button>
		</div>
    `;

		// Remove the fade class shortly after rendering to trigger the fade-in.
		const item = carouselContainer.querySelector('.carousel-item');
		setTimeout(() => {
			if (item) {
				item.classList.remove('fade');
			}
		}, 10);

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
	const nextButton = document.getElementById('next-btn');
	if (nextButton) {
		nextButton.addEventListener('click', () => {
			// fade out current post
			const item = carouselContainer.querySelector('.carousel-item');
			if (item) {
				item.classList.add('fade');
			}
			setTimeout(() => {
				currentIndex = (currentIndex + 1) % posts.length;
				renderPost(currentIndex);
			}, 600);
		});
	} else {
		console.warn('No next button found');
	}

	const prevButton = document.getElementById('prev-btn');
	if (prevButton) {
		prevButton.addEventListener('click', () => {
			const item = carouselContainer.querySelector('.carousel-item');
			if (item) {
				item.classList.add('fade');
			}
			setTimeout(() => {
				currentIndex = (currentIndex - 1 + posts.length) % posts.length;
				renderPost(currentIndex);
			}, 600);
		});
	} else {
		console.warn('No previous button found');
	}
}
