import VueAppManager from "../src/VueAppManager";
const vueAppManager = new VueAppManager();
vueAppManager.RegisterApp("example1app", getExample1App);
async function getExample1App() {
    const appmodule = await import(/* webpackChunkName: "exampleapp1" */ './example1.vue');
    return appmodule;
}