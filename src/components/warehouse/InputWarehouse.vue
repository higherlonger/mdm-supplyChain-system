 <template>
    <div style="overflow:hidden;">
      <!-- 导航栏 -->
        <nav class="app-location-wrapper">
            <el-breadcrumb separator="/" class="fl">
                <el-breadcrumb-item :to="{ path: '/sys_setting' }">仓库管理</el-breadcrumb-item>
                <el-breadcrumb-item>库存管理</el-breadcrumb-item>
                <el-breadcrumb-item>入库</el-breadcrumb-item>
            </el-breadcrumb>
            <el-button class="fr" size="small" icon="el-icon-plus" type="primary" plain v-show="view.listView"
            @click="topHandle()">新增入库</el-button>
            <el-button class="fr" size="small" type="primary" plain v-show="view.addView"
            @click="okWrite()">完成入库</el-button>
            <el-button class="fr" size="small"  plain v-show="view.addView"
            @click="cancel()">取消入库</el-button>
            <el-button class="fr" size="small" icon="el-icon-back" type="primary" plain v-show="view.detailView"
            @click="toPre()">后退</el-button>
        </nav>
        <!-- 入库记录 -->
        <div style="background-color:#fff;" v-show="view.listView">
          <!-- 搜索条件 -->
          <div class="component-top">
              <div class="search-title fl">搜索：</div>
              <el-input
                  placeholder="请输入单据号"
                  prefix-icon="el-icon-search"
                  class="fl"
                  size="small"
                  @keyup.enter.native="searchHandle"
                  style="width:220px;margin-right:10px;"
                  v-model="search.keyword">
              </el-input>
              <div class="search-title fl">时间：</div>
                  <el-date-picker
                    v-model="timeSlot"
                    class="fl"
                    size="small"
                    @change="searchHandle('time')"
                    type="daterange"
                    value-format="yyyy-MM-dd"
                    range-separator="至"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期">
                  </el-date-picker>
              <el-button class="fl" style="margin-left: 10px;" size="small"
                  @click.stop="searchHandle('all')">
                  全部
              </el-button>
          </div>
          <!-- 表格 -->
          <div class="component-main">
              <el-table
                  :data="list"
                  size="small"
                  stripe
                  border
                  ref="table"
                  v-loading="btnLoading"
                  style="width: 100%">
                  <el-table-column
                  prop="num"
                  label="单据号"
                  width="150"
                  >
                  </el-table-column>
                  <el-table-column
                  prop="create_date"
                  label="盘点时间"
                  width="150"
                  >
                  </el-table-column>
                  <el-table-column
                  prop="remark"
                  label="备注"
                  >
                  <template slot-scope="scope">
                    <el-popover trigger="hover" placement="top">
                        <p>{{ scope.row.remark }}</p>
                        <div slot="reference" class="name-wrapper">
                          <p size="medium">{{ scope.row.remark }}</p>
                        </div>
                    </el-popover>
                  </template>
                  </el-table-column>
                  <el-table-column label="操作" width="150">
                      <template slot-scope="scope">
                          <el-button
                          size="mini"
                          @click="recordHandle(scope.row)">查看</el-button>
                      </template>
                  </el-table-column>
              </el-table>
              <!-- 分页 -->
              <el-pagination
              @current-change="handleCurrentChange"
              :page-size="10"
              class="pagination"
              background
              layout="prev, pager, next, jumper"
              :total="this.total">
              </el-pagination>
          </div>
        </div>
        <!-- 入库项 -->
        <div class="toAdd" style="background-color:#f2f2f2;overflow:hidden;" v-show="view.addView">
            <div style="background-color:#fff;float:left;margin-top:10px;width:26%;">
            <el-input
                placeholder="输入关键字进行过滤"
                v-model="filterText"
                style="margin-bottom:5px"
                >
                </el-input>
                <!-- 树形结构 -->
                <el-tree
                :data="inputWarehouseTree.children" 
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
            <div style="width: 73.2%;float:right;margin-top:10px;">
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
                    prop="batch_num"
                    label="商品批号"
                    >
                    <template slot-scope="scope">
                        <el-input v-model="scope.row.batch_num" placeholder="请输入批号" size="small"></el-input>
                    </template>
                </el-table-column>
                <el-table-column
                    prop="warehouse_list"
                    label="入库仓库"
                    >
                    <template slot-scope="scope">
                        <el-select v-model="scope.row.warehouse_id" placeholder="请选择" size="mini">
                            <el-option
                            v-for="item in scope.row.warehouse_list"
                            :key="item.value"
                            :label="item.name"
                            :value="item.value">
                            </el-option>
                        </el-select>
                    </template>
                </el-table-column>
                <el-table-column
                    prop="order_quantity"
                    label="入库数量" 
                    width="150"
                    >
                    <template slot-scope="scope">
                        <el-input-number v-model="scope.row.order_quantity" :min="1" size="small"></el-input-number>
                    </template>
                </el-table-column>
                <el-table-column 
                    prop="min_unit"
                    width="100"
                    label="单位">
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

        <!-- 查看入库项 -->
        <div style="background-color:#fff;" v-show="view.detailView">
          <el-form :model="row" ref="form" label-width="100px" size="small" style="margin-top:20px">
              <el-form-item label="单据号" prop="num">
                  <span class="form-record-show">{{ row.num }}</span>
              </el-form-item>
              <el-form-item label="盘点时间" prop="create_date">
                  <span class="form-record-show">{{ row.create_date }}</span>
              </el-form-item>
              <el-form-item label="备注" prop="remark">
                  <span class="form-record-show">{{ row.remark }}</span>
              </el-form-item>
              <el-form-item label="盘点项" prop="count_item">
                  <el-table 
                    :data="test"
                    stripe
                    border
                    style="width: 100%">
                    <el-table-column
                      prop="num"
                      label="原料编码"
                     >
                    </el-table-column>
                    <el-table-column
                      prop="name"
                      label="原料名称"
                      >
                    </el-table-column>
                    <el-table-column
                      prop="batch_num"
                      label="批号">
                    </el-table-column>
                    <el-table-column
                      prop="warehouse_name"
                      label="仓库名称"
                      >
                    </el-table-column>
                    <el-table-column
                      prop="order_quantity"
                      label="入库数量">
                    </el-table-column>
                    <el-table-column
                      prop="min_unit"
                      label="单位">
                    </el-table-column>
                    
                        
                  </el-table>
              </el-form-item>
          </el-form>
        </div>
    </div>
