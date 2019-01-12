<template>
<div style="width:100%">
    <el-form :model="infoList" ref="infoList" size="small" label-width="100px" :rules="rules">  
        <el-form-item label="所属分类" prop="parent_id">
            <el-select v-if="state==0" v-model="infoList.parent_id" filterable allow-create default-first-option  placeholder="请选分类" class="leftItv">
                <el-option v-for="item in materialListAry" :key="item.value" :label="item.name" :value="item.value"></el-option>
            </el-select>
            <el-select v-else v-model="infoList.parent_id" filterable allow-create default-first-option  placeholder="请选分类" class="leftItv">
                <el-option v-for="item in materialListAry" :key="item.value" :label="item.name" :value="item.value"></el-option>
            </el-select>
        </el-form-item> 
        <el-form-item label="分类名称" prop="name">
            <el-input class="textarea leftItv"
            type="text"
            placeholder="请输入分类名称"
            v-model="infoList.name">
            </el-input>
        </el-form-item> 
        <el-form-item label="分类编码" prop="num">
            <el-input class="textarea leftItv"
            type="text"
            placeholder="请输入分类编码"
            v-model="infoList.num">
            </el-input>
        </el-form-item> 
        <el-form-item label="备注" prop="remark">
            <el-input class="textarea leftItv"
            type="textarea"
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
import { mapState, mapActions } from "vuex";
import { addData } from "../../common";
import { addCatalog } from "../../api";
export default {
  name: "add-class",
  props:['state'],
  data() {
    return {
      infoList: {
       
      },
      rules: {
        parent_id: [
          { required: true, message: "分类不能为空", trigger: "change" }
        ],
        name: [{ required: true, message: "分类名称不能为空", trigger: "blur" }],
        num: [{ required: true, message: "分类编号不能为空", trigger: "blur" }]
      }
    };
  },
  computed: {
    ...mapState("dict", ["cityList", "materialListAry","commodityListAry"]),
    ...mapState("stateChange", ["btnLoading"])
  },
  methods: {
    ...mapActions("dict", ["getCityList", "getMaterialListMatAry","getMaterialListComAry"]),
    submitForm(formName) {
      let typeVal;
      if(this.state==0){
        typeVal='material';
      }else if(this.state==1){
        typeVal='product';
      }
      this.$refs[formName].validate(valid => {
        if (valid) {
          addData({
            requestUrl: addCatalog,
            params: { ...this.infoList,type:typeVal }
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
    this.getMaterialListMatAry();
    this.getMaterialListComAry();
  }
};
</script>

<style>
.leftItv {
  width: 80%;
}
</style>
