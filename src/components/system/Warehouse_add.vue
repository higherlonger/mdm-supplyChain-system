<template>
    <div style="width:100%">
       <el-form :model="form" ref="form" size="small" label-width="100px" :rules="rules">  
        <el-form-item label="仓库编号" prop="num">
            <el-input class="textarea leftItv"
            type="text"
            placeholder="请输入名称"
            v-model="form.num">
            </el-input>
        </el-form-item>
        <el-form-item label="仓库名称" prop="name">
            <el-input class="textarea leftItv"
            type="text"
            placeholder="请输入名称"
            v-model="form.name">
            </el-input>
        </el-form-item> 
        <el-form-item label="仓库类型" prop="type">
            <el-select v-model="form.type" placeholder="请选择类型" class="leftItv">
                <el-option v-for="item in wareHouse" :key="item.value" :label="item.name" :value="item.value"></el-option>
            </el-select>
        </el-form-item> 
        <el-form-item label="所在城市" prop="city">
            <el-select v-model="form.city" placeholder="请选择城市" class="leftItv">
                <el-option v-for="item in cityList" :key="item.value" :label="item.name" :value="item.value"></el-option>
            </el-select>
        </el-form-item> 
        <el-form-item label="备注" prop="remark">
            <el-input class="textarea leftItv"
            type="textarea"
            placeholder="请输入备注"
            v-model="form.remark">
            </el-input>
        </el-form-item> 
        <el-form-item style="margin-left:15px;">
            <el-button type="primary" @click="submitForm('form')" :loading="btnLoading">提交</el-button>
            <el-button @click="resetForm('form')">重置</el-button>
        </el-form-item>
    </el-form>
    </div>
</template>

<script>
import { addWarehouse } from "../../api";
import { mapState, mapActions } from "vuex";
export default {
  name: "add-warehouse",
  data() {
    return {
      form: {
        username: "",
        password: "",
        nickname: "",
        sex: "",
        phone: "",
        role_id: "",
        remark: ""
      },
      rules: {
        num: [{ required: true, message: "请输入编号", trigger: "blur" }],
        name: [{ required: true, message: "请输入名称", trigger: "blur" }],
        type: [{ required: true, message: "请选择类型", trigger: "change" }],
        city: [{ required: true, message: "请选择城市", trigger: "change" }],
        state: [{ required: true, message: "请选择状态", trigger: "change" }]
      }
    };
  },
  computed: {
    ...mapState("dict", ["store_state", "cityList", "wareHouse"]),
    ...mapState("stateChange", ["btnLoading"])
  },
  methods: {
    ...mapActions("dict", ["getStoreState", "getCityList", "getWareHouse"]),
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
        const response = await addWarehouse({ ...this.form });
        if (response.code == 1) {
          this.$message({
            message: "新增成功！",
            type: "success"
          });
          this.closePanle();
        }
      } catch (error) {
        console.log(error);
      }
    },
    closePanle() {
      this.$emit("reloadEvent", "reload");
    }
  },
  created() {
    this.getStoreState();
    this.getCityList();
    this.getWareHouse();
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
