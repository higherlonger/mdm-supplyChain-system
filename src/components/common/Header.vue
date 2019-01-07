<template>
    <div class="app-header clearFix">
        <div class="app-head-logo fl">
            <router-link to='/'>面对面供应链管理系统</router-link>
        </div>
        <div class="app-top-nav fl">
            <slot name="topNav"></slot>
        </div>
        <div class="user-setting fr">
            <app-dropdown-menu placement="right">
                <span slot="title">{{username}}</span>
                <div slot="list" class="user-setting-list">
                    <ul>
                        <li @click.stop="toPersonal">个人设置</li>
                        <li @click.stop="logout">安全退出</li>
                    </ul>
                </div>        
            </app-dropdown-menu>
        </div>
    </div>
</template>

<script>
import AppDropdownMenu from "./DropdownMenu.vue";
import { getToken } from "../../assets/js/auth";
import { mapState, mapActions } from "vuex";
export default {
  name: "app-header",
  data() {
    return {
      username: "未登录"
    };
  },
  methods: {
    // ...mapActions('app', ['createLogout']),
    toPersonal() {},
    logout() {}
  },
  computed: {
    ...mapState("app", ["loginInfo"])
  },
  components: {
    AppDropdownMenu
  },
  created() {
    this.username = this.loginInfo.name || getToken();
  }
};
</script>

<style>
.app-header {
  height: 50px;
  line-height: 50px;
  padding: 0 10px 0 20px;
  background-color: #1890ff;
}
.app-head-logo {
  width: 180px;
  color: #fff;
  font-size: 16px;
}
.app-head-logo a {
  color: #fff;
}

.user-setting {
  height: 50px;
}
.user-setting-list {
  padding: 6px 0;
}
.user-setting-list ul li {
  line-height: 32px;
  padding: 0 15px;
  cursor: pointer;
}
.user-setting-list ul li:hover {
  background: #409eff;
  color: #fff;
}
</style>

