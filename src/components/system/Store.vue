<template>
<div>
    <!-- 导航栏 -->
    <nav class="app-location-wrapper">
        <el-breadcrumb separator="/" class="fl">
            <el-breadcrumb-item :to="{ path: '/sys_setting' }">系统管理</el-breadcrumb-item>
            <el-breadcrumb-item>门店管理</el-breadcrumb-item>
            <el-breadcrumb-item>门店列表</el-breadcrumb-item>
        </el-breadcrumb>
        <el-button class="fr" size="small" icon="el-icon-plus" type="primary" plain v-show="isShow"
            @click="topHandle('editVisible')">快速建店</el-button>
        <el-button class="fr" size="small" icon="el-icon-plus" type="primary" plain v-show="isShow"
            @click="topHandle('addVisible')" style="margin-right:10px;">添加门店</el-button>
        <el-button class="fr" size="small" icon="el-icon-plus" type="primary" plain v-show="!isShow"
            @click="okToAdd" style="margin-right:10px;">确定</el-button>
    </nav> 

      <div v-show="isShow">
        <!-- 搜索条件 -->
        <div class="component-top">
            <div class="search-title fl">搜索：</div>
            <el-input
                placeholder="请输入门店(名称/拼音/电话)"
                prefix-icon="el-icon-search"
                class="fl"
                size="small"
                @keyup.enter.native="searchHandle"
                style="width:220px;margin-right:10px;"
                v-model="search.keyword">
            </el-input>
            <div class="search-title fl">门店状态：</div>
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
            <div class="search-title fl">所在城市：</div>
                <el-select 
                    class="fl"
                    size="small" 
                    clearable
                    @change="searchHandle"
                    v-model="search.city"
                    style="width:160px;margin-right:10px;"
                    >
                    <el-option
                    v-for="item in cityList"
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
        <!-- 表格 -->
        <div class="component-main">
            <el-table
                :data="list"
                size="small"
                stripe
                border
                ref="table"
                v-loading="btnLoading"
                @selection-change="handleSelectionChange"
                style="width: 100%">
                <el-table-column
                type="selection"
                width="55">
                </el-table-column>
                <el-table-column
                prop="name"
                label="门店名称"
                width="180">
                <template slot-scope="scope">
                    <span :style="{color: scope.row.color}">{{ scope.row.name }}</span>
                </template>
                </el-table-column>
                <el-table-column
                prop="address"
                label="门店地址"
                >
                </el-table-column>
                <el-table-column
                prop="phone"
                label="门店电话"
                width="200"
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
                <el-table-column label="操作" width="250">
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
                        v-if="scope.row.state==1"
                        :loading="btnLoading"
                        @click="stopStore(scope.row.id,scope.row.state)">停用</el-button>
                        <el-button
                        size="mini"
                        type="danger"
                        v-else
                        :loading="btnLoading"
                        @click="stopStore(scope.row.id,scope.row.state)">启用</el-button>
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

      <div v-show="!isShow" style="background-color:#f2f2f2;overflow:hidden;">
        <div style="background-color:#fff;float:left;margin-top:10px;width:32%;">
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
        <div style="width: 67.2%;float:right;margin-top:10px;">
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
              label="单位"
              width="100"
              >
          </el-table-column>
          <el-table-column
              prop="attribute"
              label="规格"
              width="100"
              >
          </el-table-column>
          <el-table-column
              prop="purchase_price"
              label="采购价"
              width="100"
              >
          </el-table-column>
          <el-table-column
              prop="sell_price"
              label="售卖价"
              width="100"
              >
          </el-table-column>
          </el-table>
        </div>
      </div>
 
    <!-- 弹窗 -->
    <app-dialog title="门店信息" :visible.sync="dialog.seeVisible" top="0" customClass="customClass">
      <show-store :record-id="recordId"></show-store>
    </app-dialog>
    <app-dialog :title="dialogTit" :visible.sync="dialog.editVisible">
      <edit-store :info="info" :type="type" @reloadEvent="reloadGetData"></edit-store>
    </app-dialog>
    <app-dialog title="新增门店" :visible.sync="dialog.addVisible">
      <add-store @reloadEvent="reloadGetData" @relateGoods="addGoods"></add-store>
    </app-dialog>
</div>
</template>

<script>
import { getStoreList, EditStoreInfo, stopStore,relationGoods } from "../../api";
import { mapState, mapActions } from "vuex";
import AppDialog from "../common/AppDialog.vue";
import ShowStore from "./Store_show.vue";
import EditStore from "./Store_edit.vue";
import AddStore from "./Store_add.vue";
import { addData } from "../../common";

