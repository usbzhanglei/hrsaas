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
          <el-button size="small" type="danger" @click="exportData">excel导出</el-button>
          <el-button :disabled="!checkPermission('POINT-USER-ADD')" size="small" type="primary" @click="showDialog = true">新增员工</el-button>
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
        <el-table-column label="头像" width="120px" align="center">
          <template v-slot="{ row }">
            <img
              v-imagerror="require('@/assets/common/bigUserHeader.png')"
              :src="row.staffPhoto"
              style="border-radius: 50%; width: 99px; height: 99px; padding: 11px;"
              @click="showQrCode(row.staffPhoto)"
            >
          </template>
        </el-table-column>
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
            <el-button type="text" size="small" @click="$router.push(`/employees/detail/${row.id}`)">查看</el-button>
            <el-button type="text" size="small">转正</el-button>
            <el-button type="text" size="small">调岗</el-button>
            <el-button type="text" size="small">离职</el-button>
            <el-button type="text" size="small" @click="editRole(row.id)">角色</el-button>
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
    <el-dialog title="二维码" :visible.sync="showCodeDiaLog">
      <el-row type="flex" justify="center">
        <canvas ref="myCanvas" />
      </el-row>
    </el-dialog>
    <!-- 放置分配组件 -->
    <assignRole ref="assignRole" :show-role-dialog.sync="showRoleDialog" :user-id="userId" />
  </div>
</template>

<script>
import { getEmployeeList, delEmployee } from '@/api/employees'
import EmployeesEnum from '@/api/constant/employees' // 引入员工的枚举对象
import AddEmployees from './components/add-employees'
import { formatDate } from '@/filters'
import QrCode from 'qrcode'
import assignRole from './components/assign-role.vue'
export default {
  name: 'Employees',
  components: {
    AddEmployees,
    assignRole
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
      showDialog: false,
      showCodeDiaLog: false, // 显示二维码弹层
      showRoleDialog: false, // 分配权限弹层
      userId: null
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
    },
    exportData() {
      const headers = {
        '姓名': 'username',
        '手机号': 'mobile',
        '入职日期': 'timeOfEntry',
        '聘用形式': 'formOfEmployment',
        '转正日期': 'correctionTime',
        '工号': 'workNumber',
        '部门': 'departmentName'
      }
      import('@/vendor/Export2Excel').then(async excel => {
        const { rows } = await getEmployeeList({ page: 1, size: this.page.total })
        const data = this.formatJson(headers, rows)
        const multiHeader = [['姓名', '主要信息', '', '', '', '', '部门']]
        const merges = ['A1:A2', 'B1:F1', 'G1:G2']
        excel.export_json_to_excel({
          header: Object.keys(headers),
          data,
          filename: '员工工资表',
          autoWidth: true,
          bookType: 'xlsx',
          multiHeader,
          merges
        })
      })
    },
    formatJson(headers, rows) {
      return rows.map(item => {
        return Object.keys(headers).map(key => {
          if (key === '入职日期' || key === '转正日期') {
            if (!item[headers[key]]) return
            return formatDate(item[headers[key]])
          } else if (key === '聘用形式') {
            const obj = EmployeesEnum.hireType.find(obj => obj.id === item[headers[key]])
            return obj ? obj.value : '未知'
          }
          return item[headers[key]]
        })
      })
      // return rows.map(item => Object.keys(headers).map(key => item[headers[key]])
    },
    showQrCode(url) {
      if (url) {
        // 数据更新了 但是我的弹层会立刻出现吗 ？页面的渲染是异步的！！！！
        this.showCodeDiaLog = true
        // 有一个方法可以在上一次数据更新完毕，页面渲染完毕之后
        this.$nextTick(() => {
          // 此时可以确认已经有ref对象了
          QrCode.toCanvas(this.$refs.myCanvas, url)
          // 将地址转化成二维码
          // 如果转化的二维码后面信息 是一个地址的话 就会跳转到该地址 如果不是地址就会显示内容
        })
      } else {
        this.$message.warning('该用户还未上传头像')
      }
    },
    async editRole(id) {
      // 弹层
      this.userId = id
      await this.$refs.assignRole.getUserDetailById(id)
      this.showRoleDialog = true
    }
  }
}
</script>

<style>

</style>
