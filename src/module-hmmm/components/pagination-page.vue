<template>
  <div class="pagination">
    <!-- 分页组件 -->
     <el-pagination
      background
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :hide-on-single-page="true"
      :current-page="currentPage4"
      :page-sizes="[10, 20, 30, 40]"
      :page-size="Number(page.pagesize)"
      layout="prev, pager, next,sizes,jumper"
      :total="page.counts">
    </el-pagination>
  </div>
</template>

<script>
export default {
  data () {
    return {
      currentPage4: 1
    }
  },
  props: ['page'],
  methods: {
    // 每页多少条改变的时候触发 val是最新值
    handleSizeChange (val) {
      // console.log(`每页 ${val} 条`)
      this.$emit('changeSize', val)
    },
    // 当前是多少页 val是最新值
    handleCurrentChange (val) {
      console.log(`当前页: ${val}`)
      this.$emit('changeCurrent', val)
      // console.log(this.page)
    }
  }
}
</script>

<style lang="scss">
.pagination{
    margin-top: 20px;
}
</style>
