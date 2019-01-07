 <template>
<div style="width:100%">
    <el-form :model="info" ref="info" label-width="100px" size="small">
        <el-form-item label="编号" prop="num">
            <span class="form-record-show">{{ info.num }}</span>
        </el-form-item>
        <el-form-item label="名称" prop="name">
            <span class="form-record-show">{{ info.name }}</span>
        </el-form-item>
        <el-form-item label="省份" prop="province">
            <span class="form-record-show">{{ info.province }}</span>
        </el-form-item>
        <el-form-item label="城市" prop="city">
            <span class="form-record-show">{{ info.city }}</span>
        </el-form-item>
        <el-form-item label="地址" prop="address">
            <span class="form-record-show">{{ info.address }}</span>
        </el-form-item>
        <el-form-item label="状态" prop="state_text">
            <span class="form-record-show">{{ info.state_text }}</span>
        </el-form-item>
        <el-form-item label="提供原料" prop=" material_items">
            <span class="form-record-show">{{ info.material_items }}</span>
        </el-form-item>
        <el-form-item label="更新时间" prop=" updatedate">
            <span class="form-record-show">{{ info.updatedate }}</span>
        </el-form-item>

    </el-form>
</div>
</template>

<script>
import {getSuppById} from "../../api";
import { getDetailById } from "../../common";
export default {
  name: "show-supplier",
  props: ["info"],
  data() {
    return {
    };
  },
  created() {
  }
};
</script>

<style>
.form-record-show {
  width: 78%;
}
</style>
