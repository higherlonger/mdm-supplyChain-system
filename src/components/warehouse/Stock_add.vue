<template>
<div style="width:100%">
    <el-form :model="infoList" ref="infoList" size="small" label-width="100px" :rules="rules" style="overflow:hidden">  
        <el-form-item label="原料数量" prop="name">
            <el-input class="textarea leftItv"
            type="text"
            placeholder="请输入原材料数量"
            v-model="infoList.quantity">  
            </el-input>
        </el-form-item>
        <el-form-item label="原料批号" prop="name">
            <el-input class="textarea leftItv"
            type="text"
            placeholder="请输入原材料批号"
            v-model="infoList.batch_num">
            </el-input>
        </el-form-item>
        <el-form-item label="所属分类" prop="catalog_id">
            <el-select v-model="infoList.catalog_id" filterable  placeholder="请选分类" class="leftItv">
                <el-option v-for="item in secondTree" :key="item.id" :label="item.name" :value="item.id"></el-option>
            </el-select>
        </el-form-item> 
        <el-form-item label="原材料名称" prop="name">
            <el-input class="textarea leftItv"
            type="text"
            placeholder="请输入原材料名称"
            v-model="infoList.name">
            </el-input>
        </el-form-item>
        <el-form-item label="编号" prop="num">
            <el-input class="textarea leftItv"
            type="text"
            placeholder="请输入编号"
            v-model="infoList.num">
            </el-input>
        </el-form-item>
        <el-form-item label="计量单位" prop="min2mid_num" style="clear:left">
            <template>
                <el-input-number class="nub" v-model="infoList.min2mid_num" controls-position="right" :min="0"></el-input-number>
            </template>
            <el-select v-model="infoList.min_unit"  placeholder="单位" class="danwei leftInval">
                <el-option v-for="item in materialUnit" :key="item.value" :label="item.name" :value="item.value"></el-option>
            </el-select>
            <span style="margin:0px 5px;font-size:20px;">/</span>
            <el-select v-model="infoList.mid_unit"  placeholder="单位" class="danwei">
                <el-option v-for="item in materialUnit" :key="item.value" :label="item.name" :value="item.value"></el-option>
            </el-select>
        </el-form-item>
        <el-form-item label="装箱单位" prop="mid2max_num" style="clear:left">
            <template>
                <el-input-number class="nub" v-model="infoList.mid2max_num" controls-position="right" :min="0"></el-input-number>
            </template>
            <el-select v-model="infoList.mid_unit"   placeholder="单位" class="danwei leftInval">
                <el-option v-for="item in materialUnit" :key="item.value" :label="item.name" :value="item.value"></el-option>
            </el-select>
            <span style="margin:0px 5px;font-size:20px;">/</span>
            <el-select v-model="infoList.max_unit"   placeholder="单位" class="danwei">
                <el-option v-for="item in materialUnit" :key="item.value" :label="item.name" :value="item.value"></el-option>
            </el-select>
        </el-form-item>
        <el-form-item label="订单类型" prop="order_type_text" class="leftFl">
            <el-select v-model="infoList.order_type_text"  placeholder="单位" class="tihuo">
                <el-option v-for="item in orderType" :key="item.value" :label="item.name" :value="item.value"></el-option>
            </el-select>
        </el-form-item>
        <el-form-item label="采购类型" prop="type" class="rightFl">
            <el-select v-model="infoList.type"  placeholder="单位" class="tihuo">
                <el-option v-for="item in purchase" :key="item.value" :label="item.name" :value="item.value"></el-option>
            </el-select>
        </el-form-item>
        <el-form-item label="提货单位" prop="out_unit" class="leftFl">
            <el-select v-model="infoList.out_unit"  placeholder="单位" class="tihuo">
                <el-option v-for="item in getProductUnit" :key="item.value" :label="item.name" :value="item.value"></el-option>
            </el-select>
        </el-form-item>
        <el-form-item label="规格" prop="attribute" class="rightFl">
            <el-input class="textarea tihuo "
            type="text"
            placeholder="请输入规格"
            v-model="infoList.attribute">
            </el-input>
        </el-form-item>
        <el-form-item label="成本价" prop="cost_price" style="clear:left;float:left;" class="leftFl">
            <template>
                <el-input-number class="tihuo"  v-model="infoList.cost_price" :precision="2" controls-position="right" :min="0"></el-input-number>
            </template>
        </el-form-item>
        <el-form-item label="采购价" prop="purchase_price" class="rightFl">
            <template>
                <el-input-number class="tihuo" v-model="infoList.purchase_price" :precision="2" controls-position="right" :min="0"></el-input-number>
            </template>
        </el-form-item>
        <el-form-item label="品牌" prop="brand" style="clear:left;float:left;" class="leftFl">
            <el-input class="textarea tihuo "
            type="text"
            placeholder="请输入品牌"
            v-model="infoList.brand">
            </el-input>
        </el-form-item>
        <el-form-item label="型号" prop="model" class="rightFl">
            <el-input class="textarea tihuo"
            type="text"
            placeholder="请输入型号"
            v-model="infoList.model">
            </el-input>
        </el-form-item>
        <el-form-item label="存储条件" prop="storage_condition_text" style="clear:left;float:left;" class="leftFl">
            <el-select v-model="infoList.storage_condition_text"   placeholder="单位" class="tihuo">
                <el-option v-for="item in storeCondition" :key="item.value" :label="item.name" :value="item.value"></el-option>
            </el-select>
        </el-form-item>
        <el-form-item label="到货周期" prop="security_time" class="rightFl">
            <template>
                <el-input-number v-model="infoList.security_time" controls-position="right" :min="0"></el-input-number>
            </template>
            <span style="margin-left:4%">天</span>
        </el-form-item>
        <el-form-item label="保质期" prop="shelf_life_num" style="clear:left">
            <template>
                <el-input-number v-model="infoList.shelf_life_num" controls-position="right" :min="0"></el-input-number>
            </template>
            <el-select v-model="infoList.shelf_life_unit_text" placeholder="单位" class="danwei leftInval">
                <el-option v-for="item in lifeUnit" :key="item.value" :label="item.name" :value="item.value"></el-option>
            </el-select>
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
import { addData } from "../../common";
import { addStockSec } from "../../api";
export default {
  name: "add-material",
  data() {
    return {
      infoList: {
        name: "",
        num: "",
        cost_price: "",
        purchase_price: "",
        min_unit: "",
        min2mid_num: "",
        min_unit: "",
        mid2max_num: "",
        max_unit: "",
        out_unit: "",
        attribute: "",
        brand: "",
        storage_condition: "",
        shelf_life_num: "",
        shelf_life_unit: "",
        security_time: "",
        order_type: "",
        model: "",
        remark: "",
        type: "",
        catalog_id: ""
      },
      rules: {
        province: [
          { required: true, message: "请选择省份", trigger: "change" }
        ],
        city: [{ required: true, message: "请选择城市", trigger: "change" }],
        address: [{ required: true, message: "请输入地址", trigger: "blur" }]
      }
    };
  },
  computed: {
    ...mapState("dict", [
      "cityList",
      "provinceList",
      "secondTree",
      "storeCondition",
      "orderType",
      "purchase",
      "lifeUnit",
      "materialUnit"
    ]),
    ...mapState("stateChange", ["btnLoading"]),
    getProductUnit() {
      let ary = [];
      this.infoList.out_unit = "";
      for (let i = 0; i < this.materialUnit.length; i++) {
        if (this.materialUnit[i].value == this.infoList.min_unit) {
          ary.push({
            name: this.materialUnit[i].name,
            value: this.materialUnit[i].value
          });
        }
      }
      for (let i = 0; i < this.materialUnit.length; i++) {
        if (this.materialUnit[i].value == this.infoList.mid_unit) {
          ary.push({
            name: this.materialUnit[i].name,
            value: this.materialUnit[i].value
          });
        }
      }
      for (let i = 0; i < this.materialUnit.length; i++) {
        if (this.materialUnit[i].value == this.infoList.max_unit) {
          ary.push({
            name: this.materialUnit[i].name,
            value: this.materialUnit[i].value
          });
        }
      }
      this.uniqueArray(ary);
      return this.uniqueArray(ary);
    }
  },
  methods: {
    ...mapActions("dict", [
      "getCityList",
      "getProvinceList",
      "getSecondTree",
      "getStoreCondition",
      "getOrderType",
      "getPurchase",
      "getLifeUnit",
      "getMaterialUnit"
    ]),
    //数组json去重
    uniqueArray(paylist) {
     if(paylist[0]==undefined){
         paylist[0]=''
     }
      var payArr = [paylist[0]];
      for (var i = 1; i < paylist.length; i++) {
        var payItem = paylist[i];
        var repeat = false;
        for (var j = 0; j < payArr.length; j++) {
          if (payItem.value == payArr[j].value) {
            repeat = true;
            break;
          }
        }
        if (!repeat) {
          payArr.push(payItem);
        }
      }
      return payArr;
    },
    submitForm(formName) {
      let obj = {
        material_data: this.infoList,
        quantity: this.infoList.quantity,
        batch_num: this.infoList.batch_num
      };
      this.$refs[formName].validate(valid => {
        if (valid) {
          addData({
            requestUrl: addStockSec,
            paramsType: 1,
            preData: obj
          })
            .then(item => {
              if (item == 1) {
                this.$emit("reloadEvent", "reload");
                this.$message({
                  message: "新增成功！",
                  type: "success"
                });
              } else {
                this.$message.error("新增失败");
              }
            })
            .catch(error => {
              this.$message.error("新增失败");
            });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    }
  },
  created() {
    this.getCityList();
    this.getProvinceList();
    this.getSecondTree();
    this.getStoreCondition();
    this.getOrderType();
    this.getPurchase();
    this.getLifeUnit();
    this.getMaterialUnit();
  }
};
</script>

<style>
.leftItv {
  width: 80%;
}
.danwei {
  width: 100px;
}
.tihuo {
  width: 90%;
}
.leftInval {
  margin-left: 4%;
}
.leftFl {
  width: 40%;
  float: left;
}
.rightFl {
  width: 40%;
  float: right;
  margin-right: 15%;
}
.nub {
  width: 26.5%;
}
</style>
