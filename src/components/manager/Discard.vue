<template>
<div>
    <!-- 导航栏 -->
    <nav class="app-location-wrapper">
        <el-breadcrumb separator="/" class="fl">
            <el-breadcrumb-item :to="{ path: '/sys_setting' }">店长管理</el-breadcrumb-item>
            <el-breadcrumb-item>订单管理</el-breadcrumb-item>
            <el-breadcrumb-item>废弃单</el-breadcrumb-item>
        </el-breadcrumb>
        <el-button class="fr" v-if="flag" size="small" icon="el-icon-warning" type="danger" plain v-show="!isShow"
            @click="cancleConfim('')">撤销</el-button>
        <el-button class="fr" v-else size="small" icon="el-icon-warning" type="danger" plain v-show="!isShow"
            disabled>撤销</el-button>
        <el-button class="fr" size="small" icon="el-icon-arrow-left"  plain v-show="!isShow"  style="margin-right:10px"
            @click="goPre">后退</el-button>
    </nav>
    <div style="background-color:#fff" v-show="isShow">
        <!-- 搜索条件 -->
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
                v-model="search.order_state"
                @change="searchHandle"
                style="width:160px;margin-right:10px;"
                >
                <el-option
                v-for="item in returnOrderState"
                :key="item.value"
                :label="item.name"
                :value="item.value">
                </el-option>
            </el-select>
        <div class="search-title fl">开始时间：</div>
              <el-date-picker
                v-model="search.beginTime"
                @change="searchHandle"
                type="date"
                class="fl"
                style="width:160px" 
                size="small"
                value-format="yyyy-MM-dd"
                placeholder="选择日期">
              </el-date-picker>
          <div class="search-title fl" style="margin-left:10px">结束时间：</div>
              <el-date-picker
                v-model="search.endTime" 
                value-format="yyyy-MM-dd"
                @change="searchHandle"
                type="date"
                class="fl"
                style="width:160px"
                size="small"
                placeholder="选择日期">
              </el-date-picker>
          
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
                style="width: 100%;">
                <el-table-column
                  prop="num"
                  label="编号"
                  >
                  <template slot-scope="scope">
                    <span :style="{color: scope.row.store_color}">{{ scope.row.num }}</span>
                  </template>
                  </el-table-column>
                  <el-table-column
                  prop="create_date"
                  label="订单时间"
                  >
                  <template slot-scope="scope">
                    <span :style="{color: scope.row.store_color}">{{ scope.row.create_date }}</span>
                  </template>
                  </el-table-column>
                  <el-table-column
                  prop="city"
                  label="城市"
                  >
                  <template slot-scope="scope">
                    <span :style="{color: scope.row.store_color}">{{ scope.row.city }}</span>
                  </template>
                  </el-table-column>
                  <el-table-column
                  prop="order_state_text"
                  label="状态"
                  >
                    <template slot-scope="scope">
                        <el-tag v-if="scope.row.order_state=='revoked'" type="danger">{{scope.row.order_state_text}}</el-tag>
                        <el-tag v-if="scope.row.order_state=='returned'"  type="info">{{scope.row.order_state_text}}</el-tag>
                        <el-tag v-if="scope.row.order_state=='unaccepted'" type="warning">{{scope.row.order_state_text}}</el-tag>
                        <el-tag v-if="scope.row.order_state=='accepted'" >{{scope.row.order_state_text}}</el-tag>
                        <el-tag v-if="scope.row.order_state=='finished'" type="success">{{scope.row.order_state_text}}</el-tag>
                    </template>
                  </el-table-column>
                  <el-table-column label="操作" width="200">
                    <template slot-scope="scope">
                        <el-button
                        size="mini"
                        @click="toDetail(scope.row)">查看</el-button>
                        <el-button
                        size="mini"
                        type="danger"
                        v-if="scope.row.order_state=='unaccepted'"
                        @click="cancleConfim(scope.row)">撤销</el-button>
                        <el-button
                        size="mini"
                        type="danger"
                        v-else
                        disabled
                       >撤销</el-button>
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
        <h5 class="form-part-line">订单基本信息</h5>
        <el-form :model="row" label-width="100px" class="demo-ruleForm frame" style="font-size:13px;">
            <el-form-item label="订单编号" class="leftShow item">
                <span class="form-record-show list">{{ row.num }}</span>
            </el-form-item>
            <el-form-item label="所在城市" class="rightShow item">
                <span class="form-record-show list">{{ row.city }}</span>
            </el-form-item>
            <el-form-item label="门店名称" class="leftShow item">
                <span class="form-record-show list">{{ row.store_name }}</span>
            </el-form-item>
            <el-form-item label="订货时间" class="rightShow item">
                <span class="form-record-show list">{{ row.order_date }}</span>
            </el-form-item>
            <el-form-item label="到货时间" class="leftShow item">
                <span class="form-record-show list">{{ row.arrive_date }}</span>
            </el-form-item>
            <el-form-item label="废弃原因" class="rightShow item">
                <span class="form-record-show list">{{ row.scrap_reason }}</span>
            </el-form-item>
            <el-form-item label="废弃图片" style="float:left">
                <img :src="item" v-for="item in row.image" :key="item" style="float:left;width:200px;margin-right:10px">
            </el-form-item>
        </el-form>
        <h5 class="form-part-line" style="margin-top:15px;">原材料清单</h5>
        <el-table
          :data="materialDetail"
          stripe
          border 
          style="width: 100%">
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
            prop="total_material_quantity"
            label="数量">
          </el-table-column>
          <el-table-column
            prop="min_unit"
            label="单位">
          </el-table-column>
          <el-table-column
            prop="cost_price"
            label="成本价">
          </el-table-column>
          <el-table-column
            prop="purchase_price"
            label="采购价">
          </el-table-column>
        </el-table>
        <h5 class="form-part-line" style="margin-top:15px;">商品清单</h5>
        <el-table
          :data="productDetail"
          stripe
          border 
          style="width: 100%">
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
            prop="total_material_quantity"
            label="数量">
          </el-table-column>
          <el-table-column
            prop="min_unit"
            label="单位">
          </el-table-column>
          <el-table-column
            prop="cost_price"
            label="成本价">
          </el-table-column>
          <el-table-column
            prop="purchase_price"
            label="采购价">
          </el-table-column>
        </el-table>
    </div>
