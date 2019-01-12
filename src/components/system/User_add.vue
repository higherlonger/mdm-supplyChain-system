<template>
    <div style="width:100%">
       <el-form :model="form" :rules="rules" ref="form" label-width="100px" size="small">
          <el-form-item label="用户名" prop="username">
              <el-input v-model="form.username" clearable placeholder="请输入用户姓名" class="leftItv"></el-input>
          </el-form-item>
          <el-form-item label="密码" prop="password">
              <el-input v-model="form.password" clearable placeholder="请输入密码" class="leftItv"></el-input>
          </el-form-item>
          <el-form-item label="昵称" prop="nickname">
              <el-input v-model="form.nickname" clearable placeholder="请输入昵称" class="leftItv"></el-input>
          </el-form-item>
          <el-form-item label="性别" prop="sex">
              <el-select v-model="form.sex" placeholder="请选性别" class="leftItv">
                  <el-option v-for="(item, key) in sexList" :key="key" :label="item.name" :value="item.value"></el-option>
              </el-select>
          </el-form-item>
          <el-form-item label="电话" prop="phone">
              <el-input v-model="form.phone" clearable placeholder="请输入电话" class="leftItv"></el-input>
          </el-form-item>
          <el-form-item label="角色" prop="role_id">
              <el-select v-model="form.role_id" clearable placeholder="请选角色" class="leftItv">
                  <el-option v-for="(item, key) in roleList" :key="key" :label="item.name" :value="item.value"></el-option>
              </el-select>
          </el-form-item> 
          <el-form-item label="备注" prop="remark">
              <el-input type="texteare" v-model="form.remark" clearable placeholder="请输入备注" class="leftItv"></el-input>
          </el-form-item>
          <el-form-item>
              <el-button type="primary" @click="submitForm('form')" :loading="btnLoading">提交</el-button>
              <el-button @click="resetForm('form')">重置</el-button>
          </el-form-item>
       </el-form>
    </div>
</template>

<script>
import { addUser } from "../../api";
import { mapState, mapActions } from "vuex";
export default {
  name: "sys-add",
  data() {
    return {
      form: {
        username: "",
        password:"",
        nickname:"",
        sex:"",
        phone:"",
        role_id:"",
        remark:""
      },
      sexList:[{
        name:'男',
        value:'1'
      },{
        name:'女',
        value:'0'
      }],
      rules: {
        username: [
          { required: true, message: "请输入用户姓名", trigger: "blur" }
        ],
        password: [{ required: true, message: "请输入密码", trigger: "blur" }],
        nikename: [{ required: true, message: "请输入昵称", trigger: "blur" }],
        sex: [{ required: true, message: "请输入性别", trigger: "blur" }],
        phone: [{ required: true, message: "请输入手机号", trigger: "blur" }],
        role_id: [{ required: true, message: "请选择角色", trigger: "blur" }]
      }
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
          this.okAdd();
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    resetForm(formName) {
       this.$refs[formName].resetFields();
    },
    //增加用户
    async okAdd() {
      try {
        const response=await addUser({...this.form})
        if(response.code==1){
          this.$message({
            message: '新增成功！',
            type: 'success'
          });
          this.closePanle();
        }
      } catch (error) {
        console.log(error);
      }
    },
    closePanle(){
      this.$emit('reloadEvent','reload')
    }
  },
  created() {
    this.getRoleList();
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
