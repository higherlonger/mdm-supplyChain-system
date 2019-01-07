<template>
<div style="width:100%">
    <el-form :model="info" ref="info" label-width="100px" size="small">
        <el-form-item label="名称" prop="name">
            <span class="form-record-show">{{ info.name }}</span>
        </el-form-item>
        <el-form-item label="编号" prop="num">
            <span class="form-record-show">{{ info.num }}</span>
        </el-form-item>
        <el-form-item label="单位" prop="unit">
            <span class="form-record-show">{{ info.unit }}</span>
        </el-form-item>
        <el-form-item label="成本价" prop="cost_price">
            <span class="form-record-show">{{ info.cost_price }}</span>
        </el-form-item>
        <el-form-item label="售价" prop="purchase_price">
            <span class="form-record-show">{{ info.purchase_price }}</span>
        </el-form-item>
        <el-form-item label="备注" prop="remark">
            <span class="form-record-show">{{ info.remark }}</span>
        </el-form-item>
    </el-form>
</div>
</template>

<script>
import { getAdById } from "../../api";
import { getDetailById } from "../../common";
export default {
  name: "show-goods",
  props: ["info"],
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
