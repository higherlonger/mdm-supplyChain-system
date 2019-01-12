  <template>
<div>
    <!-- 导航栏 -->
    <nav class="app-location-wrapper">
        <el-breadcrumb separator="/" class="fl">
            <el-breadcrumb-item :to="{ path: '/sys_setting' }">物流管理</el-breadcrumb-item>
            <el-breadcrumb-item>订单管理</el-breadcrumb-item>
            <el-breadcrumb-item>门店退货单</el-breadcrumb-item>
        </el-breadcrumb>
        <el-button class="fr" size="small" v-if="buttonVisible.return" icon="el-icon-close" type="danger" plain v-show="!isShow"  style="margin-right:10px" 
            @click="handle('return')">关闭</el-button>
        <el-button class="fr" size="small" v-else disabled icon="el-icon-close" type="danger" plain v-show="!isShow"  style="margin-right:10px" 
            @click="handle('return')">关闭</el-button>
        <el-button class="fr" v-if="buttonVisible.finish" size="small" icon="el-icon-check" type="success" plain v-show="!isShow" style="margin-right:10px"
            @click="handle('finish')">完成</el-button>
        <el-button class="fr" v-else size="small" disabled icon="el-icon-check" type="success" plain v-show="!isShow" style="margin-right:10px"
            >完成</el-button>
        <el-button class="fr" v-if="buttonVisible.receive" size="small" icon="el-icon-success" plain v-show="!isShow" 
            @click="receive">接收</el-button>
        <el-button class="fr" v-else size="small" disabled icon="el-icon-success" plain v-show="!isShow" 
            >接收</el-button>
        <el-button class="fr" size="small" icon="el-icon-arrow-left" plain v-show="!isShow"
            @click="goPre">后退</el-button>
    </nav>
    <div style="background-color:#fff" v-show="isShow">
        <!-- 搜索条件 -->
        <div class="component-top">
              <div class="search-title fl">搜索：</div>
              <el-input
                  placeholder="请输入订单号"
                  prefix-icon="el-icon-search"
                  class="fl"
                  size="small"
                  @keyup.enter.native="searchHandle"
                  style="width:180px;margin-right:10px;"
                  v-model="search.keyword">
              </el-input>
              <div class="search-title fl">退货日期：</div>
                  <el-date-picker
                    v-model="timeSlot"
                    class="fl"
                    size="small"
                    @change="searchHandle('time')"
                    type="daterange"
                    value-format="yyyy-MM-dd"
                    range-separator="至"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                    style="width:220px;margin-right:10px;"
                    >
                  </el-date-picker>
              <div class="search-title fl">选择门店：</div>
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
              <div class="search-title fl">退货单状态：</div>
                <el-select 
                    class="fl"
                    size="small" 
                    clearable
                    v-model="search.order_state"
                    @change="searchHandle"
                    >
                    <el-option
                    v-for="item in returnOrderState"
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
                  prop="create_date"
                  label="订单时间"
                  >
                  <template slot-scope="scope">
                    <span :style="{color: scope.row.store_color}">{{ scope.row.create_date }}</span>
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
                    <el-tag v-if="scope.row.order_state=='accepted'">{{scope.row.order_state_text}}</el-tag>
                    <el-tag v-if="scope.row.order_state=='finished'" type="success">{{scope.row.order_state_text}}</el-tag>
                  </template>
                  </el-table-column>
                  <el-table-column label="操作" width="150">
                    <template slot-scope="scope">
                        <el-button
                        size="mini"
                        @click="okRev(scope.row)">查看</el-button>
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
            prop="warehouse_stock_id"
            label="批号"
            >
            <template slot-scope="scope">
              <el-select v-model="scope.row.warehouse_stock_id" placeholder="请选择" size="mini">
                  <el-option
                  v-for="item in scope.row.batch_num_array"
                  :key="item.value"
                  :label="item.name"
                  :value="item.value">
                  </el-option>
              </el-select>
            </template>
          </el-table-column>
          <el-table-column
            prop="number"
            label="数量">
          </el-table-column>
          <el-table-column
            prop="out_unit_text"
            label="数量">
          </el-table-column>
        </el-table>
    </div>
</div>
</template>

