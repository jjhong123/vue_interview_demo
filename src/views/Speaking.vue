<template>
  <div class="speaking-page pa-6">
    <div class="d-flex align-center">
      <v-btn v-if="!isRecording" color="primary" variant="tonal" @click="startRecording">
        開始錄製 (MP3)
      </v-btn>

      <v-btn v-if="isRecording" color="error" variant="tonal" @click="stopRecording">
        停止錄製
      </v-btn>
      <span v-if="isRecording" class="mx-4"> 錄製中... {{ timeText }} </span>
    </div>

    <div v-for="(item, index) in recordList" :key="item.id" class="audio-wrapper mt-4">
      <div class="text-caption mb-2 d-flex align-center">
        錄音檔 #{{ index + 1 }} |
        <v-chip color="warning" size="small" class="font-weight-bold ml-2"> {{ item.now }} </v-chip>
      </div>
      <div class="d-flex justify-space-between align-center">
        <div class="vue-plyr-wrapper">
          <vue-plyr :options="plyrOptions">
            <audio controls playsinline>
              <source :src="item.url" type="audio/mp3" />
            </audio>
          </vue-plyr>
        </div>
        <v-btn class="ml-2" color="info" variant="tonal" @click="downloadMP3(index)">
          下載MP3
        </v-btn>
        <v-btn class="ml-2" color="info" variant="tonal" @click="uploadRecord(index)">
          上傳檔案(測試)
        </v-btn>
        <v-btn class="ml-2" color="error" variant="tonal" @click="deleteRecord(index)">
          刪除
        </v-btn>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, ref, onBeforeUnmount, onMounted } from 'vue'
import VuePlyr from 'vue-plyr'
import 'vue-plyr/dist/vue-plyr.css'
import Recorder from 'recorder-core'
import 'recorder-core/src/engine/mp3'
import 'recorder-core/src/engine/mp3-engine'
import { useExamStore } from '@/stores/exam'
Recorder.CLog = () => {}

const examStore = useExamStore()
const recordList = ref([])
const isRecording = ref(false)
const recordingTime = ref(0)
const timer = ref(null)
const recorder = ref(null)
const plyrOptions = {
  controls: ['play-large', 'play', 'progress', 'current-time', 'mute', 'volume'],
}

const timeText = computed(() => {
  const minutes = Math.floor(recordingTime.value / 60)
  const seconds = recordingTime.value % 60
  return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`
})

onMounted(async () => {
  const response = await examStore.getStudentInfo(123, { name: 'JEFF', age: 25 })
})

function startRecording() {
  const newRecorder = Recorder({
    type: 'mp3',
    bitRate: 128,
    sampleRate: 44100,
  })

  // 向使用者請求錄音權限
  newRecorder.open(
    () => {
      recorder.value = newRecorder
      newRecorder.start()

      isRecording.value = true
      recordingTime.value = 0

      timer.value = setInterval(() => {
        recordingTime.value++
      }, 1000)

      console.log('錄音中 ...')
    },
    (msg, isUserNotAllow) => {
      console.error((isUserNotAllow ? '使用者拒絕了權限：' : '開啟錄音失敗：') + msg)
    },
  )
}

// 停止錄音
function stopRecording() {
  if (!recorder.value) return
  recorder.value.stop(
    (blob, duration) => {
      isRecording.value = false
      clearInterval(timer.value)

      const newUrl = URL.createObjectURL(blob) // creat blob url

      recordList.value.push({
        id: Date.now(),
        url: newUrl,
        blob: blob,
        duration: (duration / 1000).toFixed(2),
        now: new Date().toLocaleString(),
      })

      console.log(`錄音完成`)
      recorder.value.close()
      recorder.value = null
    },
    (msg) => {
      console.error(`錄音失敗: ${msg}`)
      recorder.value.close()
      recorder.value = null
    },
  )
}

function deleteRecord(index) {
  const record = recordList.value[index]
  URL.revokeObjectURL(record.url)
  recordList.value.splice(index, 1)
}

function downloadMP3(index) {
  const record = recordList.value[index]
  const link = document.createElement('a') // create a html tag .
  link.href = record.url
  link.download = `download_${record.id}.mp3`
  link.click()
}

async function uploadRecord(index) {
  const record = recordList.value[index]
  const response = await examStore.uploadRecord(record.blob)
  alert(`上傳完成`)
}

onBeforeUnmount(() => {
  if (timer.value) clearInterval(timer.value)
  if (recorder.value) recorder.value.close()
  recordList.value.forEach((record) => URL.revokeObjectURL(record.url))
})
</script>

<style lang="scss" scoped>
.speaking-page {
  .audio-wrapper {
    margin-top: 20px;
    width: 600px;
    .vue-plyr-wrapper {
      width: 100%;
    }
  }
}
</style>