</div>
</template>

<script>
import { getDiscardList, closeDiscardOrdersList } from "../../api";
import { getList, stopInfo, getListPage, addData } from "../../common";
import { mapState, mapActions } from "vuex";
export default {
  name: "return-order",
  data() {
    return {
      search: {
        keyword: "",
        order_state: "",
        beginTime:"",
        endTime:""
      },
      total: 1,
      list: [],
      pageSize: 10,
      curPageIndex: 1,
      isShow: !0,
      materialDetail: [],
      productDetail: [],
      row: {},
      flag: ""
    };
  },
  components: {},
  computed: {
    ...mapState("stateChange", ["btnLoading"]),
    ...mapState("dict", ["returnOrderState"])
  },
  methods: {
    ...mapActions("dict", ["getReturnOrderState"]),
    //分页
    handleCurrentChange(val) {
      this.curPageIndex = val;
      getList({
        requestUrl: getDiscardList,
        params: {
          ...this.search,
          pageSize: this.pageSize
        }
      }).then(item => {
        this.total = item.total;
        this.list = item.list;
      });
    },
    //根据条件搜素
    searchHandle(val) {
      if (val == "all") {
        this.search.keyword = "";
        this.search.order_state = "";
        this.search.beginTime="";
        this.search.endTime="";
      }
      getList({
        requestUrl: getDiscardList,
        params: {
          ...this.search,
          pageSize: this.pageSize
        }
      }).then(item => {
        this.total = item.total;
        this.list = item.list;
      });
    },
    //查看订单详情
    toDetail(_row) {
      this.row = _row;
      this.materialDetail = _row.order_item.material_list;
      this.productDetail = _row.order_item.product_list;
      this.isShow = !this.isShow;
      if (_row.order_state == "unaccepted") {
        this.flag = true;
      } else {
        this.flag = false;
      }
    },
    //后退
    goPre() {
      this.isShow = !this.isShow;
    },
    cancleConfim(_row) {
      this.$prompt("请输入撤销原因", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消"
      })
        .then(({ value }) => {
          if (value == undefined) {
            this.$message.error("请输入撤销原因！");
          } else {
            this.cancleOrder(_row, value);
          }
        })
        .catch(() => {});
    },
    //撤销订单
    cancleOrder(_row, value) {
      if (_row != "") {
        this.row = _row;
      }
      let obj = {
        id: this.row.id,
        close_reason: value
      };
      addData({
        requestUrl: closeDiscardOrdersList,
        paramsType: 1,
        preData: obj
      }).then(item => {
        if (item == 1) {
          this.$message({
            message: "撤销成功！",
            type: "success"
          });
          if (_row == "") {
            this.isShow = !this.isShow;
          }
          getList({
            requestUrl: getDiscardList,
            params: {
              ...this.search,
              pageSize: this.pageSize
            }
          }).then(item => {
            this.total = item.total;
            this.list = item.list;
          });
        }
      });
    }
  },
  created() {
    this.getReturnOrderState();
    //获取列表
    getList({
      requestUrl: getDiscardList,
      params: {
        ...this.search,
        pageSize: this.pageSize
      }
    }).then(item => {
      this.total = item.total;
      this.list = item.list;
    });
  }
};
</script>

<style>
.frame {
  overflow: hidden;
}
.item {
  width: 35%;
  background-color: white;
}
.remark {
  width: 78%;
  background-color: white;
}
.leftShow {
  float: left;
  margin-right: 8%;
}
.rightShow {
  float: left;
}
.list {
  margin-top: 4px;
}
.view {
  margin-left: 36px;
  width: 75%;
}
.colorText div div {
  color: #409eff;
}
</style>
