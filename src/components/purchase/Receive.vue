<template>
<div>
    <!-- 导航栏 -->
    <nav class="app-location-wrapper">
        <el-breadcrumb separator="/" class="fl">
            <el-breadcrumb-item :to="{ path: '/sys_setting' }">采购管理</el-breadcrumb-item>
            <el-breadcrumb-item>采购单</el-breadcrumb-item>
            <el-breadcrumb-item>采购入库</el-breadcrumb-item>
        </el-breadcrumb>
        <el-button class="fr" size="small" icon="el-icon-success" type="success" plain v-show="!isShow"
            @click="toDo">接收入库</el-button>
        <el-button class="fr" size="small" icon="el-icon-check" type="primary" plain v-show="!isShow" style="margin-right:10px"
            @click="finishOrder">完成此单</el-button>
        <el-button class="fr" size="small" icon="el-icon-close"  plain v-show="!isShow" 
            @click="cancel">取消</el-button>
    </nav>
    <div style="background-color:#fff" v-show="isShow">
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
                  prop="num"
                  label="编号"
                  >
                  </el-table-column>
                  <el-table-column
                  prop="create_date"
                  label="订单时间"
                  >
                  </el-table-column>
                  <el-table-column
                  prop="purchase_type_text"
                  label="采购类型"
                  >
                  </el-table-column>
                  <el-table-column
                  prop="city"
                  label="城市"
                  >
                  </el-table-column>
                  <el-table-column
                  prop="state_text"
                  label="状态"
                  >
                  </el-table-column>
                  <el-table-column label="操作" width="150">
                    <template slot-scope="scope">
                        <el-button
                        size="mini"
                        @click="okRev(scope.row)">处理</el-button>
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
    <div style="background-color:#fff" v-show="!isShow">
        <el-table
          :data="detail"
          stripe
          border
          @selection-change="handleSelectionChange"
          style="width: 100%">
          <el-table-column
            type="selection"
            :selectable='checkboxT'
            width="55">
          </el-table-column>
          <el-table-column
            prop="num"
            label="编号"
            >
          </el-table-column>
          <el-table-column
            prop="name"
            label="名称"
            >
          </el-table-column>
          <el-table-column
            prop="out_unit"
            label="单位">
          </el-table-column>
          <el-table-column
            prop="attribute"
            label="规格">
          </el-table-column>
          <el-table-column
            prop="storage_condition"
            label="存储条件">
          </el-table-column>  
          <el-table-column
            prop="quantity"
            label="数量">
          </el-table-column>
          <el-table-column
            prop="batch_num"
            label="批号"
            width="200"
            >
            <template slot-scope="scope">
              <el-input v-model="scope.row.batch_num" size="mini" placeholder="请输入批号"></el-input>
            </template>
          </el-table-column>
          <el-table-column
            prop="state"
            label="状态">
            <template slot-scope="scope">
              <el-tag v-if="scope.row.is_accepted=='false'" type="danger">未处理</el-tag>
              <el-tag v-else type="success">已处理</el-tag>
            </template>
          </el-table-column>
        </el-table>
    </div>
</div>
</template>

<script>
import {
  getSuppSecInfo,
  getApplyById,
  updateProcess,
  allFinish
} from "../../api";
import { getList, stopInfo, getListPage, addData } from "../../common";
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
      curPageIndex: 1,
      isShow: !0,
      detail: [],
      selected: [],
      row: ""
    };
  },
  components: {},
  computed: {
    ...mapState("stateChange", ["btnLoading"]),
    ...mapState("dict", ["returnOrderType", "returnOrderName"])
  },
  methods: {
    ...mapActions("dict", ["getReturnOrderType"]),
    //判断多选框是否可以选择
    checkboxT(row, index) {
      if (row.is_accepted == "false") {
        return 1;
      } else {
        return 0;
      }
    },
    //直接完成订单
    finishOrder() {
      this.$confirm("此操作将直接完成订单,如有未处理商品将不会入库, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
            addData({
              requestUrl: allFinish,
              params:{id:this.row.purchase_id}
            }).then(item=>{
              if(item==1){

              }
            })
        })
        .catch(() => {
          this.$message({
            message: "处理成功！",
            type: "success"
          });
          this.isShow = !this.isShow;
          getList({
            requestUrl: getSuppSecInfo,
            params: {
              ...this.search,
              pageSize: this.pageSize,
              purchase_order_state: this.returnOrderName.warehouse
            }
          }).then(item => {
            this.total = item.total;
            this.list = item.list;
          });
        });
    },
    handleCurrentChange(val) {
      this.curPageIndex = val;
      getList({
        requestUrl: getSuppSecInfo,
        params: {
          ...this.search,
          pageSize: this.pageSize,
          purchase_order_state: this.returnOrderName.warehouse
        }
      }).then(item => {
        this.total = item.total;
        this.list = item.list;
      });
    },
    handleSelectionChange(val) {
      this.selected = val;
    },
    cancel() {
      this.isShow = !this.isShow;
    },
    toDo() {
      if(!this.selected.length){
        this.$message.error("请勾选商品！");
        return;
      }
      let flag=false;
      for(let i=0;i<this.selected.length;i++){
        if(this.selected[i].batch_num==''){
          flag=true;
          break;
        }
      }
      if(flag){
        this.$message.error("必须填入商品编号！");
        return;
      }
      let obj = { ...this.row, item: this.selected };
      addData({
        requestUrl: updateProcess,
        paramsType: 1,
        preData: obj
      }).then(item => {
        if (item == 1) {
          this.$message({
            message: "处理成功！",
            type: "success"
          });
          this.isShow = !this.isShow;
          getList({
            requestUrl: getSuppSecInfo,
            params: {
              ...this.search,
              pageSize: this.pageSize,
              purchase_order_state: this.returnOrderName.warehouse
            }
          }).then(item => {
            this.total = item.total;
            this.list = item.list;
          });
        } else {
          this.$message.error("处理失败");
        }
      });
    },
    //接收入库
    okRev(_row) {
      this.row = _row;
      //获取采购单
      getListPage({
        requestUrl: getApplyById,
        params: {
          id: _row.purchase_id
        }
      }).then(item => {
        this.detail = item.list.item;
        this.isShow = !this.isShow;
      });
    },
    //根据条件搜素
    searchHandle(val) {
      if (val == "all") {
        this.search.keyword = "";
      }
      getList({
        requestUrl: getSuppSecInfo,
        params: {
          ...this.search,
          pageSize: this.pageSize,
          purchase_order_state: this.returnOrderName.warehouse
        }
      }).then(item => {
        this.total = item.total;
        this.list = item.list;
      });
    }
  },
  created() {
    //获取列表
    getList({
      requestUrl: getSuppSecInfo,
      params: {
        ...this.search,
        pageSize: this.pageSize,
        purchase_order_state: this.returnOrderName.warehouse
      }
    }).then(item => {
      this.total = item.total;
      this.list = item.list;
    });
  }
};
</script>

<style>
</style>
