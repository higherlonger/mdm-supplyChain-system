<template>
<div>
    <!-- 导航栏 -->
    <nav class="app-location-wrapper">
        <el-breadcrumb separator="/" class="fl">
            <el-breadcrumb-item :to="{ path: '/sys_setting' }">系统管理</el-breadcrumb-item>
            <el-breadcrumb-item>基础管理</el-breadcrumb-item>
            <el-breadcrumb-item>分类管理</el-breadcrumb-item>
        </el-breadcrumb>
        <el-button class="fr" size="small" icon="el-icon-plus" type="primary" plain
            @click="topHandle('addVisible')">新增分类</el-button>
    </nav>
    <!-- 搜索条件 -->
    <div class="component-top">
        <div class="search-title fl">类别</div>
          <el-select  
                class="fl"
                size="small" 
                v-model="search.type"
                @change="searchHandle"
                style="width:160px;margin-right:10px;"
                >
                <el-option
                v-for="item in type"
                :key="item.value"
                :label="item.label"
                :value="item.value">
                </el-option>
            </el-select>
          <!-- <el-button class="fl" style="margin-left: 10px;" size="small"
              @click.stop="searchHandle('all')">
              全部
          </el-button> -->
    </div>
    <!-- 表格 -->
    <div class="appManager-list">
        <div class="tree-show-line" v-loading="btnLoading">
            <dl class="tree-tb-top">
                <dd style="width: 250px">分类名称</dd>
                <dd style="width:160px">分类编码</dd>
                <dd style="flex:1">备注</dd>
                <dd style="width: 150px">操作</dd>
            </dl>
            <ul class="">
                <li v-for="(item, index) in list" :key="index">
                    <div class="tree-item">
                        <span @click="childTreeHandle(item)">
                            <i class="tree-item-icon" 
                                :class="{'el-icon-minus': item.showChildren, 'el-icon-plus': !item.showChildren}">
                            </i>
                        </span>
                        <span style="width: 224px">{{ item.name }}</span>
                        <span style="width:160px">{{ item.num }}</span>
                        <span style="flex:1">{{ item.remark }}</span>
                        <div label="操作" width="150" style="margin-right:24px">
                            <el-button
                            size="mini"
                            type="primary"
                            @click="recordHandle(item,'editVisible')"
                            >修改</el-button>
                            <el-button
                            disabled
                            size="mini"
                            type="danger"
                            @click="delInfo(item.id)"
                            >删除</el-button>
                        </div>
                    </div>
                    <el-collapse-transition>
                    <ul class="child-tree" v-show="item.showChildren">
                        <li v-for="(val, key) in item.children" :key="key">
                            <div class="tree-item">
                                <span><i class="el-icon-document"></i></span>
                                <span style="width: 205px">{{ val.name }}</span>
                                <span style="width:160px">{{ val.num }}</span>
                                <span style="flex:1">{{ item.remark }}</span>
                                <div label="操作" width="218" style="margin-right:24px">
                                    <el-button
                                    size="mini"
                                    type="primary"
                                    @click="recordHandle(item,'editVisible',key)"
                                    >修改</el-button>
                                    <el-button
                                    size="mini"
                                    type="danger"
                                    @click="delInfo(item.id)"
                                    >删除</el-button>
                                </div>
                            </div>
                        </li>
                    </ul>
                    </el-collapse-transition>
                </li>
            </ul>
        </div>
    </div> 
    <!-- 弹窗 -->
    <app-dialog title="新增分类" :visible.sync="dialog.addVisible">
      <add-class :state="state" @reloadEvent="reloadGetData"></add-class>
    </app-dialog>
    <app-dialog title="修改分类" :visible.sync="dialog.editVisible">
      <edit-class :info="info" @reloadEvent="reloadGetData"></edit-class>
    </app-dialog>
</div>
</template> 

<script>
import { mapState, mapActions } from "vuex";
import { getListPage, stopInfo } from "../../common";
import { getCagTree, delClass } from "../../api";
import AppDialog from "../common/AppDialog.vue";
import AddClass from "./Class_add.vue";
import EditClass from "./Class_edit.vue";
export default {
  name: "material",
  data() {
    return {
      list: [],
      search: {
        keyword: "",
        type: "material"
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
        seeVisible: !1
      },
      recordId: "",
      info: ""
    };
  },
  components: {
    AppDialog,
    AddClass,
    EditClass
  },
  computed: {
    ...mapState("dict", ["store_state", "commodityList"]),
    ...mapState("stateChange", ["btnLoading"])
  },
  methods: {
    ...mapActions("dict", ["getStoreState", "getCommodityList"]),
    childTreeHandle(item) {
      item.showChildren = !item.showChildren;
    },
    searchHandle() {},
    //操作弹窗控制
    recordHandle(_row, text, index) {
      this.recordId = _row.id;
      this.dialog[text] = !0;
      if (index != undefined) {
        this.info = _row.children[index];
      } else {
        this.info = _row;
      }
    },
    topHandle(text) {
      this.dialog[text] = !0;
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
      requestUrl: getCagTree,
      params: { type: "material" }
    }).then(item => {
      this.state = 0;
      this.list = item.list.children;
      this.mat = item.list.children;
    });
    getListPage({
      requestUrl: getCagTree,
      params: { type: "product" }
    }).then(item => {
      this.pro = item.list.children;
    });
    this.getStoreState();
    this.getCommodityList();
  },
  watch: {
    "search.type": {
      handler(newVal) {
        if (newVal == "product") {
          this.state = 1;
          this.list = this.pro;
        } else {
          this.state = 0;
          this.list = this.mat;
        }
      },
      deep: true
    }
  }
};
</script>

<style>
.stuffType-search {
  width: 300px;
}
</style>
