 <template>
<div style="width:100%">
    <el-input
      class="searchText"
      placeholder="输入关键字进行过滤"
      v-model="filterText">
    </el-input>
    <el-tree
      :data="inventoryTree" 
      show-checkbox
      default-expand-all
      node-key="id"
      @check="checkNodes"
      ref="tree"
      :filter-node-method="filterNode"
      highlight-current
      :props="defaultProps">
    </el-tree>
</div>
</template>

<script>
import { mapState, mapActions } from "vuex";
export default {
  name: "add-formula",
  props: [],
  data() {
    return {
      filterText: "",
      defaultProps: {
        children: "children",
        label: "name"
      }
    };
  },
  watch: {
    filterText(val) {
      this.$refs.tree.filter(val);
    }
  },
  computed: {
    ...mapState("dict", ["inventoryTree"]),
    ...mapState("stateChange", ["btnLoading"])
  },
  methods: {
    ...mapActions("dict", ["getInventoryTree"]),
    filterNode(value, data) {
      if (!value) return true;
      return data.search_text.indexOf(value) !== -1;
    },
    checkNodes(){
      //  console.log(this.$refs.tree.getCheckedNodes());
       this.$emit('reloadEvent',this.$refs.tree.getCheckedNodes())
    }
  },
  created() {
    this.getInventoryTree();
  }
};
</script>

<style>
.searchText{
  width: 70%;
  margin-bottom:10px;
}
</style>
