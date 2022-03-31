<template>
  <div class="container">
    Example App 3B with store "sharedstore"<br/>
    substorecounter: {{this.substorecounter}}<br/>
    substoreboolean: {{this.substoreboolean}}<br/>
    <button v-on:click="toggleStoreValue">Toggle boolean</button>
    <button v-on:click="addToStoreCounter">Increase counter</button>
  </div>
</template>

<style lang="css" scoped>
.container {
  border:1px solid grey;
  padding:1em;
}
</style>

<script lang="ts">
import Vue from 'vue';
import { mapGetters } from 'vuex';
export default Vue.extend({
    name: 'example3app',
    data() {
      return {
        textdata: "textdata",
      };
    },
    methods: {
      toggleStoreValue() {
        this.$store.dispatch("substore/ToggleBoolean");
      },
      addToStoreCounter() {
        this.$store.dispatch("substore/IncreaseCounter");
      }
    },
    computed: {
      ...mapGetters({
            substorecounter: "substore/substorecounter",
            substoreboolean: "substore/substoreboolean"
        }),
    },
    mounted() {
      console.log('Example 3B app mounted', this);
    }
});
</script>