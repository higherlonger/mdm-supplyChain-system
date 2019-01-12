 <template>
<div>
    <!-- 导航栏 -->
    <nav class="app-location-wrapper">
        <el-breadcrumb separator="/" class="fl">
            <el-breadcrumb-item :to="{ path: '/sys_setting' }">仓库管理</el-breadcrumb-item>
            <el-breadcrumb-item>订单管理</el-breadcrumb-item>
            <el-breadcrumb-item>废弃单</el-breadcrumb-item> 
        </el-breadcrumb>
        <el-button class="fr" v-if="flag" size="small" icon="el-icon-warning" type="danger" plain v-show="this.page.detail"
            @click="cancleConfim('')">撤销</el-button>
        <el-button class="fr" v-else size="small" icon="el-icon-warning" type="danger" plain v-show="this.page.detail"
            disabled>撤销</el-button>
        <el-button class="fr" size="small" icon="el-icon-arrow-left"  plain v-show="this.page.detail"  style="margin-right:10px"
            @click="goPre">后退</el-button>
        <el-button class="fr" size="small" icon="el-icon-plus" type="success"  plain v-show="this.page.list"  style="margin-right:10px"
            @click="addScrap">新增废弃</el-button>
        <el-button class="fr" size="small" icon="el-icon-success" type="success"  plain v-show="this.page.add"  style="margin-right:10px"
            @click="okToScrap">确定</el-button>
    </nav>
    <!-- 废弃单列表 -->
    <div style="background-color:#fff" v-show="this.page.list">
        <!-- 搜索条件 -->
        <div class="component-top">
            <div class="search-title fl">搜索：</div>
            <el-input
                placeholder="请输入编号"
                prefix-icon="el-icon-search"
                class="fl"
                size="small"
                @keyup.enter.native="searchHandle"
                style="width:160px;margin-right:10px;"
                v-model="search.keyword">
            </el-input>
        <div class="search-title fl">开始时间：</div>
              <el-date-picker
                v-model="search.beginTime"
                type="date"
                @change="searchHandle"
                class="fl"
                style="width:160px"
                value-format="yyyy-MM-dd"
                size="small"
                placeholder="选择日期">
              </el-date-picker>
          <div class="search-title fl" style="margin-left:10px">结束时间：</div>
              <el-date-picker
                v-model="search.endTime"
                type="date"
                class="fl"
                @change="searchHandle"
                style="width:160px"
                value-format="yyyy-MM-dd"
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
                  prop="scrap_date"
                  label="废弃时间"
                  >
                  <template slot-scope="scope">
                    <span :style="{color: scope.row.store_color}">{{ scope.row.scrap_date }}</span>
                  </template>
                  </el-table-column>
                  <el-table-column
                  prop="warehouse_name"
                  label="仓库"
                  >
                  <template slot-scope="scope">
                    <span :style="{color: scope.row.store_color}">{{ scope.row.warehouse_name }}</span>
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
    <!-- 废弃单详情 -->
    <div style="background-color:#fff" v-show="this.page.detail">
        <h5 class="form-part-line">订单基本信息</h5>
        <el-form :model="row" label-width="100px" class="demo-ruleForm frame" style="font-size:13px;">
            <el-form-item label="订单编号" class="leftShow item">
                <span class="form-record-show list">{{ row.num }}</span>
            </el-form-item>
            <el-form-item label="仓库名称" class="rightShow item">
                <span class="form-record-show list">{{ row.warehouse_name }}</span>
            </el-form-item>
            <el-form-item label="废弃时间" class="leftShow item"> 
                <span class="form-record-show list">{{ row.scrap_date }}</span>
            </el-form-item>
            <el-form-item label="废弃原因" class="rightShow item">
                <span class="form-record-show list">{{ row.scrap_reason }}</span>
            </el-form-item>
            <el-form-item label="废弃图片" style="float:left;clear:both">
                <img :src="item.id" v-for="item in row.image" :key="item.id" style="float:left;width:200px;margin-right:10px">
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
    </div>
    <!-- 新增废弃单 -->
    <div class="toAdd" style="background-color:#f2f2f2;overflow:hidden;" v-show="this.page.add">
      <div style="background-color:#fff;overflow:hidden;">
        <h5 class="form-part-line">废弃单基本信息</h5>
        <el-form :model="scrapInfo" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm frame" style="font-size:13px;">
              <el-form-item label="废弃原因" style="width:60%" prop="reason">
                  <el-input v-model="scrapInfo.reason" placeholder="请输入废弃原因"></el-input>
              </el-form-item>
              <el-form-item label="废弃图片" prop="picture">
                  <el-upload
                    action="https://up-z2.qbox.me"
                    list-type="picture-card" 
                    ref='upload'
                    :on-success="handleAvatarSuccess"
                    :data="postData"
                    :on-preview="handlePictureCardPreview"
                    :on-remove="handleRemove">
                    <i class="el-icon-plus"></i>
                  </el-upload>
                  <el-dialog :visible.sync="dialogVisible">
                    <img width="100%" :src="dialogImageUrl" alt="">
                  </el-dialog>
              </el-form-item>
        </el-form>
      </div>
      <div style="background-color:#fff;margin-top:10px">
        <!-- <h5 class="form-part-line">废弃单内容</h5> -->
        <div style="background-color:#fff;float:left;margin-top:10px;width:30%;">
        <el-input
          placeholder="输入关键字进行过滤"
          v-model="filterText"
          style="margin-bottom:5px"
          >
          </el-input>
          <!-- 树形结构 -->
          <el-tree
          :data="inputWarehouseTree.children" 
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
      </div>
      <!-- 表格 -->
        <span class="timeSel">废弃日期</span>
        <el-date-picker
            v-model="time"
            type="date"
            size="small"
            class="time"
            value-format="yyyy-MM-dd"
            placeholder="选择废弃日期">
        </el-date-picker>
      <div style="width: 68.2%;float:right;margin-top:10px;">
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
            label="商品批号"
            >
        </el-table-column>
        <el-table-column 
            prop="unit"
            width="100"
            label="单位">
        </el-table-column>
        <el-table-column 
            prop="stock_quantity"
            width="100"
            label="库存数量">
        </el-table-column>
        <el-table-column
            prop="order_quantity"
            label="废弃数量"
            width="150"
            >
            <template slot-scope="scope">
                <el-input-number v-model="scope.row.order_quantity" :min="1" :max="scope.row.stock_quantity" size="small"></el-input-number>
            </template>
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
</template>

