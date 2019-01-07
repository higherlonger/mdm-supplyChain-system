 <template>
<div> 
    <!-- 导航栏 --> 
    <nav class="app-location-wrapper">
        <el-breadcrumb separator="/" class="fl">
            <el-breadcrumb-item :to="{ path: '/sys_setting' }">物流管理</el-breadcrumb-item>
            <el-breadcrumb-item>订单管理</el-breadcrumb-item>
            <el-breadcrumb-item>移库单</el-breadcrumb-item>
        </el-breadcrumb>
        <el-button class="fr" size="small" icon="el-icon-arrow-left"  plain v-show="visible.detail"
            @click="cancel">后退</el-button>
        <el-button class="fr" size="small" type="success" icon="el-icon-plus"  plain v-show="visible.order"
            @click="addMove('addOrder')">新增移库</el-button>
        <el-button class="fr" size="small" type="success" icon="el-icon-success"  plain v-show="visible.addOrder"
            @click="okMove">确定</el-button>
    </nav>

    <div style="background-color:#fff;" v-show="visible.order">
      <!-- 搜索条件 -->
      <div class="component-top">
          <div class="search-title fl">存储条件：</div>
              <el-select 
                  class="fl"
                  size="small" 
                  v-model="search.storage_condition"
                  @change="searchHandle"
                  style="width:160px;margin-right:10px;"
                  >
                  <el-option
                  v-for="item in storeCondition"
                  :key="item.value"
                  :label="item.name"
                  :value="item.value">
                  </el-option>
              </el-select>
          <div class="search-title fl">移出仓库：</div>
              <el-select 
                  class="fl"
                  size="small" 
                  v-model="search.warehourse_from_id"
                  @change="searchHandle"
                  style="width:160px;margin-right:10px;"
                  >
                  <el-option
                  v-for="item in warehouseList"
                  :key="item.value"
                  :label="item.name"
                  :value="item.value">
                  </el-option>
              </el-select>
          <div class="search-title fl">移入仓库：</div>
              <el-select 
                  class="fl"
                  size="small" 
                  v-model="search.warehourse_to_id"
                  @change="searchHandle"
                  style="width:160px;margin-right:10px;"
                  >
                  <el-option
                  v-for="item in warehouseList"
                  :key="item.value"
                  :label="item.name"
                  :value="item.value">
                  </el-option>
              </el-select>
          <div class="search-title fl">开始时间：</div>
              <el-date-picker
                v-model="search.out_date_begin"
                type="date"
                class="fl"
                style="width:160px"
                size="small"
                placeholder="选择日期">
              </el-date-picker>
          <div class="search-title fl" style="margin-left:10px">结束时间：</div>
              <el-date-picker
                v-model="search.out_date_end"
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
    </div>

    <!-- 新增移库 -->
    <div style="background-color:#fff;" v-show="visible.addOrder">
        <div class="topNav">
          <div class="search-title">存储条件：</div>
              <el-select 
                  class="fl"
                  size="small" 
                  v-model="search.storage_condition"
                  @change="searchHandle"
                  style="width:160px;margin-right:10px;"
                  >
                  <el-option
                  v-for="item in storeCondition"
                  :key="item.value"
                  :label="item.name"
                  :value="item.value">
                  </el-option>
              </el-select>
          <div class="search-title">移出仓库：</div>
              <el-select 
                  class="fl"
                  size="small" 
                  clearable
                  v-model="search.warehourse_from_id"
                  @change="searchHandle"
                  style="width:160px;margin-right:10px;"
                  >
                  <el-option
                  v-for="item in warehouseList"
                  :key="item.value"
                  :label="item.name"
                  :value="item.value">
                  </el-option>
              </el-select>
          <div class="search-title">移入仓库：</div>
              <el-select 
                  class="fl"
                  size="small" 
                  clearable
                  v-model="search.warehourse_to_id"
                  @change="searchHandle"
                  style="width:160px;margin-right:10px;"
                  >
                  <el-option
                  v-for="item in warehouseList"
                  :key="item.value"
                  :label="item.name"
                  :value="item.value">
                  </el-option>
              </el-select>
          <span class="search-title">移库时间：</span>
              <el-date-picker
                  v-model="time"
                  type="date"
                  size="small"
                  class="time"
                  value-format="yyyy-MM-dd"
                  placeholder="选择到货日期">
              </el-date-picker>
        </div>
        <div class="toAdd" style="background-color:#f2f2f2;overflow:hidden;">
        <div style="background-color:#fff;float:left;margin-top:10px;width:30%;">
        <el-input
          placeholder="输入关键字进行过滤"
          v-model="filterText"
          style="margin-bottom:5px"
          >
          </el-input>
          <!-- 树形结构 -->
          <el-tree
            :data="moveOrderTree"
            show-checkbox
            default-expand-all
            node-key="id" 
            ref="tree"
            highlight-current 
            :filter-node-method="filterNode"
            @check="handleNodeClick"
            :props="defaultProps">
          </el-tree>
        </div>
        <!-- 表格 -->   
        <div style="width: 68.2%;float:right;margin-top:10px;background-color:#fff;">
          <el-table
          :data="tableData"
          border
          ref="table"
          > 
          <el-table-column
              prop="num"
              label="商品编码"
              width="100"
              >
          </el-table-column>
          <el-table-column
              prop="name"
              label="商品名称"
              >
          </el-table-column> 
           <el-table-column 
              prop="batch_num"
              label="批号">
          </el-table-column>
          <el-table-column
              prop="order_quantity"
              label="数量"
              width="150"
              >
              <template slot-scope="scope">
                  <el-input-number v-model="scope.row.order_quantity" :min="1" size="small"></el-input-number>
              </template>
          </el-table-column>
          <el-table-column 
              prop="unit"
              width="100"
              label="单位">
          </el-table-column> 
          <el-table-column label="操作" width="100">
              <template slot-scope="scope">
                  <el-button
                  size="mini"
                  @click="removeNode(scope.row.id)"
                  >移除</el-button>
              </template>
          </el-table-column>
          </el-table>
        </div> 
      </div>
    </div>

