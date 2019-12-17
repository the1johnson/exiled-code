<template>
  <full-page v-if="prismicRes.length" ref="fullpage" :options="fpopts" id="fullpage">
    <div class="section" :class="getClass(slide.data.layout_type)" v-for="(slide) in prismicRes" v-bind:key="slide.id">
      <prismic-rich-text :field="slide.data.description" />
      <!-- <button v-if="index != prismicRes.length - 1" class="next" @click="$refs.fullpage.api.moveSectionDown()">Next</button>
      <button v-if='index' class="prev" @click="$refs.fullpage.api.moveSectionUp()">Prev</button> -->
      <div class="slideTitle">{{ $prismic.richTextAsPlain(slide.data.title) }}</div>
      <div>{{ $prismic.richTextAsPlain(slide.data.description) }}</div>
      <img v-if="slide.data.image.url" :src="slide.data.image.url">
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
    navigation: true,
    afterLoad: this.afterLoad,
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
  afterLoad() {
    console.log('af hit');
  }
  getClass(layoutType:string) {
    let cName = '';

    switch (layoutType) {
    case 'Intro':
      cName = 'layoutIntro';
      break;

    case 'Explore':
      cName = 'layoutExplore';
      break;

    case 'Image Left':
      cName = 'layoutImageLeft';
      break;

    case 'Image Right':
      cName = 'layoutImageRight';
      break;

    case '2 Column Text':
      cName = 'layoutTwoColTxt';
      break;

    case 'Contact Form Left':
      cName = 'layoutContactForm';
      break;

    default:
      cName = 'layoutImageLeft';
    }

    return cName;
  }
}
</script>

<style lang="scss">
@import "@/styles/styles.scss";
</style>