<script>
import {
  getWarehouseDiscardList,
  closeDiscardOrdersList,
  submitScrapOrder,
  getScrapToken
} from "../../api";
import { getList, stopInfo, getListPage, addData } from "../../common";
import { mapState, mapActions } from "vuex";
export default {
  name: "return-order",
  data() {
    return {
      search: {
        keyword: "",
        beginTime: "",
        endTime: "",
        
      },
      time: new Date(),
      fileList:[],
      postData: {
        token: ""
      },
      dialogImageUrl: "",
      dialogVisible: false,
      scrapInfo: {},
      total: 1,
      list: [],
      pageSize: 10,
      curPageIndex: 1,
      materialDetail: [],
      productDetail: [],
      row: {},
      flag: "",
      page: {
        list: !0,
        detail: !1,
        add: !1
      },
      defaultProps: {
        children: "children",
        label: "name"
      },
      tableData: [],
      filterText: "",
      rules: {
        reason: [{ required: true, message: "请输入废弃原因", trigger: "blur" }]
      }
    };
  },
  components: {},
  computed: {
    ...mapState("stateChange", ["btnLoading"]),
    ...mapState("dict", ["returnOrderState", "inputWarehouseTree"])
  },
  methods: {
    ...mapActions("dict", ["getReturnOrderState", "getInputWarehouseTree"]),
    handleAvatarSuccess(res, file){
      this.fileList.push(res)
    },
    handleRemove(file, fileList) {
      for(let i=0;i<this.fileList.length;i++){
        if(this.fileList[i].key==file.response.key){
          this.fileList.splice(i,1);
        }
      }
    },
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    },
    //新增废弃单
    addScrap() {
      this.pageControl("add");
      getListPage({
        requestUrl: getScrapToken,
        params: {}
      }).then(item => {
        this.postData.token=item.list;
      });
    },
    //分页
    handleCurrentChange(val) {
      this.curPageIndex = val;
      getList({
        requestUrl: getWarehouseDiscardList,
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
        this.search.beginTime="";
        this.search.endTime="";
      }
      getList({
        requestUrl: getWarehouseDiscardList,
        params: {
          ...this.search,
          pageSize: this.pageSize
        }
      }).then(item => {
        this.total = item.total;
        this.list = item.list;
      });
    },
    //页面控制
    pageControl(text) {
      for (let attr in this.page) {
        this.page[attr] = !1;
      }
      this.page[text] = !0;
    },
    //查看订单详情
    toDetail(_row) {
      this.row = _row;
      this.materialDetail = _row.scrap_item.material_list;
      this.pageControl("detail");
      if (_row.order_state == "unaccepted") {
        this.flag = true;
      } else {
        this.flag = false;
      }
    },
    //后退
    goPre() {
      this.pageControl("list");
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
            this.pageControl("list");
          }
          getList({
            requestUrl: getWarehouseDiscardList,
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
    removeNode(_id) {
      this.tableData = this.tableData.filter(item => {
        return item.id != _id;
      });
      this.$refs.tree.setCheckedNodes(this.tableData);
    },
    filterNode(value, data) {
      if (!value) return true;
      return data.search_text.indexOf(value) !== -1;
    },
    keyUpHandle(event) {
      event.stopPropagation();
      if (
        event.keyCode === 13 &&
        event.target.classList.value.search("el-input__inner") !== -1
      ) {
        const inputNumberArr = Array.from(
          this.$refs.table.$el.querySelectorAll(
            ".el-table__body-wrapper .el-input__inner"
          )
        );
        let index = inputNumberArr.findIndex(item => item === event.target);
        if (index === -1) {
          return;
        }
        index = ++index % inputNumberArr.length;
        this.$refs.table.setCurrentRow(this.tableData[index]);
        inputNumberArr[index].focus();
        inputNumberArr[index].select();
      }
      return false;
    },
    handleNodeClick() {
      this.getCheckedNodes();
    },
    getCheckedNodes() {
      this.tableData = [];
      let val = this.$refs.tree.getCheckedNodes();
      let filterVal = val.filter(item => {
        return !item.children;
      });
      this.tableData = filterVal;
    },
    //提交废弃信息
    okToScrap() {

      this.$refs["ruleForm"].validate(valid => {
        if (valid) {
          for (let i = 0; i < this.tableData.length; i++) {
            if (this.tableData[i].order_quantity == "") {
              this.$message.error("请填入商品的废弃数量");
              return;
            }
          }
          if (this.time == "") {
            this.$message.error("请选择废弃时间！");
            return;
          }
          this.scrapRequest();
        } else {
          this.$message.error("请输入废弃原因");
          return false;
        }
      });
    },
    scrapRequest() {
      let formatData = {
        scrap_item: this.tableData,
        scrap_reason: this.scrapInfo.reason,
        image: this.fileList,
        scrap_date: this.time
      };
      addData({
        requestUrl: submitScrapOrder,
        paramsType: 1,
        preData: formatData,
        returnType: 1
      }).then(item => {
        if (item.code == 1) {
          this.tableData = [];
          this.$refs.tree.setCheckedKeys([]);
          this.search.beginTime = "";
          this.scrapInfo.image = "";
          this.scrapInfo.reason = "";
          this.$refs.upload.clearFiles();
          this.$message({
            message: "废弃成功！",
            type: "success"
          });
          this.fileList=[];
          this.pageControl("list");
          getList({
            requestUrl: getWarehouseDiscardList,
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
    this.getInputWarehouseTree();
    //获取列表
    getList({
      requestUrl: getWarehouseDiscardList,
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
.length {
  width: 51.6%;
}
.leftLen {
  width: 40%;
}
.selectLen {
  width: 78%;
}
.page {
  text-align: center;
  padding: 15px;
}
.timeSel {
  margin: 10px 10px 0 20px;
}
.time {
  margin-top: 10px;
}
</style>
