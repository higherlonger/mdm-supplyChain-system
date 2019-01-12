<template>
<div>
    <!-- 导航栏 -->
    <nav class="app-location-wrapper">
        <el-breadcrumb separator="/" class="fl">
            <el-breadcrumb-item :to="{ path: '/sys_setting' }">采购管理</el-breadcrumb-item>
            <el-breadcrumb-item>采购单</el-breadcrumb-item>
            <el-breadcrumb-item>采购订单</el-breadcrumb-item>
        </el-breadcrumb>
        <el-button class="fr" size="small" icon="el-icon-arrow-left"  plain v-show="!isShow"
            @click="cancle">后退</el-button>
    </nav>
    <div style="background-color:#fff;" v-show="isShow">
        <!-- 搜索条件 -->
        <div class="component-top">
            <div class="search-title fl">搜索：</div> 
            <el-input
                placeholder="请输入名称"
                prefix-icon="el-icon-search"
                class="fl"
                size="small"
                @keyup.enter.native="searchHandle"
                style="width:220px;margin-right:10px;"
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
                prop="num"
                label="编号"
                >
                </el-table-column>
                <el-table-column
                prop="create_date"
                label="订单时间"
                >
                </el-table-column>
                <el-table-column
                prop="purchase_type_text"
                label="采购类型"
                >
                </el-table-column>
                <el-table-column
                prop="city"
                label="城市"
                >
                </el-table-column>
                <el-table-column
                prop="state_text"
                label="状态"
                >
                </el-table-column>
                <el-table-column label="操作" width="150">
                    <template slot-scope="scope">
                        <el-button
                        size="mini"
                        @click="seeDetail(scope.row.id)">查看</el-button>
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
    <div v-show="!isShow" style="background-color:#fff;padding:10px 0">
        <h5 class="form-part-line">订单基本信息</h5>
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
        <!-- 订单流程 -->
        <h5 class="form-part-line" v-html="titText"></h5>
        <el-collapse v-model="activeName" accordion class="view">
            <el-collapse-item title="① 采购申请" name="1" :class="[activeName==1? 'colorText':'']">
                <div v-html="text.one"></div>
            </el-collapse-item>
            <el-collapse-item title="② 选择供应商" name="2" :class="[activeName==2? 'colorText':'']">
                <div v-html="text.two"></div>
            </el-collapse-item>
            <el-collapse-item title="③ 财务审批" name="3" :class="[activeName==3? 'colorText':'']">
                <div v-html="text.three"></div>
            </el-collapse-item>
            <el-collapse-item title="④ BOSS审批" name="4" :class="[activeName==4? 'colorText':'']">
                <div v-html="text.four"></div>
            </el-collapse-item>
            <el-collapse-item title="⑤ 采购入库" name="5" :class="[activeName==5? 'colorText':'']">
                <div v-html="text.five"></div>
            </el-collapse-item>
        </el-collapse>
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
            <el-table-column label="操作" width="130" fixed='right'>
                <template slot-scope="scope">
                    <el-button
                    size="mini"
                    @click="recordHandle(scope.row,'seeVisible')">查看</el-button>
                </template>
            </el-table-column>
        </el-table>
    </div>
    <!-- 弹窗 -->
    <app-dialog title="原料详情" :visible.sync="dialog.seeVisible" top="0" customClass="customClass">
      <show-order :detailList="detailList"></show-order>
    </app-dialog>
</div>
</template>

