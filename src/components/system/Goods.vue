<template>
<div>
    <!-- 导航栏 -->
    <nav class="app-location-wrapper">
        <el-breadcrumb separator="/" class="fl">
            <el-breadcrumb-item :to="{ path: '/sys_setting' }">系统管理</el-breadcrumb-item>
            <el-breadcrumb-item>商品管理</el-breadcrumb-item>
            <el-breadcrumb-item>商品管理</el-breadcrumb-item>
        </el-breadcrumb>
        <el-button class="fr" size="small" icon="el-icon-plus" type="primary" plain v-show="pageVisible.index"
            @click="topHandle('addVisible')">新增商品</el-button>
        <el-button class="fr" size="small" icon="el-icon-back" plain v-show="pageVisible.detail"
            @click="goOut">后退</el-button>
        <el-button class="fr" size="small" icon="el-icon-plus" type="primary" plain v-show="pageVisible.formula"
            @click="okToEdit">确定</el-button>
    </nav>

    <!-- 商品回显 --> 
    <div style="background-color:#fff;overflow:hidden" v-show="pageVisible.index">
      <!-- 搜索条件 --> 
      <div class="component-top">
          <div class="search-title fl">状态：</div>
            <el-select 
                  class="fl"
                  size="small" 
                  v-model="search.state"
                  @change="searchHandle"
                  style="width:160px;margin-right:10px;"
                  >
                  <el-option
                  v-for="item in store_state"
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
      <div class="appManager-list">
          <div class="tree-show-line" v-loading="btnLoading">
              <dl class="tree-tb-top">
                  <dd style="width: 250px">商品名称</dd>
                  <dd style="flex:1">商品编号</dd>
                  <dd style="flex:1">单位(标准)</dd>
                  <dd style="flex:1">成本价</dd>
                  <dd style="flex:1">售价</dd>
                  <dd style="flex:1">状态</dd>
                  <dd style="width: 219px">操作</dd>
              </dl>
              <ul class="">
                  <li v-for="(item, index) in list" :key="index">
                      <div class="tree-item">
                          <span @click="childTreeHandle(item)">
                              <i class="tree-item-icon" 
                                  :class="{'el-icon-minus': item.showChild, 'el-icon-plus': !item.showChild}">
                              </i>
                          </span>
                          <span style="width: 225px">{{ item.name }}</span>
                          <span style="flex:1">{{ item.num }}</span>
                          <span style="flex:1">{{ item.unit }}</span>
                          <span style="flex:1">{{ item.cost_price }}</span>
                          <span style="flex:1">{{ item.sell_price }}</span>
                          <span style="flex:1;color:red" v-if="item.state==0">{{ item.state_text }}</span>
                          <span style="flex:1;color:#80d640" v-if="item.state==1">{{ item.state_text }}</span>
                          <div label="操作" width="219" style="margin-right:24px">
                              <el-button
                              size="mini"
                              @click="recordHandle(item,'seeVisible')"
                              >查看</el-button>
                              <el-button
                              size="mini"
                              @click="recordHandle(item,'formulaVisible')"
                              >配方</el-button>
                              <!-- <el-button
                              size="mini"
                              type="primary"
                              @click="recordHandle(item,'editVisible')"
                              >修改</el-button>
                              <el-button
                              size="mini"
                              type="danger"
                              disabled
                              @click="delInfo(item.id)"
                              >删除</el-button> -->


                              <el-dropdown size="mini" style="margin-left:8px" @command="handleCommand(item,arguments)">
                                <el-button type="primary" size="mini">
                                  操作<i class="el-icon-arrow-down el-icon--right"></i>
                                </el-button>
                                <el-dropdown-menu slot="dropdown">
                                    <el-dropdown-item command="edit">修  改</el-dropdown-item>
                                    <el-dropdown-item command="del">删  除</el-dropdown-item>
                                </el-dropdown-menu> 
                              </el-dropdown>

                          </div>
                      </div>
                      <el-collapse-transition>
                      <ul class="child-tree" v-show="item.showChild">
                          <li v-for="(val, key) in item.children" :key="key">
                              <div class="tree-item">
                                  <span><i class="el-icon-document"></i></span>
                                  <span style="width: 205px">{{ val.name }}</span>
                                  <span style="flex:1">{{ val.num }}</span>
                                  <span style="flex:1">{{ val.unit }}</span>
                                  <span style="flex:1">{{ val.cost_price }}</span>
                                  <span style="flex:1">{{ val.sell_price }}</span>
                                  <span style="flex:1;color:red" v-if="val.state==0">{{ val.state_text }}</span>
                                  <span style="flex:1;color:#80d640" v-if="val.state==1">{{ val.state_text }}</span>
                                  <div label="操作" width="219" style="margin-right:24px">
                                      <el-button
                                      size="mini"
                                      @click="recordHandle(val,'seeVisible',key)"
                                      >查看</el-button>
                                      <el-button
                                      size="mini"
                                      @click="recordHandle(val,'formulaVisible')"
                                      >配方</el-button>
                                      <!-- <el-button
                                      size="mini"
                                      type="primary"
                                      @click="recordHandle(val,'editVisible')"
                                      >修改</el-button>
                                      <el-button
                                      size="mini"
                                      type="danger"
                                      @click="delInfo(val.id)"
                                      >删除</el-button> -->
                                      <el-dropdown size="mini" style="margin-left:8px" @command="handleCommand(val,arguments)">
                                        <el-button type="primary" size="mini">
                                          操作<i class="el-icon-arrow-down el-icon--right"></i>
                                        </el-button>
                                        <el-dropdown-menu slot="dropdown">
                                            <el-dropdown-item command="edit">修  改</el-dropdown-item>
                                            <el-dropdown-item command="del">删  除</el-dropdown-item>
                                        </el-dropdown-menu> 
                                      </el-dropdown>
                                  </div>
                              </div>
                          </li>
                      </ul>
                      </el-collapse-transition>
                  </li>
              </ul>
          </div>
      </div> 
    </div>
 
    <!-- 查看商品详情 -->
    <div style="background-color:#fff;" v-show="pageVisible.detail">
        <h5 class="form-part-line">商品基本信息</h5>
        <el-form :model="info" ref="info" label-width="100px" size="small">
            <el-form-item label="名称" prop="name">
                <span class="form-record-show">{{ info.name }}</span>
            </el-form-item>
            <el-form-item label="编号" prop="num">
                <span class="form-record-show">{{ info.num }}</span>
            </el-form-item>
            <el-form-item label="成本价" prop="cost_price">
                <span class="form-record-show">{{ info.cost_price }}</span>
            </el-form-item>
            <el-form-item label="售价" prop="purchase_price">
                <span class="form-record-show">{{ info.purchase_price }}</span>
            </el-form-item>
            <el-form-item label="备注" prop="remark">
                <span class="form-record-show">{{ info.remark }}</span>
            </el-form-item>
        </el-form>
        <h5 class="form-part-line">商品原料详情</h5>
        <el-table
          :data="detail"
          stripe
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
            prop="out_unit"
            label="单位">
          </el-table-column>
          <el-table-column
            prop="out_unit"
            label="单位">
          </el-table-column>
          <el-table-column
            prop="storage_condition"
            label="存储条件">
          </el-table-column>
          <el-table-column
            prop="brand"
            label="品牌">
          </el-table-column>
          <el-table-column
            prop="out_unit"
            label="品牌">
          </el-table-column>
        </el-table>
    </div>

    <!-- 修改配方 -->
    <div v-show="pageVisible.formula">
      <div class="component-top">
        <el-button class="fl" style="margin-left: 10px;" size="small" @click.stop="addMaterialList('addMaterial')">
            添加原材料
        </el-button>
        <span class="fl relation-top-tit">
            <i class="el-icon-question"></i> 配方估算成本：{{ totalPrice }} 元/份
        </span>
      </div>
      <el-table
        :data="tableData"
        border
        style="width: 100%">
        <el-table-column
          prop="name"
          fixed
          label="原材料名称"
        >
        </el-table-column>
        
        <el-table-column
          prop="num"
          label="原材料编号">
        </el-table-column>
        <el-table-column
          prop="storage_condition_text"
          label="库存类型"
          >
        </el-table-column>
        <el-table-column
          prop="out_unit"
          label="单位(标准)">
        </el-table-column>
        <el-table-column
          prop="cost_price"
          label="估算单价"
          >
        </el-table-column>
        <el-table-column
          prop="net_num"
          label="净料数量"
          width="150"
          >
          <template slot-scope="scope">
            <span v-if="!scope.row.isShow">{{scope.row.net_num}}</span>
            <el-input-number v-if="scope.row.isShow" v-model="scope.row.net_num" :min="1" size="mini"></el-input-number>
          </template>
        </el-table-column>
        <el-table-column
          prop="yield_rate"
          label="出成率"
          width="150"
          >
          <template slot-scope="scope">
            <span v-if="!scope.row.isShow">{{scope.row.yield_rate}}%</span>
            <el-input-number v-if="scope.row.isShow" v-model="scope.row.yield_rate" :min="0" size="mini" :max="100"></el-input-number>
          </template>
        </el-table-column>
        <el-table-column
          prop="gross"
          label="毛料数量"

          >
          <template slot-scope="scope">
           <span>{{scope.row.net_num/(scope.row.yield_rate/100)}}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="estimate_price"
          label="估算金额">
          <template slot-scope="scope">
            <span>{{scope.row.cost_price*scope.row.gross}}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="150" fixed="right"> 
          <template slot-scope="scope">
            <el-button
              size="mini"
               v-if="!scope.row.isShow"
              @click="handleEdit(scope.$index, scope.row)">修改</el-button>
            <el-button
              size="mini"
              v-if="scope.row.isShow"
              @click="handleEdit(scope.$index, scope.row)">完成</el-button>
            <el-button
              size="mini"
              type="danger"
              @click="handleDelete(scope.$index, scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    
    <!-- 弹窗 -->
    <app-dialog title="新增商品" :visible.sync="dialog.addVisible" top="0vh" customClass="customClass">
      <add-goods :state="state" @reloadEvent="reloadGetData"></add-goods>
    </app-dialog>
    <app-dialog title="修改分类" :visible.sync="dialog.editVisible">
      <edit-class :info="info" @reloadEvent="reloadGetData"></edit-class>
    </app-dialog>
    <app-dialog title="添加原材料" :visible.sync="dialog.addMaterial" top="0vh" customClass="customClass">
      <add-formula @reloadEvent="reloadMaterial"></add-formula>
    </app-dialog>
