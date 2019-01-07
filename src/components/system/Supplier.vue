<template>
<div>
    <!-- 导航栏 -->
    <nav class="app-location-wrapper">
        <el-breadcrumb separator="/" class="fl">
            <el-breadcrumb-item :to="{ path: '/sys_setting' }">系统管理</el-breadcrumb-item>
            <el-breadcrumb-item>基础管理</el-breadcrumb-item>
            <el-breadcrumb-item>供应商管理</el-breadcrumb-item>
        </el-breadcrumb>
        <el-button class="fr" size="small" icon="el-icon-plus" type="primary" plain
            @click="topHandle('addVisible')" v-show="isShow">新增供应商</el-button>
        <el-button class="fr" size="small" icon="el-icon-check" type="primary" plain
            @click="okToAdd" v-show="!isShow">{{title}}</el-button>
        <el-button class="fr" size="small" icon="el-icon-close" plain
            @click="cancel" v-show="!isShow">取消</el-button>
    </nav>
    <div class="toShow" v-show="isShow">
        <!-- 搜索条件 -->
        <div class="component-top">
            <div class="search-title fl">搜索：</div>
            <el-input
                placeholder="请输入供应商(编号/姓名/姓名拼音)"
                prefix-icon="el-icon-search"
                class="fl"
                size="small"
                @keyup.enter.native="searchHandle"
                style="width:250px;margin-right:10px;"
                v-model="search.keyword">
            </el-input>
            <div class="search-title fl">城市：</div>
                <el-select 
                    class="fl"
                    size="small" 
                    clearable
                    v-model="search.city"
                    @change="searchHandle"
                    style="width:160px;margin-right:10px;"
                    >
                    <el-option
                    v-for="item in cityList"
                    :key="item.value"
                    :label="item.name"
                    :value="item.value">
                    </el-option>
                </el-select>
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
                </el-table-column>
                <el-table-column
                prop="name"
                label="名称"
                >
                </el-table-column>
                <el-table-column
                prop="city"
                label="城市"
                >
                </el-table-column>
                <el-table-column
                prop="material_items"
                label="提供原料"
                width="500"  
                >
                <template slot-scope="scope">
                  <el-popover trigger="hover" placement="top">
                    <p style="width:470px;">{{ scope.row.material_items }}</p>
                    <div slot="reference" class="name-wrapper">
                      <p size="medium" style="overflow:hidden;text-overflow:ellipsis;white-space:nowrap;width:470px;">{{ scope.row.material_items }}</p>
                    </div>
                  </el-popover>
                </template>
                </el-table-column>
                <el-table-column
                prop="state"
                label="状态"
                width="100">
                <template slot-scope="scope">
                    <el-tag size="medium" v-if="scope.row.state==1">启用</el-tag>
                    <el-tag size="medium" v-else type="danger">停用</el-tag>
                </template>
                </el-table-column>
                <el-table-column label="操作" width="250">
                    <template slot-scope="scope">
                        <el-button
                        size="mini"
                        @click="recordHandle(scope.row,'seeVisible')">查看</el-button>
                        <el-button
                        size="mini"
                        type="primary"
                        @click="recordHandle(scope.row,'editVisible')">修改</el-button>
                        <el-button
                        size="mini"
                        type="danger"
                        v-if="scope.row.state==1"
                        :loading="btnLoading"
                        @click="stopAddress(scope.row.id,scope.row.state)">停用</el-button>
                        <el-button
                        size="mini"
                        type="danger"
                        v-else
                        :loading="btnLoading"
                        @click="stopAddress(scope.row.id,scope.row.state)">启用</el-button>
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
    <div class="toAdd" v-show="!isShow" style="background-color:#f2f2f2;overflow:hidden;">
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
            width="180">
        </el-table-column>
        <el-table-column
            prop="name"
            label="商品名称"
            width="180">
        </el-table-column>
        <el-table-column
            prop="out_unit"
            label="单位">
        </el-table-column>
        <el-table-column
            prop="model"
            label="型号">
        </el-table-column>
        <el-table-column
            prop="out_unit"
            label="保质期">
            <template slot-scope="scope">
                <p>{{scope.row.shelf_life_num}} / {{scope.row.shelf_life_unit}}</p>
            </template>
        </el-table-column>
        <el-table-column label="操作">
            <template slot-scope="scope">
                <el-button
                size="mini"
                @click="recordHandle(scope.row,'seeMaterVisible')"
                >查看</el-button>
            </template>
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
    <!-- 弹窗 -->
    <app-dialog title="供应商信息" :visible.sync="dialog.seeVisible">
      <show-supplier :info="info"></show-supplier>
    </app-dialog>
    <app-dialog title="修改供应商" :visible.sync="dialog.editVisible">
      <edit-supplier :info="info" @linkMater="addMater('edit',arguments)"></edit-supplier>
    </app-dialog>
    <app-dialog title="新增供应商" :visible.sync="dialog.addVisible">
      <add-supplier @linkMater="addMater('add',arguments)"></add-supplier>
    </app-dialog>
