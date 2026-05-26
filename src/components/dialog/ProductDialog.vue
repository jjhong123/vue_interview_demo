<template>
  <v-dialog :model-value="modelValue" @update:model-value="$emit('update:modelValue', $event)" max-width="640px" persistent>
    <v-card>
      <v-card-title class="text-h6 pa-4 bg-grey-lighten-4">
        {{ isEditMode ? '編輯商品' : '新增商品' }}
      </v-card-title>
      
      <v-card-text class="pa-4 pt-6">
        <v-form ref="formRef">
          <v-row>
            <v-col cols="12" sm="6">
              <v-text-field v-model="localItem.name" label="項目名稱" variant="outlined" density="compact"></v-text-field>
            </v-col>
            <v-col cols="12" sm="6">
              <v-select v-model="localItem.category" :items="categories" label="分類" variant="outlined" density="compact"></v-select>
            </v-col>
            <v-col cols="12" sm="6">
              <v-text-field v-model.number="localItem.calories" label="熱量 (kcal)" type="number" variant="outlined" density="compact"></v-text-field>
            </v-col>
            <v-col cols="12" sm="6">
              <v-text-field v-model.number="localItem.price" label="售價 (TWD)" type="number" variant="outlined" density="compact"></v-text-field>
            </v-col>
            <v-col cols="12" sm="6">
              <v-text-field v-model.number="localItem.stock" label="庫存數量" type="number" variant="outlined" density="compact"></v-text-field>
            </v-col>
            <v-col cols="12" sm="6">
              <v-text-field v-model="localItem.createdAt" label="建立日期" type="date" variant="outlined" density="compact"></v-text-field>
            </v-col>
          </v-row>
        </v-form>
      </v-card-text>
      
      <v-divider></v-divider>
      <v-card-actions class="pa-4">
        <v-btn color="grey-darken-1" variant="text" @click="handleClose">取消</v-btn>
        <v-btn color="primary" variant="elevated" class="px-6" @click="handleSave">儲存</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup>
import { ref, watch } from 'vue'

const props = defineProps({
  modelValue: Boolean,    
  itemData: Object,     
  isEditMode: Boolean,   
  categories: Array     
})

const emit = defineEmits(['update:modelValue', 'save'])

const formRef = ref(null)

const localItem = ref({ ...props.itemData })

watch(() => props.itemData, (newVal) => {
  localItem.value = { ...newVal }
}, { deep: true })

const handleClose = () => {
  emit('update:modelValue', false)
}

const handleSave = () => {
  emit('save', localItem.value)
}
</script>