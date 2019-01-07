<template> 
<div>
    <!-- 导航栏 -->
    <nav class="app-location-wrapper">
        <el-breadcrumb separator="/" class="fl">
            <el-breadcrumb-item :to="{ path: '/sys_setting' }">采购管理</el-breadcrumb-item>
            <el-breadcrumb-item>采购单</el-breadcrumb-item>
            <el-breadcrumb-item>采购申请</el-breadcrumb-item>
        </el-breadcrumb>
        <el-button class="fr" size="small" icon="el-icon-plus" type="primary" plain v-show="visible.listVisible"
            @click="okToAdd">提交申请</el-button>
        <el-button class="fr" size="small" icon="el-icon-document"  plain  style="margin-right:10px;" v-show="visible.listVisible"
        @click="quickNew">引单新建</el-button>
        <el-button class="fr" size="small" icon="el-icon-close"  plain v-show="visible.quickVisible"
            @click="cancle">取消</el-button>
        <el-button class="fr" size="small" icon="el-icon-arrow-left"  plain v-show="visible.detailVisible"
            @click="goPre">后退</el-button>
    </nav>
    <!-- 树 -->
    <div class="toAdd" style="background-color:#f2f2f2;overflow:hidden;" v-show="visible.listVisible">
      <div style="background-color:#fff;padding:10px 0 5px 0">
        <el-form :model="info" :rules="rules" ref="info" label-width="100px" class="demo-ruleForm">
            <el-form-item label="采购类型" prop="purchase_type" size="small" style="float:left">
                <el-select v-model="info.purchase_type" placeholder="请选采购类型" class="selectLen">
                    <el-option v-for="item in purchase" :key="item.value" :label="item.name" :value="item.value"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="发起城市" prop="city" size="small" style="float:left">
                <el-select v-model="info.city" placeholder="请选城市" class="selectLen">
                    <el-option v-for="item in cityList" :key="item.value" :label="item.name" :value="item.value"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="下一处理人" prop="to_user_id" size="small" style="float:left">
                <el-select v-model="info.to_user_id" placeholder="请选下一处理人" class="selectLen">
                    <el-option v-for="item in nextHandlePeo" :key="item.value" :label="item.name" :value="item.value"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="备注" prop="remark" size="small" class="length" style="clear:both">
                <el-input v-model="info.remark" type="textarea" size="small"></el-input>
            </el-form-item>
        </el-form>
      </div>
      <div style="background-color:#fff;float:left;margin-top:10px;width:25%;">
       <el-input
        placeholder="输入关键字进行过滤"
        v-model="filterText"
        style="margin-bottom:5px"
        >
        </el-input>
        <!-- 树形结构 -->
        <el-tree
        :data="inventoryTree"
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
      <div style="width: 74.2%;float:right;margin-top:10px;">
        <el-table
        :data="tableData"
        border
        ref="table"
        >
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
            prop="out_unit"
            label="单位">
        </el-table-column>
        <el-table-column
            prop="attribute"
            label="规格">
        </el-table-column>
        <el-table-column
            prop="quantity"
            label="订货数量"
            width="150"
            >
            <template slot-scope="scope">
                <el-input-number v-model="scope.row.quantity" :min="1" size="small"></el-input-number>
            </template>
        </el-table-column>
        <el-table-column label="操作">
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
    <!-- 快速建单 -->
    <div style="background-color:#fff" v-show="visible.quickVisible">
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
          <div class="search-title fl">下一处理人：</div>
              <el-select 
                  class="fl"
                  size="small" 
                  clearable
                  v-model="search.handle_id"
                  @change="searchHandle"
                  style="width:160px;margin-right:10px;"
                  >
                  <el-option
                  v-for="item in nextHandlePeo"
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
      <el-table
        :data="quickData"
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
        <el-table-column label="操作" width="200">
            <template slot-scope="scope">
                <el-button
                size="mini"
                @click="seeDetail(scope.row)">查看</el-button>
                <el-button
                size="mini"
                type="primary"
                @click="yindan(scope.row.id)">引单</el-button>
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
    <!-- 查看订单详情 -->
    <div style="background-color:#fff;" v-show="visible.detailVisible">
        <h5 class="form-part-line" style="margin-top:10px;">订单基本信息</h5>
        <el-form :model="detail" label-width="100px" class="demo-ruleForm frame" style="font-size:13px;">
            <el-form-item label="订单编号" class="leftShow item">
                <span class="form-record-show list">{{ detail.num }}</span>
            </el-form-item>
            <el-form-item label="订单时间" class="rightShow item">
                <span class="form-record-show list">{{ detail.create_date }}</span>
            </el-form-item>
            <el-form-item label="采购类型" class="leftShow item">
                <span class="form-record-show list">{{ detail.purchase_type_text }}</span>
            </el-form-item>
            <el-form-item label="城市" class="rightShow item">
                <span class="form-record-show list">{{ detail.city }}</span>
            </el-form-item>
            <el-form-item label="状态" class="leftShow item">
                <span class="form-record-show list">{{ detail.state_text }}</span>
            </el-form-item>
            <el-form-item label="关闭时间" class="rightShow item">
                <span class="form-record-show list">{{ detail.close_date }}</span>
            </el-form-item>
            <el-form-item label="订单备注" class="rightShow remark">
                <span class="form-record-show list">{{ detail.remark }}</span>
            </el-form-item>
        </el-form>
        <h5 class="form-part-line" style="margin-top:15px;">采购项信息</h5>
        <el-table
            :data="dataVal"
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
            prop="out_unit"
            label="单位">
            </el-table-column>
            <el-table-column 
            prop="quantity"
            label="购买数量">
            </el-table-column>
        </el-table>
    </div>
    
</div> 
</template>

