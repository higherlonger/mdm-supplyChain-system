 <template> 
<div>
    <!-- 导航栏 -->
    <nav class="app-location-wrapper">
        <el-breadcrumb separator="/" class="fl">
            <el-breadcrumb-item :to="{ path: '/sys_setting' }">店长管理</el-breadcrumb-item>
            <el-breadcrumb-item>订单管理</el-breadcrumb-item>
            <el-breadcrumb-item>月订单</el-breadcrumb-item>
        </el-breadcrumb>
        <el-button class="fr" size="small" icon="el-icon-plus" type="primary" plain
            @click="finishOrder">完成</el-button>
    </nav>
    <!-- 树 -->
    <div class="toAdd" style="background-color:#f2f2f2;overflow:hidden;">
      <div style="background-color:#fff;float:left;margin-top:10px;width:30%;">
       <el-input
        placeholder="输入关键字进行过滤"
        v-model="filterText"
        style="margin-bottom:5px"
        >
        </el-input>
        <!-- 树形结构 -->
        <el-tree
        :data="monthTree" 
        show-checkbox
        default-expand-all
        node-key="id" 
        ref="tree"
        highlight-current 
        :filter-node-method="filterNode"
        @check="handleNodeClick"
        :props="defaultProps">
        </el-tree>
        
      </div>
      <!-- 表格 -->
        <span class="timeSel">订货日期</span>
        <el-date-picker
            v-model="beginTime"
            type="date"
            size="small"
            class="time"
            value-format="yyyy-MM-dd"
            placeholder="选择订货日期">
        </el-date-picker>
        <span class="timeSel">到货日期</span>
        <el-date-picker
            v-model="endTime"
            type="date"
            size="small"
            class="time"
            value-format="yyyy-MM-dd"
            placeholder="选择到货日期">
        </el-date-picker>
      <div style="width: 68.2%;float:right;margin-top:10px;">
        <el-table
        :data="tableData"
        border
        ref="table"
        > 
        <el-table-column
            prop="num"
            label="商品编码"
            width="100"
            >
        </el-table-column>
        <el-table-column
            prop="name"
            label="商品名称"
            >
        </el-table-column>
        <el-table-column 
            prop="unit"
            width="100"
            label="单位"> 
        </el-table-column>
        <el-table-column
            prop="order_quantity"
            label="订货数量"
            width="150"
            >
            <template slot-scope="scope">
                <el-input-number v-model="scope.row.order_quantity" :min="1" size="small"></el-input-number>
            </template>
        </el-table-column>
        <el-table-column label="操作" width="100">
            <template slot-scope="scope">
                <el-button
                size="mini"
                @click="removeNode(scope.row.id)"
                >移除</el-button>
            </template>
        </el-table-column>
        </el-table>
      </div>
    </div>
    
</div> 
</template>

<script>
import { commitOrder, editSupp, commitMaterialOrder } from "../../api";
import { getList, getListPage, addData } from "../../common";
import { mapState, mapActions } from "vuex";
export default {
  name: "apply",
  data() {
    return {
      search: {
        state: "",
        keyword: "",
        handle_id: ""
      },
      beginTime: "",
      endTime: "",
      total: 1,
      list: [],
      curPageIndex: 1,
      isShow: !0,
      filterText: "",
      tree: "",
      defaultProps: {
        children: "children",
        label: "name"
      },
      currPageIndex: 1,
      total: 1,
      tableData: [],
      choseIds: [],
      pageSize: 10,
      detail: {},
      dataVal: [],
      quickData: []
    };
  },
  computed: {
    ...mapState("stateChange", ["btnLoading"]),
    ...mapState("dict", ["monthTree"])
  },
  methods: {
    ...mapActions("dict", ["getMonthTree"]),
    //完成订货
    finishOrder() {
      let formatData = {
        order_type: "day",
        order_item: this.tableData,
        order_date: this.beginTime,
        arrive_date: this.endTime
      };
      addData({
        requestUrl: commitMaterialOrder,
        paramsType: 1,
        preData: formatData,
        returnType: 1
      }).then(item => {
        if (item.code == 1) {
          this.tableData=[];
          this.$refs.tree.setCheckedKeys([]);
          this.beginTime="";
          this.endTime="";
          this.$message({
            message: "订货成功！",
            type: "success"
          });
        } else {
          this.$message.error("新增失败");
        }
      });
    },
    getCheckedNodes() {
      this.tableData = [];
      let val = this.$refs.tree.getCheckedNodes();
      let filterVal = val.filter(item => {
        return !item.children;
      });
      this.tableData = filterVal;
    },
    handleNodeClick() {
      this.getCheckedNodes();
    },
    removeNode(_id) {
      this.tableData = this.tableData.filter(item => {
        return item.id != _id;
      });
      this.$refs.tree.setCheckedNodes(this.tableData);
    },
    filterNode(value, data) {
      if (!value) return true;
      return data.search_text.indexOf(value) !== -1;
    },
    keyUpHandle(event) {
      event.stopPropagation();
      if (
        event.keyCode === 13 &&
        event.target.classList.value.search("el-input__inner") !== -1
      ) {
        const inputNumberArr = Array.from(
          this.$refs.table.$el.querySelectorAll(
            ".el-table__body-wrapper .el-input__inner"
          )
        );
        let index = inputNumberArr.findIndex(item => item === event.target);
        if (index === -1) {
          return;
        }
        index = ++index % inputNumberArr.length;
        this.$refs.table.setCurrentRow(this.tableData[index]);
        inputNumberArr[index].focus();
        inputNumberArr[index].select();
      }
      return false;
    },
    //根据条件搜素
    searchHandle(val) {}
  },
  created() {
    this.getMonthTree();
    this.$alert("订货前请先盘点库存，否则会影响订货数据！", "提示", {
      confirmButtonText: "确定",
      callback: action => {
      }
    });
  },
  watch: {
    filterText(val) {
      this.$refs.tree.filter(val);
    }
  },
  mounted() {
    this.$refs.table.$el.addEventListener("keyup", this.keyUpHandle, false);
  },
  beforeDestroy() {
    this.$refs.table.$el.removeEventListener("keyup", this.keyUpHandle);
  }
};
</script>

<style>
.length {
  width: 51.6%;
}
.leftLen {
  width: 40%;
}
.selectLen {
  width: 78%;
}
.page {
  text-align: center;
  padding: 15px;
}
.timeSel {
  margin: 10px 10px 0 20px;
}
.time {
  margin-top: 10px;
}
</style>

