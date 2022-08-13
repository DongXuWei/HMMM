<<<<<<< Updated upstream
=======
<template>
  <div class="container">
    <el-row>
      <el-col :span="24" class="col">
        <el-card class="box-card">
          <el-form
            class="form"
            :model="companyForm"
            :rules="companyFormRules"
            ref="companysForm"
            label-width="80px"
          >
            <!-- 标签名称 -->
            <el-form-item label="标签名称" prop="tags">
              <el-input
                v-model="companyForm.tags"
                type="text"
                style="width: 222px"
              ></el-input>
            </el-form-item>

            <!-- 城市 -->
            <el-form-item label="城市" prop="province">
              <!-- 省 -->
              <el-select
                filterable
                placeholder="请选择省份"
                style="margin-right: 20px"
                v-model="companyForm.province"
              >
                <el-option
                  v-for="(item, index1) in provincesList"
                  :key="index1"
                  :label="item"
                  :value="item"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="地区" prop="city">
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

            <!-- 企业简称 -->
            <el-form-item label="企业简称" prop="shortName">
              <el-input
                v-model="companyForm.shortName"
                type="text"
                style="width: 222px"
              ></el-input>
            </el-form-item>

            <!-- 状态 -->
            <el-form-item label="状态" prop="state">
              <el-select placeholder="状态" v-model="companyForm.state">
                <el-option
                  v-for="(item, index3) in statusList"
                  :key="index3"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>

            <!-- 按钮 -->
            <el-form-item class="searchBuutton">
              <el-button>清除</el-button>
              <el-button type="primary" @click="searchInfo">搜索</el-button>
            </el-form-item>
            <!-- 添加 -->
            <el-form-item>
              <el-button type="success" @click="addCompany" icon="el-icon-edit"
                >新增用户</el-button
              >
            </el-form-item>
          </el-form>

          <!-- 消息提示 -->
          <el-alert
            type="info"
            show-icon
            :closable="false"
            style="margin-bottom: 20px"
            >数据一共 <strong>{{ page.counts }}</strong> 条
          </el-alert>

          <!-- table表格 -->
          <el-table :data="dataList" style="width: 100%">
            <el-table-column
              prop="id"
              label="序号"
              align="center"
              width="100"
            ></el-table-column>
            <el-table-column
              prop="number"
              label="企业编号"
              width="210"
              align="center"
            >
            </el-table-column>
            <el-table-column
              prop="shortName"
              label="企业简称"
              align="center"
              width="150px"
            >
            </el-table-column>
            <el-table-column
              prop="tags"
              label="标签"
              align="center"
              width="80"
            ></el-table-column>
            <el-table-column
              prop="creatorID"
              label="创建者"
              align="center"
              width="80"
            ></el-table-column>
            <el-table-column :formatter="formatTime" prop="addDate" label="创建时间" align="center">
            </el-table-column>
            <el-table-column
              prop="remarks"
              label="备注"
              align="center"
            ></el-table-column>
            <el-table-column
              :formatter="formatState"
              prop="state"
              label="状态"
              width="80"
              align="center"
            >
            </el-table-column>
            <el-table-column label="操作" width="250" align="center">
              <template v-slot="{ row }">
                <!-- 编辑 -->
                <el-button
                  plain
                  type="primary"
                  icon="el-icon-edit"
                  circle
                  @click="edit(row.id)"
                ></el-button>
                <!-- 启用 -->
                <el-button
                  plain
                  type="success"
                  icon="el-icon-check"
                  circle
                  @click="isEnable(row.id)"
                ></el-button>
                <!-- 删除 -->
                <el-button
                  plain
                  type="danger"
                  icon="el-icon-delete"
                  circle
                  @click="del(row.id)"
                ></el-button>
              </template>
            </el-table-column>
          </el-table>

          <el-row>
            <el-col class="pagination">
              <!-- 分页组件 -->
              <!-- -->
              <PaginationPage
                :page="page"
                @changeSize="changeSize"
                @changeCurrent="changeCurrent"
              ></PaginationPage>
            </el-col>
          </el-row>
        </el-card>
      </el-col>
    </el-row>
    <!-- 新增、编辑用户的弹窗 -->
    <AddCompany
      ref="companyRef"
      @closeDialog="closeDialog"
      :dialogVisible="showDialog"
    />
  </div>
