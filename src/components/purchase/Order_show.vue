<template>
<div style="width:100%">
    <el-form :model="detailList" ref="detailList" label-width="100px" size="small">
        <el-form-item label="原料编码" prop="num">
            <span class="form-record-show">{{ detailList.num }}</span>
        </el-form-item>
        <el-form-item label="原料名称" prop="name">
            <span class="form-record-show">{{ detailList.name }}</span>
        </el-form-item>
        <el-form-item label="单位" prop="out_unit">
            <span class="form-record-show">{{ detailList.out_unit }}</span>
        </el-form-item>
        <el-form-item label="规格" prop="attribute">
            <span class="form-record-show">{{ detailList.attribute }}</span>
        </el-form-item>
        <el-form-item label="存储条件" prop="storage_condition">
            <span class="form-record-show">{{ detailList.storage_condition }}天</span>
        </el-form-item>
        <el-form-item label="到货周期" prop="security_time">
            <span class="form-record-show">{{ detailList.security_time }}</span>
        </el-form-item>
        <el-form-item label="成本价" prop="cost_price">
            <span class="form-record-show">{{ detailList.cost_price }}</span>
        </el-form-item>
        <el-form-item label="售价" prop="purchase_price">
            <span class="form-record-show">{{ detailList.purchase_price }}</span>
        </el-form-item>
        <el-form-item label="购买数量" prop="quantity">
            <span class="form-record-show">{{ detailList.quantity }}</span>
        </el-form-item>
        <el-form-item label="供应商" prop="supplier_name">
            <span class="form-record-show">{{ detailList.supplier_name }}</span>
        </el-form-item>
        <el-form-item label="备注" prop="remark">
            <span class="form-record-show">{{ detailList.remark }}</span>
        </el-form-item>
    </el-form>
</div>
</template>

<script>
import { getAdById } from "../../api";
import { getDetailById } from "../../common";
export default {
  name: "show-order",
  props: ["detailList"],
  data() {
    return {
     
    };
  },
  created() {
    
  }
};
</script>

<style>
.form-record-show{
  width:78%;
}
</style>