<script>
import { getOrderList,getOrderById } from "../../api";
import { getList, stopInfo,getListPage } from "../../common";
import { mapState, mapActions } from "vuex";
import AppDialog from "../common/AppDialog.vue";
import ShowOrder from "./Order_show.vue";
export default {
  name: "ads",
  data() {
    return {
      search: {
        keyword: ""
      },
      dataVal:[],
      total: 1,
      list: [],
      pageSize: 10,
      recordId: "",
      info: "",
      curPageIndex: 1,
      isShow:!0,
      detail:{},
      text:{
          one:"",
          two:"",
          three:"",
          four:"",
          five:""
      },
      dialog:{
          seeVisible:!1
      },
      detailList:"",
      activeName:'1',
      titText:""
    };
  },
  components: {
      ShowOrder, 
      AppDialog
  },
  computed: {
    ...mapState("stateChange", ["btnLoading"])
  },
  methods: {
    //操作控制
    recordHandle(_row,text){
        this.detailList=_row;
        this.dialog[text]=!0;
    },
    handleCurrentChange(val) {
      this.curPageIndex = val;
      getList({
        currPage: this.curPageIndex,
        requestUrl: getOrderList,
        params: { ...this.search, pageSize: this.pageSize }
      }).then(item => {
        this.total = item.total;
        this.list = item.list;
      });
    },
    cancle(){
        this.isShow=!this.isShow;
    },
    //根据条件搜素
    searchHandle(val) {
      if (val == "all") {
        this.search.keyword = "";
      }
      getList({
        requestUrl: getOrderList,
        params: { ...this.search, pageSize: this.pageSize }
      }).then(item => {
        this.total = item.total;
        this.list = item.list;
      });
    }, 
    //点击查看
    seeDetail(_id){
        this.isShow=!this.isShow;
        getListPage({
            requestUrl: getOrderById,
            params: { id:_id},
            format:1
        }).then(item => {
            this.detail = item.list;
            this.initText(this.detail);
            this.dataVal=item.list.item;
            this.activeName=`${item.list.state_count}`
            switch(item.list.state_count){
                case 1:
                    this.titText=`订单流程（当前为"<span style='color:#409EFF'>采购申请</span>"阶段）`;
                    break;
                case 2:
                    this.titText=`订单流程（当前为"<span style='color:#409EFF'>选择供应商</span>"阶段）`;
                    break;
                case 3:
                    this.titText=`订单流程（当前为"<span style='color:#409EFF'>财务审批</span>"阶段）`;
                    break;
                case 4:
                    this.titText=`订单流程（当前为"<span style='color:#409EFF'>BOSS审批</span>"阶段）`;
                    break;
                case 5:
                    this.titText=`订单流程（当前为"<span style='color:#409EFF'>采购入库</span>"阶段）`;
                    break;
                case 6:
                    this.titText=`订单流程（<span style='color:green'>订单已完成</span>）`;
                    break;
                default:
                    this.titText=`订单流程（<span style='color:red'>订单已关闭</span>）`;
                    break;

            }
        });
    },
    //采购入库阶段的模板
    fiveText(val){
        let text="";
        for(let i=0;i<val.length;i++){
            text=text+`<div>
                <b>第${i+1}次入库</b>&nbsp;&nbsp;&nbsp;&nbsp;处理人：${val[i].name}&nbsp;&nbsp;&nbsp;&nbsp;处理时间：${val[i].time}
                <p>备注：${val[i].remark}</p>`;
            for(let j=0;j<val[i].message.length;j++){
                text=text+`<p>${j+1}、原料编号：${val[i].message[j].num}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;库存批号：${val[i].message[j].batch_num}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;名称：${val[i].message[j].name}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;数量：${val[i].message[j].quantity}</p>`
            }
            text=text+"</div></br>"
        }
        this.text.five=text;
    },
    //初始化模板
    initText(val){
       if(val.process[4]&&val.process[4][0].is_handle==1){
            this.fiveText(val.process[4])
       }else{
            this.text.five=`暂未处理`;
       }
       if(val.process[3]&&val.process[3].is_handle==1){
            this.text.four=`结果： <b>${val.process[3].message.is_agree_text}</b>`
       }else{
            this.text.four=`暂未处理`;
       }
       if(val.process[2]&&val.process[2].is_handle==1){
            this.text.three=`总价： <b>${val.process[2].message.total_price}</b> 元。</br>结果： <b>${val.process[2].message.is_agree_text}</b>`
       }else{
            this.text.three=`暂未处理`;
       }
       if(val.process[1]&&val.process[1].is_handle==1){
            this.text.two=`数量：共处理了 <b>${val.process[1].message.length}</b> 条采购项。</br>结果： <b>${val.process[1].message.is_agree_text}</b>`
       }else{
            this.text.two=`暂未处理`;
       }
       if(val.process[0]&&val.process[0].is_handle==1){
            this.text.one=`数量：共处理了 <b>${val.process[0].message.length}</b> 条采购项`;
       }else{
            this.text.one=`暂未处理`;
       }
       
    }
  },
  created() {
    //获取列表
    getList({
      requestUrl: getOrderList,
      params: { ...this.search, pageSize: this.pageSize }
    }).then(item => {
      this.total = item.total;
      this.list = item.list;
    });
  }
};
</script>

<style>
.frame{
    overflow: hidden;
}
.item{
    width:35%;
    background-color: white;
}
.remark{
    width:78%;
    background-color: white;
}
.leftShow{
    float: left;
    margin-right: 8%
}
.rightShow{
    float: left;
}
.list{
    margin-top: 4px;
}
.view{
    margin-left: 36px;
    width: 75%
}
.colorText div div{
    color:#409EFF;
}
</style>
