 <template> 
<div>
    <!-- 导航栏 --> 
    <nav class="app-location-wrapper">
        <el-breadcrumb separator="/" class="fl">
            <el-breadcrumb-item :to="{ path: '/sys_setting' }">店长管理</el-breadcrumb-item>
            <el-breadcrumb-item>订单管理</el-breadcrumb-item>
            <el-breadcrumb-item>商品订货</el-breadcrumb-item>
        </el-breadcrumb>
        <el-button class="fr" size="small" icon="el-icon-plus" type="primary" plain
            @click="okToAdd">完成</el-button>
        <el-dropdown class="fr" style="margin-right:10px" @command="handleCommand">
          <el-button plain size="small">
            导入订货<i class="el-icon-arrow-down el-icon--right"></i>
          </el-button>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item command="download">下载模板</el-dropdown-item>
            <el-dropdown-item command="upload">
              <template>
                <el-upload
                  class="upload-demo"
                  action="/mgr/works/pc/orderCtrl/createProductOrderExp"
                  :show-file-list="false"
                  :on-success="handleAvatarSuccess"
                  :on-error="handleAvatarFail"
                  accept=".xlsx,.xls"
                  > 
                  <span size="small">点击上传</span>
                </el-upload>
              </template>
            </el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
        
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
        :data="getGoodsTree.children"
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
import {
  commitOrder,
  editSupp,
  commitMaterialOrder,
  downloadCommodityExp
} from "../../api";
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
      beginTime: new Date(),
      endTime: new Date(new Date().getTime() + 3*24*60*60*1000),
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
    ...mapState("dict", ["getGoodsTree", "inventoryTree"])
  },
  methods: {
    ...mapActions("dict", ["getGoodsTreeList", "getInventoryTree"]),
    //切换弹窗显示
    okToAdd() {
      if (this.tableData.length == 0) {
        this.$message.error("请选择原料订货");
        return;
      }
      if (this.beginTime == "") {
        this.$message.error("请选择订货日期");
        return;
      }
      if (this.endTime == "") {
        this.$message.error("请选择到货日期");
        return;
      }
      let formatData = {
        order_date: this.beginTime,
        arrive_date: this.endTime,
        order_type: "day",
        order_item: this.tableData
      };
      addData({
        requestUrl: commitOrder,
        paramsType: 1,
        preData: formatData,
        returnType: 1
      }).then(item => {
        if (item.code == 1) {
          this.$message({
            message: "订货成功！",
            type: "success"
          });
          this.tableData = [];
          this.beginTime = "";
          this.endTime = "";
          this.$refs.tree.setCheckedKeys([]);
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
    //文件上传成功
    handleAvatarSuccess(res, file) {
      if (res.code == 1) {
        this.$message({
          message: "上传成功！",
          type: "success"
        });
      } else if (res.code == 0) {
        const h = this.$createElement;
        this.$alert(`<span>上传失败，请下载文件查看原因：<a href=${res.data.down_url}>${res.data.down_url}</a></span>`, '上传失败', {
          dangerouslyUseHTMLString: true
        });
      }
    },
    //文件上传失败
    handleAvatarFail(err, file, fileList){ 
      console.log(err, file, fileList)
    },
    //根据条件搜素
    searchHandle(val) {},
    //导入订货
    handleCommand(command) {
      if (command == "download") {
        //下载模板
        this.downLoadExp();
      }
    },
    //下载模板
    downLoadExp() {
      addData({
        requestUrl: downloadCommodityExp,
        params: {},
        paramsType: 2
      }).then(item => {
        if (item.code == 0) {
          this.$message.error("导出失败！");
        } else {
          window.open(item.data.down_url, "_blank");
        }
      });
    }
  },
  created() {
    this.getGoodsTreeList();
    this.getInventoryTree();
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

