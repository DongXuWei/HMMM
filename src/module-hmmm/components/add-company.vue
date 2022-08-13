<template>
  <!-- 添加企业编辑企业的弹层 -->
  <el-dialog
    width="50%"
    class="dialog"
    :title="title"
    :visible="dialogVisible"
    @close="closeDialog"
  >
    <el-form :model="companyForm" :rules="companyRules">
      <!-- 企业名称 -->
      <el-form-item label="企业名称" prop="shortName">
        <el-input
          type="text"
          v-model="companyForm.shortName"
          style="width: 222px"
        ></el-input>
      </el-form-item>
      <!-- 所属公司 -->
      <el-form-item label="所属公司" prop="company">
        <el-input
          type="text"
          v-model="companyForm.company"
          style="width: 222px"
        ></el-input>
      </el-form-item>
      <el-form-item>
        <span>江苏南京雨花台经济开发区传智教育有限公司</span>
      </el-form-item>

      <!-- 城市 -->
      <el-form-item label="城市" prop="province">
        <!-- 省 -->
        <!-- @change="provinceChange" -->
        <el-select
          filterable
          placeholder="请选择省份"
          style="margin-right: 20px"
          v-model="companyForm.province"
        >
          <!-- 循环遍历省 -->
          <el-option
            v-for="(item, index1) in provincesList"
            :key="index1"
            :value="item"
            :label="item"
          ></el-option>
        </el-select>
        <!-- 市 -->
        <el-select
          filterable
          placeholder="请选择区域"
          v-model="companyForm.city"
        >
          <el-option
            v-for="(item, index2) in citysList"
            :key="index2"
            :label="item"
            :value="item"
          ></el-option>
        </el-select>
      </el-form-item>
      <!-- 方向 -->
      <el-form-item label="方向(企业标签)" prop="tags">
        <el-input
          type="text"
          v-model="companyForm.tags"
          style="width: 222px"
        ></el-input>
      </el-form-item>
      <!-- 备注 -->
      <el-form-item label="备注" prop="remarks">
        <el-input
          type="textarea"
          v-model="companyForm.remarks"
          style="width: 222px"
        ></el-input>
      </el-form-item>
      <!-- 脚体 -->
    </el-form>
    <span slot="footer">
      <el-button @click="closeDialog">取消</el-button>
      <el-button type="primary" @click="submit">确定</el-button>
    </span>
  </el-dialog>
</template>

<script>
// 省市的JS文件
import { provinces, citys } from '@/api/hmmm/citys.js'
import { addCompanyAPI, updateCompanyDetailAPI } from '@/api/hmmm/companys'
import { Message } from 'element-ui'
export default {
  name: 'addDialog',
  props: {
    dialogVisible: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    // 省
    provincesList () {
      return provinces()
    },
    // 市
    citysList () {
      return citys(this.companyForm.province)
    },
    // 标题
    title () {
      return this.companyForm.id ? '编辑企业' : '添加企业'
    }
  },
  data () {
    return {
      companyForm: {
        id: '',
        shortName: '', // 企业简称
        company: '', // 所属公司
        province: '', // 省份
        city: '', // 区域
        tags: '', // 标签
        remarks: '',
        isFamous: false // 备注
      },

      // 规则
      companyRules: {
        tags: [
          { required: true, message: '企业标签为必填项', trigger: 'blur' }
        ],
        shortName: [
          { required: true, message: '企业名称为必填项', trigger: 'blur' }
        ],
        company: [
          { required: true, message: '所属公司为必填项', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    // 关闭
    closeDialog () {
      this.$emit('closeDialog', false)
    },
    // 添加企业
    async addCompany () {
      await addCompanyAPI(this.companyForm)
    },
    // 修改企业信息
    async updateCompanyDetail () {
      await updateCompanyDetailAPI(this.companyForm)
      await this.$parent.getCompanyListAPI()
    },
    // 点击确定
    async submit () {
      if (this.companyForm.id) {
        // 修改操作
        // console.log(this.companyForm)
        this.updateCompanyDetail()
        Message.success('修改企业信息成功')
      } else {
        // 添加操作
        await this.addCompany()
        Message.success('添加企业信息成功')
      }
      // 调用父函数的重新获取数据
      await this.$parent.getCompanyListAPI()
      await this.$emit('closeDialog', false)
    }
  }
}
</script>

<style lang="scss"></style>
