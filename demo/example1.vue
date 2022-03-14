<template>
  <div class="container">
    Example App 1<br/>
    textdata: {{ textdata }}
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
    data() {
      return {
        textdata: "textdata",
      };
    },
    mounted() {
      console.log('Example 1 app mounted', this, this.textdata)
    }
});
</script>