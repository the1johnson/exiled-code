<template>
  <div id="app">
    <full-page ref="fullpage" :options="options" id="fullpage">
      <div class="section">
        <button class="next" @click="$refs.fullpage.api.moveSectionDown()">Next</button>
        First section ...
      </div>
      <div class="section">
        <button class="prev" @click="$refs.fullpage.api.moveSectionUp()">Prev</button>
        Second section ...
      </div>
    </full-page>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
export default class App extends Vue {}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
