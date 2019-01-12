<template>
<div style="width:100%">
    <el-form :model="info" ref="info" label-width="100px" size="small">
        <el-form-item label="所属分类" prop="catalog_id">
            <span class="form-record-show">{{ info.catalog_id }}</span>
        </el-form-item>
        <el-form-item label="原材料名称" prop="name">
            <span class="form-record-show">{{ info.name }}</span>
        </el-form-item>
        <el-form-item label="编码" prop="num">
            <span class="form-record-show">{{ info.num }}</span>
        </el-form-item>
        <el-form-item label="订单类型" prop="order_type_text">
            <span class="form-record-show">{{ info.order_type_text }}</span>
        </el-form-item>
        <el-form-item label="采购类型" prop="type">
            <span class="form-record-show">{{ info.type }}</span>
        </el-form-item>
        <el-form-item label="计量单位" prop="min2mid_num">
            <span class="form-record-show">{{ info.min2mid_num }}/{{info.min_unit}}</span>
        </el-form-item>
        <el-form-item label="装箱单位" prop="mid2max_num">
            <span class="form-record-show">{{ info.mid2max_num }}/{{info.mid_unit}}</span>
        </el-form-item>
        <el-form-item label="提货单位" prop="out_unit">
            <span class="form-record-show">{{ info.out_unit }}</span>
        </el-form-item>
        <el-form-item label="规格" prop="attribute">
            <span class="form-record-show">{{ info.attribute }}</span>
        </el-form-item>
        <el-form-item label="成本价" prop="cost_price">
            <span class="form-record-show">{{ info.cost_price }}</span>
        </el-form-item>
        <el-form-item label="采购价" prop="purchase_price">
            <span class="form-record-show">{{ info.purchase_price }}</span>
        </el-form-item>
        <el-form-item label="品牌" prop="brand">
            <span class="form-record-show">{{ info.brand }}</span>
        </el-form-item>
        <el-form-item label="型号" prop="model">
            <span class="form-record-show">{{ info.model }}</span>
        </el-form-item>
        <el-form-item label="存储条件" prop="storage_condition_text">
            <span class="form-record-show">{{ info.storage_condition_text }}</span>
        </el-form-item>
        <el-form-item label="保质期" prop="shelf_life_num">
            <span class="form-record-show">{{ info.shelf_life_num }}/{{info.shelf_life_unit_text}}</span>
        </el-form-item>
        <el-form-item label="到货周期" prop="security_time">
            <span class="form-record-show">{{ info.security_time }} 天</span>
        </el-form-item>
        <el-form-item label="供应商" prop="supplierNames">
            <span class="form-record-show">{{ info.supplierNames }}</span>
        </el-form-item>
        <el-form-item label="备注" prop="remark">
            <span class="form-record-show">{{ info.remark }}</span>
        </el-form-item>
    </el-form>
</div>
</template>
 
<script>
import { getDetailById } from "../../common";
export default {
  name: "show-material",
  props: ["info"],
  data() {
    return {
      form: {}
    };
  },
  created() {
    console.log(this.info)
  }
};
</script>

<style>
.form-record-show{
  width:78%;
}
</style>
