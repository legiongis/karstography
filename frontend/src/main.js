import '../node_modules/ol/ol.css';
import './css/global.css';
import App from './App.svelte';

const app = new App({
	target: document.body,
	props: JSON.parse(document.getElementById("svelteprops").textContent)
});

export default app;