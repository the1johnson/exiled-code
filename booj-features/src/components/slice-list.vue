<template>
  <div class="sliceList">
    <div class="container slide-wrapper">
      <div class="top-text">
        <h1 v-if="title" class="title">{{title}}</h1>
        <prismic-rich-text v-if="description" :field="description" class="description"/>
      </div>
      <div class="two-column">
        <div class="img-wrapper">
          <prismic-image v-if="graphic" :field="graphic"/>
        </div>  
        <div class="contentWrap">
          <prismic-rich-text v-if="preListDescription" :field="preListDescription" class="pre-list-description" />
          <ul v-if="checkList" class="custom-bullet check">
            <li v-for="(item, index) in checkList" v-bind:key="index">
              {{item.list_item}}
            </li>
          </ul>
          <prismic-link v-if="buttonLink && buttonTxt" :field="buttonLink" class="tour-button">
            {{buttonTxt}}
          </prismic-link>
        </div>
      </div>
    </div>
  </div>
</template>
 
<script>
export default {
  props: ['graphic', 'title', 'description', 'preListDescription', 'buttonTxt', 'buttonLink', 'checkList'],
  data () {
    return {
    }
  }
}
</script>