<script>
import { getApplyList, getApplyById, addApply, editSupp } from "../../api";
import { getList, getListPage, addData } from "../../common";
import { mapState, mapActions } from "vuex";
export default {
  name: "apply",
  data() {
    return {
      search: {
        state: "",
        keyword: "",
        handle_id: ""
      },
      total: 1,
      list: [],
      curPageIndex: 1,
      isShow: !0,
      filterText: "",
      tree: "",
      defaultProps: {
        children: "children",
        label: "name"
      },
      visible:{
        listVisible:!0,
        quickVisible:!1,
        detailVisible:!1
      },
      currPageIndex:1,
      total:1,
      tableData: [],
      choseIds: [],
      pageSize:10,
      info: {
        remark: "",
        purchase_type: "",
        to_user_id: '',
        city:""
      },
      detail:{},
      dataVal:[],
      quickData:[],
      rules: {
        city: [{ required: true, message: "请选择城市", trigger: "change" }],
        purchase_type: [
          { required: true, message: "请选择类型", trigger: "change" }
        ],
        to_user_id: [
          { required: true, message: "请选择下一处理人", trigger: "change" }
        ]
      }
    };
  },
  computed: {
    ...mapState("stateChange", ["btnLoading"]),
    ...mapState("dict", ["purchase", "cityList", "inventoryTree","nextHandlePeo","returnOrderType","returnOrderName"])
  },
  methods: {
    // 查看订单详情
    seeDetail(_row){
      this.detail=_row;
      this.dataVal=_row.item.item;
      this.visible.listVisible=!1;
      this.visible.quickVisible=!1;
      this.visible.detailVisible=!0;
    },
    //查看详情-后退
    goPre(){
      this.visible.listVisible=!1;
      this.visible.detailVisible=!1;
      this.visible.quickVisible=!0;
    },
    ...mapActions("dict", ["getPurchase", "getCityList", "getInventoryTree","getNextHandlePeo","getReturnOrderType"]),
    quickNew() {
      this.visible.listVisible=!1;
      this.visible.quickVisible=!0;
    },
    cancle(){
      this.visible.listVisible=!0;
      this.visible.quickVisible=!1;
    },
    //切换弹窗显示
    okToAdd() {
      this.$refs["info"].validate(valid => {
        if (valid) {
          if (this.tableData.length == 0) {
            this.$message.error("请选择采购项");
            return;
          }
          let formatData = {
            ...this.info,
            item: this.tableData
          };
          addData({
            requestUrl: addApply,
            paramsType: 1,
            preData: formatData
          }).then(item => {
            if (item == 1) {
              this.$message({
                message: "新增成功！",
                type: "success"
              });
              this.$refs.tree.setCheckedKeys([]);
              this.$refs['info'].resetFields();
              this.tableData=[];
              for(let attr in this.info){
                this.info[attr]=""
              }
              //重新刷新订单
              getList({
                requestUrl: getApplyList,
                params: { ...this.search,pageSize: this.pageSize }
              }).then(item => {
                this.total = item.total;
                this.quickData= item.list;
              });
            } else {
              this.$message.error("新增失败");
            }
          });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    getCheckedNodes() {
      this.tableData = [];
      let val = this.$refs.tree.getCheckedNodes();
      let filterVal = val.filter(item => {
        return !item.children;
      });
      this.tableData = filterVal;
      this.filterData(filterVal);
    },
    filterData(val) {
      if (val[0]&&!val[0].hasOwnProperty("quantity")) {
        for (let i = 0; i < val.length; i++) {
          val[i]["quantity"] = 0;
        }
      }
    },
    handleNodeClick() {
      this.getCheckedNodes();
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
    handleCurrentChange(val) {
      this.visible.listVisible=!1;
      this.visible.quickVisible=!0;
      getList({
        requestUrl: getApplyList,
        params: { ...this.search,pageSize: this.pageSize }
      }).then(item => {
        this.total = item.total;
        this.quickData= item.list;
      });
    },
    //根据条件搜素
    searchHandle(val) {
      if (val == "all") {
        this.search.keyword = "";
        this.search.state = "";
        this.search.handle_id = "";
      }
      getList({
        requestUrl: getApplyList,
        params: { ...this.search,pageSize: this.pageSize }
      }).then(item => {
        this.total = item.total;
        this.quickData= item.list;
      });
    },
    //引单
    yindan(_id){
      getListPage({
        requestUrl: getApplyById,
        params: { id:_id }
      }).then(item => {
        this.$refs.tree.setCheckedNodes(item.list.item);
        this.getCheckedNodes()
        this.visible.listVisible=!0;
        this.visible.quickVisible=!1;
        this.visible.detailVisible=!1;
        this.info.purchase_type=item.list.purchase_type;
        this.info.city=item.list.city;
        this.info.remark=item.list.remark;
      });
    }
  },
  created() {
    this.getPurchase();
    this.getCityList();
    this.getInventoryTree();
    this.getNextHandlePeo(this.returnOrderName.caigou);
    this.getReturnOrderType()
    //获取列表
    getList({
      requestUrl: getApplyList,
      params: { ...this.search,pageSize: this.pageSize }
    }).then(item => {
      this.total = item.total;
      this.quickData= item.list;
    });
  },
  watch: {
    filterText(val) {
      this.$refs.tree.filter(val);
    }
  },
  mounted() {
    this.$refs.table.$el.addEventListener("keyup", this.keyUpHandle, false);
  },
  beforeDestroy() {
    this.$refs.table.$el.removeEventListener("keyup", this.keyUpHandle);
  }
};
</script>

<style>
.length {
  width: 51.6%;
}
.leftLen {
  width: 40%;
}
.selectLen {
  width: 78%;
}
.page{
  text-align: center;
  padding: 15px
}
</style>