</div>
</template>

<script>
import {
  getMoveOrderList,
  getMoveOrderTree,
  getWarehouseValue,
  okMoveOrder
} from "../../api";
import { getList, addData, getListPage } from "../../common";
import AppDialog from "../common/AppDialog.vue";
import { mapState, mapActions } from "vuex";
export default {
  name: "moveOrder",
  data() {
    return {
      search: {
        warehourse_to_id: "",
        warehourse_from_id: "",
        out_date_begin: "",
        out_date_end: "",
        storage_condition: ""
      },
      warehouseList: [],
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
        addOrder: !1
      },
      filterText: "",
      defaultProps: {
        children: "children",
        label: "label"
      },
      time: "",
      moveOrderTree: [],
      tableData: [],
      flag: false
    };
  },
  components: {
    AppDialog
  },
  computed: {
    ...mapState("stateChange", ["btnLoading"]),
    ...mapState("dict", ["storeCondition"])
  },
  methods: {
    ...mapActions("dict", ["getStoreCondition"]),
    handleCurrentChange(val) {
      this.curPageIndex = val;
      getList({
        currPage: this.curPageIndex,
        requestUrl: getMoveOrderList,
        params: { ...this.search, pageSize: this.pageSize }
      }).then(item => {
        this.total = item.total;
        this.list = item.list;
      });
    },
    removeNode(_id) {
      this.tableData = this.tableData.filter(item => {
        return item.id != _id;
      });
      this.$refs.tree.setCheckedNodes(this.tableData);
    },
    getCheckedNodes() {
      this.tableData = [];
      let val = this.$refs.tree.getCheckedNodes();
      let filterVal = val.filter(item => {
        return !item.children;
      });
      this.tableData = filterVal;
    },
    handleNodeClick() {
      this.getCheckedNodes();
    },
    filterNode(value, data) {
      if (!value) return true;
      return data.search_text.indexOf(value) !== -1;
    },
    //新增移库
    addMove(text) {
      this.flag = true;
      this.pageVisible(text);
    },
    //操作弹窗控制
    recordHandle(_row, text) {
      if (text == "seeVisible") {
        this.materialData = _row.order_item.material_list;
        this.commodityData = _row.order_item.product_list;
        this.detail = _row;
        this.pageVisible("detail");
      }
    },
    //切换控制
    pageVisible(text) {
      for (let attr in this.visible) {
        this.visible[attr] = !1;
      }
      for (let item in this.search) {
        this.search[item] = "";
      }
      this.visible[text] = !0;
    },
    //重新获取数据
    reloadGetData(res) {
      if (res == "reload") {
        for (let attr in this.dialog) {
          this.dialog[attr] = !1;
        }
        getList({
          requestUrl: getMoveOrderList,
          params: { ...this.search, pageSize: this.pageSize }
        }).then(item => {
          this.list = item;
        });
      }
    },
    //根据条件搜素
    searchHandle(val) {
      if (val == "all") {
        this.search.warehourse_to_id = "";
        this.search.warehourse_from_id = "";
        this.search.out_date_begin = "";
        this.search.out_date_end = "";
        this.storage_condition = "";
      }
      getList({
        requestUrl: getMoveOrderList,
        params: { ...this.search, pageSize: this.pageSize }
      }).then(item => {
        this.total = item.total;
        this.list = item.list;
      });
    },
    //后退
    cancel() {
      this.pageVisible("order");
    },
    //确定移库
    okMove() {
      if(this.search.warehourse_to_id==''||this.search.warehourse_to_id==''){
        this.$message.error('请选择移出仓库或移入仓库！');
        return;
      }
      if(this.time==''){
        this.$message.error('请选择移库时间！');
        return;
      }
      let formatData = {
        order_item:this.tableData,
        warehourse_to_id:this.search.warehourse_to_id,
        warehourse_from_id:this.search.warehourse_from_id,
        out_date:this.time
      };
      addData({
        requestUrl: okMoveOrder,
        paramsType: 1,
        preData: formatData,
        returnType: 1
      }).then(item=>{
        if (item.code == 1) {
          this.tableData=[];
          this.pageVisible('order');
          this.$message({
            message: "移库成功！",
            type: "success"
          });
        }
      })
    }
  },
  created() {
    this.getStoreCondition();

    //获取列表
    getList({
      requestUrl: getMoveOrderList,
      params: { ...this.search, pageSize: this.pageSize }
    }).then(item => {
      this.total = item.total;
      this.list = item.list;
    });
    //获取仓库信息
    getListPage({
      requestUrl: getWarehouseValue,
      params: { type: "" }
    }).then(item => {
      this.warehouseList = item.list;
    });
    //获取树
    getListPage({
      requestUrl: getMoveOrderTree,
      params: { type: "" }
    }).then(item => {
      this.moveOrderTree = item.list.children;
    });
  },
  watch: {
    "search.storage_condition": {
      handler(curVal, oldVal) {
        if (curVal != oldVal) {
          this.search.warehourse_to_id = "";
          this.search.warehourse_from_id = "";
          //获取仓库信息
          getListPage({
            requestUrl: getWarehouseValue,
            params: { type: this.search.storage_condition }
          }).then(item => {
            this.warehouseList = item.list;
          });
          if (this.flag) {
            getListPage({
              requestUrl: getMoveOrderTree,
              params: { type: this.search.storage_condition }
            }).then(item => {
              // console.log(item)
              this.moveOrderTree = item.list.children;
            });
          }
        }
      },
      immediate: true,
      deep: true
    }
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
.topNav {
  padding: 10px;
}
.search-title {
  float: left;
  margin-top: 5px;
}
.search-title2 {
  float: left;
  margin-top: 5px;
}
</style>
