import VueAppManager from "../src/VueAppManager";
const vueAppManager = new VueAppManager();
vueAppManager.RegisterApp("example2app", getExample2App);
async function getExample2App() {
    const appmodule = await import(/* webpackChunkName: "exampleapp2" */ './example2.vue');
    return appmodule;
}