<template>
<div style="width:100%">
    <el-form :model="info" ref="infoList" size="small" label-width="100px">   
        <el-form-item label="昵称" prop="nickname">
            <el-input class="textarea leftItv"
                type="text"
                placeholder="请输入昵称"
                v-model="info.nickname">
                </el-input>
        </el-form-item>
        <el-form-item label="手机号" prop="phone">
            <el-input class="textarea leftItv"
                type="text"
                placeholder="请输入手机号"
                v-model="info.phone">
                </el-input>
        </el-form-item>   
        <el-form-item label="密码" prop="password">
                <el-input class="textarea leftItv"
                type="text"
                placeholder="请输入密码"
                v-model="info.password">
                </el-input>
        </el-form-item>
        <el-form-item style="margin-left:15px;">
            <el-button type="primary" @click="submitForm()" :loading="btnLoading">提交</el-button>
            <el-button @click="resetForm()">重置</el-button>
        </el-form-item>
    </el-form>
</div>
</template>

<script>
import { mapState, mapActions } from "vuex";
import { getListPage, addData } from "../../common";
import { getToken } from "../../assets/js/auth";
import { personset, updatePerson } from "../../api";
export default {
  name: "person-set",
  data() {
    return {
      info: {
        nickname: "",
        phone: "",
        password: "******",
        id: ""
      }
    };
  },
  computed: {
    ...mapState("stateChange", ["btnLoading"])
  },
  methods: {
    ...mapActions("app", ["createLoginInfo"]),
    submitForm(formName) {
      addData({
        requestUrl: updatePerson,
        params: { ...this.info },
        paramsType: 2
      })
        .then(item => {
          if (item.code == 1) {
            this.$emit("reloadEvent",this.info.nickname);
            this.createLoginInfo({
              name: this.info.nickname
            });
            this.$message({
              message: "修改成功！",
              type: "success"
            });
          } else {
            this.$message.error("修改失败");
          }
        })
        .catch(error => {
          this.$message.error("修改失败");
        });
    },
    resetForm() {
      for (let attr in this.info) {
        this.info[attr] = "";
      }
    }
  },
  created() {
    getListPage({
      requestUrl: personset
    }).then(item => {
      this.info.nickname = item.list.nickname;
      this.info.phone = item.list.phone;
      this.info.id = item.list.id;
    });
  }
};
</script>

<style>
.leftItv {
  width: 80%;
}
.leftPro {
  width: 39%;
  margin-right: 11px;
  float: left;
}
</style>
