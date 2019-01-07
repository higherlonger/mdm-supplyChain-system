<template>
<div style="width:100%">
    <el-form :model="infoList" ref="infoList" size="small" label-width="100px" :rules="rules">  
        <el-form-item label="仓库编号" prop="num">
            <el-input class="textarea leftItv"
            type="text"
            placeholder="请输入名称"
            v-model="infoList.num">
            </el-input>
        </el-form-item>
        <el-form-item label="仓库名称" prop="name">
            <el-input class="textarea leftItv"
            type="text"
            placeholder="请输入名称"
            v-model="infoList.name">
            </el-input>
        </el-form-item> 
        <el-form-item label="仓库类型" prop="type">
            <el-select v-model="infoList.type" placeholder="请选择类型" class="leftItv">
                <el-option v-for="item in wareHouse" :key="item.value" :label="item.name" :value="item.value"></el-option>
            </el-select>
        </el-form-item> 
        <el-form-item label="所在城市" prop="city">
            <el-select v-model="infoList.city" placeholder="请选择城市" class="leftItv">
                <el-option v-for="item in cityList" :key="item.value" :label="item.name" :value="item.value"></el-option>
            </el-select>
        </el-form-item> 
        <el-form-item label="仓库状态" prop="state">
            <el-select v-model="infoList.state" placeholder="请选择状态" class="leftItv">
                <el-option v-for="item in store_state" :key="item.value" :label="item.name" :value="item.value"></el-option>
            </el-select>
        </el-form-item> 
        <el-form-item label="备注" prop="remark">
            <el-input class="textarea leftItv"
            type="text"
            placeholder="请输入备注"
            v-model="infoList.remark">
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
import { getWhDetail, editWarehouse } from "../../api";
import { mapState, mapActions } from "vuex";
export default {
  name: "edit-role",
  props: ["recordId"],
  data() {
    return {
      infoList: {},
      rules: {
        num: [{ required: true, message: "请输入编号", trigger: "blur" }],
        name: [{ required: true, message: "请输入名称", trigger: "blur" }],
        type: [{ required: true, message: "请选择类型", trigger: "change" }],
        city: [{ required: true, message: "请选择城市", trigger: "change" }],
        state: [{ required: true, message: "请选择状态", trigger: "change" }]
      },
      defaultProps: {
        children: "children",
        label: "label"
      }
    };
  },
  computed: {
    ...mapState("dict", ["store_state", "cityList", "wareHouse"]),
    ...mapState("stateChange", ["btnLoading"])
  },
  methods: {
    ...mapActions("dict", ["getStoreState", "getCityList", "getWareHouse"]),
    async getList() {
      try {
        const response = await getWhDetail({ id: this.recordId });
        if (response.code == 1) {
          this.infoList = response.data;
        }
      } catch (error) {
        console.log(error);
      }
    },
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
    async okEdit() {
      try {
        const response = await editWarehouse({
          ...this.infoList
        });
        if (response.code == 1) {
          this.$message({
            message: "修改成功！",
            type: "success"
          });
          this.reloadData();
        }
      } catch (error) {
        console.log(error);
      }
    },
    reloadData() {
      this.$emit("reloadEvent", "reload");
    }
  },
  created() {
    this.getStoreState();
    this.getCityList();
    this.getWareHouse();
    this.getList();
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
