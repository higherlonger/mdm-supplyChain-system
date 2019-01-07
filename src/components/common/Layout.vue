<template>
    <el-container class="is-vertical my-app">
        <app-head-nav style="height:50px" :list="navList" :path="routerPath"></app-head-nav>
        <el-container>
            <app-sidebar :list="sidebarList" :path="routerPath"></app-sidebar>
            <el-main>
                <transition>
                    <router-view class="view-wrapper"></router-view>
                </transition>
            </el-main>
        </el-container>
    </el-container>
</template>

<script>
import AppHeadNav from "./HeadNav.vue";
import AppSidebar from "./Sidebar.vue";
import { mapState, mapActions } from "vuex";
export default {
  name: "app-layout",
  data() {
    return {
      sidebarList: []
    };
  },
  methods: {
    setNavInfo() {
      let info = this.navList.find(
        item => item.link === "/" + this.routerPath.split("/")[1]
      );
      if (!info) {
        info = this.navList[0] || [];
      }
      this.sidebarList = info.children;
    }
  },
  computed: {
    ...mapState("app", ["navList"]),
    routerPath() {
      return this.$route.path;
    }
  },
  created() {
    this.setNavInfo();
  },
  components: {
    AppHeadNav,
    AppSidebar
  },
  watch: {
    $route(to, from) {
      this.setNavInfo();
    }
  }
};
</script>

<style>
.my-app > .el-container {
  height: calc(100vh - 50px);
  display: flex;
}
.my-app .el-main {
  position: relative;
  background-color: #f2f2f2;
  flex: 1;
  padding: 10px;
}
.my-app .view-wrapper {
  position: absolute;
  left: 10px;
  right: 10px;
  /* min-height: calc(100vh - 70px); */
  background-color: #fff;
}

/**
 * 路由组件切换动画
 */
#app .router-enter {
  opacity: 0;
  -webkit-transform: translate3d(0, 25px, 0);
  transform: translate3d(0, 25px, 0);
}
#app .router-enter-to {
  opacity: 1;
  -webkit-transform: translate3d(0, 0, 0);
  transform: translate3d(0, 0, 0);
}
#app .router-leave {
  opacity: 1;
}
#app .router-leave-to {
  opacity: 0;
}
#app .router-enter-to,
#app .router-leave {
  opacity: 1;
  -webkit-transform: translate3d(0, 0, 0);
  transform: translate3d(0, 0, 0);
}
#app .router-enter-active,
#app .router-leave-active {
  -webkit-transition: all 0.5s ease-out;
  transition: all 0.5s ease-out;
}
</style>
