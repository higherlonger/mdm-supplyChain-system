<template>
    <div style="width:100%">
        <el-form :model="infoList" ref="infoList" size="small" label-width="100px" :rules="rules"> 
          <el-form-item label="用户名" prop="username">
              <el-input v-model="infoList.username" clearable placeholder="请输入用户名" class="leftItv"></el-input>
          </el-form-item>
          <el-form-item label="密码" prop="password">
              <el-input v-model="infoList.password" clearable placeholder="请输入密码" class="leftItv"></el-input>
          </el-form-item>
          <el-form-item label="昵称" prop="nickname">
              <el-input v-model="infoList.nickname" clearable placeholder="请输入昵称" class="leftItv"></el-input>
          </el-form-item>
          <el-form-item label="性别" prop="sex">
              <el-select v-model="infoList.sex" placeholder="请选性别" class="leftItv">
                  <el-option v-for="(item, key) in sex" :key="key" :label="item.name" :value="item.value"></el-option>
              </el-select>
          </el-form-item>
          <el-form-item label="电话" prop="phone">
              <el-input v-model="infoList.phone" clearable placeholder="请输入电话" class="leftItv"></el-input>
          </el-form-item>
          <el-form-item label="角色" prop="role_id">
              <el-select v-model="infoList.role_id" placeholder="请选角色" class="leftItv">
                  <el-option v-for="(item, key) in roleList" :key="key" :label="item.name" :value="item.value"></el-option>
              </el-select>
          </el-form-item> 
          <el-form-item label="备注" prop="remark">
              <el-input v-model="infoList.remark" type="textarea" placeholder="请输入备注" class="leftItv"></el-input>
          </el-form-item>
          <el-form-item>
              <el-button type="primary" @click="submitForm('infoList')" :loading="btnLoading">提交</el-button>
              <el-button @click="resetForm('form')">重置</el-button>
          </el-form-item>
        </el-form>
    </div>
</template>

<script>
import { mapState, mapActions } from "vuex";
import { editUser } from "../../api";
export default {
  name: "sys-edit",
  props: ["info"],
  data() {
    return {
      infoList: [],
      rules: {},
      sex:[{
        name:'男',
        value:'1'
      },{
        name:'女',
        value:'0'
      }]
    };
  },
  computed: {
    ...mapState("dict", ["roleList"]),
    ...mapState('stateChange',['btnLoading'])
  },
  methods: {
    ...mapActions("dict", ["getRoleList"]),
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.okEdit();
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
      for(let attr in this.infoList){
        this.infoList[attr]='';
      }
    },
    //提交修改
    async okEdit() {
      try {
        const response = await editUser({
          id: this.infoList.id,
          ...this.infoList
        });
        if (response.code == 1) {
          this.$message({
            message: "修改成功！",
            type: "success"
          });
          this.closePanle();
        }else{
            this.$message.error('修改失败！');
        }
      } catch (error) {
        console.log(error);
      }
    },
    closePanle(){
        this.$emit('reloadEvent','reload');
    }
  },
  created() {
    this.getRoleList();
    this.infoList = JSON.parse(JSON.stringify(this.info));
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
