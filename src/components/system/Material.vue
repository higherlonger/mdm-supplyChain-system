<template>
    <div style="overflow:hidden;">
      <!-- 导航栏 -->
        <nav class="app-location-wrapper">
            <el-breadcrumb separator="/" class="fl">
                <el-breadcrumb-item :to="{ path: '/sys_setting' }">系统管理</el-breadcrumb-item>
                <el-breadcrumb-item>商品管理</el-breadcrumb-item>
                <el-breadcrumb-item>原料管理</el-breadcrumb-item>
            </el-breadcrumb>
            <el-button class="fr" size="small" icon="el-icon-plus" type="primary" plain
                @click="topHandle('addVisible')">新增原材料</el-button>
        </nav>
        <div style="background-color:#f2f2f2;overflow:hidden">
          <div style="background-color:#fff;float:left;margin-top:10px;width:20%">
            <el-input
            placeholder="输入关键字进行过滤"
            v-model="filterText" 
            style="margin-bottom:5px;"
            >
            </el-input>
            <!-- 树形结构 -->
            <el-tree
            :data="typeTree"
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
          <div style="width: 79.2%;float:right;margin-top:10px;">
            <div style="background:#fff" class="component-top">
                <div class="search-title fl">搜索：</div>
                <el-input
                    placeholder="请输入名称"
                    prefix-icon="el-icon-search"
                    class="fl"
                    size="small"
                    @keyup.enter.native="searchHandle"
                    style="width:160px;margin-right:10px;"
                    v-model="search.keyword">
                </el-input>
                <div class="search-title fl">状态：</div>
                <el-select 
                    class="fl"
                    size="small" 
                    clearable
                    v-model="search.state"
                    @change="searchHandle"
                    style="width:160px;margin-right:10px;"
                    >
                    <el-option
                    v-for="item in store_state"
                    :key="item.value"
                    :label="item.name"
                    :value="item.value">
                    </el-option>
                </el-select>
                <div class="search-title fl">库存类型：</div>
                <el-select 
                    class="fl"
                    size="small" 
                    clearable
                    v-model="search.order_type"
                    @change="searchHandle"
                    style="width:160px;margin-right:10px;"
                    >
                    <el-option
                    v-for="item in material"
                    :key="item.value"
                    :label="item.name"
                    :value="item.value">
                    </el-option>
                </el-select>
                <el-button class="fl" style="margin-left: 10px;" size="small"
                    @click.stop="searchHandle('all')">
                    全部
                </el-button>
            </div>
            <el-table
            :data="tableData"
            border
            ref="table"
            :default-sort = "{prop: 'num'}"
            >
            <el-table-column
                prop="name"
                sortable
                label="原料名称"
                >
            </el-table-column>
            <el-table-column
                prop="num"
                label="编码"
                width="100"
               >
            </el-table-column>
            <el-table-column
                prop="security_time"
                label="到货周期"
                width="100"
                >
            </el-table-column>
            <el-table-column
                prop="order_type"
                label="订单类型"
                width="100"
                >
            </el-table-column>
            <el-table-column
                prop="type_text"
                label="采购类型"
                width="100"
                >
            </el-table-column>
            <el-table-column
              prop="state_text"
              label="状态"
              width="100">
              <template slot-scope="scope">
                  <el-tag size="medium" v-if="scope.row.state==1">启用</el-tag>
                  <el-tag size="medium" v-else type="danger">停用</el-tag>
              </template>
            </el-table-column>
            <el-table-column label="操作" width="220">
                <template slot-scope="scope">
                    <el-button
                    size="mini"
                    @click="recordHandle(scope.row,'seeVisible')">查看</el-button>
                    <el-button
                    size="mini"
                    type="primary"
                    @click="recordHandle(scope.row,'editVisible')">修改</el-button>
                    <el-button
                    size="mini"
                    type="danger"
                    :loading="btnLoading"
                    v-if="scope.row.state==1"
                    @click="stopMater(scope.row.id,scope.row.state)">停用</el-button>
                    <el-button
                    size="mini"
                    type="danger"
                    :loading="btnLoading" 
                    v-else
                    @click="stopMater(scope.row.id,scope.row.state)">启用</el-button>
                </template>
                </el-table-column>
            </el-table>
            <!-- 分页 -->
            <el-pagination
            @current-change="handleCurrentChange"
            :page-size="10"
            class="pagination"
            style="display:block;margin:10px 0;text-align:center"
            background
            layout="prev, pager, next, jumper"
            :total="this.total">
            </el-pagination>
          </div>
          
        </div>
        <!-- 弹窗 -->
        <app-dialog title="新增原材料" :visible.sync="dialog.addVisible" top="0" customClass="customClass">
          <add-material @reloadEvent="reloadGetData"></add-material>
        </app-dialog>
        <app-dialog title="原料信息" :visible.sync="dialog.seeVisible" top="0" customClass="customClass">
          <show-material :info="info"></show-material>
        </app-dialog>
        <app-dialog title="修改原材料" :visible.sync="dialog.editVisible" top="0" customClass="customClass">
          <edit-material :info="info" @reloadEvent="reloadGetData"></edit-material>
        </app-dialog>
    </div>
