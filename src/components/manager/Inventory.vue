<template>
    <div style="overflow:hidden;">
      <!-- 导航栏 -->
        <nav class="app-location-wrapper">
            <el-breadcrumb separator="/" class="fl">
                <el-breadcrumb-item :to="{ path: '/sys_setting' }">店长管理</el-breadcrumb-item>
                <el-breadcrumb-item>库存管理</el-breadcrumb-item>
                <el-breadcrumb-item>盘点</el-breadcrumb-item>
            </el-breadcrumb>
            <el-button class="fr" size="small" icon="el-icon-plus" type="primary" plain v-show="view.listView"
            @click="topHandle()">新增盘点</el-button>
            <el-button class="fr" size="small"  plain v-show="view.addView"
            @click="cancel()">取消盘点</el-button>
            <el-button class="fr" size="small" type="primary" plain v-show="view.addView"
            @click="okWrite()">完成盘点</el-button>
            
            <el-button class="fr" size="small" icon="el-icon-back" type="primary" plain v-show="view.detailView"
            @click="toPre()">后退</el-button>
            <el-dropdown class="fr"  @command="handleCommand" v-show="view.addView"> 
              <el-button plain size="small">
                导入订货<i class="el-icon-arrow-down el-icon--right"></i>
              </el-button>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item command="download">下载模板</el-dropdown-item>
                <el-dropdown-item command="upload">
                  <template>
                    <el-upload 
                      class="upload-demo"
                      action="/mgr/works/pc/warehouseCountCtrl/countByXls"
                      :show-file-list="false"
                      :on-success="handleAvatarSuccess"
                      :on-error="handleAvatarFail"
                      accept=".xlsx,.xls"
                      > 
                      <span size="small">点击上传</span>
                    </el-upload>
                  </template>
                </el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
        </nav>
        <!-- 盘点记录 -->
        <div style="background-color:#fff;" v-show="view.listView">
          <!-- 搜索条件 -->
          <div class="component-top">
              <div class="search-title fl">搜索：</div>
              <el-input
                  placeholder="请输入单据号"
                  prefix-icon="el-icon-search"
                  class="fl"
                  size="small"
                  @keyup.enter.native="searchHandle"
                  style="width:220px;margin-right:10px;"
                  v-model="search.keyword">
              </el-input>
              <div class="search-title fl">时间：</div>
                  <el-date-picker
                    v-model="timeSlot"
                    class="fl"
                    size="small"
                    @change="searchHandle('time')"
                    type="daterange"
                    value-format="yyyy-MM-dd HH:mm:ss"
                    range-separator="至"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期">
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
                  label="单据号"
                  width="150"
                  >
                  </el-table-column>
                  <el-table-column
                  prop="count_date"
                  label="盘点时间"
                  width="150"
                  >
                  </el-table-column>
                  <el-table-column
                  prop="remark"
                  label="备注"
                  >
                  <template slot-scope="scope">
                    <el-popover trigger="hover" placement="top">
                        <p>{{ scope.row.remark }}</p>
                        <div slot="reference" class="name-wrapper">
                          <p size="medium">{{ scope.row.remark }}</p>
                        </div>
                    </el-popover>
                  </template>
                  </el-table-column>
                  <el-table-column label="操作" width="150">
                      <template slot-scope="scope">
                          <el-button
                          size="mini"
                          @click="recordHandle(scope.row)">查看</el-button>
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
        <!-- 盘点项 -->
        <div style="background-color:#f2f2f2;overflow:hidden" v-show="view.addView">
            <div class="component-top" style="background-color:#fff;">
                <div class="search-title fl">搜索：</div>
                <el-input
                    placeholder="请输入名称/拼音"
                    prefix-icon="el-icon-search"
                    class="fl"
                    size="small"
                    @keyup.enter.native="searchHandle"
                    style="width:220px;margin-right:10px;"
                    v-model="searchList.keyword">
                </el-input>
                <el-button class="fl" style="margin-left: 10px;" size="small"
                    @click.stop="searchHandle('all')">
                    全部
                </el-button>
            </div>
            <!-- 表格 -->
            <el-table
            :data="tableData"
            border
            ref="table"
            >
            <el-table-column
                prop="material_data.name"
                fixed
                label="原料名称"
                width="250"
                >
            </el-table-column>
            <el-table-column
                prop="material_data.num"
                label="编码"
               >
            </el-table-column>
            <el-table-column
                prop="material_data.out_unit"
                label="单位"
                >
            </el-table-column>
            <el-table-column
                prop="material_data.attribute"
                label="规格"
                >
            </el-table-column>
            <el-table-column
                prop="quantity"
                label="历史库存"
                >
            </el-table-column>
            <el-table-column
              prop="material_data.current_quantity"
              label="库存数量"
              width="180">
              <template slot-scope="scope">
                <el-input-number size="small" v-model="scope.row.material_data.current_quantity"></el-input-number>
              </template>
            </el-table-column>
            <el-table-column label="操作" width="130" fixed='right'>
                <template slot-scope="scope">
                    <el-button
                    size="mini"
                    @click="addRemark(scope.row.material_data)">添加备注</el-button>
                </template>
                </el-table-column>
            </el-table>
        </div>
        <!-- 查看盘点项 -->
        <div style="background-color:#fff;" v-show="view.detailView">
          <el-form :model="row" ref="form" label-width="100px" size="small" style="margin-top:20px">
              <el-form-item label="单据号" prop="num">
                  <span class="form-record-show">{{ row.num }}</span>
              </el-form-item>
              <el-form-item label="盘点时间" prop="count_date">
                  <span class="form-record-show">{{ row.count_date }}</span>
              </el-form-item>
              <el-form-item label="备注" prop="remark">
                  <span class="form-record-show">{{ row.remark }}</span>
              </el-form-item>
              <el-form-item label="盘点项" prop="count_item">
                  <el-table 
                    :data="test"
                    stripe
                    border
                    style="width: 100%">
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
                      prop="attribute"
                      label="规格">
                    </el-table-column>
                    <el-table-column
                      prop="before_quantity"
                      label="历史库存">
                    </el-table-column>
                    <el-table-column
                      prop="current_quantity"
                      label="库存数量">
                    </el-table-column>      
                  </el-table>
              </el-form-item>
          </el-form>
        </div>
    </div>
