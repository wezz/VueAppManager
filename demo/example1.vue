<template>
  <div class="container">
    Example App 1
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
    name: 'example1app',
    mounted() {
      console.log('Example 1 app mounted')
    }
});
</script>