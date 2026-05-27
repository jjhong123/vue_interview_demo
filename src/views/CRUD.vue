<template>
  <v-container fluid class="pa-6">
    <v-row col="12">
      <v-text-field v-model="apiKey" prepend-inner-icon="mdi-magnify" label="請填入API KEY" single-line hide-details
        variant="outlined" density="compact" clearable></v-text-field>
    </v-row>
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
              @click="generateAIReport(localProducts)">
              生成分析
            </v-btn>
          </v-card-title>

          <v-card-text class="bg-grey-lighten-4 rounded pa-3 flex-grow-1 overflow-y-auto" style="max-height: 220px;">
            <div v-if="aiReport" class="text-body-2 text-grey-darken-3 style-report">
              {{ aiReport }}
            </div>
            <div v-else class="d-flex align-center justify-center h-100 text-grey-darken-1 text-body-2">
              點擊右上角按鈕，讓 AI 幫你分析目前的庫存與定價策略
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
      <v-data-table items-per-page="10" v-model:page="page" :headers="headers" :items="localProducts" :search="search"
        :loading="tableLoading">
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
            <v-pagination v-model="page" :length="Math.ceil(localProducts.length / 10)" total-visible="5"
              density="comfortable" active-color="primary" variant="text"></v-pagination>
          </div>
        </template>
      </v-data-table>
    </v-card>

    <ProductDialog v-model="dialog" :item-data="editedItem" :is-edit-mode="isEditMode" :categories="categories"
      @save="handleSaveProduct" />
  </v-container>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import { Doughnut } from 'vue-chartjs'
import { Chart as ChartJS, Title, Tooltip, Legend, ArcElement } from 'chart.js'
import ProductDialog from '@/components/dialog/ProductDialog.vue'
import { useProductAI } from '@/composables/useProductAI'

ChartJS.register(Title, Tooltip, Legend, ArcElement)

const { setKey, checkKey, aiReport, aiLoading, generateAIReport, clearReport } = useProductAI()
const apiKey = ref('')

const defaultProducts = [
  { id: 1, name: '法式千層蛋糕', category: '蛋糕甜點', calories: 320, price: 150, stock: 12, createdAt: '2026-05-20' },
  { id: 2, name: '美式經典黑咖啡', category: '冰品飲料', calories: 5, price: 80, stock: 50, createdAt: '2026-05-21' },
  { id: 3, name: '宇治抹茶紅豆冰', category: '冰品飲料', calories: 280, price: 120, stock: 8, createdAt: '2026-05-22' },
  { id: 4, name: '巧克力燕麥餅乾', category: '餅乾點心', calories: 150, price: 65, stock: 30, createdAt: '2026-05-23' },
  { id: 5, name: '草莓戚風蛋糕', category: '蛋糕甜點', calories: 250, price: 130, stock: 18, createdAt: '2026-05-24' }
]

const localProducts = ref([])
const page = ref(1)
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

const fetchProductsLocal = () => {
  tableLoading.value = true
  setTimeout(() => {
    if (localProducts.value.length === 0) {
      localProducts.value = defaultProducts
    }
    tableLoading.value = false
  }, 500)
}

onMounted(() => {
  fetchProductsLocal()
})

watch(search, () => {
  page.value = 1
})

// Chart.js
const chartData = computed(() => {
  const counts = categories.map(categories_item => {
    return localProducts.value.filter(item => item.category === categories_item).length
  })
  return {
    labels: categories,
    datasets: [{ backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56'], data: counts }]
  }
})
const chartOptions = { responsive: true, maintainAspectRatio: false }

const editedItem = ref({})
const isEditMode = computed(() => editedIndex.value > -1)

const openCreateDialog = () => {
  editedIndex.value = -1
  editedItem.value = {
    id: null, name: '', category: '蛋糕甜點', calories: 0, price: 0, stock: 0, createdAt: new Date().toISOString().split('T')[0]
  }
  dialog.value = true
}

// 編輯商品
const openEditDialog = (item) => {
  editedIndex.value = localProducts.value.findIndex(p => p.id === item.id)
  editedItem.value = { ...item }
  dialog.value = true
}

// 儲存商品（新增/更新）
const handleSaveProduct = (updatedItem) => {
  if (isEditMode.value) {
    localProducts.value[editedIndex.value] = { ...updatedItem }
  } else {
    const newId = localProducts.value.length > 0 ? Math.max(...localProducts.value.map(p => p.id)) + 1 : 1
    localProducts.value.push({
      ...updatedItem,
      id: newId
    })
  }
  dialog.value = false
}

const deleteItem = (item) => {
  if (confirm(`確定要刪除 ${item.name} 嗎？`)) {
    localProducts.value = localProducts.value.filter(p => p.id !== item.id)
  }
}

const handleResetDatabase = () => {
  if (confirm('確定要資料全部重置回原廠初始狀態?')) {
    localProducts.value = defaultProducts
    page.value = 1
  }
}

computed(() => {
  if (checkKey()) {
    generateAIReport(localProducts.value)
  } else {
    clearReport()
  }
})
watch(apiKey, () => { setKey(apiKey.value) })
watch(localProducts, () => { clearReport() }, { deep: true })
</script>

<style scoped>
.style-report {
  line-height: 1.6;
}
</style>