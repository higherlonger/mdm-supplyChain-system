 <template>
<div> 
    <!-- 导航栏 -->
    <nav class="app-location-wrapper">
        <el-breadcrumb separator="/" class="fl">
            <el-breadcrumb-item :to="{ path: '/sys_setting' }">物流管理</el-breadcrumb-item>
            <el-breadcrumb-item>订单管理</el-breadcrumb-item>
            <el-breadcrumb-item>门店订货单</el-breadcrumb-item>
        </el-breadcrumb>
        <el-button class="fr" size="small" disabled icon="el-icon-warning" type="danger"  plain v-show="visible.detail" v-if="this.rowInfo.order_state=='to_be_confirmed'"
            @click="bohui">驳回</el-button>
        <el-button class="fr" size="small" icon="el-icon-warning" type="danger"  plain v-show="visible.detail" v-else
            @click="bohui">驳回</el-button>
        <el-button class="fr" size="small" icon="el-icon-arrow-left"  plain v-show="visible.detail" style="margin-right:10px"
            @click="cancel">后退</el-button> 
        <el-button class="fr" size="small" icon="el-icon-success" type="success" plain v-show="visible.outOrder" style="margin-right:10px"
            @click="submit">提交</el-button>
        <el-button class="fr" size="small" icon="el-icon-arrow-left"  plain v-show="visible.outOrder" 
          @click="cancel">后退</el-button>
    </nav>

    <div style="background-color:#fff;" v-show="visible.order">
      <!-- 搜索条件 -->
      <div class="component-top">
          <div class="search-title fl">门店：</div>
              <el-select 
                  class="fl"
                  size="small" 
                  clearable
                  v-model="search.store_id"
                  @change="searchHandle"
                  style="width:160px;margin-right:10px;"
                  >
                  <el-option
                  v-for="item in storeList"
                  :key="item.value"
                  :label="item.name"
                  :value="item.value">
                  </el-option>
              </el-select>
          <div class="search-title fl">搜索：</div>
          <el-input
              placeholder="请输入订单编号"
              prefix-icon="el-icon-search"
              class="fl"
              size="small"
              @keyup.enter.native="searchHandle"
              style="width:160px;margin-right:10px;"
              v-model="search.num">
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
                  v-for="item in orderStates"
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
              label="订单编号"
              >
              <template slot-scope="scope">
                <span :style="{color: scope.row.store_color}">{{ scope.row.num }}</span>
              </template>
              </el-table-column>
              <el-table-column
              prop="store_name"
              label="门店名称"
              >
              <template slot-scope="scope">
                <span :style="{color: scope.row.store_color}">{{ scope.row.store_name }}</span>
              </template>
              </el-table-column>
              <el-table-column
              prop="order_date"
              label="订货日期"
              >
              <template slot-scope="scope">
                <span :style="{color: scope.row.store_color}">{{ scope.row.order_date }}</span>
              </template>
              </el-table-column>
              <el-table-column
              prop="arrive_date"
              label="到货日期"
              >
              <template slot-scope="scope">
                <span :style="{color: scope.row.store_color}">{{ scope.row.arrive_date }}</span>
              </template>
              </el-table-column>
              <el-table-column
              prop="create_date"
              label="提交日期"
              >
              <template slot-scope="scope">
                <span :style="{color: scope.row.store_color}">{{ scope.row.create_date }}</span>
              </template>
              </el-table-column>
              <el-table-column
              prop="order_type_text"
              label="订单类型"
              >
              <template slot-scope="scope">
                <span :style="{color: scope.row.store_color}">{{ scope.row.order_type_text }}</span>
              </template>
              </el-table-column>
              <el-table-column
              prop="order_state_text"
              label="状态"
              width="100">
              <template slot-scope="scope">
                  <el-tag size="medium" :type=scope.row.order_state_color>{{scope.row.order_state_text}}</el-tag>
              </template>
              </el-table-column>
              <el-table-column label="操作" width="330">
                  <template slot-scope="scope">
                      <el-button 
                      size="mini"
                      @click="recordHandle(scope.row,'seeVisible')">查看</el-button>
                      <el-button 
                      size="mini"
                      type="warning"
                      @click="print(scope.row)">打印</el-button>
                      <el-button
                      size="mini"
                      type="primary"
                      v-if="scope.row.order_state=='to_be_received'"
                      @click="agreeOutOrder(scope.row)">接收</el-button>
                      <el-button
                      size="mini"
                      type="primary"
                      v-else
                      disabled
                      @click="agreeOutOrder(scope.row)">接收</el-button>
                      <el-button
                      size="mini"
                      type="success"
                      v-if="scope.row.order_state=='to_be_out_storage'"
                      @click="recordHandle(scope.row,'outOrder')">生成出库单</el-button>
                      <el-button
                      size="mini"
                      type="success"
                      v-else
                      disabled
                      @click="recordHandle(scope.row,'outOrder')">生成出库单</el-button>
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

    <!-- 查看订货单详情 --> 
    <div style="background-color:#fff;padding:10px 0" v-show="visible.detail">
        <h5 class="form-part-line">订单基本信息</h5>
        <el-form :model="detail" label-width="100px" class="demo-ruleForm frame" style="font-size:13px;">
            <el-form-item label="订单编号" class="leftShow item">
                <span class="form-record-show list">{{ detail.num }}</span>
            </el-form-item>
            <el-form-item label="门店名称" class="rightShow item">
                <span class="form-record-show list">{{ detail.store_name }}</span>
            </el-form-item>
            <el-form-item label="订货日期" class="leftShow item">
                <span class="form-record-show list">{{ detail.order_date }}</span>
            </el-form-item>
            <el-form-item label="到货日期" class="rightShow item">
                <span class="form-record-show list">{{ detail.arrive_date }}</span>
            </el-form-item>
            <el-form-item label="提交日期" class="leftShow item">
                <span class="form-record-show list">{{ detail.create_date }}</span>
            </el-form-item>
            <el-form-item label="订单类型" class="rightShow item">
                <span class="form-record-show list">{{ detail.order_type_text }}</span>
            </el-form-item>
            <el-form-item label="订单状态" class="leftShow item">
                <span class="form-record-show list">{{ detail.order_state_text }}</span>
            </el-form-item>
            <el-form-item label="撤销原因" class="rightShow remark">
                <span class="form-record-show list">{{ detail.close_reason }}</span>
            </el-form-item>
        </el-form>
        <!-- 采购项信息 -->
        <h5 class="form-part-line" style="margin-top:15px;">原材料清单</h5>
        <el-table
            :data="materialData"
            stripe
            border
            style="width: 95%;margin-left:18px">
            <el-table-column
            prop="num"
            label="原料编码"
            >
            </el-table-column>
            <el-table-column
            prop="name"
            label="原料名称"
            >
            </el-table-column>
            <el-table-column 
            prop="purchase_price"
            label="门店采购价">
            </el-table-column>
            <el-table-column 
            prop="order_quantity"
            label="订货数量">
            </el-table-column>
            <el-table-column 
            prop="unit"
            label="单位">
            </el-table-column>
            <el-table-column 
            prop="security_time"
            label="到货周期">
            </el-table-column>
        </el-table>
        <h5 class="form-part-line" style="margin-top:15px;">商品清单</h5>
        <el-table
            :data="commodityData"
            stripe
            border
            style="width: 95%;margin-left:18px">
            <el-table-column
            prop="num"
            label="商品编码"
            >
            </el-table-column>
            <el-table-column
            prop="name"
            label="商品名称"
            >
            </el-table-column>
            <el-table-column 
            prop="parent_name"
            label="所属分类">
            </el-table-column>
            <el-table-column 
            prop="order_quantity"
            label="订货数量">
            </el-table-column>
            <el-table-column 
            prop="unit"
            label="单位">
            </el-table-column>
            <el-table-column 
            prop="purchase_price"
            label="门店采购价">
            </el-table-column>
            <el-table-column 
            prop="sell_price"
            label="门店售卖价">
            </el-table-column>
        </el-table>
    </div>

    <!-- 生成出库单 -->
    <div style="background-color:#fff;margin-top:10px" v-show="visible.outOrder">
        <h5 class="form-part-line">订单基本信息</h5>
        <el-form :model="orderList" label-width="100px" class="demo-ruleForm frame" style="font-size:13px;">
            <el-form-item label="订单编号" class="leftShow item">
                <span class="form-record-show list">{{ orderList.num }}</span>
            </el-form-item>
            <el-form-item label="门店名称" class="rightShow item">
                <span class="form-record-show list">{{ orderList.store_name }}</span>
            </el-form-item>
            <el-form-item label="订货时间" class="leftShow item">
                <span class="form-record-show list">{{ orderList.order_date }}</span>
            </el-form-item>
            <el-form-item label="到货时间" class="rightShow item">
                <span class="form-record-show list">{{ orderList.arrive_date }}</span>
            </el-form-item>
        </el-form>
        <h5 class="form-part-line">缺货信息</h5>
        <el-table
              :data="problem"
              border
              style="width: 100%">
              <el-table-column
              prop="num"
              label="批号"
              >
              </el-table-column>
              <el-table-column
              prop="name"
              label="原料" 
              >
              </el-table-column>
              <el-table-column
              prop="total_material_quantity"
              label="数量">
              </el-table-column>
              <el-table-column
              prop="out_unit" 
              label="单位">
              </el-table-column>
          </el-table>
        <!-- 采购项信息 -->
        <div v-for="item in outData" :key="item.warehouse_name">
          <h5 class="form-part-line" style="margin-top:15px;">{{item.warehouse_name}}</h5>
          <el-table
              :data="item.order_item.material_list"
              border
              style="width: 100%">
              <el-table-column
              prop="name"
              label="原料" 
              >
              </el-table-column>
              <el-table-column
              prop="batch_num"
              label="批号"
              width="230"
              >
              <template slot-scope="scope">
                  <el-select v-model="scope.row.batch_num" placeholder="请选择" size="mini">
                      <el-option
                      v-for="item in scope.row.warehouse_stock_id"
                      :key="item.value"
                      :label="item.name"
                      :value="item.value">
                      </el-option>
                  </el-select>
              </template>
              </el-table-column>
              <el-table-column
              prop="out_unit_quantity"
              width="230"
              label="数量">
              <template slot-scope="scope">
                  <el-input v-model="scope.row.out_unit_quantity" size="mini"></el-input>
              </template>
              </el-table-column>
              <el-table-column
              prop="out_unit" 
              width="230"
              label="单位">
              </el-table-column>
          </el-table>
        </div>
    </div>

 
