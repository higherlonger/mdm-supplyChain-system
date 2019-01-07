<template>
<div>
    <!-- 导航栏 -->
    <nav class="app-location-wrapper">
        <el-breadcrumb separator="/" class="fl">
            <el-breadcrumb-item :to="{ path: '/sys_setting' }">店长管理</el-breadcrumb-item>
            <el-breadcrumb-item>库存管理</el-breadcrumb-item>
            <el-breadcrumb-item>库存</el-breadcrumb-item>
        </el-breadcrumb>
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
            prop="material_data.num"
            label="编号"
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
   
</div>
</template>

<script>
import { getInvenDataList } from "../../api";
import { getList, stopInfo } from "../../common";
import { mapState, mapActions } from "vuex";
export default {
  name: "ads",
  data() {
    return {
      search: {
        keyword: ""
      },
      total: 1,
      list: [],
      pageSize: 10,
      recordId: "",
      info: "",
      curPageIndex: 1
    };
  },
  components: {},
  computed: {
    ...mapState("stateChange", ["btnLoading"])
  },
  methods: {
    handleCurrentChange(val) {
      this.curPageIndex = val;
      getList({
        currPage: this.curPageIndex,
        requestUrl: getInvenDataList,
        params: { ...this.search, pageSize: this.pageSize },
        format: 1
      }).then(item => {
        this.total = item.total;
        this.list = item.list;
      });
    },
    //根据条件搜素
    searchHandle(val) {
      if (val == "all") {
        this.search.keyword = "";
      }
      getList({
        requestUrl: getInvenDataList,
        params: { ...this.search, pageSize: this.pageSize },
        format: 1
      }).then(item => {
        this.total = item.total;
        this.list = item.list;
      });
    }
  },
  created() {
    //获取列表
    getList({
      requestUrl: getInvenDataList,
      params: { ...this.search, pageSize: this.pageSize },
      format: 1
    }).then(item => {
      this.total = item.total;
      this.list = item.list;
    });
  }
};
</script>

<style>
</style>