</template>

<script>
// 省市的JS文件
import { provinces, citys } from '@/api/hmmm/citys.js'
import { status } from '@/api/hmmm/constants.js'
import PaginationPage from '@/module-hmmm/components/pagination-page.vue'
import {
  getCompanyListAPI,
  getCompanyDetailAPI,
  updateCompanyState,
  delCompanyByIDAPI
} from '@/api/hmmm/companys.js'
import AddCompany from '@/module-hmmm/components/add-company.vue'
import { formatDate } from '@/utils/index.js'
import { Message } from 'element-ui'

export default {
  components: {
    PaginationPage,
    AddCompany
  },
  data () {
    return {
      // 表单数据
      // tags: '', // 标签
      // province: '', // 省份
      // city: '', // 地区
      // shortName: '', // 企业简称
      // state: '' // 状态 1启动 0禁用
      companyForm: {},
      dataList: [], // 列表数组
      page: {
        counts: 0,
        page: 1,
        pagesize: 10
      },
      showDialog: false,
      // 规则校验
      companyFormRules: {

      }
    }
  },
  created () {
    this.getCompanyListAPI()
  },
  methods: {
    // 获取表格数据
    async getCompanyListAPI () {
      try {
        const { data } = await getCompanyListAPI(this.page)
        this.page.counts = data.counts

        this.dataList = data.items
      } catch (error) {
        console.log(error)
      }

      // 枚举状态
      // status.forEach((item) => {
      //   this.dataList.forEach((obj) => {
      //     if (item.value === Number(obj.state)) {
      //       obj.state = item.label
      //     }
      //   })
      // })
    }, // 改变每页多少条的时候触发
    changeSize (val) {
      this.page.pagesize = val
      this.getCompanyListAPI(this.page)
    },
    // 改变页数的时候
    changeCurrent (val) {
      this.page.page = val
      this.getCompanyListAPI(this.page)
    },
    // 添加用户按钮
    addCompany () {
      this.showDialog = true
    },
    // 关闭
    closeDialog (val) {
      this.showDialog = val
      this.$refs.companyRef.companyForm = {
        id: '',
        shortName: '', // 企业简称
        company: '', // 所属公司
        province: '', // 省份
        city: '', // 区域
        tags: '', // 标签
        remarks: '',
        isFamous: false // 备注
      }
    },

    // 编辑
    async edit (id) {
      // console.log(id)
      const { data } = await getCompanyDetailAPI(id)
      console.log(data)
      this.$refs.companyRef.companyForm = data
      if (this.$refs.companyRef.companyForm.isFamous === 0) {
        this.$refs.companyRef.companyForm.isFamous = false
      } else {
        this.$refs.companyRef.companyForm.isFamous = true
      }
      this.showDialog = true
    },
    // 是否启用
    async isEnable (id) {
      try {
        // 应该是拿到id去修改用户信息
        const { data } = await getCompanyDetailAPI(id) // 先获取这个用户的信息
        // 三元判断
        data.state = data.state === 1 ? 0 : 1
        await updateCompanyState(data)
        Message.success('状态切换成功')
        this.getCompanyListAPI()
      } catch (error) {
        console.log(error)
      }
    },
    // 过滤
    formatState (row, column) {
      if (column.label === '状态') {
        return status.filter((item) => item.value === Number(row.state))[0].label
      }
    },
    // 过滤时间 的方法
    formatTime (row, column) {
      return formatDate(row.addDate, 'yyyy-MM-dd hh:mm:ss')
    },

    // 搜索
    async searchInfo () {
      try {
        const { data } = await getCompanyListAPI({
          ...this.companyForm,
          ...this.page
        })
        this.dataList = data.items
        this.companyForm = {}
        Message.success('检索企业信息成功')
      } catch (error) {
        console.log(error)
      }
    },
    // 删除
    async del (id) {
      try {
        // 弹窗 提示 是否删除
        await this.$confirm('是否删除该企业信息', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'error'
        })

        await delCompanyByIDAPI(id)
      } catch (error) {
        console.log(error)
      }
      Message.success('删除企业信息成功')
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
    // 状态
    statusList () {
      return status
    }
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
  .form {
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;
  }
  .pagination {
    display: flex;
    justify-content: flex-end;
  }
}
</style>
>>>>>>> Stashed changes
