<template>
    <div style="width:100%">
        <el-form :model="form" :rules="rules" ref="form" label-width="100px" size="small">
            <el-form-item label="门店名称" prop="name">
                <el-input v-model="form.name" clearable placeholder="请输入门店名称" class="leftItv"></el-input>
            </el-form-item>
            <el-form-item label="门店电话" prop="phone">
                <el-input v-model="form.phone" clearable placeholder="请输入门店电话" class="leftItv"></el-input>
            </el-form-item>
            <el-form-item label="省份/城市" prop="province">
                <el-select v-model="form.province" filterable allow-create default-first-option placeholder="请选省份" class="leftPro">
                    <el-option v-for="(item, key) in provinceList" :key="key" :label="item.name" :value="item.value"></el-option>
                </el-select>
                <el-select v-model="form.city" filterable allow-create default-first-option placeholder="请选城市" class="leftPro">
                    <el-option v-for="(item, key) in cityList" :key="key" :label="item.name" :value="item.value"></el-option>
                </el-select>
            </el-form-item> 
            <el-form-item label="门店地址" prop="address">
                <el-input v-model="form.address" clearable placeholder="请输入门店地址" class="leftItv"></el-input>
            </el-form-item>
            <el-form-item label="门店描述" prop="remark">
                <el-input v-model="form.remark" type="textarea" :rows="4" class="leftItv" clearable placeholder="请输入门店描述..."></el-input>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="submitForm('form')" :loading="btnLoading">关联商品</el-button>
                <el-button @click="resetForm('form')">重置</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>

<script>
import {addStore,relationGoods} from '../../api'
import {mapState,mapActions} from 'vuex'

export default {
  name: "add-store",
  data() {
    return {
      form: { 
          name:"",
          phone:"",
          address:"",
          province:"吉林",
          city:"长春",
          remark:""
      },
      rules: {
        name: [{ required: true, message: "请输入门店名称", trigger: "blur" }],
        state_text: [
          { required: true, message: "请选择门店状态", trigger: "change" }
        ],
        province: [
          { required: true, message: "请输入所在省份/城市", trigger: "change" }
        ],
        address: [
          { required: true, message: "请输入门店地址", trigger: "blur" }
        ]
      }
    };
  },
  computed:{
    ...mapState("dict", ["cityList","provinceList","store_state"]),
    ...mapState('stateChange',['btnLoading'])
  },
  methods:{
    ...mapActions("dict", ["getCityList","getProvinceList","getStoreState"]),
    submitForm(formName){
        this.$refs[formName].validate((valid) => {
          if (valid) {
             this.okSubmit();
          } else {
            return false;
          }
        });
    },
    resetForm(formName){
        this.$refs[formName].resetFields();
        for(var attr in this.form){
            this.form[attr]=""
        }
    },
    //新增门店
    async okSubmit(){
        try {
            const response=await addStore({
                ...this.form
            })
            if(response.code==1){
                this.closePanle();
                this.$emit('relateGoods', this.form)
            }else{
                this.$message.error('新增失败！');
            }
        } catch (error) {
            console.log(error)
        }
    },
    closePanle(){
        this.$emit('reloadEvent', 'reload')
    }
  },
  created(){
    this.getCityList();
    this.getProvinceList();
    this.getStoreState();
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
