<script lang="ts">
	import { page } from '$app/state';
	import logo from '$lib/images/svelte-logo.svg';
	import github from '$lib/images/github.svg';

	let isDarkMode = false;
	let currentLang = 'en';
	let isLanguageMenuOpen = false;

	function toggleTheme() {
		isDarkMode = !isDarkMode;
		document.body.classList.toggle('dark');
	}

	function toggleLanguageMenu() {
		isLanguageMenuOpen = !isLanguageMenuOpen;
	}

	function switchLanguage(lang: string) {
		currentLang = lang;
		isLanguageMenuOpen = false;
		const url = new URL(window.location.href);
		url.searchParams.set('lang', lang);
		window.history.pushState({}, '', url.toString());
	}
</script>

<header>
	<div class="corner">
		<a href="https://svelte.dev/docs/kit">
			<img src={logo} alt="SvelteKit" />
		</a>
	</div>

	<nav>
		<svg viewBox="0 0 2 3" aria-hidden="true">
			<path d="M0,0 L1,2 C1.5,3 1.5,3 2,3 L2,0 Z" />
		</svg>
		<ul>
			<li aria-current={page.url.pathname === '/' ? 'page' : undefined}>
				<a href="/">Home</a>
			</li>
			<li aria-current={page.url.pathname === '/about' ? 'page' : undefined}>
				<a href="/about">About</a>
			</li>
			<li aria-current={page.url.pathname.startsWith('/sverdle') ? 'page' : undefined}>
				<a href="/sverdle">Sverdle</a>
			</li>
		</ul>
		<svg viewBox="0 0 2 3" aria-hidden="true">
			<path d="M0,0 L0,3 C0.5,3 0.5,3 1,2 L2,0 Z" />
		</svg>
	</nav>

	<div class="corner actions">
		<button 
			class="theme-button" 
			on:click={toggleTheme}
			aria-label="Toggle dark mode"
			data-testid="theme-toggle"
		>
			{isDarkMode ? '🌞' : '🌙'} Dark Mode
		</button>
		<div class="language-menu">
			<button 
				class="language-button"
				on:click={toggleLanguageMenu}
				aria-label="Toggle language menu"
				aria-expanded={isLanguageMenuOpen}
				data-testid="language-toggle"
			>
				🌐 Language
			</button>
			<div 
				class="menu-items" 
				class:open={isLanguageMenuOpen}
				role="menu"
			>
				<button 
					class="menuitem" 
					on:click={() => switchLanguage('en')}
					role="menuitem"
					data-testid="language-en"
				>
					English
				</button>
				<button 
					class="menuitem" 
					on:click={() => switchLanguage('ja')}
					role="menuitem"
					data-testid="language-ja"
				>
					日本語
				</button>
			</div>
		</div>
		<a href="https://github.com/sveltejs/kit">
			<img src={github} alt="GitHub" />
		</a>
	</div>
</header>

<style>
	header {
		display: flex;
		justify-content: space-between;
	}

	.corner {
		width: 3em;
		height: 3em;
	}

	.corner.actions {
		width: auto;
		display: flex;
		gap: 1rem;
		align-items: center;
		padding: 0 1rem;
	}

	.theme-button,
	.language-button {
		padding: 0.5rem 1rem;
		border: none;
		border-radius: 4px;
		background: var(--color-theme-1);
		color: white;
		cursor: pointer;
		font-size: 0.8rem;
	}

	.language-menu {
		position: relative;
	}

	.menu-items {
		display: none;
		position: absolute;
		top: 100%;
		right: 0;
		background: white;
		border: 1px solid #ddd;
		border-radius: 4px;
		padding: 0.5rem;
		z-index: 100;
	}

	.menu-items.open {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}

	/* Remove hover-based menu display */
	.language-menu:hover .menu-items {
		display: none;
	}

	.menuitem {
		border: none;
		background: none;
		padding: 0.5rem 1rem;
		cursor: pointer;
		white-space: nowrap;
	}

	.menuitem:hover {
		background: #f0f0f0;
	}

	.corner a {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 100%;
		height: 100%;
	}

	.corner img {
		width: 2em;
		height: 2em;
		object-fit: contain;
	}

	nav {
		display: flex;
		justify-content: center;
		--background: rgba(255, 255, 255, 0.7);
	}

	svg {
		width: 2em;
		height: 3em;
		display: block;
	}

	path {
		fill: var(--background);
	}

	ul {
		position: relative;
		padding: 0;
		margin: 0;
		height: 3em;
		display: flex;
		justify-content: center;
		align-items: center;
		list-style: none;
		background: var(--background);
		background-size: contain;
	}

	li {
		position: relative;
		height: 100%;
	}

	li[aria-current='page']::before {
		--size: 6px;
		content: '';
		width: 0;
		height: 0;
		position: absolute;
		top: 0;
		left: calc(50% - var(--size));
		border: var(--size) solid transparent;
		border-top: var(--size) solid var(--color-theme-1);
	}

	nav a {
		display: flex;
		height: 100%;
		align-items: center;
		padding: 0 0.5rem;
		color: var(--color-text);
		font-weight: 700;
		font-size: 0.8rem;
		text-transform: uppercase;
		letter-spacing: 0.1em;
		text-decoration: none;
		transition: color 0.2s linear;
	}

	a:hover {
		color: var(--color-theme-1);
	}
</style>
