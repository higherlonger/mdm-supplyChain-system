<template>
<div style="width:100%">
    <el-form :model="infoList" ref="infoList" size="small" label-width="100px" :rules="rules">  
        <el-form-item label="名称" prop="name">
            <el-input class="textarea leftItv"
            type="text"
            placeholder="请输入名称"
            v-model="infoList.name">
            </el-input>
        </el-form-item> 
        <el-form-item label="状态" prop="state">
            <el-select v-model="infoList.state" placeholder="请选状态" class="leftItv">
                <el-option v-for="item in store_state" :key="item.value" :label="item.name" :value="item.value"></el-option>
            </el-select>
        </el-form-item> 
        <el-form-item label="备注" prop="remark">
            <el-input class="textarea leftItv"
            type="textarea"
            placeholder="请输入备注"
            v-model="infoList.remark">
            </el-input>
        </el-form-item> 
        <el-form-item label="权限" prop="menu_ids">
            <el-tree
            :data="limitList"
            show-checkbox
            default-expand-all
            node-key="id"
            ref="tree"
            highlight-current
            :props="defaultProps">
            </el-tree>
        </el-form-item> 
        <el-form-item style="margin-left:15px;">
            <el-button type="primary" @click="submitForm('infoList')" :loading="btnLoading">提交</el-button>
            <el-button @click="resetForm('infoList')">重置</el-button>
        </el-form-item>
    </el-form>
</div>
</template>

<script>
import { getDetailById, editRole } from "../../api";
import { mapState, mapActions } from "vuex";
export default {
  name: "edit-role",
  props: ["recordId"],
  data() {
    return {
      infoList: {},
      rules: {
        name: [{ required: true, message: "请输入名称", trigger: "blur" }]
      },
      defaultProps: {
        children: "children",
        label: "title"
      }
    };
  },
  computed: {
    ...mapState("dict", ["store_state", "limitList"]),
    ...mapState('stateChange',['btnLoading'])
  },
  methods: {
    ...mapActions("dict", ["getStoreState", "getLimitList"]),
    async getList() {
      try {
        const response = await getDetailById({ id: this.recordId });
        if (response.code == 1) {
          this.infoList = response.data;
          this.setCheckedKeys(response.data.menu_ids);
        }
      } catch (error) {
        console.log(error);
      }
    },
    setCheckedKeys(val) {
      this.$refs.tree.setCheckedKeys(val);
    },
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.okEdit();
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
      for(let attr in this.infoList){
        this.infoList[attr]='';
      }
    },
    async okEdit() {
      try {
        let treeAry=this.$refs.tree.getCheckedKeys();
        if(treeAry.length==0){
          treeAry=[]
        }
        const response = await editRole({
          name: this.infoList.name,
          remark: this.infoList.remark,
          state: this.infoList.state,
          menu_ids: treeAry,
          id: this.recordId
        });
        if(response.code==1){
            this.$message({
                message: '修改成功！',
                type: 'success'
            });
            this.reloadData();
        }else if(response.code==0){
          this.$message.error('修改失败！');
        }
      } catch (error) {
        console.log(error);
      }
    },
    reloadData(){
        this.$emit('reloadEvent','reload');
    }
  },
  created() {
    this.getStoreState();
    this.getLimitList();
    this.getList();
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
