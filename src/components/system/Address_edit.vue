<template>
<div style="width:100%">
    <el-form :model="infoList" ref="infoList" size="small" label-width="100px" :rules="rules">   
        <el-form-item label="省份" prop="province">
            <el-select v-model="infoList.province" clearable placeholder="请选状态" class="leftItv">
                <el-option v-for="item in provinceList" :key="item.value" :label="item.name" :value="item.value"></el-option>
            </el-select>
        </el-form-item>
        <el-form-item label="城市" prop="city">
            <el-select v-model="infoList.city" clearable placeholder="请选状态" class="leftItv">
                <el-option v-for="item in cityList" :key="item.value" :label="item.name" :value="item.value"></el-option>
            </el-select>
        </el-form-item>   
        <el-form-item label="地址" prop="address">
                <el-input class="textarea leftItv"
                type="text"
                placeholder="请输入门店名称"
                v-model="infoList.address">
                </el-input>
        </el-form-item>
        <el-form-item label="状态" prop="state">
            <el-select v-model="infoList.state" placeholder="请选状态" class="leftItv">
                <el-option v-for="item in store_state" :key="item.value" :label="item.name" :value="item.value"></el-option>
            </el-select>
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
import { editData } from "../../common";
import { editAddress } from "../../api";
export default {
  name: "edit-address",
  props: ["info"],
  data() {
    return {
      infoList: [],
      rules: {
        province: [
          { required: true, message: "请选择省份", trigger: "change" }
        ],
        city: [{ required: true, message: "请选择城市", trigger: "change" }],
        address: [{ required: true, message: "请输入地址", trigger: "blur" }],
        state: [{ required: true, message: "请选择状态", trigger: "change" }]
      }
    };
  },
  computed: {
    ...mapState("dict", ["cityList", "provinceList", "store_state"]),
    ...mapState("stateChange", ["btnLoading"])
  },
  methods: {
    ...mapActions("dict", ["getCityList", "getProvinceList", "getStoreState"]),
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          editData({
            requestUrl: editAddress,
            params: { ...this.infoList, id: this.info.id }
          })
            .then(item => {
              this.$emit("reloadEvent", "reload");
              if (item == 1) {
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
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
      for (let attr in this.infoList) {
        this.infoList[attr] = "";
      }
    }
  },
  created() {
    this.infoList = JSON.parse(JSON.stringify(this.info));
    this.getStoreState();
    this.getCityList();
    this.getProvinceList();
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
