<template>
  <div class="container">
    Example App 2<br/>
    this.options.enabled: {{this.options.enabled}}<br/>
    this.options.optionvalue: {{this.options.optionvalue}}<br/>
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
export default Vue.extend({
    name: 'example2app',
    data() {
      return {
        
      };
    },
    mounted() {
      console.log('Example 2 app mounted', this);
      console.log('Example 2 app options', this.options);
    }
});
</script>