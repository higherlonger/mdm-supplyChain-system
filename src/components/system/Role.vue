<template>
<div>
    <!-- 导航栏 -->
    <nav class="app-location-wrapper">
        <el-breadcrumb separator="/" class="fl">
            <el-breadcrumb-item :to="{ path: '/sys_setting' }">系统管理</el-breadcrumb-item>
            <el-breadcrumb-item>系统设置</el-breadcrumb-item>
            <el-breadcrumb-item>角色管理</el-breadcrumb-item>
        </el-breadcrumb>
        <el-button class="fr" size="small" icon="el-icon-plus" type="primary" plain
            @click="topHandle('addVisible')">新增角色</el-button>
    </nav>
    <!-- 搜索条件 -->
    <div class="component-top">
        <div class="search-title fl">搜索：</div>
        <el-input
            placeholder="请输入名称"
            prefix-icon="el-icon-search"
            class="fl"
            size="small"
            @keyup.enter.native="searchHandle"
            style="width:160px;margin-right:10px;"
            v-model="search.keyword">
        </el-input>
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
            prop="name"
            label="名称"
            >
            </el-table-column>              
            <el-table-column
            prop="state_text"
            label="状态"
            >
            <template slot-scope="scope">
                <el-tag size="medium" v-if="scope.row.state==1">启用</el-tag>
                <el-tag size="medium" v-else type="danger">停用</el-tag>
            </template>
            </el-table-column>
            <el-table-column
            prop="remark"
            label="备注"
            >
            </el-table-column>
            <el-table-column
            prop="updatedate"
            label="修改时间"
            >
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
                    @click="stopRole(scope.row.id,scope.row.state)">停用</el-button>
                    <el-button
                    size="mini"
                    type="danger"
                    v-else
                    :loading="btnLoading"
                    @click="stopRole(scope.row.id,scope.row.state)">启用</el-button>
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
    <!-- 弹窗 -->
    <app-dialog title="角色信息" :visible.sync="dialog.seeVisible" top=0 customClass='customClass'>
      <show-role :record-id="recordId"></show-role>
    </app-dialog>
    <app-dialog title="修改信息" :visible.sync="dialog.editVisible">
      <edit-role :record-id="recordId" @reloadEvent="reloadData"></edit-role>
    </app-dialog>
    <app-dialog title="新增角色" :visible.sync="dialog.addVisible">
      <add-role @reloadEvent="reloadData"></add-role>
    </app-dialog>
    
</div> 
</template>

<script>
import { getRoleList, stopRole } from "../../api";
import { mapState, mapActions } from "vuex";
import AppDialog from "../common/AppDialog.vue";
import ShowRole from "./Role_show.vue";
import EditRole from "./Role_edit.vue";
import AddRole from "./Role_add.vue";
export default {
  name: "role",
  data() {
    return {
      search: {
        keyword: ""
      },
      list: [],
      dialog: {
        seeVisible: !1,
        editVisible: !1,
        addVisible: !1
      },
      recordId: "",
      currPageIndex: 1,
      total:1
    };
  },
  components: {
    AppDialog,
    ShowRole,
    EditRole,
    AddRole
  },
  computed: {
    ...mapState("stateChange", ["btnLoading"])
  },
  methods: {
    handleCurrentChange(val) {
      this.currPageIndex = val;
      this.getList(this.currPageIndex);
    },
    //获取列表
    async getList(currPage, callback) {
      try {
        currPage = currPage > 0 ? Number(currPage) : this.curPageIndex;
        const response = await getRoleList({ ...this.search });
        if (response.code == 1) {
          this.list = response.data;
          this.total = response.data.totalRow || 1;
          callback && callback();
        } else {
          this.$message.error("查询失败！");
        }
      } catch (error) {
        console.log(error);
      }
    },
    //   操作控制
    recordHandle(_row, text) {
      this.recordId = _row.id;
      this.dialog[text] = !0;
    },
    topHandle(text) {
      this.dialog[text] = !0;
    },
    //重新加载数据
    reloadData(res) {
      if (res == "reload") {
        for (let attr in this.dialog) {
          this.dialog[attr] = !1;
        }
        this.getList();
      }
    },
    //停用、启用
    stopRole(_id, state) {
      let val = state == 1 ? 0 : 1;
      let text = state == 1 ? "您确定停用此用户吗？" : "您确定启用此用户吗？";
      this.$confirm(text, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        this.okStop(_id, val);
      });
    },
    async okStop(_id, val) {
      try {
        const response = await stopRole({ id: _id, state: val });
        if (response.code == 1) {
          this.$message({
            message: "操作成功！",
            type: "success"
          });
          this.getList();
        } else {
          this.$message.error("操作失败！");
        }
      } catch (error) {
        console.log(error);
      }
    },
    searchHandle(text) {
      if (text == "all") {
        this.search.keyword = "";
      }
      this.getList();
    }
  },
  created() {
    this.getList();
  }
};
</script>

<style>
</style>
