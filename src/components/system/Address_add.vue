<template>
<div style="width:100%">
    <el-form :model="infoList" ref="infoList" size="small" label-width="100px" :rules="rules">  
        <el-form-item label="省份" prop="province">
            <el-select v-model="infoList.province" filterable allow-create default-first-option  placeholder="请选省份" class="leftItv">
                <el-option v-for="item in provinceList" :key="item.value" :label="item.name" :value="item.value"></el-option>
            </el-select>
        </el-form-item> 
        <el-form-item label="城市" prop="city">
            <el-select v-model="infoList.city" filterable allow-create default-first-option  placeholder="请选城市" class="leftItv">
                <el-option v-for="item in cityList" :key="item.value" :label="item.name" :value="item.value"></el-option>
            </el-select>
        </el-form-item> 
        <el-form-item label="地址" prop="address">
            <el-input class="textarea leftItv"
            type="text"
            placeholder="请输入地址"
            v-model="infoList.address">
            </el-input>
        </el-form-item> 
        <el-form-item style="margin-left:15px;">
            <el-button type="primary" @click="submitForm('infoList')" :loading="btnLoading">提交</el-button>
            <el-button @click="resetForm('infoList')">重置</el-button>
        </el-form-item>
    </el-form>
</div>    
</template>

<script>
import { mapState, mapActions } from "vuex";
import { addData } from "../../common";
import { addAddress } from "../../api";
export default {
  name: "add-address",
  data() {
    return {
      infoList: {
        province: "",
        city: "",
        address: ""
      },
      rules: {
        province: [
          { required: true, message: "请选择省份", trigger: "change" }
        ],
        city: [{ required: true, message: "请选择城市", trigger: "change" }],
        address: [{ required: true, message: "请输入地址", trigger: "blur" }]
      }
    };
  },
  computed: {
    ...mapState("dict", ["cityList", "provinceList"]),
    ...mapState("stateChange", ["btnLoading"])
  },
  methods: {
    ...mapActions("dict", ["getCityList", "getProvinceList"]),
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          addData({
            requestUrl: addAddress,
            params: { ...this.infoList }
          })
            .then(item => {
              this.$emit("reloadEvent", "reload");
              if (item == 1) {
                this.$message({
                  message: "新增成功！",
                  type: "success"
                });
              } else {
                this.$message.error("新增失败");
              }
            })
            .catch(error => {
              this.$message.error("新增失败");
            });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    }
  },
  created() {
    this.getCityList();
    this.getProvinceList();
  }
};
</script>

<style>
.leftItv {
  width: 80%;
}
</style>