</div>
</template>

<script>
import {
  getCommodityList,
  discardReturnOrder,
  agreeOrder,
  getOutOrderInfo,
  submitOrder,
  printOrder
} from "../../api";
import { getList, addData, getListPage } from "../../common";
import AppDialog from "../common/AppDialog.vue";
import { mapState, mapActions } from "vuex";
export default {
  name: "ads",
  data() {
    return {
      search: {
        order_state: "",
        num: "",
        store_id: ""
      },
      detail: {},
      total: 1,
      list: [],
      pageSize: 10,
      curPageIndex: 1,
      materialData: [],
      commodityData: [],
      visible: {
        order: !0,
        detail: !1,
        outOrder: !1
      },
      outData: [],
      outOrderDetail: "",
      rowInfo: "",
      orderList: {},
      problem: []
    };
  },
  components: {
    AppDialog
  },
  computed: {
    ...mapState("stateChange", ["btnLoading"]),
    ...mapState("dict", ["orderStates", "storeList"])
  },
  methods: {
    ...mapActions("dict", ["getOrderStates", "getStoreList"]),
    handleCurrentChange(val) {
      this.curPageIndex = val;
      getList({
        currPage: this.curPageIndex,
        requestUrl: getCommodityList,
        params: { ...this.search, pageSize: this.pageSize }
      }).then(item => {
        this.total = item.total;
        this.list = item.list;
      });
    },
    setSearchParams(params) {
      const search = window.location.search;
      let str = search.indexOf("?") == -1 ? "?" : "&";
      let _arr = [];
      for (let i in params) {
        _arr.push(i + "=" + encodeURIComponent(params[i]));
      }
      return str + _arr.join("&");
    }, 
    //打印
    print(_row) {
      addData({
        requestUrl: printOrder,
        params: { id: _row.id },
        paramsType: 2
      }).then(item => {
        window.open(`../../../static/print.html${this.setSearchParams(item.data)}`,"_blank");
      });
    },
    bohui() {
      this.$prompt("请输入驳回原因", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消"
      })
        .then(({ value }) => {
          if (value == null) {
            this.$message.error("请输入驳回理由！");
          } else {
            this.cancelOrder(this._row, value);
          }
        })
        .catch(() => {});
    },
    //撤销订单
    cancelOrder(_row, value) {
      addData({
        requestUrl: discardReturnOrder,
        params: { id: _row.id, close_reason: value } 
      })
        // .then(item => {
        //   if (item == 1) {
        //     this.$message({
        //       message: "驳回成功！",
        //       type: "success"
        //     });
        //     getList({
        //       requestUrl: getCommodityList,
        //       params: { ...this.search, pageSize: this.pageSize }
        //     }).then(item => {
        //       this.total = item.total;
        //       this.list = item.list;
        //     });
        //   } else {
        //     this.$message.error("驳回失败");
        //   }
        // })
        // .catch(error => {
        //   this.$message.error("驳回失败");
        // });
    },
    submit() {
      let obj = {
        order_id: this.orderList.order_id,
        out_order_list: this.outData
      };
      addData({
        requestUrl: submitOrder,
        paramsType: 1,
        preData: obj
      }).then(item => {
        if (item == 1) {
          for(let attr in this.visible){
            this.visible[attr]=!1
          }
          this.visible['order']=!0;
          this.$message({
            message: "提交成功！",
            type: "success"
          });
        }else if(item==0){
          this.$message.error('提交失败！');
        }

      });
    },
    //操作弹窗控制
    recordHandle(_row, text) {
      this.rowInfo = _row;
      if (text == "seeVisible") {
        this.materialData = _row.order_item.material_list;
        this.commodityData = _row.order_item.product_list;
        this.detail = _row;
        for (let attr in this.visible) {
          this.visible[attr] = !1;
        }
        this.visible["detail"] = !0;
      }
      if (text == "outOrder") {
        for (let attr in this.visible) {
          this.visible[attr] = !1;
        }
        this.visible["outOrder"] = !0;
        //获取列表信息
        getListPage({
          requestUrl: getOutOrderInfo,
          params: { id: _row.id }
        }).then(item => {
          this.orderList.arrive_date = item.list.arrive_date;
          this.orderList.num = item.list.num;
          this.orderList.order_id = item.list.order_id;
          this.orderList.order_date = item.list.order_date;
          this.orderList.problem_map = item.list.problem_map;
          this.orderList.store_name = item.list.store_name;
          this.outData = item.list.warehouse_out_order_list;
          this.problem = item.list.problem_map.not_enough;
          // this.outOrderDetail=item.list
        });
      }
    },
    //出库
    agreeOutOrder(_row) {
      addData({
        requestUrl: agreeOrder,
        params: { id: _row.id }
      })
        .then(item => {
          if (item == 1) {
            this.$message({
              message: "接收成功！",
              type: "success"
            });
            getList({
              requestUrl: getCommodityList,
              params: { ...this.search, pageSize: this.pageSize }
            }).then(item => {
              this.total = item.total;
              this.list = item.list;
            });
          } else {
            this.$message.error("接收失败");
          }
        })
        .catch(error => {
          this.$message.error("接收失败");
        });
    },
    //重新获取数据
    reloadGetData(res) {
      if (res == "reload") {
        for (let attr in this.dialog) {
          this.dialog[attr] = !1;
        }
        getList({
          requestUrl: getCommodityList,
          params: { ...this.search, pageSize: this.pageSize }
        }).then(item => {
          this.list = item;
        });
      }
    },
    //根据条件搜素
    searchHandle(val) {
      if (val == "all") {
        this.search.num = "";
        this.search.order_state = "";
        this.search.store_id="";
      }
      getList({
        requestUrl: getCommodityList,
        params: { ...this.search, pageSize: this.pageSize }
      }).then(item => {
        this.total = item.total;
        this.list = item.list;
      });
    },
    //后退
    cancel() {
      for (let attr in this.visible) {
        this.visible[attr] = !1;
      }
      this.visible["order"] = !0;
    }
  },
  created() {
    this.getOrderStates();
    this.getStoreList();
    //获取列表
    getList({
      requestUrl: getCommodityList,
      params: { ...this.search, pageSize: this.pageSize }
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
