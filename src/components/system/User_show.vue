<template>
    <div style="width:100%">
        <el-form :model="form" ref="form" label-width="100px" size="small">
            <el-form-item label="用户名" prop="username">
                <span class="form-record-show">{{ form.username }}</span>
            </el-form-item> 
            <el-form-item label="密码" prop="password">
                <span class="form-record-show">{{ form.password }}</span>
            </el-form-item>
            <el-form-item label="昵称" prop="nickname">
                <span class="form-record-show">{{ form.nickname }}</span>
            </el-form-item>
            <el-form-item label="电话" prop="phone">
                <span class="form-record-show">{{ form.phone }}</span>
            </el-form-item>
            <el-form-item label="角色" prop="role">
                <span class="form-record-show">{{ form.role }}</span>
            </el-form-item>
            <el-form-item label="创建时间" prop=" updatedate">
                <span class="form-record-show">{{ form. updatedate }}</span>
            </el-form-item>
            <el-form-item label="备注" prop="remark">
                <span class="form-record-show">{{ form.remark }}</span>
            </el-form-item>
        </el-form>
    </div>
</template>

<script>
import {getInfoById} from '../../api'
export default {
  name: "sys-show",
  props:['recordId'],
  data() {
    return {
        form:{

        }
    };
  },
  methods:{
      async getDetail(){
          try {
              const response=await getInfoById({
                   id:this.recordId
              })
              if(response.code==1){
                  this.form=response.data
              }else{
                  this.$message.error('查询失败！');
              }
          } catch (error) {
              console.log(error)
          }
      }
  },
  created(){
      this.getDetail();
  }
};
</script>

<style>
</style>
