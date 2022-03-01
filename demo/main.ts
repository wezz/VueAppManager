console.log('main.ts loaded');

document.addEventListener("DOMContentLoaded", function(){
	const VueAppManager = (window as { [key: string]: any })["VueAppManager"].default;
	const VueAppManagerInstance = new VueAppManager();
	console.log("VueAppManagerInstance", VueAppManagerInstance);
});

// require("./example1");
import "./example1";