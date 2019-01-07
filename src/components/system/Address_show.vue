<template>
<div style="width:100%">
    <el-form :model="form" ref="form" label-width="100px" size="small">
        <el-form-item label="地址" prop="address">
            <span class="form-record-show">{{ form.address }}</span>
        </el-form-item>
        <el-form-item label="省份" prop="province">
            <span class="form-record-show">{{ form.province }}</span>
        </el-form-item>
        <el-form-item label="城市" prop="city">
            <span class="form-record-show">{{ form.city }}</span>
        </el-form-item>
        <el-form-item label="状态" prop="state">
            <span class="form-record-show">{{ form.state }}</span>
        </el-form-item>
    </el-form>
</div>
</template>

<script>
import { getAdById } from "../../api";
import { getDetailById } from "../../common";
export default {
  name: "show-address",
  props: ["recordId"],
  data() {
    return {
      form: {}
    };
  },
  created() {
    getDetailById({
      requestUrl: getAdById,
      params: { id: this.recordId }
    }).then(item => {
      this.form = item;
    });
  }
};
</script>

<style>
.form-record-show{
  width:78%;
}
</style>
