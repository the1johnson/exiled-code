<template>
  <full-page ref="fullpage" :options="fpopts" id="fullpage">
    <div class="section" v-for="slide in prismicRes" v-bind:key="slide.id">
      <button class="next" @click="$refs.fullpage.api.moveSectionDown()">Next</button>
      tester
    </div>
    <div class="section">
      <button class="next" @click="$refs.fullpage.api.moveSectionDown()">Next</button>
      First section ...
    </div>
    <div class="section">
      <button class="prev" @click="$refs.fullpage.api.moveSectionUp()">Prev</button>
      Second section ...
    </div>
  </full-page>
</template>

<script lang="ts">
import { mixins } from 'vue-class-component';
import { Component } from 'vue-property-decorator';
import { PrismicApiResponseObject, PrismicResultsObject } from '@/types/prismic-data';
import PrismicMixin from '@/mixins/prismic.mixin';

@Component
export default class PrismicSlides extends mixins(PrismicMixin) {
  prismicRes: PrismicResultsObject[] = [];
  fpopts = {
    licenseKey: 'x',
  };
  queryOptions = {};

  created() {
    this.getSlides();
  }

  getSlides() {
    this.prismicService.getByType('slide', this.queryOptions).then((res: PrismicApiResponseObject) => {
      this.prismicRes = res.results;
      console.log(this.prismicRes);
    });
  }
}
</script>
