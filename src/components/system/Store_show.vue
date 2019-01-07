<template>
    <div style="width:100%">
        <el-form :model="form" ref="form" label-width="100px" size="small">
            <el-form-item label="所在城市" prop="city">
                <span class="form-record-show">{{ form.city }}</span>
            </el-form-item>
            <el-form-item label="门店名称" prop="name">
                <span class="form-record-show">{{ form.name }}</span>
            </el-form-item>
            <el-form-item label="门店地址" prop="address">
                <span class="form-record-show">{{ form.address }}</span>
            </el-form-item>
            <el-form-item label="门店电话" prop="phone">
                <span class="form-record-show">{{ form.phone }}</span>
            </el-form-item>
            <el-form-item label="门店描述" prop="remark">
                <span class="form-record-show">{{ form.remark }}</span>
            </el-form-item>
            <el-form-item label="关联商品" prop="product_list">
                <el-table :data="form.product_list">
                    <el-table-column property="num" label="编号" width="80"></el-table-column>
                    <el-table-column property="name" label="商品名称"></el-table-column>
                    <el-table-column property="cost_price" label="出厂成本价" width="90"></el-table-column>
                    <el-table-column property="purchase_price" label="门店采购价" width="90"></el-table-column>
                    <el-table-column property="sell_price" label="门店售卖价" width="90"></el-table-column>
                </el-table>         
            </el-form-item>
        </el-form>
    </div>
</template> 

<script>
import {getStoreById} from '../../api'
export default {
  name: "app-show-staff",
  props: ["recordId"],
  data() {
    return {
      form: {}
    };
  },
  methods: {
      async getDetail(){
          try {
              const response=await getStoreById({id:this.recordId});
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
      this.getDetail();
  }
};
</script>

<style>
</style>
