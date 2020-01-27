<template>
  <header id="header" v-bind:class="{headerTall: scrollPosition < 70, headerShort: scrollPosition > 70}">
    <div class="booj-logo">
      <img src="@/assets/booj_product_rgb.svg">
    </div>
    <ul>
      <li>
        <router-link to="/">
          <span class="iconWrap"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 15 15"><path id="Icon_awesome-play-circle" data-name="Icon awesome-play-circle" d="M8.063.563a7.5,7.5,0,1,0,7.5,7.5A7.5,7.5,0,0,0,8.063.563Zm3.5,8.226L6.239,11.843a.727.727,0,0,1-1.08-.635V4.917a.728.728,0,0,1,1.08-.635l5.323,3.236A.728.728,0,0,1,11.561,8.788Z" transform="translate(-0.563 -0.563)" fill="#fff"/></svg></span><span class="txt">Introducing Booj</span>
        </router-link>
      </li>
      <li>
        <router-link to="/">
          <span class="iconWrap"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 15 15"><path id="Icon_ionic-md-home" data-name="Icon ionic-md-home" d="M9.144,19.5v-5h3.462v5h3.519V12h2.25l-7.5-7.5L3.375,12h2.25v7.5Z" transform="translate(-3.375 -4.5)" fill="#fff"/></svg></span><span class="txt">Home</span>
        </router-link>
      </li>
      <li>
        <router-link to="/tour">
          <span class="iconWrap"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16.875 15"><path id="Icon_awesome-map-marked" data-name="Icon awesome-map-marked" d="M8.438,0A3.691,3.691,0,0,0,4.746,3.691c0,1.648,2.413,4.652,3.337,5.743a.462.462,0,0,0,.709,0c.924-1.09,3.337-4.095,3.337-5.743A3.691,3.691,0,0,0,8.438,0ZM.589,6.327A.938.938,0,0,0,0,7.2v7.334a.469.469,0,0,0,.643.435l4.045-1.841V6.3a8.872,8.872,0,0,1-.623-1.36Zm7.848,4.211a1.4,1.4,0,0,1-1.07-.5c-.576-.68-1.189-1.454-1.743-2.248v5.332L11.25,15V7.793c-.554.794-1.167,1.568-1.743,2.248A1.4,1.4,0,0,1,8.438,10.537Zm7.795-5.816L12.188,6.563V15l4.1-1.639a.937.937,0,0,0,.589-.87V5.157A.469.469,0,0,0,16.232,4.721Z" fill="#fff"/></svg></span><span class="txt">Tour a Section</span>
        </router-link>
      </li>
    </ul>
  </header>
</template>
 
<script>
export default {
  data () {
    return {
      scrollPosition: null,
    }
  },
  methods: {
    updateScroll() {
      this.scrollPosition = window.scrollY
    }
  },
  mounted() {
    window.addEventListener('scroll', this.updateScroll);
  }
}
</script>