</template>

<script>
import { mapState, mapActions } from "vuex";
import { getMaterialTree, getMaterList, stopMarters } from "../../api";
import { getList, stopInfo } from "../../common";
import AddMaterial from "./Material_add.vue";
import ShowMaterial from "./Material_show.vue";
import EditMaterial from "./Material_edit.vue";
import AppDialog from "../common/AppDialog.vue";
export default {
  name: "tree",
  data() {
    return { 
      tree: [],
      defaultProps: {
        children: "children",
        label: "name"
      },
      search: {
        keyword: "",
        state: "",
        order_type: ""
      },
      tableData: [],
      filterText: "",
      btnLoading: false,
      ids: "",
      dialog: {
        addVisible: !1,
        editVisible: !1,
        seeVisible: !1
      },
      recordId: "",
      info: "",
      total: 1,
      currPageIndex: 1,
      pageSize: 10
    };
  },
  components: {
    AddMaterial,
    AppDialog,
    ShowMaterial,
    EditMaterial
  },
  computed: {
    ...mapState("dict", ["store_state", "material", "typeTree", "orderType"])
  },
  methods: {
    ...mapActions("dict", [
      "getStoreState",
      "getMaterial",
      "getTypeTree",
      "getOrderType"
    ]),
    handleCurrentChange(val) {
      this.currPageIndex = val;
      this.handleNodeClick();
    },
    //重新获取数据
    reloadGetData(res) {
      if (res == "reload") {
        for (let attr in this.dialog) {
          this.dialog[attr] = !1;
        }
        this.handleNodeClick();
      }
    },
    stopMater(_id, state) {
      let val = state == 1 ? 0 : 1;
      let text = state == 1 ? "您确定停用此原料吗？" : "您确定启用此原料吗？";
      this.$confirm(text, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        stopInfo({
          requestUrl: stopMarters,
          params: { id: _id, state: val }
        })
          .then(item => {
            this.handleNodeClick();
            if (item == 1) {
              this.$message({
                message: "操作成功！",
                type: "success"
              });
            } else {
              this.$message.error("操作失败！");
            }
          })
          .catch(error => {
            this.$message.error("操作失败！");
          });
      });
    },
    //操作弹窗控制
    recordHandle(_row, text) {
      this.recordId = _row.id;
      this.dialog[text] = !0;
      this.info = _row;
    },
    //点击多选框
    handleNodeClick() {
      // console.log(this.currPageIndex)
      this.ids = this.$refs.tree.getCheckedKeys();
      if (this.ids.length == 0) {
        this.ids = "";
      }
      getList({
        requestUrl: getMaterList,
        currPage:this.currPageIndex,
        params: {
          ...this.search,
          catalog_ids: this.ids,
          pageSize: this.pageSize
        },
        format: 1
      }).then(item => {
        this.tableData = item.list.list;
        this.total=item.total;
      });
    },
    searchHandle(val) {
      this.ids = this.$refs.tree.getCheckedKeys();
      if (this.ids.length == 0) {
        this.ids = "";
      }
      if (val == "all") {
        this.search.keyword = "";
        this.search.state = "";
        this.search.order_type = "";
      }
      getList({
        requestUrl: getMaterList,
        params: {
          ...this.search,
          catalog_ids: this.ids,
          pageSize: this.pageSize
        },
        format: 1
      }).then(item => {
        this.tableData = item.list.list;
      });
    },
    filterNode(value, data) {
      if (!value) return true;
      return data.search_text.indexOf(value) !== -1;
    },
    topHandle(text) {
      this.dialog[text] = !0;
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
    this.getStoreState();
    this.getMaterial();
    this.getTypeTree();
    this.getOrderType();
    getList({
      requestUrl: getMaterList,
      params: { ...this.search, catalog_ids: "", pageSize: this.pageSize },
      format: 1
    }).then(item => {
      this.tableData = item.list.list;
    });
  }
};
</script>

<style>
</style>
