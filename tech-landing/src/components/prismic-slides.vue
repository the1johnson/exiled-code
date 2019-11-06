<template>
  <full-page v-if="prismicRes.length" ref="fullpage" :options="fpopts" id="fullpage">
    <div class="section" v-for="(slide, index) in prismicRes" v-bind:key="slide.id">
      <button v-if="index != prismicRes.length - 1" class="next" @click="$refs.fullpage.api.moveSectionDown()">Next</button>
      <button v-if='index' class="prev" @click="$refs.fullpage.api.moveSectionUp()">Prev</button>
      {{ slide.data.title[0].text }}
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
    licenseKey: 'DBE56275-4E7F4563-B1EC41D0-77DDCB26',
  };
  queryOptions = {
    orderings: '[my.slide.order_position]',
  };

  created() {
    this.getSlides();
  }
  getSlides() {
    this.prismicService.getByType('slide', this.queryOptions).then((res: PrismicApiResponseObject) => {
      this.prismicRes = res.results;
    });
  }
}
</script>
