import VueAppManager from "../src/VueAppManager";
import sharedStore from './sharedstore';

const vueAppManager = new VueAppManager();

vueAppManager.RegisterApp("example3Aapp", getExample3AApp);
vueAppManager.RegisterStore('sharedstore', sharedStore);

async function getExample3AApp() {
    const appmodule = await import(/* webpackChunkName: "exampleapp3" */ './example3a.vue');
    return appmodule;
}

vueAppManager.RegisterApp("example3Bapp", getExample3BApp);

async function getExample3BApp() {
    const appmodule = await import(/* webpackChunkName: "exampleapp3" */ './example3b.vue');
    return appmodule;
}