<script>
import {
  getReturnOrdersList,
  getLogisticsById,
  receiveLogistics,
  finishLogistics,
  returnLogistics
} from "../../api";
import { getList, stopInfo, getListPage, addData } from "../../common";
import { mapState, mapActions } from "vuex";
export default {
  name: "ads",
  data() {
    return {
      search: {
        keyword: "",
        order_state: "",
        store_id: "",
        from_date: "",
        to_date: ""
      },
      timeSlot: "",
      total: 1,
      list: [],
      pageSize: 10,
      recordId: "",
      info: "",
      curPageIndex: 1,
      isShow: !0,
      materialDetail: [],
      productDetail: [],
      selected: [],
      row: {},
      buttonVisible: {
        receive: !1,
        finish: !1,
        return: !0
      }
    };
  },
  components: {},
  computed: {
    ...mapState("stateChange", ["btnLoading"]),
    ...mapState("dict", ["storeList", "returnOrderState"])
  },
  methods: {
    ...mapActions("dict", ["getStoreList", "getReturnOrderState"]),
    handleCurrentChange(val) {
      this.curPageIndex = val;
      getList({
        requestUrl: getReturnOrdersList,
        params: {
          ...this.search,
          pageSize: this.pageSize
        }
      }).then(item => {
        this.total = item.total;
        this.list = item.list;
      });
    },
    handleSelectionChange(val) {
      this.selected = val;
    },
    //查看
    okRev(_row) {
      let flag = true;
      if (_row.order_state == "unaccepted") {
        flag = false;
        this.buttonVisible.receive = !0;
        this.buttonVisible.finish = !1;
      } else if (_row.order_state == "accepted") {
        this.buttonVisible.receive = !1;
        this.buttonVisible.finish = !0;
      } else {
        this.buttonVisible.receive = !1;
        this.buttonVisible.finish = !1;
      }
      if (
        _row.order_state == "revoked" ||
        _row.order_state == "returned" ||
        _row.order_state == "finished"
      ) {
        this.buttonVisible.return = !1;
      }
      let obj = { ..._row, is_accepted: flag };
      addData({
        requestUrl: getLogisticsById,
        paramsType: 1,
        preData: obj,
        returnType: 1
      }).then(item => {
        this.row = item.data;
        this.materialDetail = item.data.order_item.material_list;
        this.isShow = !this.isShow;
      });
    },
    //根据条件搜素
    searchHandle(val) {
      if (val == "all") {
        this.search.keyword = "";
        this.search.order_state = "";
        this.search.store_id = "";
        this.search.from_date = "";
        this.timeSlot = "";
        this.search.to_date = "";
      }
      if (val == "time") {
        if (this.timeSlot==null) {
          this.search.from_date = "";
          this.search.to_date = "";
        } else {
          this.search.from_date = this.timeSlot[0];
          this.search.to_date = this.timeSlot[1];
        }
      }
      getList({
        requestUrl: getReturnOrdersList,
        params: {
          ...this.search,
          pageSize: this.pageSize
        }
      }).then(item => {
        this.total = item.total;
        this.list = item.list;
      });
    },
    //完成
    handle(val) {
      let postUrl;
      if (val == "finish") {
        postUrl = finishLogistics;
      } else {
        postUrl = returnLogistics;
      }
      let obj = {
        id: this.row.id
      };
      addData({
        requestUrl: postUrl,
        paramsType: 1,
        preData: obj
      }).then(item => {
        if (item == 1) {
          this.$message({
            message: "操作成功！",
            type: "success"
          });
          this.isShow = !this.isShow;
          getList({
            requestUrl: getReturnOrdersList,
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
    },
    //后退
    goPre() {
      this.isShow = !this.isShow;
    },
    //接收
    receive() {
      let flag = false;
      for (let i = 0; i < this.row.order_item.material_list.length; i++) {
        if (this.row.order_item.material_list[i].warehouse_stock_id == "") {
          flag = true;
          break;
        }
      }
      if (flag) {
        this.$message.error("请为每一件商品选择批号！");
        return;
      }
      let obj = {
        order_item: this.row.order_item,
        id: this.row.id
      };
      addData({
        requestUrl: receiveLogistics,
        paramsType: 1,
        preData: obj
      }).then(item => {
        if (item == 1) {
          this.$message({
            message: "接收成功！",
            type: "success"
          });
          this.isShow = !this.isShow;
          getList({
            requestUrl: getReturnOrdersList,
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
    this.getStoreList();
    this.getReturnOrderState();
    //获取列表
    getList({
      requestUrl: getReturnOrdersList,
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