</div>
</template>
  
<script>
import { mapState, mapActions } from "vuex";
import { getListPage, stopInfo } from "../../common";
import { addData } from "../../common";
import { getOnlyGoodsTree, getFormulaById, editBom } from "../../api";
import AppDialog from "../common/AppDialog.vue";
import AddGoods from "./Goods_add.vue";
import EditClass from "./Goods_edit.vue";
import addFormula from "./Goods_formula.vue";
export default {
  name: "material",
  data() {
    return {
      list: [],
      netVis: !0,
      search: {
        state: ""
      },
      pageVisible: {
        index: !0,
        detail: !1,
        formula: !1
      },
      type: [
        {
          value: "material",
          label: "原料"
        },
        {
          value: "product",
          label: "商品"
        }
      ],
      mat: [],
      pro: [],
      state: 0,
      dialog: {
        addVisible: !1,
        editVisible: !1,
        seeVisible: !1,
        addMaterial: !1
      },
      recordId: "",
      info: {},
      detail: [],
      tableData: [],
      backupsData: [],
      bomId: ""
    };
  },
  components: {
    AppDialog,
    AddGoods,
    EditClass,
    addFormula
  },
  computed: {
    ...mapState("dict", ["store_state"]),
    ...mapState("stateChange", ["btnLoading"]),
    //总成本价
    totalPrice() {
      let sum = 0;
      this.tableData.forEach(item => {
        sum += item.estimate_price;
      });
      return sum;
    }
  },
  methods: {
    ...mapActions("dict", ["getStoreState"]),
    //添加原材料
    addMaterialList(text) {
      for (let attr in this.dialog) {
        this.dialog[attr] = !1;
      }
      this.dialog[text] = !0;
    },
    //重新配置表格数据
    reloadMaterial(data) {
      this.tableData = JSON.parse(JSON.stringify(this.backupsData));
      for (let i = 0; i < data.length; i++) {
        this.tableData.push(data[i]);
      }
    },
    //配方修改
    handleEdit(index, _row) {
      _row.isShow = !_row.isShow;
    },
    //提交修改配方
    okToEdit() {
      let obj = { product_id: this.bomId, bom: this.tableData };
      addData({
        requestUrl: editBom,
        preData: obj,
        paramsType: 1
      })
        .then(item => {
          if (item == 1) {
            this.$message({
              message: "修改成功！",
              type: "success"
            });
            this.pageVisible.index = !0;
            this.pageVisible.detail = !1;
            this.pageVisible.formula = !1;
            getListPage({
              requestUrl: getOnlyGoodsTree,
              params: { ...this.search }
            }).then(item => {
              this.list = item.list;
            });
          } else {
            this.$message.error("修改失败");
          }
        })
        .catch(error => {
          this.$message.error("新增失败");
        });
    },
    //配方删除
    handleDelete(index, _row) {
      this.$confirm("确定删除'" + _row.name + "'吗?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.tableData.splice(index, 1);
        })
        .catch(() => {});
    },
    childTreeHandle(item) {
      item.showChild = !item.showChild;
    },
    searchHandle(val) {
      if (val == "all") {
        this.search.state = "";
      }
      getListPage({
        requestUrl: getOnlyGoodsTree,
        params: { ...this.search }
      }).then(item => {
        this.list = item.list;
      });
    },
    handleCommand() {
      if (arguments[1][0] == "edit") {
        this.recordHandle(arguments[0], "editVisible");
      } else if (arguments[1][0] == "del") {
        if (arguments[0].parent_id == 0) {
          this.$message.error("此分类含有子分类，不能删除！");
        } else {
          this.delInfo(arguments[0].id);
        }
      }
    },
    //操作弹窗控制
    recordHandle(_row, text, index) {
      if (text == "seeVisible") {
        for (let attr in this.pageVisible) {
          this.pageVisible[attr] = !1;
        }
        this.pageVisible.detail = !0;
      }
      if (text == "formulaVisible") {
        for (let attr in this.pageVisible) {
          this.pageVisible[attr] = !1;
        }
        this.pageVisible.formula = !0;
        this.getById(_row.id);
        this.bomId = _row.id;
      }
      this.recordId = _row.id;
      this.dialog[text] = !0;
      this.info = _row;
      this.detail = _row.bom.bom;
    },
    getById(_id) {
      getListPage({
        requestUrl: getFormulaById,
        params: { id: _id }
      }).then(item => {
        item.list.bom.bom.map(attr => {
          attr.isShow = false;
        });
        this.tableData = item.list.bom.bom;
        this.backupsData = item.list.bom.bom;
      });
    },
    topHandle(text) {
      this.dialog[text] = !0;
    },
    goOut() {
      this.pageVisible.index = !0;
      this.pageVisible.detail = !1;
    },
    //重新获取数据
    reloadGetData(res) {
      if (res == "reload") {
        for (let attr in this.dialog) {
          this.dialog[attr] = !1;
        }
        if (this.state == 0) {
          getListPage({
            requestUrl: getCagTree,
            params: { type: "material" }
          }).then(item => {
            this.list = item.list.children;
            this.mat = item.list.children;
          });
        } else {
          getListPage({
            requestUrl: getCagTree,
            params: { type: "product" }
          }).then(item => {
            this.list = item.list.children;
            this.pro = item.list.children;
          });
        }
      }
    },
    //删除分类
    delInfo(_id) {
      this.$confirm("确定删除此分类吗？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        stopInfo({
          requestUrl: delClass,
          params: { ids: _id }
        })
          .then(item => {
            this.reloadGetData("reload");
            if (item == 1) {
              this.$message({
                message: "操作成功！",
                type: "success"
              });
            } else {
              this.$message.error("操作失败！");
            }
          })
          .catch(error => {
            this.$message.error("操作失败！");
          });
      });
    }
  },
  created() {
    getListPage({
      requestUrl: getOnlyGoodsTree,
      params: { ...this.search }
    }).then(item => {
      this.list = item.list;
    });
    this.getStoreState();
  },
  watch: {}
};
</script>

<style>
.stuffType-search {
  width: 300px;
}
.leftSty {
  float: left;
}
.clearLeft {
  clear: left;
}
.form-record-show {
  width: 50%;
}
.relation-top-tit {
  line-height: 30px;
  margin-left: 10px;
  color: #909399;
}
</style>
