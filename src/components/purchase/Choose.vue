<template>
<div>
    <!-- 导航栏 -->
    <nav class="app-location-wrapper">
        <el-breadcrumb separator="/" class="fl">
            <el-breadcrumb-item :to="{ path: '/sys_setting' }">采购管理</el-breadcrumb-item>
            <el-breadcrumb-item>采购单</el-breadcrumb-item>
            <el-breadcrumb-item>选择供应商</el-breadcrumb-item>
        </el-breadcrumb>
        <el-button class="fr" size="small" icon="el-icon-success" type="primary" plain v-show="!isShow"
            @click="okToAdd">处理完成</el-button>
        <el-button class="fr" size="small" icon="el-icon-close"  plain v-show="!isShow" style="margin-right:10px"
            @click="cancel">取消</el-button>
    </nav>
    <!-- 订单回显 -->
    <div style="background-color:#fff" v-show="isShow">
        <!-- 搜索 -->
      <div class="component-top">
          <div class="search-title fl">搜索：</div>
          <el-input 
              placeholder="请输入编号"
              prefix-icon="el-icon-search"
              class="fl"
              size="small"
              @keyup.enter.native="searchHandle"
              style="width:220px;margin-right:10px;"
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
                  v-for="item in returnOrderType"
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
                label="编号"
                >
                </el-table-column>
                <el-table-column
                prop="handle_date"
                label="创建时间">
                </el-table-column>
                <el-table-column
                prop="purchase_type_text"
                label="采购类型">
                </el-table-column>
                <el-table-column label="操作" width="250">
                    <template slot-scope="scope">
                        <el-button
                        size="mini"
                        @click="toDo(scope.row)">处理</el-button>
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
    <!-- 处理 -->
    <div style="background-color:#fff;" v-show="!isShow">
            <div style="padding:10px">
                <div class="search-title fl" style="margin-top:5px;">下一处理人：</div>
                <el-select 
                    class="fl"
                    size="small" 
                    clearable
                    v-model="search.handle_id"
                    @change="searchHandle"
                    style="width:160px;margin-right:10px;margin-bottom:10px;"
                    >
                    <el-option
                    v-for="item in nextHandlePeo"
                    :key="item.value"
                    :label="item.name"
                    :value="item.value">
                    </el-option>
                </el-select>
            </div>
            <!-- 表格 -->
            <el-table
            :data="toDoList"
            border
            ref="table"
            >
            <el-table-column
                prop="num"
                label="编码"
               >
            </el-table-column>
            <el-table-column
                prop="name"
                label="原料名称"
                >
            </el-table-column>     
            <el-table-column
                prop="out_unit"
                label="单位"
                >
            </el-table-column>
            <el-table-column
                prop="attribute"
                label="规格"
                >
            </el-table-column>
            <el-table-column
                prop="quantity"
                label="采购数量"
                >
            </el-table-column>
            <el-table-column
              prop="supplier_id" 
              label="选择供应商"
              width="220">
              <template slot-scope="scope">
                <el-select v-model="scope.row.supplier_id" placeholder="请选供应商" class="leftItv">
                    <el-option v-for="item in scope.row.suppliers" :key="item.value" :label="item.name" :value="item.value"></el-option>
                </el-select>
              </template>
            </el-table-column>
            </el-table>
    </div>

</div>
</template>

<script>
import { getSuppSecInfo, getSuppInfo, updateProcess } from "../../api";
import { getList, getListPage, addData } from "../../common";
import { mapState, mapActions } from "vuex";
export default {
  name: "choose",
  data() {
    return {
      search: {
        keyword: "",
        state: "",
        handle_id: ""
      },
      selectList: [],
      total: 1,
      list: [],
      pageSize: 10,
      recordId: "",
      info: "",
      curPageIndex: 1,
      isShow: !0,
      toDoList: [],
      provinceList: [],
      upData: [],
      row: {}
    };
  },
  components: {},
  computed: {
    ...mapState("stateChange", ["btnLoading"]),
    ...mapState('dict',["nextHandlePeo","returnOrderType","returnOrderName"])
  },
  methods: {
    test(_row){
      console.log(_row)
    },
    ...mapActions('dict',['getNextHandlePeo','getReturnOrderType']),
    handleCurrentChange(val) {
      this.curPageIndex = val;
      getList({
        requestUrl: getSuppSecInfo,
        params: {
          ...this.search,
          pageSize: this.pageSize,
          purchase_order_state: this.returnOrderName.purchase
        }
      }).then(item => {
        this.total = item.total;
        this.list = item.list;
      });
    },
    cancel() {
      this.isShow = !this.isShow;
    },
    //过滤数据
    filterData(_row) {
      let val = _row.item;
      for (let i = 0; i < val.length; i++) {
        val[i].supplier_id = "";
      }
      this.toDoList = _row.item;
      this.row = _row;
    },
    //处理
    toDo(_row) {
      let valStr = JSON.stringify(_row);
      let obj = {
        [valStr]: ""
      };
      getListPage({
        requestUrl: getSuppInfo,
        params: obj
      }).then(item => {
        this.filterData(item.list);
        this.isShow = !this.isShow;
      });
    },
    //完成处理
    okToAdd() {
      let flag=false;
      for(let i=0;i<this.toDoList.length;i++){
        if(this.toDoList[i].supplier_id==''){
          flag=true;
          break;
        }
      }
      if(flag){
        this.$message.error("请选择原料的供应商！");
        return;
      }
      this.upData=this.toDoList.filter(item=>{
        delete item['suppliers']; 
        return item
      })
      let obj = {
        ...this.row,
        item: this.upData,
         to_user_id:this.search.handle_id
      };
      addData({
        requestUrl: updateProcess,
        paramsType: 1,
        preData: obj
      }).then(item => {
        console.log(item);
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
              purchase_order_state: this.returnOrderName.purchase
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
          purchase_order_state: this.returnOrderName.purchase
        }
      }).then(item => {
        this.total = item.total;
        this.list = item.list;
      });
    }
  },
  created() {
    this.getNextHandlePeo(this.returnOrderName.caiwu);
    this.getReturnOrderType();
    //获取列表
    getList({
      requestUrl: getSuppSecInfo,
      params: {
        ...this.search,
        pageSize: this.pageSize,
        purchase_order_state: this.returnOrderName.purchase
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
