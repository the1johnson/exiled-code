<template>
  <div id="header">
    Header info
    <ul>
      <li><router-link to="/">Home</router-link></li>
      <li><router-link to="/tour">Section Tour</router-link></li>
    </ul>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';

@Component({
  components: {
  },
})
export default class HeaderComponent extends Vue {}
</script>