</template>

<script>
import { mapState, mapActions } from "vuex";
import {
  getMaterialTree,
  getInputWarehouseList,
  stopMarters,
  addInven,
  addInputWarehouseTree
} from "../../api";
import { getList, getListPage, addData } from "../../common";
import AppDialog from "../common/AppDialog.vue";
export default {
  name: "tree",
  data() {
    return {
      timeSlot: "",
      list: [],
      tree: [],
      defaultProps: {
        children: "children",
        label: "name"
      },
      search: {
        keyword: "",
        from_date: "",
        to_date: ""
      },
      searchList: {
        keyword: ""
      },
      tableData: [],
      filterText: "",
      ids: "",
      total: 1,
      curPageIndex: 1,
      pageSize: 10,
      remark: "",
      upToData: {},
      view: {
        listView: !0,
        addView: !1,
        detailView: !1
      },
      row: {},
      test: []
    };
  },
  computed: {
    ...mapState("dict", ["inputWarehouseTree"]),
    ...mapState("stateChange", ["btnLoading"])
  },
  methods: {
    ...mapActions("dict", ["getInputWarehouseTree"]),
    handleCurrentChange(val) {
      this.curPageIndex = val;
      getList({
        requestUrl: getInputWarehouseList,
        currPage: this.curPageIndex,
        params: { ...this.search, pageSize: this.pageSize }
      }).then(item => {
        this.total = item.total;
        this.list = item.list;
      });
    },
    topHandle() {
      this.view.listView = !this.view.listView;
      this.view.addView = !this.view.addView;
    },
    cancel() {
      this.view.listView = !this.view.listView;
      this.view.addView = !this.view.addView;
    },
    okWrite() {
      for (let i = 0; i < this.tableData.length; i++) {
        if (
          this.tableData[i].batch_num == "" ||
          this.tableData[i].warehouse_id == "" ||
          this.tableData[i].order_quantity == ""
        ) {
          this.$message.error("请正确填写批号/入库仓库/入库数量！");
          return;
        }
      }
      this.$prompt("请输入入库单备注", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消"
      })
        .then(({ value }) => {
          if (value == null) {
            this.remark = "";
          } else {
            this.remark = value;
          }
          this.filterUpData();
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "取消"
          });
        });
    },
    recordHandle(_row) {
      this.view.listView = !this.view.listView;
      this.view.detailView = !this.view.detailView;
      this.row = _row;
      this.test = this.row.order_item.material_list;
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
    searchHandle(val) {
      if (val == "all") {
        this.search.keyword = "";
        this.search.from_date = "";
        this.search.to_date = "";
        this.timeSlot = "";
      }
      if (val == "time") {
        this.search.from_date = this.timeSlot[0];
        this.search.to_date = this.timeSlot[1];
      }
      getList({
        requestUrl: getInputWarehouseList,
        params: { ...this.search, pageSize: this.pageSize }
      }).then(item => {
        this.total = item.total;
        this.list = item.list;
      });
    },
    toPre() {
      this.view.listView = !this.view.listView;
      this.view.detailView = !this.view.detailView;
    },
    //处理提交的数据格式
    filterUpData() {
      this.upToData = {
        remark: this.remark,
        order_item: this.tableData
      };
      //提交-请求
      addData({
        requestUrl: addInputWarehouseTree,
        preData: this.upToData,
        paramsType: 1
      }).then(item => {
        if (item == 1) {
          this.$message({
            message: "新增成功！",
            type: "success"
          });
          this.view.listView = !this.view.listView;
          this.view.addView = !this.view.addView;
          this.tableData = [];
          this.$refs.tree.setCheckedKeys([]);
          getList({
            requestUrl: getInputWarehouseList,
            params: { ...this.search, pageSize: this.pageSize }
          }).then(item => {
            this.total = item.total;
            this.list = item.list;
          });
        } else {
          this.$message.error("新增失败");
        }
      });
    },
    //每一项的备注
    addRemark(_row) {
      let text = "请输入" + _row.name + "备注：";
      this.$prompt(text, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消"
      })
        .then(({ value }) => {
          _row.item_remark = value;
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "取消输入"
          });
        });
    }
  },
  watch: {
    filterText(val) {
      this.$refs.tree.filter(val);
    }
  },
  mounted() {
    this.$refs.table.$el.addEventListener("keyup", this.keyUpHandle, false);
  },
  created() {
    this.getInputWarehouseTree();
    //获取列表
    getList({
      requestUrl: getInputWarehouseList,
      params: { ...this.search, pageSize: this.pageSize }
    }).then(item => {
      this.total = item.total;
      this.list = item.list;
    });
  }
};
</script>

<style>
.form-record-show {
  width: 78%;
}
</style>