</template>

<script>
import { mapState, mapActions } from "vuex";
import {
  getMaterialTree,
  getInvenList,
  stopMarters,
  getInvenDataList,
  addInven,
  downloadStock
} from "../../api";
import { getList, getListPage, addData } from "../../common";
import AppDialog from "../common/AppDialog.vue";
export default {
  name: "tree",
  data() {
    return {
      timeSlot: "",
      list: [],
      tree: [],
      defaultProps: {
        children: "children",
        label: "name"
      },
      search: {
        keyword: "",
        from_date: "",
        to_date: ""
      },
      searchList: {
        keyword: ""
      },
      tableData: [],
      filterText: "",
      ids: "",
      total: 1,
      curPageIndex: 1,
      pageSize: 10,
      remark: "",
      upToData: {},
      view: {
        listView: !0,
        addView: !1,
        detailView: !1
      },
      row: {},
      test: []
    };
  },
  computed: {
    ...mapState("dict", ["inventoryTree"]),
    ...mapState("stateChange", ["btnLoading"])
  },
  methods: {
    ...mapActions("dict", ["getInventoryTree"]),
    //文件上传成功
    handleAvatarSuccess(res, file) {
      if (res.code == 1) {
        this.$message({
          message: "上传成功！",
          type: "success"
        });
      } else if (res.code == 0) {
        const h = this.$createElement;
        this.$alert(`<span>上传失败，请下载文件查看原因：<a href=${res.data.down_url}>${res.data.down_url}</a></span>`, '上传失败', {
          dangerouslyUseHTMLString: true
        });
      }
    },
    //文件上传失败
    handleAvatarFail(err, file, fileList){ 
      console.log(err, file, fileList)
    },
    //导入订货
    handleCommand(command) {
      if (command == "download") {
        //下载模板
        this.downLoadExp();
      }
    },
    //下载模板
    downLoadExp() {
      addData({
        requestUrl: downloadStock,
        params: {},
        paramsType: 2
      }).then(item => {
        if (item.code == 0) {
          this.$message.error("导出失败！");
        } else {
          window.open(item.data.down_url, "_blank");
        }
      });
    },
    handleCurrentChange(val) {
      this.curPageIndex = val;
      getList({
        requestUrl: getInvenList,
        currPage: this.curPageIndex,
        params: { ...this.search, pageSize: this.pageSize }
      }).then(item => {
        this.total = item.total;
        this.list = item.list;
      });
    },
    topHandle() {
      this.view.listView = !this.view.listView;
      this.view.addView = !this.view.addView;
    },
    cancel() {
      this.view.listView = !this.view.listView;
      this.view.addView = !this.view.addView;
    },
    okWrite() {
      this.$prompt("请输入盘点单备注", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消"
      })
        .then(({ value }) => {
          if (value == null) {
            this.remark = "";
          } else {
            this.remark = value;
          }
          this.filterUpData();
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "取消"
          });
        });
    },
    recordHandle(_row) {
      this.view.listView = !this.view.listView;
      this.view.detailView = !this.view.detailView;
      this.row = _row;
      this.test = this.row.count_item.items;
      // console.log(this.row.count_item.items[0].columns.name)
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
    //根据条件搜素
    searchHandle(val) {
      if (val == "all") {
        this.search.keyword = "";
        this.search.from_date = "";
        this.search.to_date = "";
        this.timeSlot = "";
      }
      if (val == "time") {
        this.search.from_date = this.timeSlot[0];
        this.search.to_date = this.timeSlot[1];
      }
      getList({
        requestUrl: getInvenList,
        params: { ...this.search, pageSize: this.pageSize }
      }).then(item => {
        this.total = item.total;
        this.list = item.list;
      });
    },
    //过滤回显数据
    filterDataList(val) {
      for (let i = 0; i < val.length; i++) {
        val[i].material_data["current_quantity"] = "";
        val[i].material_data["item_remark"] = "";
      }
      this.tableData = val;
    },
    toPre() {
      this.view.listView = !this.view.listView;
      this.view.detailView = !this.view.detailView;
    },
    //处理提交的数据格式
    filterUpData() {
      let count_item = [];
      for (let i = 0; i < this.tableData.length; i++) {
        count_item.push({
          id: this.tableData[i].material_data.id,
          stock_id: this.tableData[i].id,
          before_quantity: this.tableData[i].quantity,
          current_quantity: this.tableData[i].material_data.current_quantity,
          item_remark: this.tableData[i].material_data.item_remark
        });
      }
      this.upToData = {
        remark: this.remark,
        count_item: count_item
      };
      //提交-请求
      addData({
        requestUrl: addInven,
        preData: this.upToData,
        paramsType: 1
      }).then(item => {
        if (item == 1) {
          this.$message({
            message: "新增成功！",
            type: "success"
          });
          this.view.listView = !this.view.listView;
          this.view.addView = !this.view.addView;
          getList({
            requestUrl: getInvenList,
            params: { ...this.search, pageSize: this.pageSize }
          }).then(item => {
            this.total = item.total;
            this.list = item.list;
          });
        } else {
          this.$message.error("新增失败");
        }
      });
    },
    //每一项的备注
    addRemark(_row) {
      let text = "请输入" + _row.name + "备注：";
      this.$prompt(text, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消"
      })
        .then(({ value }) => {
          _row.item_remark = value;
        })
        .catch(() => {
        });
    }
  },
  watch: {
    filterText(val) {
      this.$refs.tree.filter(val);
    }
  },
  mounted() {
    this.$refs.table.$el.addEventListener("keyup", this.keyUpHandle, false);
  },
  created() {
    this.getInventoryTree();
    //获取列表
    getList({
      requestUrl: getInvenList,
      params: { ...this.search, pageSize: this.pageSize }
    }).then(item => {
      this.total = item.total;
      this.list = item.list;
    });
    //获取盘点项列表
    getListPage({
      requestUrl: getInvenDataList,
      params: { ...this.searchList }
    }).then(item => {
      this.filterDataList(item.list);
    });
  }
};
</script>

<style>
.form-record-show {
  width: 78%;
}
</style>
