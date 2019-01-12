 <template>
<div style="width:100%">
    <el-form :model="infoList" ref="infoList" size="small" label-width="100px" :rules="rules">   
        <el-form-item label="所属分类" prop="catalog_id" v-show="isShow">
            <el-select v-model="infoList.catalog_id" placeholder="请选分类" class="leftItv">
                <el-option v-for="item in commodityList" :key="item.id" :label="item.name" :value="item.id"></el-option>
            </el-select>
        </el-form-item>
        <el-form-item label="分类名称" prop="name" >
            <el-input class="textarea leftItv"
            type="text" 
            placeholder="请输入分类名称"
            v-model="infoList.name">
            </el-input>
        </el-form-item>   
        <el-form-item label="商品编号" prop="num">
                <el-input class="textarea leftItv"
                type="text"
                placeholder="请输入分类编码"
                v-model="infoList.num">
                </el-input>
        </el-form-item>
        <el-form-item label="备注" prop="remark">
            <el-input class="textarea leftItv"
                    type="textarea"
                    placeholder="请输入备注"
                    v-model="infoList.remark">
                    </el-input>
            </el-form-item>  
        <el-form-item style="margin-left:15px;">
            <el-button type="primary" @click="submitForm('infoList')" :loading="btnLoading">提交</el-button>
            <el-button @click="resetForm('infoList')">重置</el-button>
        </el-form-item>
    </el-form>
</div>
</template>

<script>
import { mapState, mapActions } from "vuex";
import { editData } from "../../common";
import { editCommodity } from "../../api";
export default {
  name: "edit-class",
  props: ["info"],
  data() {
    return {
      infoList: [],
      isShow:!0,
      rules: {
        parent_id: [
          { required: true, message: "分类不能为空", trigger: "change" }
        ],
        name: [
          { required: true, message: "分类名称不能为空", trigger: "blur" }
        ],
        num: [{ required: true, message: "分类编号不能为空", trigger: "blur" }]
      }
    };
  },
  computed: {
    ...mapState("dict", [
      "cityList",
      "provinceList",
      "store_state",
      "commodityList"
    ]),
    ...mapState("stateChange", ["btnLoading"])
  },
  methods: {
    ...mapActions("dict", [
      "getCityList",
      "getProvinceList",
      "getStoreState",
      "getCommodityList"
    ]),
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          editData({
            requestUrl: editCommodity,
            params: { 
              catalog_id:this.infoList.catalog_id,
              id: this.info.id,
              name:this.infoList.name,
              num:this.infoList.num,
              remark:this.infoList.rem
            } 
          })
            .then(item => {
              this.$emit("reloadEvent", "reload");
              if (item == 1) {
                this.$message({
                  message: "修改成功！", 
                  type: "success"
                });
              } else {
                this.$message.error("修改失败");
              }
            })
            .catch(error => {
              this.$message.error("修改失败");
            });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
      for (let attr in this.infoList) {
        this.infoList[attr] = "";
      }
    }
  },
  created() {
    this.infoList = JSON.parse(JSON.stringify(this.info));
    if(this.infoList.parent_id==0){
      this.isShow=!1
    }else{
      this.isShow=!0;
    }
    this.getStoreState();
    this.getCityList();
    this.getProvinceList();
    this.getCommodityList();
  }
};
</script>

<style>
.leftItv {
  width: 80%;
}
.leftPro {
  width: 39%;
  margin-right: 11px;
  float: left;
}
</style>
