<template>
    <div v-if="toggle">
        <el-dialog 
        :title="title" 
        :visible.sync="isShow"
        :top="top"
        :custom-class="customClass"
         @close="$emit('update:visible', false)"
        >
        <slot></slot>
        </el-dialog>
    </div>
</template>

<script>
export default {
  name: "app-dialog",
  props:{
      title: {
      type: String,
      default: "提示信息"
    },
    visible: {
      type: Boolean,
      default: false
    },
    top: {
      type: String,
      default: "15vh"
    },
    customClass: {
      type: String,
      default: ""
    }   
  },
  data() {
    return {
        isShow:"",
        toggle:""
    };
  },
  watch:{
      visible(val){
          this.isShow=this.visible;
          this.toggle=this.visible;
      }
  }
};
</script>

<style>
</style>
