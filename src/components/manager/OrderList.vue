 <template>
<div> 
    <!-- 导航栏 -->
    <nav class="app-location-wrapper">
        <el-breadcrumb separator="/" class="fl">
            <el-breadcrumb-item :to="{ path: '/sys_setting' }">店长管理</el-breadcrumb-item>
            <el-breadcrumb-item>订单管理</el-breadcrumb-item>
            <el-breadcrumb-item>商品订货</el-breadcrumb-item>
        </el-breadcrumb>
        <el-button class="fr" size="small" icon="el-icon-arrow-left"  plain v-show="!isShow"
            @click="cancel">后退</el-button>
    </nav>

    <div style="background-color:#fff;" v-show="isShow">
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
              </el-table-column>
              <el-table-column
              prop="store_name"
              label="门店名称"
              >
              </el-table-column>
              <el-table-column
              prop="order_date"
              label="订货日期"
              >
              </el-table-column>
              <el-table-column
              prop="arrive_date"
              label="到货日期"
              >
              </el-table-column>
              <el-table-column
              prop="create_date"
              label="提交日期"
              >
              </el-table-column>
              <el-table-column
              prop="order_type_text"
              label="订单类型"
              >
              </el-table-column>
              <el-table-column
              prop="order_state_text"
              label="状态"
              width="100">
              <template slot-scope="scope">
                  <el-tag size="medium" :type=scope.row.order_state_color>{{scope.row.order_state_text}}</el-tag>
              </template>
              </el-table-column>
              <el-table-column label="操作" width="250">
                  <template slot-scope="scope">
                      <el-button
                      size="mini"
                      @click="recordHandle(scope.row,'seeVisible')">查看</el-button>
                      <el-button
                      size="mini" 
                      type="success"
                      v-if="scope.row.order_state=='sorting_finish'"
                      @click="recordHandle(scope.row,'receive')">接收</el-button>
                      <el-button
                      size="mini" 
                      type="success"
                      disabled
                      v-else
                      @click="recordHandle(scope.row,'receive')">接收</el-button>
                      <el-button
                      size="mini" 
                      type="danger"
                      v-if="scope.row.order_state=='to_be_confirmed'||scope.row.order_state=='to_be_received'"
                      @click="recordHandle(scope.row,'cancel')">撤销</el-button>
                      <el-button
                      size="mini" 
                      type="danger"
                      disabled
                      v-else
                      @click="recordHandle(scope.row,'cancel')">撤销</el-button>
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
    <div style="background-color:#fff;padding:10px 0" v-show="!isShow">
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


</div>
</template>

<script>
import { getCommodityList, cancelOrder, receiveOrder } from "../../api";
import { getList, addData } from "../../common";
import AppDialog from "../common/AppDialog.vue";
import { mapState, mapActions } from "vuex";
export default {
  name: "ads",
  data() {
    return {
      search: {
        state: "",
        keyword: ""
      },
      detail: {},
      total: 1,
      list: [],
      pageSize: 10,
      curPageIndex: 1,
      materialData: [],
      commodityData: [],
      isShow: true
    };
  },
  components: {
    AppDialog
  },
  computed: {
    ...mapState("stateChange", ["btnLoading"]),
    ...mapState("dict", ["orderStates"])
  },
  methods: {
    ...mapActions("dict", ["getOrderStates"]),
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
    //操作弹窗控制
    recordHandle(_row, text) {
      if (text == "cancel") {
        this.$prompt("请输入撤销订单原因", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消"
        })
          .then(({ value }) => {
            if (value == null) {
              this.$message.error("请输入撤销理由！");
            } else {
              this.cancelOrder(_row, value);
            }
          })
          .catch(() => {});
      }
      if (text == "seeVisible") {
        this.materialData = _row.order_item.material_list;
        this.commodityData = _row.order_item.product_list;
        this.detail = _row;
        this.isShow = !this.isShow;
      }
      if (text == "receive") {
        this.received(_row.id);
      }
    },
    //接收入库
    received(_id) {
      addData({
        requestUrl: receiveOrder,
        params: { id: _id }
      }).then(item => {
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
        }
      });
    },
    //撤销订单
    cancelOrder(_row, value) {
      addData({
        requestUrl: cancelOrder,
        params: { id: _row.id, close_reason: value }
      })
        .then(item => {
          if (item == 1) {
            this.$message({
              message: "撤销成功！",
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
            this.$message.error("撤销失败");
          }
        })
        .catch(error => {
          this.$message.error("撤销失败");
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
        this.search.keyword = "";
        this.search.state = "";
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
      this.isShow = !this.isShow;
    }
  },
  created() {
    this.getOrderStates();
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
