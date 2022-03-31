import Vue from 'vue';
const state = () => ({
    "substorecounter": 1,
    "substoreboolean": true,
});

const getters = {
    substorecounter: (state: any, getters: any, rootState: any) => {
        return state.substorecounter;
    },
    substoreboolean: (state: any, getters: any, rootState: any) => {
        return state.substoreboolean;
    }
};

// Actions may contain business logic and conditions
const actions = {
    ToggleBoolean({ state, commit } : any, payload: any) {
        const newState = !state.substoreboolean;
        commit("setSubstoreboolean", { data: newState });
    },
    IncreaseCounter({ state, commit  } : any, result: any) {
        commit("setSubstorecounter", { data: state.substorecounter+1 });
    },
};

const mutations = {
    setSubstoreboolean(state: any, { data } : any) {
        Vue.set(state, "substoreboolean", data as any);
    },
    setSubstorecounter(state: any, { data } : any) {
        Vue.set(state, "substorecounter", data as any);
    },
    
};

export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations
}
