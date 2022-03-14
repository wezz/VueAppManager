/*
  This script will manage the initiation and loading of Vua apps that are initiated through the vue-app tag.

  Attribute values are stringified json values that are URI Encoded.
  Ex. encodeURIComponent(JSON.stringify({"debug":true}))

  Example of a hello world Vue App

  <vue-app
  name="helloworld"
  options="%7B%22verbose%22%3Atrue%2C%22debug%22%3Atrue%7D"
  appdata="%7B%22numbervalue%22%3A123%2C%22stringvalue%3A%22%3A%22stringdata%22%2C%22boolvalue%22%3Atrue%7D"
  store="helloworldstore"
  ></vue-app>
  */

import Vue, { VueConstructor } from "vue";
import Vuex from "vuex";
import AsyncComputed from "vue-async-computed";
import RefStore from "@wezz/window-reference-store";
import utilsObjects from "./UtilsObjects.ts";

export default class VueAppManager {
  private controlelements: HTMLElement[] = [];
  private eventPrefix = "vueapp-";
  private controlselector = "vue-app";
  private appStore: any;
  private storeStore: any;
  private statuses = {
    Initiated: "initiated",
    Rendered: "rendered",
  };

  constructor() {
    // Make sure older browsers respect the vue-app element
    console.log("WindowReferenceStore", RefStore);
    this.appStore = new RefStore("registeredapps", "vueappmanagerApps");
    this.storeStore = new RefStore("registeredstores", "vueappmanagerApps");
    this.globalInitiation();
  }

  public RegisterApp(name: string, callback: (module: any) => {}) {
    this.appStore.set(name, callback);
  }
  public RegisterStore(name: string, store: any) {
    this.storeStore.set(name, store);
  }
  public InitiateElements() {
    const controlElements = [].slice.call(
      document.querySelectorAll(this.controlselector)
    ) as HTMLElement[];
    const newElements = controlElements.filter(
      (elm) => elm.dataset.vueappmanager !== "activated"
    );
    newElements.forEach(this.loadApp.bind(this));
    newElements.forEach((elm) => (elm.dataset.vueappmanager = "activated"));
    this.controlelements = ([] as HTMLElement[]).concat(
      this.controlelements,
      newElements
    );
  }

  public TriggerEvent(elm: Element, eventname: string, data: any) {
    elm.dispatchEvent(
      new CustomEvent(this.eventPrefix + eventname, {
        detail: data,
      })
    );
  }

  public async RunApp(
    name: string,
    originelm: HTMLElement,
    targetelm: HTMLElement,
    options: any,
    appdata: any,
    store: any,
    eventstobind: string[]
  ) {
    let appWasLoaded = false;
    const loadAppModule = await this.getRegisteredAppLoader(name);
    const vueappModule =
      loadAppModule && typeof loadAppModule.default !== "undefined"
        ? (loadAppModule.default as VueConstructor<Vue>)
        : null;
    if (vueappModule === null || typeof Vue !== "function") {
      return appWasLoaded;
    }
    const onAppRender = function () {
      console.log("onAppRender this", this);
      const appScope: any = this as any;
      appScope.$nextTick(function () {
        const nextTickScope = this as any;
        const appElm = nextTickScope.$el.parentElement as HTMLElement;
        console.log("onAppRender appElm", appElm, nextTickScope.$el);
        const appstatusAttribute = document.createAttribute("data-appstatus");
        if (appElm) {
          nextTickScope.TriggerMarkupChangeEvent(appElm);
          appstatusAttribute.value = "rendered";
          appElm.attributes.setNamedItem(appstatusAttribute);
        }
      });
    };
    store = store !== null ? store : Vuex ? new Vuex.Store({}) : null;
    const vueapp = new Vue({
      el: targetelm,
      store,
      data: {
        options: JSON.parse(JSON.stringify(options)),
        appdata: JSON.parse(JSON.stringify(appdata)),
      },
      render: (createElement) => {
        return createElement(vueappModule, options, null);
      },
      // updated: onAppRender,
      // mounted: onAppRender,
      renderError(h, err) {
        console.error(err);
        return h();
      },
    });
    eventstobind.forEach((eventname) => {
      originelm.addEventListener(this.eventPrefix + eventname.trim(), (e) => {
        if (typeof (vueapp as any)["onTriggeredEvent"] === "function") {
          (vueapp as any)["onTriggeredEvent"](eventname, e);
        }
      });
    });
    appWasLoaded = true;
    return appWasLoaded;
  }

  private getRegisteredAppLoader(name: string) {
    if (!this.appStore.has(name)) {
      console.info("Unable to find any app registered with the name: " + name);
      return null;
    }
    return this.appStore.get(name)();
  }

