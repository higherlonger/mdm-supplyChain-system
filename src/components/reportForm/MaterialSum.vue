 <template>
<div> 
    <!-- 导航栏 -->
    <nav class="app-location-wrapper">
        <el-breadcrumb separator="/" class="fl">
            <el-breadcrumb-item :to="{ path: '/sys_setting' }">报表管理</el-breadcrumb-item>
            <el-breadcrumb-item>物流报表</el-breadcrumb-item>
            <el-breadcrumb-item>原料统计</el-breadcrumb-item>
        </el-breadcrumb>
        <el-button class="fr" size="small" icon="el-icon-download" type="primary" plain 
            @click="outReport">导出报表</el-button>
    </nav>

    <div style="background-color:#fff;"> 
      <!-- 搜索条件 -->
      <div class="component-top">
          <div class="search-title fl">开始时间：</div>
              <el-date-picker
                v-model="search.beginTime"
                type="date"
                class="fl"
                style="width:160px"
                value-format="yyyy-MM-dd"
                size="small"
                @change="searchHandle()"
                placeholder="选择日期">
              </el-date-picker>
          <div class="search-title fl" style="margin-left:10px">结束时间：</div>
              <el-date-picker
                v-model="search.endTime"
                type="date"
                class="fl"
                style="width:160px"
                value-format="yyyy-MM-dd"
                size="small"
                @change="searchHandle()"
                placeholder="选择日期">
              </el-date-picker>
          <el-button class="fl" style="margin-left: 10px;" size="small"
              @click.stop="searchHandle('all')">
              全部
          </el-button>
      </div>
      <!-- 小标题 -->
      <div class="title">
          <span v-for="(item) in this.title" :key="item.name">{{item.name}}：{{item.value}}</span>
      </div>
      <!-- 表格 -->
      <div class="component-main">
          <el-table
              :data="tbody"
              size="small"
              stripe
              border
              ref="table"
              v-loading="btnLoading"
              style="width: 100%">
              <el-table-column v-for="item in this.thead" :key="item.key"
              :prop=item.key
              :label=item.value
              >
              </el-table-column>       
          </el-table>
      </div>
    </div>
</div>
</template>

<script>
import { getMaterialSum,getMaterialSumExp } from "../../api";
import { getList, addData, getListPage } from "../../common";
import AppDialog from "../common/AppDialog.vue";
import { mapState, mapActions } from "vuex";
export default {
  name: "returnStatistics",
  data() {
    return {
      search: {
        beginTime: "",
        endTime: ""
      },
      thead: [],
      tbody: [],
      title: []
    };
  },
  components: {
    AppDialog
  },
  computed: {
    ...mapState("stateChange", ["btnLoading"])
  },
  methods: {
    //根据条件搜素
    searchHandle(val) {
      if (val == "all") {
        this.search.beginTime = "";
        this.search.endTime = "";
      }
      getListPage({
        requestUrl: getMaterialSum,
        params: { ...this.search }
      }).then(item => {
        this.thead = item.list.thead_list;
        this.tbody = item.list.tbody_list;
        this.title = item.list.title;
      });
    },
    //导出报表
    outReport() {
      addData({
        requestUrl: getOrderStatisticsExp,
        params: { beginTime:this.search.beginTime,endTime:this.search.endTime },
        paramsType:2
      }).then(item=>{ 
        if(item.code==0){ 
          this.$message.error('导出失败！');
        }else{
          window.open(item.data.down_url, "_blank");
        }
      })
    }
  },
  created() {
   
  }
};
</script>

<style>
.title {
  padding: 0 10px 10px 10px;
  font-size: 14px;
}
.title span {
  margin-right: 25px;
  color: #656565;
}
</style>