</div>
</template>

<script>
import { getSuppList, stopAddress, addSupp, editSupp } from "../../api";
import { getList, stopInfo, addData } from "../../common";
import AppDialog from "../common/AppDialog.vue";
import ShowSupplier from "./Supplier_show.vue";
import EditSupplier from "./Supplier_edit.vue";
import AddSupplier from "./Supplier_add.vue";
import { mapState, mapActions } from "vuex";
export default {
  name: "ads",
  data() {
    return {
      search: {
        state: "",
        city: "",
        keyword: ""
      },
      total: 1,
      list: [],
      pageSize: 10,
      dialog: {
        addVisible: !1,
        editVisible: !1,
        seeVisible: !1,
        seeMaterVisible: !1
      },
      info: "",
      curPageIndex: 1,
      isShow: !0,
      preData: {},
      filterText: "",
      tree: "",
      defaultProps: {
        children: "children",
        label: "name"
      },
      tableData: [],
      toData: {
        material_ids: "",
        material_items: []
      },
      flag: "",
      choseIds: [],
      title: ""
    };
  },
  components: {
    AppDialog,
    ShowSupplier,
    EditSupplier,
    AddSupplier
  },
  computed: {
    ...mapState("stateChange", ["btnLoading"]),
    ...mapState("dict", [
      "store_state",
      "cityList",
      "provinceList",
      "inventoryTree"
    ])
  },
  methods: {
    /** 回显展示 */
    ...mapActions("dict", [
      "getStoreState",
      "getCityList",
      "getProvinceList",
      "getInventoryTree"
    ]),
    handleCurrentChange(val) {
      this.curPageIndex = val;
      getList({
        currPage: this.curPageIndex,
        requestUrl: getSuppList,
        params: { ...this.search, pageSize: this.pageSize }
      }).then(item => {
        this.total = item.total;
        this.list = item.list;
      });
    },
    //操作弹窗控制
    recordHandle(_row, text) {
      this.dialog[text] = !0;
      this.info = _row;
      if (text == "editVisible") {
        this.choseIds = _row.material_ids.split(",");
      }
    },
    //重新获取数据
    reloadGetData(res) {
      if (res == "reload") {
        for (let attr in this.dialog) {
          this.dialog[attr] = !1;
        }
        getList({
          requestUrl: getSuppList,
          params: { ...this.search, pageSize: this.pageSize }
        }).then(item => {
          this.list = item;
        });
      }
    },
    topHandle(text) {
      this.dialog[text] = !0;
    },
    //切换弹窗显示
    addMater() {
      if (arguments[0] == "add") {
        this.$refs.tree.setCheckedKeys([]);
        this.tableData=[]
        this.flag = 0;
        this.title = "增加完成";
      } else {
        this.setChoose();
        this.flag = 1;
        this.title = "修改完成";
      }
      this.preData = arguments[1][0];
      this.isShow = !this.isShow;
      for (let attr in this.dialog) {
        this.dialog[attr] = !1;
      }
    },
    setChoose() {
      this.$refs.tree.setCheckedKeys(this.choseIds);
      this.getCheckedNodes();
    },
    cancel() {
      this.isShow = !this.isShow;
    },
    //根据条件搜素
    searchHandle(val) {
      if (val == "all") {
        this.search.keyword = "";
        this.search.state = "";
        this.search.city = "";
        this.search.province = "";
      }
      getList({
        requestUrl: getSuppList,
        params: { ...this.search, pageSize: this.pageSize }
      }).then(item => {
        this.total = item.total;
        this.list = item.list;
      });
    },
    stopAddress(_id, state) {
      let val = state == 1 ? 0 : 1;
      let text = state == 1 ? "您确定停用此地址吗？" : "您确定启用此地址吗？";
      this.$confirm(text, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        stopInfo({
          requestUrl: stopAddress,
          params: { id: _id, state: val }
        })
          .then(item => {
            this.$emit("reloadEvent", "reload");
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
    },
    /** 关联原料 */
    getCheckedNodes() {
      this.tableData = [];
      let val = this.$refs.tree.getCheckedNodes();
      let filterVal = val.filter(item => {
        return !item.children;
      });
      this.tableData = filterVal;
      this.toData.material_items = filterVal;
      this.idFilter(filterVal);
    },
    //过滤出选中的子id
    idFilter(val) {
      this.toData.material_ids = "";
      val.forEach(item => {
        this.toData.material_ids = this.toData.material_ids + item.id + ",";
      });
      this.toData.material_ids = this.toData.material_ids.slice(
        0,
        this.toData.material_ids.length - 1
      );
    },
    //增加完成
    okToAdd() {
      let formatData = { ...this.preData, ...this.toData };
      if (this.flag == 0) {
        this.okAdd(formatData);
      } else {
        this.editInfo(formatData);
      }
    },
    async okAdd(val) {
      try {
        let valStr = JSON.stringify(val);
        let obj = {
          [valStr]: ""
        };
        const response = await addSupp(obj);
        if (response.code == 1) {
          this.$message({
            message: "新增成功！",
            type: "success"
          });
          this.isShow = !this.isShow;
          getList({
            requestUrl: getSuppList,
            params: { ...this.search, pageSize: this.pageSize }
          }).then(item => {
            this.total = item.total;
            this.list = item.list;
          });
        } else {
          this.$message.error("新增失败");
        }
      } catch (error) {
        this.$message.error("新增失败");
      }
    },
    async editInfo(val) {
      try {
        let valStr = JSON.stringify(val);
        let obj = {
          [valStr]: ""
        };
        const response = await editSupp(obj);
        if (response.code == 1) {
          this.$message({
            message: "修改成功！",
            type: "success"
          });
          this.isShow = !this.isShow;
          getList({
            requestUrl: getSuppList,
            params: { ...this.search, pageSize: this.pageSize }
          }).then(item => {
            this.total = item.total;
            this.list = item.list;
          });
        } else {
          this.$message.error("修改失败");
        }
      } catch (error) {
        console.log(error);
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
    }
  },
  created() {
    this.getProvinceList();
    this.getCityList();
    this.getStoreState();
    this.getInventoryTree();
    //获取列表
    getList({
      requestUrl: getSuppList,
      params: { ...this.search, pageSize: this.pageSize }
    }).then(item => {
      this.total = item.total;
      this.list = item.list;
    });
  },
  watch: {
    list(val) {
      var _this = this;
      let text = "";
      for (let i = 0; i < this.list.length; i++) {
        text = "";
        for (var j = 0; j < _this.list[i].material_items.items.length; j++) {
          text = text + _this.list[i].material_items.items[j].name;
          if (j != _this.list[i].material_items.items.length - 1) {
            text = text + "  ,  ";
          }
        }
        _this.list[i].material_items = text;
      }
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
</style>