export default {
  name: "store-list",
  data() {
    return {
      filterText: "",
      tableData: [],
      total: 1,
      type: "",
      currPageIndex: 1,
      state: "",
      city: "",
      search: {
        keyword: "",
        state: "",
        city: ""
      },
      list: [],
      pageSize: 10,
      dialog: {
        editVisible: !1,
        seeVisible: !1,
        addVisible: !1,
        quickVisible: !1
      },
      recordId: "",
      info: "",
      selected: [],
      storeInfo: {},
      isShow: !0,
      defaultProps: {
        children: "children",
        label: "name"
      }
    };
  },
  computed: {
    ...mapState("dict", ["store_state", "cityList", "getGoodsTree"]),
    ...mapState("stateChange", ["btnLoading"]),
    dialogTit() {
      return this.type == "edit" ? "修改信息" : "快速建店";
    }
  },
  components: {
    AppDialog,
    ShowStore,
    EditStore,
    AddStore
  },
  methods: {
    ...mapActions("dict", ["getStoreState", "getCityList", "getGoodsTreeList"]),
    handleCurrentChange(val) {
      this.currPageIndex = val;
      this.getList(this.currPageIndex);
    },
    handleNodeClick() {
      this.getCheckedNodes();
    },
    getCheckedNodes() {
      this.tableData = [];
      let val = this.$refs.tree.getCheckedNodes();
      let filterVal = val.filter(item => {
        return !item.children;
      });
      this.tableData = filterVal;
    },
    //新增门店
    okToAdd() {
      addData({
        requestUrl: relationGoods,
        params: {  product_ids:this.tableData, store_id: this.storeInfo.id}
      })
        .then(item => {
          if (item == 1) {
            this.$message({
              message: "新增成功！",
              type: "success"
            });
            this.isShow=!this.isShow;
            this.getList();
          } else {
            this.$message.error("新增失败");
          }
        })
        .catch(error => {
          this.$message.error("新增失败");
        });
    },
    //树-搜索
    filterNode(value, data) {
      if (!value) return true;
      return data.search_text.indexOf(value) !== -1;
    },
    //获取列表
    async getList(curPage, callback) {
      curPage = curPage > 0 ? Number(curPage) : this.currPageIndex;
      try {
        const response = await getStoreList({
          ...this.search,
          pageNum: curPage,
          pageSize: this.pageSize
        });
        if (response.code == 1) {
          this.list = response.data.list;
          this.total = response.data.totalRow || 1;
          callback && callback();
        } else {
          this.$message.error(response.message);
        }
      } catch (error) {
        console.log(error);
      }
    },
    //根据条件搜素
    searchHandle(val) {
      if (val == "all") {
        this.search.keyword = "";
        this.search.state = "";
        this.search.city = "";
      }
      this.getList(1);
    },
    //操作弹窗控制
    recordHandle(_row, text) {
      this.info = _row;
      this.type = "edit";
      this.recordId = _row.id;
      this.dialog[text] = !0;
    },
    //停用门店
    stopStore(_id, _state) {
      let text = _state == 1 ? "确定停用门店吗？" : "确定启用门店吗？";
      this.$confirm(text, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.okEdit(_id, _state);
        })
        .catch(() => {});
    },
    async okEdit(_id, _state) {
      try {
        let val = _state == 1 ? 0 : 1;
        const response = await stopStore({
          id: _id,
          state: val
        });
        if (response.code == 1) {
          this.getList();
        } else {
          this.$message.error("修改失败");
        }
      } catch (error) {
        console.log(error);
      }
    },
    //重新获取数据
    reloadGetData(res) {
      if (res == "reload") {
        for (let attr in this.dialog) {
          this.dialog[attr] = !1;
        }
        this.getList();
      }
    },
    //多选框选择状态变化
    handleSelectionChange(val) {
      let _this = this;
      this.selected = val;
      for (var i = 0; i < this.selected.length - 1; i++) {
        _this.$refs.table.toggleRowSelection(this.selected[i]);
      }
    },
    topHandle(text) {
      if (text == "editVisible") {
        this.type = "add";
        if (this.selected[0] == undefined) {
          this.$message.error("请先选择门店！");
        } else {
          this.info = this.selected[0];
          this.dialog[text] = !0;
        }
      } else {
        this.dialog[text] = !0;
      }
    },
    //关联商品
    addGoods(list) {
      this.storeInfo = list;
      for (let attr in this.dialog) {
        this.dialog[attr] = !1;
      }
      this.isShow = !this.isShow;
    }
  },
  created() {
    this.getStoreState();
    this.getCityList();
    this.getList();
    this.getGoodsTreeList();
  }
};
</script>

<style>
.form-record-show {
  width: 75%;
}
</style>
