<script>
	const year = new Date().getFullYear();

	const socials = [
		{
			label: 'Newsletter',
			href: 'mailto:info@more4nature.eu',
			path: 'M3 9l9 6 9-6M3 9l9-6 9 6M3 9v10a1 1 0 001 1h16a1 1 0 001-1V9',
			stroke: true
		},
		{
			label: 'LinkedIn',
			href: 'https://www.linkedin.com/company/more4nature',
			path: 'M20.45 20.45h-3.55v-5.57c0-1.33-.03-3.04-1.85-3.04-1.86 0-2.14 1.45-2.14 2.94v5.67H9.35V9h3.41v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28zM5.34 7.43a2.06 2.06 0 110-4.13 2.06 2.06 0 010 4.13zm1.78 13.02H3.56V9h3.56v11.45z'
		},
		{
			label: 'Bluesky',
			href: 'https://bsky.app/profile/more4nature.eu',
			path: 'M12 10.8c-1.09-2.11-4.05-6.05-6.8-8C2.57.94 1.56 1.27.9 1.57.14 1.91 0 3.08 0 3.77c0 .69.38 5.65.62 6.48.82 2.74 3.72 3.66 6.39 3.36-3.91.58-7.39 2-2.83 7.08 5.01 5.19 6.87-1.11 7.82-4.31.95 3.2 2.05 9.27 7.73 4.31 4.27-4.31 1.17-6.5-2.74-7.08 2.67.3 5.57-.62 6.38-3.36.25-.83.63-5.79.63-6.48 0-.69-.14-1.86-.9-2.2-.66-.3-1.67-.62-4.3 1.24C16.05 4.75 13.09 8.69 12 10.8z'
		},
		{
			label: 'YouTube',
			href: 'https://www.youtube.com/@more4nature',
			path: 'M23.5 6.19a3.02 3.02 0 00-2.12-2.14C19.5 3.55 12 3.55 12 3.55s-7.5 0-9.38.5A3.02 3.02 0 00.5 6.19C0 8.07 0 12 0 12s0 3.93.5 5.81a3.02 3.02 0 002.12 2.14c1.87.5 9.38.5 9.38.5s7.5 0 9.38-.5a3.02 3.02 0 002.12-2.14C24 15.93 24 12 24 12s0-3.93-.5-5.81zM9.55 15.57V8.43L15.82 12l-6.27 3.57z'
		}
	];
</script>

<footer class="footer">
	<div class="container">
		<!-- Top: logo + socials -->
		<div class="top">
			<a href="/" class="logo">
				<img src="/images/logos/m4n-logo.webp" alt="more4nature – with citizen science" />
			</a>

			<ul class="socials">
				{#each socials as s}
					<li>
						<a href={s.href} target="_blank" rel="noopener noreferrer" aria-label={s.label}>
							<svg viewBox="0 0 24 24" aria-hidden="true"
								fill={s.stroke ? 'none' : 'currentColor'}
								stroke={s.stroke ? 'currentColor' : 'none'}
								stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
								<path d={s.path} />
							</svg>
						</a>
					</li>
				{/each}
			</ul>
		</div>

		<hr />

		<!-- Funding -->
		<div class="funding">
			<div class="fund-item">
				<img src="/images/logos/EU.png" alt="European Union flag" class="eu" />
				<p>
					Co-Funded by the European Union. Views and opinions expressed are however those of
					the author(s) only and do not necessarily reflect those of the European Union.
					Neither the European Union nor the granting authority can be held responsible for them.
				</p>
			</div>

			<div class="fund-item">
				<img src="/images/logos/UKRI_Innovate-UK_Horizontal_RGB.png" alt="UKRI Innovate UK" class="ukri" />
				<p>
					UK participants in Horizon Europe Project more4nature are supported by UKRI grant
					numbers: 10108638 UNEP-WCMC and 10110989 Earthwatch Europe.
				</p>
			</div>
		</div>

		<!-- Bottom -->
		<div class="bottom">
			<p>
				The project abides to Open Science and FAIR data:
				<a href="https://open-research-europe.ec.europa.eu/" target="_blank" rel="noopener noreferrer">
					EU Open Research Repository (Pilot)
				</a>
			</p>
			<a href="https://more4nature.eu/privacy-policy">Privacy Policy</a>
		</div>
	</div>
</footer>

<style>
	.footer {
		background: #2b3a4a;
		color: #fff;
		padding: 4rem 1rem 3rem;
		font-size: 0.95rem;
	}

	.container {
		max-width: 720px; /* ajusta al ancho de tu web */
		margin: 0 auto;
	}

	.top {
		display: flex;
		justify-content: space-between;
		align-items: center;
		gap: 1.5rem;
		flex-wrap: wrap;
	}

	.logo img {
		height: 56px;
		display: block;
	}

	.socials {
		display: flex;
		gap: 0.9rem;
		list-style: none;
		margin: 0;
		padding: 0;
	}

	.socials a {
		width: 44px;
		height: 44px;
		border-radius: 50%;
		background: #5b6672;
		color: #fff;
		display: grid;
		place-items: center;
		transition: background 0.2s;
	}

	.socials a:hover {
		background: #76818c;
	}

	.socials svg {
		width: 18px;
		height: 18px;
	}

	hr {
		border: 0;
		border-top: 1px solid rgba(255, 255, 255, 0.25);
		margin: 2rem 0 1.25rem;
	}

	.funding {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 2.5rem;
	}

	.fund-item {
		display: flex;
		gap: 1.75rem;
		align-items: flex-start;
	}

	.fund-item p {
		margin: 0;
		font-size: 0.72rem;
		line-height: 1.8;
	}

	.eu {
		width: 60px;
		flex-shrink: 0;
	}

	.ukri {
		width: 115px;
		flex-shrink: 0;
	}

	.bottom {
		display: flex;
		justify-content: space-between;
		gap: 1rem;
		flex-wrap: wrap;
		margin-top: 1.25rem;
	}

	.bottom p {
		margin: 0;
	}

	.bottom a {
		color: #fff;
		text-decoration: underline;
	}

	@media (max-width: 700px) {
		.funding {
			grid-template-columns: 1fr;
		}
	}
</style>