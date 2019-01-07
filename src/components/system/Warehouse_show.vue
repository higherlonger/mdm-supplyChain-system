<template>
    <div style="width:100%">
        <el-form :model="form" ref="form" label-width="100px" size="small">
            <el-form-item label="仓库编号" prop="num">
                <span class="form-record-show">{{ form.num }}</span>
            </el-form-item>
            <el-form-item label="仓库名称" prop="name">
                <span class="form-record-show">{{ form.name }}</span>
            </el-form-item>
            <el-form-item label="仓库类型" prop="type_text">
                <span class="form-record-show">{{ form.type_text }}</span>
            </el-form-item>
            <el-form-item label="仓库状态" prop="state_text">
                <span class="form-record-show">{{ form.state_text }}</span>
            </el-form-item>
            <el-form-item label="所在城市" prop="city_text">
                <span class="form-record-show">{{ form.city_text }}</span>
            </el-form-item>
            <el-form-item label="仓库描述" prop="remark">
                <span class="form-record-show">{{ form.remark }}</span>
            </el-form-item>
        </el-form>
    </div>
</template>

<script>
import {getWhDetail} from '../../api'
export default {
  name: "show-warehouse",
  props:['recordId'],
  data() {
    return {
        form:{}
    };
  },
  methods:{
      async getList(){
          try {
              const response=await getWhDetail({id:this.recordId});
              if(response.code==1){
                  this.form=response.data
              }else{
                  this.$message.error(response.message);
              }
          } catch (error) {
              console.log(error)
          }
      }
  },
  created(){
      this.getList()
  }
};
</script>

<style>
.form-record-show{
    width:78%;
}
</style>
