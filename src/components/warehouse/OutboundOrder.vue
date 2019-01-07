 <template>
<div> 
    <!-- 导航栏 -->
    <nav class="app-location-wrapper">
        <el-breadcrumb separator="/" class="fl">
            <el-breadcrumb-item :to="{ path: '/sys_setting' }">物流管理</el-breadcrumb-item>
            <el-breadcrumb-item>物流管理</el-breadcrumb-item>
            <el-breadcrumb-item>出库单</el-breadcrumb-item>
        </el-breadcrumb>
        <el-button class="fr" size="small" icon="el-icon-arrow-left"  plain v-show="!isShow"
            @click="cancel">后退</el-button>
    </nav>

    <div style="background-color:#fff;" v-show="isShow">
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
                  v-for="item in orderStates"
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
              style="width:220px;margin-right:10px;"
              v-model="search.num">
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
              <el-table-column label="操作" width="150">
                  <template slot-scope="scope">
                      <el-button 
                      size="mini"
                      @click="recordHandle(scope.row,'seeVisible')">查看</el-button>
                    
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
    </div>


</div>
</template>

<script>
import { getCommodityList, discardReturnOrder, agreeOrder } from "../../api";
import { getList, addData } from "../../common";
import AppDialog from "../common/AppDialog.vue";
import { mapState, mapActions } from "vuex";
export default {
  name: "ads",
  data() {
    return {
      search: {
        state: "",
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
        params: { ...this.search, pageSize: this.pageSize,user_id:'5' }
      }).then(item => {
        this.total = item.total;
        this.list = item.list;
      });
    },
    //操作弹窗控制
    recordHandle(_row, text) {
      if (text == "seeVisible") {
        this.materialData = _row.order_item.material_list;
        this.commodityData = _row.order_item.product_list;
        this.detail = _row;
        this.isShow = !this.isShow;
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
              params: { ...this.search, pageSize: this.pageSize,user_id:'5' }
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
          params: { ...this.search, pageSize: this.pageSize,user_id:'5' }
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
        params: { ...this.search, pageSize: this.pageSize ,user_id:'5'}
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
      params: { ...this.search, pageSize: this.pageSize,user_id:'6' }
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
