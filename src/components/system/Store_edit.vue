<template>
    <div style="width:100%">
        <el-form :model="infoList" ref="infoList" size="small" label-width="100px" :rules="rules">   
            <el-form-item label="门店名称" prop="name">
                    <el-input class="textarea leftItv"
                    type="text"
                    placeholder="请输入门店名称"
                    v-model="infoList.name">
                    </el-input>
            </el-form-item> 
            <el-form-item label="门店电话" prop="phone">
                    <el-input class="textarea leftItv"
                    type="text"
                    placeholder="请输入门店电话"
                    v-model="infoList.phone">
                    </el-input>
            </el-form-item>
            <el-form-item label="门店状态" prop="state_text">
                <el-select v-model="infoList.state" clearable placeholder="请选状态" class="leftItv">
                    <el-option v-for="item in store_state" :key="item.value" :label="item.name" :value="item.value"></el-option>
                </el-select>
            </el-form-item>  
            <el-form-item label="省份/城市" prop="province">
                <el-select v-model="infoList.province" filterable allow-create default-first-option  placeholder="请选省份" class="leftPro">
                    <el-option v-for="item in provinceList" :key="item.value" :label="item.name" :value="item.value"></el-option>
                </el-select>
                <el-select v-model="infoList.city" filterable allow-create default-first-option placeholder="请选城市" class="leftPro">
                    <el-option v-for="item in cityList" :key="item.value" :label="item.name" :value="item.value"></el-option>
                </el-select>
            </el-form-item>   
            <el-form-item label="门店地址" prop="address">
                    <el-input class="textarea leftItv"
                    type="text"
                    placeholder="请输入门店地址"
                    v-model="infoList.address">
                    </el-input>
            </el-form-item>
            <el-form-item label="门店描述" prop="remark">
                    <el-input class="textarea leftItv"
                    type="textarea"
                    placeholder="请输入门店描述"       
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
import {EditStoreInfo} from '../../api'
import { mapState, mapActions } from "vuex";
export default {
  name: "edit-group",
  props: ["info","type"],
  data() {
    return {
      infoList: "",
      value:"1",
      rules:{
          name: [
            { required: true, message: '请输入门店名称', trigger: 'blur' }
          ],
          state_text: [
            { required: true, message: '请选择门店状态', trigger: 'change' }
          ],
          province: [
            { required: true, message: '请输入所在省份/城市', trigger: 'change' }
          ],
          address: [
            { required: true, message: '请输入门店地址', trigger: 'blur' }
          ]
      }
    };
  },
  computed: {
    ...mapState("dict", ["cityList","provinceList","store_state"]),
    ...mapState('stateChange',['btnLoading'])
  },
  methods: {
    ...mapActions("dict", ["getCityList","getProvinceList","getStoreState"]),
    async submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) { 
            this.type=='edit'?  this.editData():this.addData();       
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    async editData(){
        try {
            const response=await EditStoreInfo({
                 id:this.info.id,
                 ...this.infoList
            })
            if(response.code==1){
                this.closePanle();
                this.$message({
                    message: '修改成功！',
                    type: 'success'
                });
            }else{
                this.$message.error('修改失败！');
            }
        } catch (error) {
            console.log(error);
        }
    },
    async addData(){

    },
    resetForm(formName){
        this.$refs[formName].resetFields();
        for(var attr in this.infoList){
            this.infoList[attr]=""
        }
    },
    closePanle(){
        this.$emit('reloadEvent','reload')
    }
  },
  created() {
    this.getCityList();
    this.getProvinceList();
    this.getStoreState();
    this.infoList = JSON.parse(JSON.stringify(this.info));
  }
};
</script>

<style>
.leftItv{
    width:80%
}
.leftPro{
    width: 39%;
    margin-right: 11px;
    float: left;
}
</style>
