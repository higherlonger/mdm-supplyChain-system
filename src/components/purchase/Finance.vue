<template>
<div>
    <!-- 导航栏 --> 
    <nav class="app-location-wrapper">
        <el-breadcrumb separator="/" class="fl">
            <el-breadcrumb-item :to="{ path: '/sys_setting' }">采购管理</el-breadcrumb-item>
            <el-breadcrumb-item>采购单</el-breadcrumb-item>
            <el-breadcrumb-item>财务审批</el-breadcrumb-item>
        </el-breadcrumb>
        <el-button class="fr" size="small" icon="el-icon-success" type="success" plain v-show="!isShow"
            @click="toDo">通过</el-button>
        <el-button class="fr" size="small" icon="el-icon-warning" type="danger" plain v-show="!isShow" style="margin-right:10px"
            @click="noToAdd">拒绝</el-button>
        <el-button class="fr" size="small" icon="el-icon-close"  plain v-show="!isShow" 
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
              prop="create_date"
              label="创建时间">
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
                    <el-button
                    size="mini"
                    type="danger"
                    @click="noToAdd(scope.row)">拒绝</el-button>
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
      <div style="padding:10px 2% 36px">
        <div class="search-title fl" style="margin-top:5px;">下一处理人：</div>
        <el-select 
          class="fl"
          size="small" 
          clearable
          v-model="nextPeo"
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
      <!-- 订单信息回显 -->
      <el-form :model="row" ref="row" label-width="100px" size="small" style="margin-top:15px;clear:both">
          <el-form-item label="订单编号" prop="num">
              <span class="form-record-show">{{ row.num }}</span>
          </el-form-item>
          <el-form-item label="订单时间" prop="province">
              <span class="form-record-show">{{ row.num }}</span>
          </el-form-item>
          <el-form-item label="总金额" prop="total_price">
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
import { getSuppSecInfo, updateProcess, closeProcess } from "../../api";
import { getList, addData } from "../../common";
import { mapState, mapActions } from "vuex";
export default {
  name: "finance",
  data() {
    return {
      search: {
        keyword: ""
      },
      nextPeo:"boss_id",
      total: 1,
      list: [],
      pageSize: 10,
      recordId: "",
      info: "",
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
    ...mapState('dict',["nextHandlePeo","returnOrderName"])
  },
  methods: {
    ...mapActions('dict',['getNextHandlePeo']),
    handleCurrentChange(val) {
      this.curPageIndex = val;
      getList({
        requestUrl: getSuppSecInfo,
        params: {
          ...this.search,
          pageSize: this.pageSize,
          purchase_order_state: this.returnOrderName.finance
        }
      }).then(item => {
        this.total = item.total;
        this.list = item.list;
      });
    },
    //同意
    toDo() {
      let obj = { ...this.row,  to_user_id: this.nextPeo };
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
              purchase_order_state: this.returnOrderName.finance
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
    noToAdd(val) {
      this.$prompt("请输入拒绝理由", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消"
      })
        .then(({ value }) => {
          console.log(val)
          if (value == null||value=='') {
            this.$message.error("请输入拒绝原因");
          } else {
            addData({
              requestUrl: closeProcess,
              params: {
                id: val.purchase_id||this.row.purchase_id,
                close_reason: value,
                close_id: "caiwu_id"
              }
            }).then(item => {
              if (item == 1) {
                this.$message({
                  message: "处理成功！",
                  type: "success"
                });
                if(!val){
                  this.isShow = !this.isShow;
                }
                getList({
                  requestUrl: getSuppSecInfo,
                  params: {
                    ...this.search,
                    pageSize: this.pageSize,
                    purchase_order_state: this.returnOrderName.finance
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
        this.search.state = "";
        this.search.handle_id = "";
      }
      getList({
        requestUrl: getSuppSecInfo,
        params: {
          ...this.search,
          pageSize: this.pageSize,
          purchase_order_state: this.returnOrderName.finance
        }
      }).then(item => {
        this.total = item.total;
        this.list = item.list;
      });
    }
  },
  created() {
    this.getNextHandlePeo(this.returnOrderName.boss);
    //获取列表
    getList({
      requestUrl: getSuppSecInfo,
      params: {
        ...this.search,
        pageSize: this.pageSize,
        purchase_order_state: this.returnOrderName.finance
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
