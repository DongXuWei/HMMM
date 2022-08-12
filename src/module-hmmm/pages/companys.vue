<template>
  <div class="container">
    <el-row>
      <el-col :span="24" class="col">
        <el-card class="box-card">
          <el-form ref="companysForm" label-width="80px">
            <el-form-item label="活动名称">
              <el-input type="text"></el-input>
            </el-form-item>

            <!-- 城市 -->
            <el-form-item label="城市" prop="province">
              <!-- 省 -->
              <el-select
                filterable
                placeholder="请选择省份"
                style="margin-right: 20px"
              >
                <el-option label="item" value="123"></el-option>
              </el-select>
              <!-- 市 -->
              <el-select filterable placeholder="请选择区域">
                <el-option label="123" value="123">123</el-option>
              </el-select>
            </el-form-item>

<!-- 企业简称 -->
             <el-form ref="companysForm" label-width="80px">
            <el-form-item label="活动名称">
              <el-input type="text"></el-input>
            </el-form-item>

<!-- 状态 -->
            <el-select filterable placeholder="状态">
                <el-option label="123" value="123">123</el-option>
              </el-select>

            <el-form-item>
               <el-button>取消</el-button>
              <el-button type="primary">立即创建</el-button>
            </el-form-item>
          </el-form>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
export default {
  data () {
    return {}
  }
}
</script>

<style scoped lang="scss">
.container {
  .col {
    height: 100%;
    padding: 10px;
    border-radius: 10px;
  }
  .box-card {
    width: 100%;
    height: 100%;
  }
}
</style>
