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
        <el-form-item label="备注" prop="remark">
            <el-input class="textarea leftItv"
            type="text"
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
import { addRole } from "../../api";
import { mapState, mapActions } from "vuex";
export default {
  name: "add-role",
  data() {
    return {
      infoList: {
        name: "",
        remark: ""
      },
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
    ...mapState("dict", ["limitList"]),
    ...mapState('stateChange',['btnLoading'])
  },
  methods: {
    ...mapActions("dict", ["getLimitList"]),
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
    
    },
    async okEdit(){
        try {
            const response=await addRole({
                ...this.infoList,
                menu_ids:this.$refs.tree.getCheckedKeys()
            })
            if(response.code==1){
                this.$message({
                    message: '新增成功！',
                    type: 'success'
                });
                this.reload();
            }
        } catch (error) {
            console.log(error)
        }
    },
    reload(){
        this.$emit('reloadEvent','reload');
    }
  },
  created() {
    this.getLimitList();
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
