<template>
  <div class="sliceSupport">
    <div class="container slide-wrapper">  
      <div class="text-right">
        <h1 v-if="title" class="title">{{title}}</h1>
        <prismic-rich-text v-if="description" :field="description" class="description" />
        <div v-if="checkList">
          <div v-for="(item, index) in checkList" v-bind:key="index" class="repeat-text">
            <prismic-image v-if="item.repeatable_icon" :field="item.repeatable_icon"/>  
            <div class="list-text">
              <h2 v-if="item.repeatable_title">{{item.repeatable_title}}</h2>
              <prismic-rich-text v-if="item.repeatable_description" :field="item.repeatable_description" class="list-text-description" />
            </div>  
          </div>
        </div>
      </div>
      <div class="text-left">
        <div class="box">
          <h2 v-if="whiteBoxTitleTop" class="white-box-title">{{whiteBoxTitleTop}}</h2>
          <prismic-rich-text v-if="whiteBoxDescriptionTop" :field="whiteBoxDescriptionTop" class="white-box-description" />
          <hr>
          <h2 v-if="whiteBoxTitleBottom" class="white-box-title">{{whiteBoxTitleBottom}}</h2>
          <prismic-rich-text v-if="whiteBoxDescriptionBottom" :field="whiteBoxDescriptionBottom" class="white-box-description" />
          <prismic-link v-if="buttonLink && buttonTxt" :field="buttonLink" class="tour-button">
            {{buttonTxt}}
          </prismic-link>
        </div>  
      </div>
    </div>
    <div class="bg-img-red">
      <img src="@/assets/bg-rect-bottom.svg">
    </div>  
  </div>
</template>
 
<script>
export default {
  props: ['title', 'description', 'whiteBoxTitleTop', 'whiteBoxDescriptionTop', 'whiteBoxTitleBottom', 'whiteBoxDescriptionBottom', 'buttonLink', 'buttonTxt', 'checkList'],
  data () {
    return {
    }
  }
}
</script>