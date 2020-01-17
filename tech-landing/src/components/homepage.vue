<template>
  <div id="Homepage">
    Homepage Prismic Component will go here maybe? Or just pull the data here
  </div>
</template>
<script lang="ts">
import { mixins } from 'vue-class-component';
import { Component } from 'vue-property-decorator';
import { PrismicApiResponseObject, PrismicResultsObject } from '@/types/prismic-data';
import PrismicMixin from '@/mixins/prismic.mixin';

@Component
export default class Homepage extends mixins(PrismicMixin) {
}
</script>
