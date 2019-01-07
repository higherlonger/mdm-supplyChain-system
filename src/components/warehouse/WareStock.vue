<template>
<div>
    <!-- 导航栏 -->
    <nav class="app-location-wrapper">
        <el-breadcrumb separator="/" class="fl">
            <el-breadcrumb-item :to="{ path: '/sys_setting' }">店长管理</el-breadcrumb-item>
            <el-breadcrumb-item>库存管理</el-breadcrumb-item>
            <el-breadcrumb-item>库存</el-breadcrumb-item>
        </el-breadcrumb>
        <el-button class="fr" size="small" icon="el-icon-plus" type="primary" plain 
            @click="topHandle()">新增库存</el-button>
    </nav>
    <!-- 搜索条件 --> 
    <div class="component-top">
        <div class="search-title fl">搜索：</div>
        <el-input
            placeholder="请输入名称"
            prefix-icon="el-icon-search"
            class="fl"
            size="small"
            @keyup.enter.native="searchHandle"
            style="width:220px;margin-right:10px;"
            v-model="search.keyword">
        </el-input>
        <div class="search-title fl">类别：</div>
            <el-select 
                class="fl"
                size="small" 
                clearable
                v-model="search.material_id"
                @change="searchHandle"
                style="width:160px;margin-right:10px;"
                >
                <el-option
                v-for="item in stockList"
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
            prop="batch_num"
            label="批号"
            >
            </el-table-column>
            <el-table-column
            prop="material_data.name"
            label="名称"
            >
            </el-table-column>
            <el-table-column
            prop="material_data.attribute"
            label="规格"
            >
            </el-table-column>
            <el-table-column
            prop="material_data.out_unit"
            label="单位"
            >
            </el-table-column>
            <el-table-column
            prop="quantity"
            label="历史库存"
            >
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
    <app-dialog title="新增库存" :visible.sync="dialog.addVisible" top="0" customClass="customClass">
      <add-stock @reloadEvent="reloadGetData"></add-stock>
    </app-dialog>
</div>
</template> 

<script>
import { getWarehouseList } from "../../api";
import { getList, stopInfo } from "../../common";
import { mapState, mapActions } from "vuex";
import AddStock from "./Stock_add.vue";
import AppDialog from "../common/AppDialog.vue";
export default {
  name: "ads",
  data() {
    return {
      search: {
        keyword: "",
        material_id: ""
      },
      total: 1,
      list: [],
      pageSize: 10,
      recordId: "",
      info: "",
      curPageIndex: 1,
      dialog:{
        addVisible:!1
      }
    };
  },
  components: {
    AppDialog,
    AddStock
  },
  computed: {
    ...mapState("stateChange", ["btnLoading"]),
    ...mapState("dict", ["stockList"])
  },
  methods: {
    ...mapActions("dict", ["getStockList"]),
    handleCurrentChange(val) {
      this.curPageIndex = val;
      
       getList({
        currPage: this.curPageIndex,
        requestUrl: getWarehouseList,
        params: { ...this.search, pageSize: this.pageSize },
        format: 1
      }).then(item => {
        this.total = item.total;
        this.list = item.list.list;
      });
    },
    //重新获取数据
    reloadGetData(res) {
      if (res == "reload") {
        for (let attr in this.dialog) {
          this.dialog[attr] = !1;
        }
        getList({
        requestUrl: getWarehouseList,
        params: { ...this.search, pageSize: this.pageSize },
        format: 1
      }).then(item => {
        this.total = item.total;
        this.list = item.list.list;
      });
      }
    },
    //新增库存
    topHandle(){
      this.dialog.addVisible=!0;
    },
    //根据条件搜素
    searchHandle(val) {
      if (val == "all") {
        this.search.keyword = "";
        this.search.material_id = "";
      } 
      getList({
        requestUrl: getWarehouseList,
        params: { ...this.search, pageSize: this.pageSize },
        format: 1
      }).then(item => {
        this.total = item.total;
        this.list = item.list.list;
      });
    }
  },
  created() {
    this.getStockList();
    //获取列表
    getList({
      requestUrl: getWarehouseList,
      params: { ...this.search, pageSize: this.pageSize },
      format: 1
    }).then(item => {
      this.total = item.total;
      this.list = item.list.list;
    });
  }
};
</script>

<style>
</style>
