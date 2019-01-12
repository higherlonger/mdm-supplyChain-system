<template> 
<div> 
    <!-- 导航栏 -->
    <nav class="app-location-wrapper">
        <el-breadcrumb separator="/" class="fl">
            <el-breadcrumb-item :to="{ path: '/sys_setting' }">采购管理</el-breadcrumb-item>
            <el-breadcrumb-item>采购退货</el-breadcrumb-item>
            <el-breadcrumb-item>退货申请</el-breadcrumb-item>
        </el-breadcrumb>
        <el-button class="fr" size="small" icon="el-icon-arrow-down" type="primary" plain v-show="visible.listVisible"
            @click="okToAdd">下一步</el-button>
        <el-button class="fr" size="small" icon="el-icon-document"  plain  style="margin-right:10px;" v-show="visible.listVisible"
        @click="quickNew">引单新建</el-button>
        <el-button class="fr" size="small" icon="el-icon-arrow-left"  plain v-show="visible.goPre"
            @click="cancle">后退</el-button>
        <el-button class="fr" size="small" icon="el-icon-close"  plain v-show="visible.cancleHandle"
            @click="cancle">取消</el-button>
        <el-button class="fr" size="small" icon="el-icon-arrow-left"  plain v-show="visible.detailVisible"
            @click="detailPre">后退</el-button>
    </nav>
    <!-- 新建 -->
    <div class="toAdd" style="background-color:#f2f2f2;overflow:hidden;" v-show="visible.listVisible">
      <div style="background-color:#fff;padding:10px 0 5px 0">
        <el-form :model="info" :rules="rules" ref="info" label-width="100px" class="demo-ruleForm">
            <el-form-item label="发起城市" prop="city" size="small">
                <el-select v-model="info.city" placeholder="请选城市" class="selectLen">
                    <el-option v-for="item in cityList" :key="item.value" :label="item.name" :value="item.value"></el-option>
                </el-select>
            </el-form-item>
        </el-form>
      </div>
      <div style="background-color:#fff;float:left;margin-top:10px;width:25%;" v-show="className">
       <el-input
        placeholder="输入关键字进行过滤"
        v-model="filterText"
        style="margin-bottom:5px"
        >
        </el-input>
        <!-- 树形结构 -->
        <el-tree
        :data="stockTree"
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
      <div style="float:right;margin-top:10px;" :class="{widthPer:className,widthPro:!className}">
        <el-table
        :data="tableData"
        border
        ref="table"
        >
        <el-table-column
            prop="material_data.num"
            label="商品编码"
            width="120"
            >
        </el-table-column>
        <el-table-column
            prop="material_data.name"
            label="商品名称及批号"

            >
            <template slot-scope="scope">
              <span>{{scope.row.material_data.name}}-{{scope.row.batch_num}}</span>
            </template>
        </el-table-column>
        <el-table-column 
            prop="material_data.out_unit"
            label="单位"
            width="80">
        </el-table-column>
        <el-table-column
            prop="material_data.quantity"
            label="历史库存"
            width="100">
        </el-table-column>
        <el-table-column
            prop="material_data.current_quantity"
            label="退货数量"
            width="150"
            >
            <template slot-scope="scope">
                <el-input-number v-model="scope.row.material_data.current_quantity" :min="1" size="small"></el-input-number>
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
    <!-- 引单 -->
    <div style="background-color:#fff" v-show="visible.newVisible">
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
                  v-model="search.order_state"
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
                @click="toDetail(scope.row)">查看</el-button>
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
    <!-- 第二步-填写退货单 -->
    <div style="background-color:#fff;" v-show="visible.returnList">
      <el-card class="box-card" v-for="(item,index) in returnOrderList" :key="index" v-if="item.isShow">
        <div slot="header" class="clearfix">
          <span>第 {{index+1}} 个退货单</span>
          <el-button style="float: right;" size="mini" @click="commitReturn(item,index)">提交</el-button>
        </div>
        <el-form :model="item" :rules="rules" ref="item" label-width="100px" class="demo-ruleForm">
          <el-form-item label="退货原料" prop="showText">
             <el-input v-model="item.showText" size="small" disabled class="leftItv" type="textarea"></el-input>
          </el-form-item>
          <el-form-item label="下一处理人" prop="to_user_id">
              <el-select v-model="item.to_user_id"  placeholder="请选择下一处理人" class="leftItv" size="small">
                 <el-option v-for="item in nextHandlePeo" :key="item.value" :label="item.name" :value="item.value"></el-option>
              </el-select>
          </el-form-item> 
          <el-form-item label="退货原因" prop="return_reason">
            <el-input v-model="item.return_reason" size="small"  class="leftItv" type="textarea"></el-input>
          </el-form-item>
          <el-form-item label="备注" prop="remark">
            <el-input v-model="item.remark" size="small"  class="leftItv" type="textarea"></el-input>
          </el-form-item>
          <el-form-item label="上传图片" prop="image">
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
                <img width="100%" :src="item.image" alt="">
              </el-dialog>
          </el-form-item>
        </el-form>
      </el-card>
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
import {
  getApplyList,
  getApplyById,
  addReturnList,
  editSupp,
  getScrapToken,
  addReturnListSec
} from "../../api";
import { getList, getListPage, addData } from "../../common";
import { mapState, mapActions } from "vuex";
export default {
  name: "reApply",
  data() {
    return {
      //图片
      dialogImageUrl: "",
      dialogVisible: false,
      postData: {
        token: ""
      },
      search: {
        order_state: "",
        keyword: "",
        handle_id: ""
      },
      total: 1,
      list: [],
      isShow: !0,
      filterText: "",
      tree: "",
      defaultProps: {
        children: "children",
        label: "name"
      },
      className: !0,
      currPageIndex: 1,
      total: 1,
      tableData: [],
      pageSize: 10,
      info: {
        city: ""
      },
      cancleHandle: !1,
      quickData: [],
      rules: {
        city: [
          { required: true, message: "请选择发起城市", trigger: "change" }
        ],
        to_user_id: [
          { required: true, message: "请选择下一处理人", trigger: "change" }
        ],
        return_reason: [
          { required: true, message: "请填写退货原因", trigger: "blur" }
        ],
        image: [
          { required: true, message: "请上传退货图片", trigger: "change" }
        ]
      },
      returnOrderList: [],
      visible: {
        listVisible: !0,
        newVisible: !1,
        returnList: !1,
        goPre: !1,
        cancleHandle: !1,
        detailVisible: !1
      },
      returnListLength: "",
      detail: {},
      dataVal: [],
      fileList: []
    };
  },
  computed: {
    ...mapState("stateChange", ["btnLoading"]),
    ...mapState("dict", [
      "purchase",
      "cityList",
      "stockTree",
      "nextHandlePeo",
      "returnOrderType",
      "returnOrderName"
    ])
  },
  methods: {
    /** 图片 */
    handleRemove(file, fileList) {
      for (let i = 0; i < this.fileList.length; i++) {
        if (this.fileList[i].key == file.response.key) {
          this.fileList.splice(i, 1);
        }
      }
    },
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    },
    handleAvatarSuccess(res, file) {
      this.fileList.push(res);
    },
    /**图片结束 */
    ...mapActions("dict", [
      "getPurchase",
      "getCityList",
      "getStockTree",
      "getNextHandlePeo",
      "getReturnOrderType"
    ]),
    //查看订单详情
    toDetail(_row) {
      this.detail = _row;
      this.dataVal = _row.item.item;
      for (let attr in this.visible) {
        this.visible[attr] = !1;
      }
      this.visible.detailVisible = !0;
    },
    //订单详情后退
    detailPre() {
      for (let attr in this.visible) {
        this.visible[attr] = !1;
      }
      this.visible.newVisible = !0;
      this.visible.goPre = !0;
    },
    quickNew() {
      this.visible.listVisible = !1;
      this.visible.goPre = !0;
      this.visible.newVisible = !0;
    },
    cancle() {
      this.visible.listVisible = !0;
      this.visible.goPre = !1;
      this.visible.newVisible = !1;
    },
    //提交前整理数据
    updateData(value) {
      let valAry = [];
      for (let i = 0; i < value.length; i++) {
        valAry.push(value[i].material_data);
      }
      return valAry;
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
            return_item: this.updateData(this.tableData)
          };
          addData({
            requestUrl: addReturnList,
            paramsType: 1,
            preData: formatData,
            returnType: 1
          }).then(item => {
            if (item.code == 1) {
              //重置
              this.$refs.tree.setCheckedKeys([]);
              this.$refs["info"].resetFields();
              this.tableData = [];
              this.cancleHandle = !this.cancleHandle;
              for (let attr in this.info) {
                this.info[attr] = "";
              }
              //切换显示界面
              this.visible.listVisible = !1;
              this.visible.returnList = !0;
              //过滤退货单信息
              this.returnOrderList = this.filterReturnOrderList(item.data);
              this.isShow = !this.isShow;
              getListPage({
                requestUrl: getScrapToken,
                params: {}
              }).then(item => {
                this.postData.token = item.list;
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
    //过滤退货单回显信息
    filterReturnOrderList(item) {
      let text = "";
      this.returnListLength = item.length;
      for (let i = 0; i < item.length; i++) {
        item[i].to_user_id = "";
        item[i].image = "";
        item[i].return_reason = "";
        item[i].remark = "";
        item[i].isShow = true;
        text = "";
        for (let j = 0; j < item[i].item.length; j++) {
          text = text + item[i].item[j].name + ",";
        }
        item[i].showText = text;
      }
      return item;
    },
    //提交退货信息
    commitReturn(item, index) {
      console.log(this.returnListLength)
      if(item.to_user_id==''){
        this.$message.error('请选择下一处理人！');
        return;
      }else if(item.return_reason==''){
        this.$message.error('请填写退货原因！');
        return;
      }else if(this.fileList.length==0){
        this.$message.error('请上传图片！');
        return;
      }
      let obj = {
        ...item,
        image: this.fileList
      };
      addData({
        requestUrl: addReturnListSec,
        paramsType: 1,
        preData: obj,
        returnType: 1
      }).then(item => {
        if (item.code == 1) {
          
          // this.$refs.upload.clearFiles();
          this.returnOrderList[index].isShow = false;
          this.returnListLength--;
          if (this.returnListLength <= 0) {
           for(let attr in this.visible){
             this.visible[attr]=!1;
           }
           this.visible['listVisible']=!0;
          }
           this.$message({
            message: "提交成功！",
            type: "success"
          });
        }
      });
    },
    getCheckedNodes() {
      this.tableData = [];
      let val = this.$refs.tree.getCheckedNodes();
      let filterVal = val.filter(item => {
        return !item.children;
      });
      this.filterData(filterVal);
    },
    filterData(newVal) {
      for (let i = 0; i < newVal.length; i++) {
        if (!newVal[i].material_data.batch_num) {
          newVal[i].material_data.current_quantity = 1;
          newVal[i].material_data.stock_id = newVal[i].id;
          newVal[i].material_data.batch_num = newVal[i].batch_num;
        }
      }
      this.tableData = newVal;
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
      this.currPageIndex = val;
      getList({
        requestUrl: getApplyList,
        params: { ...this.search, pageSize: this.pageSize }
      }).then(item => {
        this.total = item.total;
        this.quickData = item.list;
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
        params: { ...this.search, pageSize: this.pageSize }
      }).then(item => {
        this.total = item.total;
        this.quickData = item.list;
      });
    },
    //引单
    yindan(_id) {
      this.visible.returnList = !1;
      this.visible.listVisible = !0;
      this.visible.goPre = !1;
      getListPage({
        requestUrl: getApplyById,
        params: { id: _id }
      }).then(item => {
        this.$refs.tree.setCheckedNodes(item.list.item);
        this.getCheckedNodes();
        // this.tableData=item.list.item;
        // this.className=!1;
        this.info.city = item.list.city;
      });
    }
  },
  created() {
    this.getPurchase();
    this.getCityList();
    this.getStockTree();
    this.getReturnOrderType();
    this.getNextHandlePeo(this.returnOrderName.caigou);
    //获取列表
    getList({
      requestUrl: getApplyList,
      params: { ...this.search, pageSize: this.pageSize }
    }).then(item => {
      this.total = item.total;
      this.quickData = item.list;
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
  width: 50%;
}
.page {
  text-align: center;
  padding: 15px;
}
.widthPer {
  width: 74.2%;
}
.widthPro {
  width: 100%;
}
.text {
  font-size: 14px;
}

.item {
  margin-bottom: 18px;
}

.clearfix:before,
.clearfix:after {
  display: table;
  content: "";
}
.clearfix:after {
  clear: both;
}

.box-card {
  width: 100%;
}
.leftItv {
  width: 60%;
}
.el-textarea.is-disabled .el-textarea__inner {
  color: #868686;
}
</style>

