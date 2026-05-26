<template>
  <v-container fluid class="pa-6">

    <v-row class="mb-6">
      <v-col cols="12" md="4">
        <v-card variant="outlined" class="pa-4 h-100">
          <v-card-title class="text-subtitle-1 font-weight-bold px-0 pt-0">商品分類比例</v-card-title>
          <div style="height: 220px; position: relative;">
            <Doughnut :data="chartData" :options="chartOptions" />
          </div>
        </v-card>
      </v-col>

      <v-col cols="12" md="8">
        <v-card variant="outlined" class="pa-4 h-100 d-flex flex-column">
          <v-card-title class="text-subtitle-1 font-weight-bold px-0 pt-0 d-flex align-center">
            <v-icon color="purple" class="me-2">mdi-robot-outline</v-icon>
            Gemini AI 營運洞察
            <v-spacer></v-spacer>
            <v-btn color="purple" variant="tonal" size="small" prepend-icon="mdi-refresh" :loading="aiLoading"
              @click="generateAIReport(desserts)">
              生成分析
            </v-btn>
          </v-card-title>

          <v-card-text class="bg-grey-lighten-4 rounded pa-3 flex-grow-1 overflow-y-auto" style="max-height: 220px;">
            <div v-if="aiReport" class="text-body-2 text-grey-darken-3 style-report">
              {{ aiReport }}
            </div>
            <div v-else class="d-flex align-center justify-center h-100 text-grey-darken-1 text-body-2">
              點擊右上角按鈕，讓 AI 幫你分析目前的庫存與定價策略！
            </div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <v-row class="mb-4" align="center">
      <v-col cols="12" sm="4">
        <v-text-field v-model="search" prepend-inner-icon="mdi-magnify" label="搜尋商品..." single-line hide-details
          variant="outlined" density="compact" clearable></v-text-field>
      </v-col>
      <v-spacer></v-spacer>
      <v-col cols="auto">
        <v-btn color="grey-darken-1" variant="outlined" prepend-icon="mdi-database-refresh" class="me-2"
          @click="handleResetDatabase">
          重置資料
        </v-btn>
        <v-btn color="primary" prepend-icon="mdi-plus" @click="openCreateDialog">
          新增商品
        </v-btn>
      </v-col>
    </v-row>

    <v-card variant="outlined">
      <v-data-table-server v-model:items-per-page="itemsPerPage" v-model:page="page" :headers="headers"
        :items="desserts" :items-length="totalItems" :loading="tableLoading" @update:options="fetchProducts" >
        <template #item.price="{ item }">
          ${{ item.price }}
        </template>

        <template #item.stock="{ item }">
          <v-chip :color="item.stock < 15 ? 'error' : 'success'" size="small" variant="tonal">
            {{ item.stock }}
          </v-chip>
        </template>

        <template #item.actions="{ item }">
          <v-btn color="primary" icon="mdi-pencil-outline" size="small" variant="tonal" class="me-2"
            @click="openEditDialog(item)">
            <v-icon size="small"></v-icon>
            <v-tooltip activator="parent" location="top">編輯商品</v-tooltip>
          </v-btn>

          <v-btn color="error" icon="mdi-delete-outline" size="small" variant="tonal" @click="deleteItem(item)">
            <v-icon size="small"></v-icon>
            <v-tooltip activator="parent" location="top">刪除商品</v-tooltip>
          </v-btn>
        </template>

        <template #bottom>
          <div class="d-flex align-center justify-center pa-2 bg-white">
            <v-pagination v-model="page" :length="Math.ceil(totalItems / itemsPerPage)" total-visible="5"
              density="comfortable" active-color="primary" variant="text"></v-pagination>
          </div>
        </template>
      </v-data-table-server>
    </v-card>

    <!-- Product Dialog -->
    <ProductDialog v-model="dialog" :item-data="editedItem" :is-edit-mode="isEditMode" :categories="categories"
      @save="handleSaveProduct" />
  </v-container>
</template>

