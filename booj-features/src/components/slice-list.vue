<template>
  <div>
    <prismic-image v-if="graphic" :field="graphic"/>
    <h1 v-if="title">{{title}}</h1>
    <prismic-rich-text v-if="description" :field="description"/>
    <prismic-rich-text v-if="preListDescription" :field="preListDescription"/>
    <ul v-if="checkList">
      <li v-for="(item, index) in checkList" v-bind:key="index">
        {{item.list_item}}
      </li>
    </ul>
    <prismic-link v-if="buttonLink && buttonTxt" :field="buttonLink">
      {{buttonTxt}}
    </prismic-link>
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