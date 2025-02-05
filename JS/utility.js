/**
 * Wraps an asynchronous function with basic error handling.
 *
 * @param {Function} asyncFunc - The async function to execute.
 * @param {HTMLElement} [errorElement] - An optional element to display the error message.
 * @returns {Promise<*>} The result of asyncFunc, or undefined if an error occurred.
 */

export async function withErrorHandling(asyncFunc, errorElement = null) {
	try {
		return await asyncFunc();
	} catch (error) {
		console.error('Error:', error);
		if (errorElement) {
			errorElement.textContent = error.message || 'An unexpected error occurred.';
			errorElement.style.display = 'block';
		}
		return undefined;
	}
}
