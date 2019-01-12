<template>
<div style="width:100%">
    <el-form :model="infoList" ref="infoList" size="small" label-width="100px" :rules="rules">  
        <el-form-item label="联系人姓名" prop="linkman">
            <el-input class="textarea leftItv"
            type="text"
            placeholder="请输入联系人姓名"
            v-model.number="infoList.linkman">
            </el-input>
        </el-form-item>
        <el-form-item label="联系人手机" prop="phone">
            <el-input class="textarea leftItv"
            type="number"
            placeholder="请输入联系人手机号"
            v-model="infoList.phone">
            </el-input>
        </el-form-item>
        <el-form-item label="省份" prop="province">
            <el-select v-model="infoList.province" placeholder="请选省份" class="leftItv">
                <el-option v-for="item in provinceList" :key="item.value" :label="item.name" :value="item.value"></el-option>
            </el-select>
        </el-form-item>
        <el-form-item label="城市" prop="city">
            <el-select v-model="infoList.city" placeholder="请选城市" class="leftItv">
                <el-option v-for="item in cityList" :key="item.value" :label="item.name" :value="item.value"></el-option>
            </el-select>
        </el-form-item>   
        <el-form-item label="地址" prop="address">
                <el-input class="textarea leftItv"
                type="text"
                placeholder="请输入供应商地址"
                v-model="infoList.address">
                </el-input>
        </el-form-item>
        <el-form-item label="状态" prop="state">
            <el-select v-model="infoList.state" placeholder="请选状态" class="leftItv">
                <el-option v-for="item in store_state" :key="item.value" :label="item.name" :value="item.value"></el-option>
            </el-select>
        </el-form-item>  
        <el-form-item style="margin-left:15px;">
            <el-button type="primary" @click="addMater('infoList')" :loading="btnLoading">下一步</el-button>
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
  name: "edit-supplier",
  props: ["info"],
  data() {
    return {
      infoList: [],
      rules: {
        linkman: [{ required: true, message: "请输入联系人姓名", trigger: "blur" }],
        phone: [{ required: true, message: "请输入联系人手机号", trigger: "blur" }],
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
    resetForm(formName) {
      this.$refs[formName].resetFields();
      for (let attr in this.infoList) {
        this.infoList[attr] = "";
      }
    },
    //跳页-添加原料
    addMater(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.$emit("linkMater", { ...this.infoList });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
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
