<template>
<div>
    <!-- 导航栏 -->  
    <nav class="app-location-wrapper">
        <el-breadcrumb separator="/" class="fl">
            <el-breadcrumb-item :to="{ path: '/sys_setting' }">采购管理</el-breadcrumb-item>
            <el-breadcrumb-item>采购退货</el-breadcrumb-item>
            <el-breadcrumb-item>退货审核</el-breadcrumb-item>
        </el-breadcrumb>
        <el-button class="fr" size="small" icon="el-icon-success" type="success" plain v-show="!isShow"
            @click="toDo">通过</el-button>
        <el-button class="fr" size="small" icon="el-icon-warning" type="danger" plain v-show="!isShow" style="margin-right:10px"
            @click="noToAdd">拒绝</el-button>
        <el-button class="fr" size="small" icon="el-icon-close"  plain v-show="!isShow" style="margin-right:10px"
            @click="cancel">取消</el-button>
    </nav> 
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
          <el-button class="fl" style="margin-left: 10px;" size="small"
              @click.stop="searchHandle('all')">
              全部
          </el-button>
      </div>
        <!-- 表格 -->
        <div class="component-main">
            <el-table
            :data="list"
            stripe
            border
            style="width: 100%">
            <el-table-column
              prop="num"
              label="编号"
            >
            </el-table-column>
            <el-table-column
              prop="purchase_type_text"
              label="采购类型">
            </el-table-column>
            <el-table-column
              prop="state_text"
              label="订单状态">
            </el-table-column>
            <el-table-column
              prop="total_price"
              label="总金额">
            </el-table-column>
            <el-table-column label="操作" width="200">
                <template slot-scope="scope">
                    <el-button
                    size="mini"
                    @click="okToAdd(scope.row)">查看</el-button>
                </template>
            </el-table-column>
          </el-table>
          <!-- 分页 -->
          <el-pagination
          @current-change="handleCurrentChange"
          :page-size="10"
          class="pagination page"
          background
          layout="prev, pager, next, jumper"
          :total="this.total">
          </el-pagination>
        </div>
    </div>
    <div style="background-color:#fff" v-show="!isShow">
      <div style="padding:10px 20px;overflow:hidden">
        <div class="search-title fl" style="margin-top:5px;">下一处理人：</div>
        <el-select 
            class="fl"
            size="small" 
            clearable
            v-model="info.handle_id"
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
      <!-- 订单信息回显 -->
      <el-form :model="row" ref="row" label-width="100px" size="small" >
          <el-form-item label="订单编号" prop="num">
              <span class="form-record-show">{{ row.num }}</span>
          </el-form-item>
          <el-form-item label="订单时间" prop="province">
              <span class="form-record-show">{{ row.num }}</span>
          </el-form-item>
          <el-form-item label="总金额" prop="city">
              <span class="form-record-show">{{ row.total_price }}</span>
          </el-form-item>
      </el-form>
      <!-- 表格 -->
      <el-table
      :data="detail"
      border
      ref="table"
      >
      <el-table-column
        type="index"
        width="50">
      </el-table-column>
      <el-table-column
          prop="num"
          label="编码"
          >
      </el-table-column>
      <el-table-column
          prop="name"
          label="名称"
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
          label="数量"
          >
      </el-table-column>
      <el-table-column
          prop="current_price"
          label="单价"
          >
      </el-table-column>
      <el-table-column
          prop="name"
          label="总价"
          >
          <template slot-scope="scope">
            <p>{{scope.row.quantity*scope.row.current_price}}</p>
          </template>
      </el-table-column>
      </el-table>
    </div>

</div>
</template>

<script>
import { getReturnProcess, addReturnListSec, closeReturnProcess } from "../../api";
import { getList, addData } from "../../common";
import { mapState, mapActions } from "vuex";
export default {
  name: "reCheck",
  data() {
    return {
      search: {
        keyword: ""
      },
      total: 1,
      list: [],
      pageSize: 10,
      recordId: "",
      info: {
        handle_id:''
      },
      curPageIndex: 1,
      isShow: !0,
      detail: [],
      provinceList: [],
      row: {}
    };
  },
  components: {},
  computed: {
    ...mapState("stateChange", ["btnLoading"]),
    ...mapState('dict',["nextHandlePeo","returnOrderType","queryProcessName","returnOrderName"])
  },
  methods: {
     ...mapActions('dict',['getNextHandlePeo','getReturnOrderType']),
    handleCurrentChange(val) {
      this.curPageIndex = val;
      getList({
        requestUrl: getReturnProcess,
        params: {
          ...this.search,
          pageSize: this.pageSize,
          purchase_order_state: this.queryProcessName.caigou
        }
      }).then(item => {
        this.total = item.total;
        this.list = item.list;
      });
    }, 
    //同意
    toDo() {
      if(!this.info.handle_id){
        this.$message.error('请选择下一处理人');
        return;
      }
      let obj = { ...this.row,to_user_id:this.info.handle_id};
      addData({
        requestUrl: addReturnListSec,
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
            requestUrl: getReturnProcess,
            params: {
              ...this.search,
              pageSize: this.pageSize,
              purchase_order_state: this.queryProcessName.caigou
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
    //拒绝
    noToAdd() {
      this.$prompt("请输入拒绝理由", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消"
      })
        .then(({ value }) => {
          if (value == null || value == undefined) {
            this.$message.error("请输入拒绝原因");
          } else {
            addData({
              requestUrl: closeReturnProcess,
              params: {
                id: this.row.purchase_return_id,
                close_reason: value,
                close_id: "caiwu_id"
              }
            }).then(item => {
              if (item == 1) {
                this.$message({
                  message: "处理成功！",
                  type: "success"
                });
                this.isShow = !this.isShow;
                getList({
                  requestUrl: getReturnProcess,
                  params: {
                    ...this.search,
                    pageSize: this.pageSize,
                    purchase_order_state: this.queryProcessName.caigou
                  }
                }).then(item => {
                  this.total = item.total;
                  this.list = item.list;
                });
              } else {
                this.$message.error("处理失败");
              }
            });
          }
        })
        .catch(() => {
          
        });
    },
    cancel() {
      this.isShow = !this.isShow;
    },
    //处理
    okToAdd(_row) {
      this.isShow = !this.isShow;
      this.row = _row;
      this.detail = _row.item;
    },
    //根据条件搜素
    searchHandle(val) {
      if (val == "all") {
        this.search.keyword = "";
      }
      getList({
        requestUrl: getReturnProcess,
        params: {
          ...this.search,
          pageSize: this.pageSize,
          purchase_order_state: this.queryProcessName.caigou
        }
      }).then(item => {
        this.total = item.total;
        this.list = item.list;
      });
    }
  },
  created() {
    this.getNextHandlePeo(this.returnOrderName.caiwu);
    //获取列表
    getList({
      requestUrl: getReturnProcess,
      params: {
        ...this.search,
        pageSize: this.pageSize,
        purchase_order_state: this.queryProcessName.caigou
      }
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
