/** @type {import('tailwindcss').Config} */
export default {
	content: ['./src/**/*.{html,js,svelte,ts}'],
	theme: {
		extend: {
			gridTemplateColumns: {
				'auto-fill-cards': 'repeat(auto-fill, minmax(200px, 1fr))'
			}
		}
	},
	safelist: [
		// Pokemon type colors - safelist to prevent purging
		{ pattern: /bg-(red|blue|green|yellow|purple|pink|gray|orange|teal|indigo|cyan)-(100|200|300|400|500|600|700)/ },
		{ pattern: /text-(red|blue|green|yellow|purple|pink|gray|orange|teal|indigo|cyan)-(700|800|900)/ },
		{ pattern: /border-(red|blue|green|yellow|purple|pink|gray|orange|teal|indigo|cyan)-(300|400|500)/ }
	],
	plugins: []
};
