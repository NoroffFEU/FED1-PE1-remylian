export function navByUserStatus() {
	const navContainer = document.getElementById('header-nav');
	if (!navContainer) return;

	const username = localStorage.getItem('username');

	// variable to load nav elements:

	let navHTML = `
	<ul class="header-home">
	<li class="header-nav-home"><a href="index.html"><img src="/img/home dark.svg" alt="home icon"></a></li>
	</ul>`;

	// statement to render nav elements based on status (logged in or not).

	if (username) {
		navHTML += `
	<ul class="header-nav-items">
		<li class="header-nav-item-admin nav-create"><a href="post/create.html?username=${encodeURIComponent(username)}">Create New Post</a></li>
		<li class="header-nav-item-admin nav-username"><div class="name">${username} is in the Alehouse</div><button class="nav-logout" id="logout-button">Log Out</button></li>
		`;
	} else {
		navHTML += `
		<ul class="header-nav-guests">
		<li class="header-nav-guest nav-reg"><a href="account/register.html">Register</a></li>
		<li class="header-nav-guest nav-login"><a href="account/login.html">Log In</a></li>`;
	}

	navHTML += `</ul>`;

	navContainer.innerHTML = navHTML;

	if (username) {
		const logoutButton = document.getElementById('logout-button');
		logoutButton.addEventListener('click', () => {
			localStorage.removeItem('authToken');
			localStorage.removeItem('username');
			window.location.href = 'index.html';
		});
	}
}
