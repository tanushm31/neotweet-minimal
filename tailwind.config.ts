import type { Config } from "tailwindcss";
const config: Config = {
	content: [
		"./src/app/**/*.{js,ts,jsx,tsx}",
		"./components/**/*.{js,ts,jsx,tsx}",
	],
	theme: {
		extend: {
			backgroundImage: {
				"liquid-metal": "linear-gradient(135deg, #72EDF2 10%, #5151E5 100%)",
			},
		},
	},
	plugins: [],
};
export default config;
