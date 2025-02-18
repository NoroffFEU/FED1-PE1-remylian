// function to handle sharing of URL
export function initShareButton() {
	const shareButton = document.getElementById('share-button');
	if (!shareButton) return;

	// copy URL to clipboard when sharebutton is clicked
	shareButton.addEventListener('click', async () => {
		const shareUrl = window.location.href;
		try {
			await navigator.clipboard.writeText(shareUrl);
			alert('Link copied to clipboard!');
		} catch (err) {
			console.error('Error copying link:', err);
			alert('Failed to copy link. Please copy it manually.');
		}
	});
}
