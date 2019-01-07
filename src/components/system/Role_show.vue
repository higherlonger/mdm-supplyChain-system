<template> 
<div style="width:100%">
    <el-form :model="form" ref="form" label-width="100px" size="small">
        <el-form-item label="名称" prop="name">
            <span class="form-record-show">{{ form.name }}</span>
        </el-form-item>
        <el-form-item label="状态" prop="state_text">
            <span class="form-record-show">{{ form.state_text }}</span>
        </el-form-item>
        <el-form-item label="备注" prop="remark">
            <span class="form-record-show">{{ form.remark }}</span>
        </el-form-item>
        <el-form-item label="修改时间" prop="updatedate">
            <span class="form-record-show">{{ form.updatedate }}</span>
        </el-form-item>
        <el-form-item label="权限" prop="remark">
            <el-tree
            :data="limitList"
            show-checkbox
            default-expand-all
            node-key="id"
            ref="tree"
            highlight-current
            :props="defaultProps">
            </el-tree>
        </el-form-item>
    </el-form>
</div>
</template>

<script>
import { getDetailById } from "../../api";
import { mapState, mapActions } from "vuex";
export default {
  name: "show-role",
  props: ["recordId"],
  data() {
    return {
      form: {},
      tree: [],
      defaultProps: { 
        children: "children",
        label: "title"
      }
    };
  },
  computed: {
    ...mapState("dict", ["limitList"])
  },
  methods: {
    ...mapActions("dict", ["getLimitList"]),
    async getList() {
      try {
        const response = await getDetailById({ id: this.recordId });
        if (response.code == 1) {
          this.form = response.data;
          this.setCheckedKeys(response.data.menu_ids)
        }
      } catch (error) {
        console.log(error);
      }
    },
    setCheckedKeys(val){
        this.$refs.tree.setCheckedKeys(val);
    }
  },
  created() {
    this.getList();
    this.getLimitList();
  }
};
</script>

<style>
</style>
