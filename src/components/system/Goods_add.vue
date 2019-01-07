<template>
<div style="width:100%">
    <el-form :model="infoList" ref="infoList" size="small" label-width="100px" :rules="rules">  
        <el-form-item label="商品分类" prop="catalog_id">
            <el-select v-model="infoList.catalog_id" clearable  placeholder="请选省份" class="leftItv">
                <el-option v-for="item in commodityList" :key="item.id" :label="item.name" :value="item.id"></el-option>
            </el-select>
        </el-form-item> 
        <el-form-item label="父级商品" prop="parent_id">
            <el-select v-model="infoList.parent_id" clearable placeholder="请选父级商品" class="leftItv">
                <el-option v-for="item in parentProduct" :key="item.value" :label="item.name" :value="item.value"></el-option>
            </el-select>
        </el-form-item> 
        <el-form-item label="商品名称" prop="name">
            <el-input class="textarea leftItv"
            type="text"
            placeholder="请输入商品名称"
            v-model="infoList.name">
            </el-input>
        </el-form-item> 
        <el-form-item label="商品编号" prop="num">
            <el-input class="textarea leftItv"
            type="text"
            placeholder="请输入商品编号"
            v-model="infoList.num">
            </el-input>
        </el-form-item> 
        <el-form-item label="商品类型" prop="type">
            <el-select v-model="infoList.type" placeholder="请选商品类型" class="leftItv">
                <el-option v-for="item in productType" :key="item.value" :label="item.name" :value="item.value"></el-option>
            </el-select>
        </el-form-item> 
        <el-form-item label="库存类型" prop="wm_type">
            <el-select v-model="infoList.wm_type" placeholder="请选库存类型" class="leftItv">
                <el-option v-for="item in wareHouse" :key="item.value" :label="item.name" :value="item.value"></el-option>
            </el-select>
        </el-form-item> 
        <el-form-item label="单位" prop="unit">
            <el-select v-model="infoList.unit" placeholder="请选单位" class="leftItv">
                <el-option v-for="item in productUnit" :key="item.value" :label="item.name" :value="item.value"></el-option>
            </el-select>
        </el-form-item> 
        <el-form-item label="属性标签" prop="attribute">
            <el-input class="textarea leftItv"
            type="text"
            placeholder="不同标签请用空格分割"
            v-model="infoList.attribute">
            </el-input>
        </el-form-item> 
        <el-form-item label="成本价" prop="cost_price"> 
            <template>
                <el-input-number v-model="infoList.cost_price" :precision="2" controls-position="right" :min="0"></el-input-number>
            </template>
        </el-form-item> 
        <el-form-item label="门店采购价" prop="purchase_price">
            <template>
                <el-input-number v-model="infoList.purchase_price" :precision="2" controls-position="right" :min="0"></el-input-number>
            </template>
        </el-form-item> 
        <el-form-item label="门店售卖价" prop="sell_price">
            <template>
                <el-input-number v-model="infoList.sell_price" :precision="2" controls-position="right" :min="0"></el-input-number>
            </template>
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
import { addGoods } from "../../api";
export default {
  name: "add-goods",
  data() {
    return {
      infoList: {
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
    ...mapState("dict", ["wareHouse", "commodityList","productUnit","productType","parentProduct"]),
    ...mapState("stateChange", ["btnLoading"])
  },
  methods: {
    ...mapActions("dict", ["getWareHouse", "getCommodityList","getProductUnit","getProductType","getParentProducts"]),
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          addData({
            requestUrl: addGoods,
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
    this.getWareHouse();
    this.getCommodityList();
    this.getProductUnit();
    this.getProductType();
    this.getParentProducts()
  }
};
</script>

<style>
.leftItv {
  width: 80%;
}
</style>
