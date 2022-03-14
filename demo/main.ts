console.log('main.ts loaded');

import VueAppManager from "../src/VueAppManager";
console.log('main.ts VueAppManager', VueAppManager)
document.addEventListener("DOMContentLoaded", function(){	
	//const VueAppManager = (window as { [key: string]: any })["VueAppManager"].default;
	const VueAppManagerInstance = new VueAppManager();
	console.log("VueAppManagerInstance", VueAppManagerInstance);
});

// require("./example1");
import "./example1";