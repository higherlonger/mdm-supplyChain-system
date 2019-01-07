<template>
<div>
    <!-- 导航栏 -->
    <nav class="app-location-wrapper">
        <el-breadcrumb separator="/" class="fl">
            <el-breadcrumb-item :to="{ path: '/sys_setting' }">系统管理</el-breadcrumb-item>
            <el-breadcrumb-item>基础管理</el-breadcrumb-item>
            <el-breadcrumb-item>地址管理</el-breadcrumb-item>
        </el-breadcrumb>
        <el-button class="fr" size="small" icon="el-icon-plus" type="primary" plain
            @click="topHandle('addVisible')">新增地址</el-button>
    </nav>
    <!-- 搜索条件 -->
    <div class="component-top">
        <div class="search-title fl">搜索：</div>
        <el-input
            placeholder="请输入地址"
            prefix-icon="el-icon-search"
            class="fl"
            size="small"
            @keyup.enter.native="searchHandle"
            style="width:220px;margin-right:10px;"
            v-model="search.keyword">
        </el-input>
        <div class="search-title fl">省份：</div>
            <el-select 
                class="fl"
                size="small" 
                clearable
                v-model="search.province"
                @change="searchHandle"
                style="width:160px;margin-right:10px;"
                >
                <el-option
                v-for="item in provinceList"
                :key="item.value"
                :label="item.name"
                :value="item.value">
                </el-option>
            </el-select>
        <div class="search-title fl">城市：</div>
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
            prop="province"
            label="省份"
            width="150"
            >
            </el-table-column>
            <el-table-column
            prop="city"
            label="城市"
            width="150"
            >
            </el-table-column>
            <el-table-column
            prop="address"
            label="地址"
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
                    @click="stopAddress(scope.row.id,scope.row.state)">停用</el-button>
                    <el-button
                    size="mini"
                    type="danger"
                    v-else
                    :loading="btnLoading"
                    @click="stopAddress(scope.row.id,scope.row.state)">启用</el-button>
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
    <app-dialog title="查看地址" :visible.sync="dialog.seeVisible">
      <show-address :record-id="recordId"></show-address>
    </app-dialog>
    <app-dialog title="修改地址" :visible.sync="dialog.editVisible">
      <edit-address :info="info" @reloadEvent="reloadGetData"></edit-address>
    </app-dialog>
    <app-dialog title="新增地址" :visible.sync="dialog.addVisible">
      <add-address @reloadEvent="reloadGetData"></add-address>
    </app-dialog>
</div>
</template>

<script>
import { getAddressList, stopAddress } from "../../api";
import { getList, stopInfo } from "../../common";
import AppDialog from "../common/AppDialog.vue";
import ShowAddress from "./Address_show.vue";
import EditAddress from "./Address_edit.vue";
import AddAddress from "./Address_add.vue";
import { mapState, mapActions } from "vuex";
export default {
  name: "ads",
  data() {
    return {
      search: {
        state: "",
        city: "",
        province: "",
        keyword: ""
      },
      total: 1,
      list: [],
      pageSize: 10,
      recordId: "",
      dialog: {
        addVisible: !1,
        editVisible: !1,
        seeVisible: !1
      },
      info: "",
      curPageIndex: 1
    };
  },
  components: {
    AppDialog,
    ShowAddress,
    EditAddress,
    AddAddress
  },
  computed: {
    ...mapState("stateChange", ["btnLoading"]),
    ...mapState("dict", ["store_state", "cityList", "provinceList"])
  },
  methods: {
    ...mapActions("dict", ["getStoreState", "getCityList", "getProvinceList"]),
    handleCurrentChange(val) {
      this.curPageIndex = val;
      getList({
        currPage: this.curPageIndex,
        requestUrl: getAddressList,
        params: { ...this.search, pageSize: this.pageSize }
      }).then(item => {
        this.total = item.total;
        this.list = item.list;
      });
    },
    //操作弹窗控制
    recordHandle(_row, text) {
      this.recordId = _row.id;
      this.dialog[text] = !0;
      this.info = _row;
    },
    //重新获取数据
    reloadGetData(res) {
      if (res == "reload") {
        for (let attr in this.dialog) {
          this.dialog[attr] = !1;
        }
        getList({
          requestUrl: getAddressList,
          params: { ...this.search, pageSize: this.pageSize }
        }).then(item => {
          this.list = item;
        });
      }
    },
    topHandle(text) {
      this.dialog[text] = !0;
    },
    //根据条件搜素
    searchHandle(val) {
      if (val == "all") {
        this.search.keyword = "";
        this.search.state = "";
        this.search.city = "";
        this.search.province = "";
      }
      getList({
        requestUrl: getAddressList,
        params: { ...this.search, pageSize: this.pageSize }
      }).then(item => {
        this.total = item.total;
        this.list = item.list;
      });
    },
    stopAddress(_id, state) {
      let val = state == 1 ? 0 : 1;
      let text = state == 1 ? "您确定停用此地址吗？" : "您确定启用此地址吗？";
      this.$confirm(text, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        stopInfo({
          requestUrl: stopAddress,
          params: { id: _id, state: val }
        })
          .then(item => {
            getList({
              requestUrl: getAddressList,
              params: { ...this.search, pageSize: this.pageSize }
            }).then(item => {
              this.total = item.total;
              this.list = item.list;
            });
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
    }
  },
  created() {
    this.getProvinceList();
    this.getCityList();
    this.getStoreState();
    //获取列表
    getList({
      requestUrl: getAddressList,
      params: { ...this.search, pageSize: this.pageSize }
    }).then(item => {
      this.total = item.total;
      this.list = item.list;
    });
  }
};
</script>

<style>
</style>
