<template>
<div>
    <!-- 导航栏 -->
    <nav class="app-location-wrapper">
        <el-breadcrumb separator="/" class="fl">
            <el-breadcrumb-item :to="{ path: '/sys_setting' }">系统管理</el-breadcrumb-item>
            <el-breadcrumb-item>系统设置</el-breadcrumb-item>
            <el-breadcrumb-item>用户管理</el-breadcrumb-item>
        </el-breadcrumb>
        <el-button class="fr" size="small" icon="el-icon-plus" type="primary" plain
            @click="topHandle('addVisible')">新增用户</el-button>
    </nav>
    <!-- 搜索条件 -->
    <div class="component-top">
        <div class="search-title fl">搜索：</div>
        <el-input
            placeholder="请输入用户(拼音/姓名/昵称)"
            prefix-icon="el-icon-search"
            class="fl"
            size="small"
            style="width:220px;margin-right:10px;"
            v-model="search.keyword">
        </el-input>
        <div class="search-title fl">用户状态：</div>
            <el-select 
                class="fl"
                size="small" 
                clearable
                v-model="search.state"
                style="width:160px;margin-right:10px;"
                >
                <el-option
                v-for="item in store_state"
                :key="item.value"
                :label="item.name"
                :value="item.value">
                </el-option>
            </el-select>
            <el-button class="fl" style="margin-left: 10px;" size="small" >
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
            prop="username"
            label="用户名"
            >
            </el-table-column>
            <el-table-column
            prop="nickname"
            label="用户昵称"
            >
            </el-table-column>
            <el-table-column
            prop="sex_text"
            label="用户性别"
            >
            </el-table-column>
            <el-table-column
            prop="phone"
            label="用户电话"
            >
            </el-table-column>
            <el-table-column
            prop="updatedate"
            label="创建时间"
            >
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
                    :loading="btnLoading"
                    v-if="scope.row.state==1"
                    @click="stopUser(scope.row.id,scope.row.state)">停用</el-button>
                    <el-button
                    size="mini"
                    type="danger"
                    v-else
                    :loading="btnLoading"
                    @click="stopUser(scope.row.id,scope.row.state)">启用</el-button>
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
    <app-dialog title="新增用户" :visible.sync="dialog.addVisible">
       <sys-add @reloadEvent="reloadData"></sys-add>
    </app-dialog>
    <app-dialog title="用户信息" :visible.sync="dialog.seeVisible">
       <sys-show :record-id="recordId"></sys-show>
    </app-dialog>
    <app-dialog title="修改信息" :visible.sync="dialog.editVisible">
       <sys-edit :info="info" @reloadEvent="reloadData"></sys-edit>
    </app-dialog>
    
</div>
</template>

<script>
import { getUserList,stopUser } from "../../api";
import { mapState, mapActions } from "vuex";
import AppDialog from "../common/AppDialog.vue";
import SysShow from "./User_show.vue";
import SysEdit from "./User_edit.vue";
import SysAdd from "./User_add.vue"
export default {
  name: "sys",
  data() {
    return {
      search: {
        keyword: "",
        state: ""
      },
      list: [],
      dialog:{
          seeVisible:!1,
          editVisible:!1,
          addVisible:!1
      },
      currPageIndex: 1,
      total: 1,
      pageSize: 10,
      recordId:"",
      info:""
    };
  },
  components:{
     SysShow,
     SysEdit,
     SysAdd,
     AppDialog
  },
  computed:{
      ...mapState('dict',['store_state']),
      ...mapState('stateChange',['btnLoading'])
  },
  methods: {
      ...mapActions('dict',['getStoreState']),
    //获取用户列表
    async getList(currPage, callback) {
      try {
        currPage = currPage > 0 ? Number(currPage) : this.currPageIndex;
        const response = await getUserList({
          pageNum: currPage,
          pageSize: this.pageSize,
          ...this.search
        });
        if (response.code == 1) {
          this.list = response.data.list;
          this.total = response.data.totalRow || 1;
          callback && callback();
        } else {
          this.$message.error("查询失败！");
        }
      } catch (error) {
        console.log(error);
      }
    },
    handleCurrentChange(val) {
      this.currPageIndex = val;
      this.getList(this.currPageIndex);
    },
    //操作控制
    recordHandle(_row,text){
        this.recordId=_row.id;
        this.info=_row;
        this.dialog[text]=!0;
    },
    topHandle(text){
        this.dialog[text]=!0;
    },
    reloadData(res){
        if(res=='reload'){
            for(let attr in this.dialog){
                this.dialog[attr]=!1;
            }
        }
        this.getList()
    },
    //停用、启用
    async stopUser(_id,state){
        let val=state==1? 0:1;
        let text=state==1? '您确定停用此用户吗？':'您确定启用此用户吗？';
        this.$confirm(text, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
           this.okStop(_id,val);
        }) 
    },
    async okStop(_id,val){
        try {
            const response=await stopUser({id:_id,state:val});
            if(response.code==1){
                this.$message({
                    message: '操作成功！',
                    type: 'success'
                });
                this.getList()
            }else{
                this.$message.error('操作失败！');
            }
        } catch (error) {
            console.log(error)
        }
    }
  },
  created() {
    this.getList();
    this.getStoreState()
  }
};
</script>

<style>
.form-record-show {
  width: 75%;
}
</style>
