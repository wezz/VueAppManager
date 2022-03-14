console.log('example1.ts loaded')
// const VueAppManager = (window as any).VueAppManager;
import VueAppManager from "../src/VueAppManager";
console.log('example VueAppManager', VueAppManager)
const vueAppManager = new VueAppManager();
console.log('vueAppManager', vueAppManager)
vueAppManager.RegisterApp("example1app", getExample1App);
console.log("example1.ts - Registered app 'example1app'");
async function getExample1App() {
    const appmodule = await import(/* webpackChunkName: "exampleapp1" */ './example1.vue');
    return appmodule;
}