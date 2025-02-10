// HUSK Å SE OVER ALL KODE FØR COMMIT!

// Functions to centralize errorhandling:

export function displayError(error, container) {
	container.textContent = error.message || 'An unexpected error occurred.';
}

export function logError(error) {
	console.error('Error details:', error);
}

export function handleError(error, container) {
	logError(error);
	displayError(error, container);
}

// A function that wraps an async function with a try/catch block,
// to centralize error handling for asynchronous operations.
export function withErrorHandling(asyncFunc, errorContainer) {
	return async function (...args) {
		try {
			await asyncFunc(...args);
		} catch (error) {
			handleError(error, errorContainer);
		}
	};
}
