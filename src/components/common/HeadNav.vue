<template>
<app-header>
    <nav class="head-nav" slot="topNav">
        <ul class="clearFix">
            <li v-for="(item,key) in list" :key="key" :class="{active:path.indexOf(item.link)!=-1}">        
                <router-link :to="item.link">
                    <!-- <i class="app-icon" :class="'graph-'+item.iconName"></i> -->
                    <span>{{item.title}}</span>
                </router-link>
            </li>
        </ul>
    </nav>  
</app-header>
</template>

<script>
import appHeader from "./Header.vue";
export default {
  name: "app-head-nav",
  props:{
      list:{
          type:Array,
          default:[]
      },
      path:{
          type:String,
          default:'/'
      }
  },
  components:{
      appHeader
  },
  data() {
    return {};
  }
};
</script>

<style>
.head-nav ul li {
  float: left;
}
.head-nav ul li a {
  display: block;
  padding: 0 20px;
  height: 50px;
  line-height: 50px;
  -webkit-transition: all 0.3s ease;
  transition: all 0.3s ease;
}
.head-nav ul li a:hover,
.head-nav ul li.active a {
  background-color: rgba(0, 0, 0, 0.2);
}
.head-nav ul li a i {
  height: 16px;
  width: 16px;
  margin-top: -3px;
}
.head-nav ul li a span {
  margin-left: 6px;
  font-size: 16px;
  color: #fff;
}
</style>
