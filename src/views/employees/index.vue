<template>
  <div class="dashboard-container">
    <div class="app-container">
      <page-tools :show-before="true">
        <!-- 左侧显示总记录数 -->
        <!-- <span slot="before">共16条记录</span> -->
        <template #before>
          <span>共{{ page.total }}条记录</span>
        </template>
        <!-- 右侧显示按钮 excel导入 excel导出 新增员工 -->
        <template #after>
          <el-button size="small" type="success" @click="$router.push('/import')">excel导入</el-button>
          <el-button size="small" type="danger">excel导出</el-button>
          <el-button size="small" type="primary" @click="showDialog = true">新增员工</el-button>
        </template>
      </page-tools>
      <!-- 表格 -->
      <el-table
        v-loading="loading"
        border
        :data="list
        "
      >
        <el-table-column type="index" label="序号" sortable="" />
        <el-table-column prop="username" label="姓名" sortable="" />
        <el-table-column prop="workNumber" label="工号" sortable="" />
        <el-table-column :formatter="formatEmployment" prop="formOfEmployment" label="聘用形式" sortable="" />
        <el-table-column prop="departmentName" label="部门" sortable="" />
        <!-- 作用域插槽+过滤器 -->
        <el-table-column label="入职时间" sortable="">
          <template slot-scope="{ row }">
            <!-- 将时间格式化 -->
            {{ row.timeOfEntry | formatDate }}
          </template>
        </el-table-column>
        <el-table-column prop="enableState" label="账户状态" sortable="">
          <template slot-scope="{ row }">
            <el-switch :value="row.enableState === 1" />
          </template>
        </el-table-column>
        <el-table-column label="操作" sortable="" fixed="right" width="280">
          <template slot-scope="{ row }">
            <el-button type="text" size="small">查看</el-button>
            <el-button type="text" size="small">转正</el-button>
            <el-button type="text" size="small">调岗</el-button>
            <el-button type="text" size="small">离职</el-button>
            <el-button type="text" size="small">角色</el-button>
            <el-button type="text" size="small" @click="deleteEmployee(row.id)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页 -->
      <el-row type="flex" justify="center" align="middle" style="height: 60px;">
        <el-pagination
          :current-page="page.page"
          :page-size="page.size"
          :total="page.total"
          layout="prev,pager,next"
          @current-change="changePage"
        />
      </el-row>
    </div>
    <add-employees :show-dialog.sync="showDialog" />
  </div>
</template>

<script>
import { getEmployeeList, delEmployee } from '@/api/employees'
import EmployeesEnum from '@/api/constant/employees' // 引入员工的枚举对象
import AddEmployees from './components/add-employees'
export default {
  components: {
    AddEmployees
  },
  data() {
    return {
      list: [],
      page: {
        page: 1,
        size: 10,
        total: 0 // 分页的总数
      },
      loading: false, // 显示遮罩层
      showDialog: false
    }
  },
  created() {
    this.getEmployeeList()
  },
  methods: {
    async getEmployeeList() {
      this.loading = true
      const { total, rows } = await getEmployeeList(this.page)
      this.page.total = total
      this.list = rows
      this.loading = false
    },
    // newPage 是最新的页码
    changePage(newPage) {
      this.page.page = newPage
      this.getEmployeeList()
    },
    // 格式化聘用形式
    formatEmployment(row, column, cellValue, index) {
      const obj = EmployeesEnum.hireType.find(item => item.id === +cellValue)
      return obj ? obj.value : '未知'
    },
    async deleteEmployee(id) {
      try {
        await this.$confirm('确认删除')
        await delEmployee(id)
        this.$message.success('删除员工成功')
        this.getEmployeeList()
      } catch (error) {
        console.log(error)
      }
    }
  }
}
</script>

<style>

</style>
