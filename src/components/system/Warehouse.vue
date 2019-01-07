<template>
<div>
    <!-- 导航栏 -->
    <nav class="app-location-wrapper">
        <el-breadcrumb separator="/" class="fl">
            <el-breadcrumb-item :to="{ path: '/sys_setting' }">系统管理</el-breadcrumb-item>
            <el-breadcrumb-item>基础管理</el-breadcrumb-item>
            <el-breadcrumb-item>仓库管理</el-breadcrumb-item>
        </el-breadcrumb>
        <el-button class="fr" size="small" icon="el-icon-plus" type="primary" plain
            @click="topHandle('addVisible')">新增仓库</el-button>
    </nav>
    <!-- 搜索条件 -->
    <div class="component-top">
        <div class="search-title fl">搜索：</div>
        <el-input
            placeholder="请输入仓库(编号/名称/拼音)"
            prefix-icon="el-icon-search"
            class="fl"
            size="small"
            @keyup.enter.native="searchHandle"
            style="width:220px;margin-right:10px;"
            v-model="search.keyword">
        </el-input>
        <div class="search-title fl">仓库状态：</div>
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
        <div class="search-title fl">仓库类型：</div>
            <el-select 
                class="fl"
                size="small" 
                clearable
                v-model="search.type"
                @change="searchHandle"
                style="width:160px;margin-right:10px;"
                >
                <el-option
                v-for="item in wareHouse"
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
                v-model="search.city"
                @change="searchHandle"
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
            style="width: 100%">
            <el-table-column
            prop="num"
            label="仓库编号"
            >
            </el-table-column>
            <el-table-column
            prop="name"
            label="仓库名称"
            >
            </el-table-column>
            <el-table-column
            prop="type_text"
            label="仓库类型"
            >
            </el-table-column>
            <el-table-column
            prop="city"
            label="所在城市"
            >
            </el-table-column>
            <el-table-column
            prop="state"
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
                    @click="recordHandle(scope.row.id,'seeVisible')">查看</el-button>
                    <el-button
                    size="mini"
                    type="primary"
                    @click="recordHandle(scope.row.id,'editVisible')">修改</el-button>
                    <el-button
                    size="mini"
                    type="danger"
                    v-if="scope.row.state==1"
                    :loading="btnLoading"
                    @click="stopWarehouse(scope.row.id,scope.row.state)">停用</el-button>
                    <el-button
                    size="mini"
                    type="danger"
                    v-else
                    :loading="btnLoading"
                    @click="stopWarehouse(scope.row.id,scope.row.state)">启用</el-button>
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
    <!-- 弹窗 -->
    <app-dialog title="仓库信息" :visible.sync="dialog.seeVisible">
      <show-warehouse :record-id="recordId"></show-warehouse>
    </app-dialog>
    <app-dialog title="修改信息" :visible.sync="dialog.editVisible">
      <edit-warehouse :record-id="recordId" @reloadEvent="reloadGetData"></edit-warehouse>
    </app-dialog>
    <app-dialog title="新增仓库" :visible.sync="dialog.addVisible">
      <add-warehouse @reloadEvent="reloadGetData"></add-warehouse>
    </app-dialog>
</div>
</template>

<script>
import { mapActions, mapState } from "vuex";
import { test } from "../../common";
import { getWarehouse, stopWarehouse } from "../../api";
import AppDialog from "../common/AppDialog.vue";
import ShowWarehouse from "./Warehouse_show.vue";
import EditWarehouse from "./Warehouse_edit.vue";
import AddWarehouse from "./Warehouse_add.vue";
export default {
  name: "warehouse",
  data() {
    return {
      search: {
        keyword: "",
        state: "",
        type: "",
        city: ""
      },
      list: [],
      total: 1,
      currPageIndex: 1,
      pageSize: 10,
      dialog: {
        seeVisible: !1,
        editVisible: !1,
        addVisible: !1
      },
      recordId: ""
    };
  },
  components: {
    AppDialog,
    ShowWarehouse,
    EditWarehouse,
    AddWarehouse
  },
  computed: {
    ...mapState("dict", ["store_state", "cityList", "wareHouse"]),
    ...mapState("stateChange", ["btnLoading"])
  },
  methods: {
    ...mapActions("dict", ["getStoreState", "getCityList", "getWareHouse"]),
    handleCurrentChange(val) {
      this.currPageIndex = val;
      this.getList(this.currPageIndex);
    },
    //获取仓库列表
    async getList(currPage, callback) {
      try {
        currPage = currPage > 0 ? Number(currPage) : this.currPageIndex;
        const response = await getWarehouse({
          ...this.search,
          pageNum: currPage,
          pageSize: this.pageSize
        });
        if (response.code == 1) {
          this.list = response.data.list;
        }
      } catch (error) {
        console.log(error);
      }
    },
    //操作弹窗控制
    recordHandle(_id, text) {
      this.recordId = _id;
      this.dialog[text] = !0;
    },
    topHandle(text) {
      this.dialog[text] = !0;
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
    //根据条件搜素
    searchHandle(val) {
      if (val == "all") {
        this.search.keyword = "";
        this.search.state = "";
        this.search.city = "";
        this.search.type = "";
      }
      this.getList(1);
    },
    //停用、启用
    stopWarehouse(_id, state) {
      let val = state == 1 ? 0 : 1;
      let text = state == 1 ? "您确定停用此仓库吗？" : "您确定启用此仓库吗？";
      this.$confirm(text, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        this.okStop(_id, val);
      });
    },
    async okStop(_id, val) {
      try {
        const response = await stopWarehouse({ id: _id, state: val });
        if (response.code == 1) {
          this.$message({
            message: "操作成功！",
            type: "success"
          });
          this.getList();
        } else {
          this.$message.error("操作失败！");
        }
      } catch (error) {
        console.log(error);
      }
    }
  },
  created() {
    this.getStoreState();
    this.getCityList();
    this.getWareHouse();
    this.getList();
  }
};
</script>

<style>
</style>
