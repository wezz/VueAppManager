<template>
  <div class="container">
    Example App 3A with store "sharedstore"<br/>
    substorecounter: {{this.substorecounter}}<br/>
    substoreboolean: {{this.substoreboolean}}<br/>
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
    computed: {
      ...mapGetters({
            substorecounter: "substore/substorecounter",
            substoreboolean: "substore/substoreboolean"
        }),
    },
    mounted() {
      console.log('Example 3A app mounted', this);
      console.log('Example 3A app store', this.$store)
    }
});
</script>