<script setup>
import { ref, computed, reactive, watch } from 'vue'
import { Doughnut } from 'vue-chartjs'
import { Chart as ChartJS, Title, Tooltip, Legend, ArcElement } from 'chart.js'
import ProductDialog from '@/components/dialog/ProductDialog.vue'
import { useProductAI } from '@/composables/useProductAI'
import api from '@/services/productService'

ChartJS.register(Title, Tooltip, Legend, ArcElement)

const { aiReport, aiLoading, generateAIReport, clearReport } = useProductAI()

const desserts = ref([])
const totalItems = ref(0)
const page = ref(1)
const itemsPerPage = ref(10)
const tableLoading = ref(false)
const search = ref('')

const categories = ['蛋糕甜點', '冰品飲料', '餅乾點心']
const editedIndex = ref(-1)
const dialog = ref(false)

const headers = [
  { title: '項目名稱', key: 'name' },
  { title: '分類', key: 'category' },
  { title: '熱量 (kcal)', key: 'calories' },
  { title: '售價', key: 'price' },
  { title: '庫存', key: 'stock' },
  { title: '建立日期', key: 'createdAt' },
  { title: '操作', key: 'actions', sortable: false, align: 'end', width: '120' },
]

const fetchProducts = async () => {
  tableLoading.value = true
  try {
    const res = await api.get('/products', {
      params: {
        page: page.value,
        itemsPerPage: itemsPerPage.value,
        search: search.value
      }
    })
    desserts.value = res.items
    totalItems.value = res.total

    if (res.categoryCounts) {
      Object.assign(globalCategoryCounts, res.categoryCounts)
    }
  } catch (error) {
    console.error('無法取得商品資料:', error)
  } finally {
    tableLoading.value = false
  }
}

watch(search, () => {
  page.value = 1
  fetchProducts()
})

// Chart.js
const globalCategoryCounts = reactive({ '蛋糕甜點': 0, '冰品飲料': 0, '餅乾點心': 0 })
const chartData = computed(() => {
  
  const counts = categories.map(cat => globalCategoryCounts[cat] || 0)
  console.log(globalCategoryCounts)
  return {
    labels: categories,
    datasets: [{ backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56'], data: counts }]
  }
})
const chartOptions = { responsive: true, maintainAspectRatio: false }

const editedItem = ref({})
const isEditMode = computed(() => editedIndex.value > -1) // Edit mode or Create mode 

const openCreateDialog = () => {
  editedIndex.value = -1
  editedItem.value = {
    id: null, name: '', category: '蛋糕甜點', calories: 0, price: 0, stock: 0, createdAt: new Date().toISOString().split('T')[0]
  }
  dialog.value = true
}

const openEditDialog = (item) => {
  editedIndex.value = desserts.value.findIndex(p => p.id === item.id)
  editedItem.value = { ...item }
  dialog.value = true
}

// 儲存 Post/Put
const handleSaveProduct = async (updatedItem) => {
  try {
    if (isEditMode.value) {
      await api.put(`/products/${updatedItem.id}`, updatedItem)
    } else {
      await api.post('/products', updatedItem)
    }
    dialog.value = false
    fetchProducts()
  } catch (error) {
    console.error('儲存產品失敗:', error)
  }
}

// 刪除
const deleteItem = async (item) => {
  if (confirm(`確定要刪除 ${item.name} 嗎？`)) {
    try {
      await api.delete(`/products/${item.id}`)
      fetchProducts()
    } catch (error) {
      console.error('刪除產品失敗:', error)
    }
  }
}

// 重置資料庫
const handleResetDatabase = async () => {
  if (confirm('確定要將後端資料庫全部重置回原廠初始狀態嗎？')) {
    try {
      await api.post('/products/reset')
      page.value = 1 // 回到第一頁
      fetchProducts()
    } catch (error) {
      console.error('重置資料庫失敗:', error)
    }
  }
}

// 當表格資料刷新時，自動重設 AI 報告
watch(desserts, () => { clearReport() }, { deep: true })
</script>

<style scoped>
.style-report {
  white-space: pre-line;
  line-height: 1.6;
}
</style>