  private getRegisteredStore(name: string) {
    if (!this.storeStore.has(name)) {
      console.info(
        "Unable to find any store registered with the name: " + name
      );
      return null;
    }
    return this.storeStore.get(name);
  }

  private addMixingToVue() {
    const currentLanguage = document.documentElement.getAttribute("lang");
    const prefferedCultureMetaTag = document.querySelector(
      'meta[name="preferredculture"]'
    );
    const prefferedCulture = prefferedCultureMetaTag
      ? prefferedCultureMetaTag.getAttribute("content")
      : currentLanguage;
    Vue.mixin({
      created() {
        const prepopulatedProperty = ["options", "appdata"];
        prepopulatedProperty.forEach((propname) => {
          if ((this as any)["$root"][propname]) {
            const originalValue = (this as any)[propname];
            let setValue = (this as any)["$root"][propname];
            if (
              typeof originalValue === "object" &&
              Object.keys(originalValue).length > 0
            ) {
              setValue = {
                ...originalValue,
                ...setValue,
              };
            }
            Vue.set(this, propname, setValue);
          }
        });
      },
      computed: {
        i18n() {
          return (this.options as any).i18n || {};
        },
      },
      data() {
        return {
          appdata: {},
          global: {
            currentlanguage: currentLanguage,
            prefferedculture: prefferedCulture,
          },
          options: {},
        };
      },
      methods: {
        onTriggeredEvent(eventname, data) {
          const appscope = this as any;
          if (
            typeof appscope["$children"] === "object" &&
            typeof appscope["$children"][0] !== "undefined"
          ) {
            const childComponent = appscope["$children"][0] as any;
            if (typeof childComponent[eventname] === "function") {
              childComponent[eventname](data);
            }
          }
        },
        TriggerEvent(eventname: string, eventdata: any) {
          if (this["$root"]["$el"]) {
            const parentElm = (this["$root"]["$el"] as HTMLElement)
              .parentElement;
            if (parentElm) {
              parentElm.dispatchEvent(
                new CustomEvent(eventname, {
                  detail: eventdata,
                })
              );
            }
          }
        },
        TriggerMarkupChangeEvent(elm) {
          window.dispatchEvent(
            new CustomEvent("global-markupchange", {
              detail: {
                target: elm,
              },
            })
          );
        },
      },
    });
  }

  private getAttribute(elm: HTMLElement, attributename: string) {
    let attributevalue = "";
    if (elm.hasAttribute(attributename)) {
      attributevalue = elm.getAttribute(attributename) as string;
    }
    return attributevalue;
  }
  private async loadApp(elm: HTMLElement) {
    const appname = this.getAttribute(elm, "name");
    if (!this.appStore.has(appname)) {
      return;
    }
    const isType = (o: any, t: string) => typeof o === t;
    const optionstring = this.getAttribute(elm, "options");
    const appdatastring = this.getAttribute(elm, "appdata");
    const storestring = this.getAttribute(elm, "store");
    const eventstobind = this.getAttribute(elm, "events").split(",");
    const appstatusAttribute = document.createAttribute("data-appstatus");
    const targetselector = this.getAttribute(elm, "targetelement");
    let targetelm = targetselector
      ? (document.querySelector(targetselector) as HTMLElement)
      : document.createElement("div");
    let options = {};
    let appdata = {};
    let store = null;

    // Set app status
    appstatusAttribute.value = this.statuses.Initiated;
    elm.attributes.setNamedItem(appstatusAttribute);

    if (isType(optionstring, "string")) {
      options = utilsObjects.StringToObject(optionstring);
    }
    if (isType(appdatastring, "string")) {
      appdata = utilsObjects.StringToObject(appdatastring);
    }
    if (isType(storestring, "string") && storestring !== "") {
      if (this.storeStore.has(storestring)) {
        store = this.storeStore.get(storestring);
      }
    }

    if (appname && appname.length > 0) {
      if (targetelm === null || !targetselector) {
        targetelm = document.createElement("div") as HTMLElement;
        elm.appendChild(targetelm);
      }
      const appWasRun = await this.RunApp(
        appname,
        elm,
        targetelm,
        options,
        appdata,
        store,
        eventstobind
      );
      if (appWasRun) {
      }
    }
  }

  private globalInitiation() {
    if (document.documentElement.dataset.vuemanagerinitialized === "true") {
      return;
    }
    document.createElement("vue-app");

    if (Vuex) {
      Vue.use(Vuex);
    }
    Vue.use(AsyncComputed);
    this.addMixingToVue();
    if (document.readyState === "complete") {
      this.InitiateElements();
    }
    window.addEventListener("global-markupchange", (e: Event) => {
      this.InitiateElements();
    });
    window.addEventListener("DOMContentLoaded", () => {
      this.InitiateElements();
    });

    document.documentElement.dataset.vuemanagerinitialized = "true";
  }
}
