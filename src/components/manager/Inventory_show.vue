<template>
<div style="width:100%">
    <el-form :model="info" ref="form" label-width="100px" size="small">
        <el-form-item label="单据号" prop="num">
            <span class="form-record-show">{{ info.num }}</span>
        </el-form-item>
        <el-form-item label="盘点时间" prop="count_date">
            <span class="form-record-show">{{ info.count_date }}</span>
        </el-form-item>
        <el-form-item label="备注" prop="remark">
            <span class="form-record-show">{{ info.remark }}</span>
        </el-form-item>
        <el-form-item label="盘点项" prop="count_item">
            <el-table :data="gridData">
                <el-table-column property="date" label="日期" width="150"></el-table-column>
                <el-table-column property="name" label="姓名" width="200"></el-table-column>
                <el-table-column property="address" label="地址"></el-table-column>
            </el-table>
        </el-form-item>
    </el-form>
</div>
</template>

<script>
import { getAdById } from "../../api";
import { getDetailById } from "../../common";
export default {
  name: "show-inventory",
  props: ["info"],
  data() {
    return {
      form: {},
      gridData: [
        {
          date: "2016-05-02",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1518 弄"
        },
        {
          date: "2016-05-04",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1518 弄"
        },
        {
          date: "2016-05-01",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1518 弄"
        },
        {
          date: "2016-05-03",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1518 弄"
        }
      ]
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
.form-record-show {
  width: 78%;
}
</style>
