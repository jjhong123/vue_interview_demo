<template>
  <v-container class="pa-0 taiwan-view fill-height" fluid>
    <v-row>
      <v-col cols="12" class="header">
        <div class="header-title px-5 py-2 font-weight-bold">2024 開票地圖</div>
      </v-col>
    </v-row>
    <v-row class="px-5 mt-2">
      <v-col cols="12" md="3">
        <div class="area-title">
          <div>地區篩選</div>
        </div>
      </v-col>
    </v-row>

    <v-row class="px-5 mt-2">
      <v-col cols="12" md="3">
        <v-select v-model="selectedCity" :items="cityOptions" label="請選擇縣市" variant="outlined" density="compact"
          hide-details @update:model-value="handleCityChange">
        </v-select>
      </v-col>
      <v-col cols="12" md="3">
        <v-select v-model="selectedDistrict" :items="districtOptions" label="請選擇區域" variant="outlined" density="compact"
          hide-details :disabled="!selectedCity" ></v-select>
      </v-col>
    </v-row>
    <v-row class="px-2 px-md-5">
      <v-col :md="12" :lg="12" :xl="10" class="d-flex justify-space-between main-content-wrapper">
        <div class="voting-overview">
          <div class="overview-title font-weight-bold mb-2">投票概況</div>
          <div class="d-flex justify-space-between flex-lg-wrap flex-md-nowrap align-center">
            <div class="chart-wrapper d-flex align-center">
              <canvas ref="totalChartCanvas"></canvas>
              <div class="ml-3">
                <div class="font-weight-bold">
                  {{ ((electionData?.summary.totalVotesCast / electionData?.summary.eligibleVoters) * 100).toFixed(2)
                  }}%
                </div>
                <div>投票率</div>
              </div>
            </div>

            <div class="flex-column d-flex flex-wrap">
              <div class="overview-item font-weight-bold">
                <div class="overview-text">
                  <span>投票數</span>
                  {{ formatNumber(electionData?.summary.totalVotesCast) }} 票
                </div>
              </div>
              <div class="overview-item font-weight-bold">
                <div class="overview-text">
                  <span>無效票數</span>
                  {{ formatNumber(electionData?.summary.totalInvalidVotes) }} 票
                </div>
              </div>
              <div class="overview-item font-weight-bold">
                <div class="overview-text">
                  <span>有效票數</span>
                  {{ formatNumber(electionData?.summary.totalValidVotes) }} 票
                </div>
              </div>
              <div class="overview-item font-weight-bold">
                <div class="overview-text">
                  <span>選舉人數</span>
                  {{ formatNumber(electionData?.summary.eligibleVoters) }} 票
                </div>
              </div>
            </div>

          </div>

          <div class="d-flex justify-space-between flex-lg-wrap flex-md-nowrap align-center mt-4">
            <div class="chart-wrapper d-md-flex align-md-center">
              <canvas ref="chartCanvas"></canvas>
            </div>

            <div class="flex-column rank-list mt-3 d-flex flex-wrap">
              <div v-for="(ev, index) in electionData?.summary?.candidates" :key="ev.id" class="rank-item"
                :class="ev.party.toLowerCase()">
                <div class="rank-number">{{ index + 1 }}</div>
                <div class="rank-info">
                  <div class="font-weight-bold">{{ getPartyName(ev.party) }}</div>
                  <div class="rank-name">{{ ev.candidate_main }}<span class="mx-1">|</span>{{ ev.candidate_sub }}</div>
                </div>
                <div class="mx-2 line"></div>
                <div class="rank-percentage">
                  <div>{{ ev.percentage }}% </div>
                  <div class="ticket-count">{{ formatNumber(ev.vote) }} 票</div>
                </div>
              </div>
            </div>
          </div>

        </div>

        <div class="map-container">
          <svg viewBox="0 0 344 472" width="100%">
            <City v-for="city in cities" :key="city.name" :data="city" @click-city="handleCityClick">
              <template #content>
                <path v-for="path in city.path" :d="path" xmlns="http://www.w3.org/2000/svg" :fill="city.partyColor"/>
              </template>
            </City>
          </svg>
        </div>

        <div class="cards-container">
          <!-- 縣市 -->
          <div v-if="currentCityData" class="tip-card mb-4">
            <div class="city-title">{{ selectedCity }}</div>
            <div class="rank-list">
              <div v-for="(cand, keys, index) in currentCityData.details" :key="index" class="rank-item d-flex mb-1"
                :class="keys.toLowerCase()">
                <div class="rank-number">{{ index + 1 }}</div>
                <div class="rank-info">
                  <div class="font-weight-bold">{{ getPartyName(keys) }}</div>
                  <div class="rank-name">
                    {{electionData.summary.candidates.find(c => c.party === keys).candidate_main}}<span
                      class="mx-1">|</span>
                    {{electionData.summary.candidates.find(c => c.party === keys).candidate_sub}}
                  </div>
                </div>
                <div class="mx-2 line"></div>
                <div class="rank-percentage">
                  <div>{{ cand.percentage }}%</div>
                  <div class="ticket-count">{{ formatNumber(cand.vote) }} 票</div>
                </div>
              </div>
            </div>
          </div>
          <!-- 區 -->
          <div v-if="currentDistrictData" class="tip-card border-orange"
            style="border-color: #ff9800; background: #fff9f0;">
            <div class="city-title">{{ selectedDistrict }}</div>
            <div class="rank-list">
              <div v-for="(cand, keys, index) in currentDistrictData.details" :key="keys.toLowerCase()"
                class="rank-item d-flex mb-1" :class="keys.toLowerCase()">
                <div class="rank-number">{{ index + 1 }}</div>
                <div class="rank-info">
                  <div class="font-weight-bold">{{ getPartyName(keys) }}</div>
                  <div class="rank-name">
                    {{electionData.summary.candidates.find(c => c.party === keys).candidate_main}}<span
                      class="mx-1">|</span>
                    {{electionData.summary.candidates.find(c => c.party === keys).candidate_sub}}
                  </div>
                </div>
                <div class="mx-2 line"></div>
                <div class="rank-percentage">
                  <div>{{ cand.percentage }}%</div>
                  <div class="ticket-count">{{ formatNumber(cand.vote) }} 票</div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';

import { useTaiwanMap } from '@/composables/useTaiwanmap';
const {
  getTaiwan
} = useTaiwanMap()
const cities = ref(getTaiwan());

import City from '@/components/Taiwan/City.vue';

// 選單列表
import { useTool } from '@/composables/useTool.js'
const { formatNumber, getPartyColor, getPartyName } = useTool();
const selectedCity = ref(null);
const selectedDistrict = ref(null);
const electionData = ref(null);

// Chart
import Chart from 'chart.js/auto';
const totalChartCanvas = ref(null);
const chartCanvas = ref(null);
let totalChartInstance = null;
let chartInstance = null;

const cityOptions = computed(() => {
  if (!electionData.value) return [];
  return electionData.value.cities.map(city => city.name);
});

// 選單列表(區)
const districtOptions = computed(() => {
  if (electionData.value === null) {
    return [];
  }
  if (selectedCity.value === null) {
    return [];
  }
  const foundCity = electionData.value.cities.find((c) => {
    return c.name === selectedCity.value;
  });

  if (foundCity) {
    const nameList = foundCity.districts.map((d) => d.name);
    return nameList;
  } else {
    return [];
  }
});

// 選擇中->縣市資料
const currentCityData = computed(() => {
  if (electionData.value === null) {
    return null;
  }
  if (selectedCity.value === null) {
    return null;
  }
  return electionData.value.cities.find(cities => cities.name === selectedCity.value);
});

const currentDistrictData = computed(() => {
  if (electionData.value === null) {
    return null;
  }
  if (selectedDistrict.value === null) {
    return null;
  }
  return currentCityData.value.districts.find(d => d.name === selectedDistrict.value);
});

const handleCityChange = () => {
  selectedDistrict.value = null;
};

onMounted(async () => {
  const response = await fetch('/data/2024.json');
  const data = await response.json();
  electionData.value = data;
  initTotalChart(data.summary);
  initPartyChart(data.summary.candidates);
});

function initTotalChart() {
  const totalVotes = electionData.value.summary.totalVotesCast;
  const eligible = electionData.value.summary.eligibleVoters;
  const remaining = eligible - totalVotes;

  totalChartInstance = new Chart(totalChartCanvas.value, {
    type: 'doughnut',
    data: {
      labels: ['已投票', '未投票'],
      datasets: [
        {
          data: [totalVotes, remaining],
          backgroundColor: ['#262E49', '#E6E6E6'],
        }
      ]
    },
    options: {
      responsive: true,
      plugins: { legend: { display: false } }
    },
  });
};

function initPartyChart(candidates) {
  const labels = candidates.map(c => getPartyName(c.party));
  const dataValues = candidates.map(c => parseFloat(c.percentage));
  const colors = candidates.map(c => getPartyColor(c.party));
  chartInstance = new Chart(chartCanvas.value, {
    type: 'doughnut',
    data: {
      labels: labels,
      datasets: [{
        data: dataValues,
        backgroundColor: colors,
        borderWidth: 0
      }]
    },
    options: {
      responsive: true,
      plugins: { legend: { display: false } }
    }
  });
};

function handleCityClick(city_name){
  selectedCity.value = city_name;
}
</script>

<style lang="scss" scoped>
.taiwan-view {
  background: #E6E6E6;

  .header {
    background-color: #262E49;
    color: #fff;

    .header-title {
      font-size: 24px;
    }
  }

  .area-title {
    border-left: 4px solid #3b82f6;
    padding-left: 8px;
    margin-bottom: 8px;
    font-size: 1.6rem;

    span {
      font-size: 13px;
      color: #333;
      font-weight: bold;
      letter-spacing: 0.5px;
    }
  }

  .voting-overview {
    background: #fff;
    padding: 20px;
    border-radius: 8px;
    max-width: 270px;
    width: 100%;

    .chart-wrapper {
      height: 120px;
      font-size: 1.4rem;
    }

    .overview-title {
      font-size: 24px;
    }

    .overview-item {
      display: flex;
      align-items: center;
      margin-top: 8px;

      .color-box {
        width: 16px;
        height: 16px;
        margin-right: 8px;
        border-radius: 4px;
      }

      .overview-text {
        font-size: 16px;

        span {
          width: 64px;
          display: inline-block;
        }
      }
    }
  }

  .map-container {
    width: 350px;
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;

    .custom-tooltip {
      position: absolute;
      pointer-events: none;
      background: rgba(0, 0, 0, 0.8);
      color: white;
      padding: 4px 8px;
      border-radius: 4px;
      transform: translate(-50%, -100%);
      z-index: 1000;
      white-space: nowrap;
    }
  }


  .cards-container {
    display: flex;
    flex-direction: column;
    gap: 20px;

    @media (max-width: 1100px) {
      width: 100%;
      display: flex;
      flex-direction: row; 
      overflow-x: auto; 
      padding-bottom: 10px;
      gap: 15px;
      &::-webkit-scrollbar {
        display: none;
      }
    }

    .tip-card {
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      flex-shrink: 0;
      padding: 20px;
      border: 2px solid rgb(132, 203, 152);
      border-radius: 8px;
      background: rgb(243, 250, 245);
      height: 210px;
      width: 300px;

      .city-title {
        font-size: 1.2rem;
        font-weight: bold;
        margin-bottom: 10px;
      }


    }
  }


  .rank-list {
    .rank-item {
      display: flex;
      align-items: center;

      .rank-number {
        font-size: 1rem;
        font-weight: bold;
        width: 24px;
      }

      .rank-info {
        margin-left: 8px;

        .rank-name {
          font-size: 0.8rem;
        }
      }

      .rank-percentage {
        font-size: rem;
        font-weight: bold;

        .ticket-count {
          font-size: 0.8rem;
          color: #666;
        }
      }

      &.tpp {
        .rank-number {
          background: #28C7C7;
          color: #fff;
          text-align: center;
          width: 35px;
          line-height: 35px;
          height: 35px;
          border-radius: 4px;
        }

        .line {
          width: 2px;
          height: 35px;
          background: #28C7C7;
        }
      }

      &.dpp {
        .rank-number {
          background: #28945E;
          color: #fff;
          text-align: center;
          width: 35px;
          line-height: 35px;
          height: 35px;
          border-radius: 4px;
        }

        .line {
          width: 2px;
          height: 35px;
          background: #28945E;
        }
      }

      &.kmt {
        .rank-number {
          background: #005599;
          color: #fff;
          text-align: center;
          width: 35px;
          line-height: 35px;
          height: 35px;
          border-radius: 4px;
        }

        .line {
          width: 2px;
          height: 35px;
          background: #005599;
        }
      }
    }
  }
}

@media (max-width: 1100px) {
  .main-content-wrapper {
    flex-direction: column !important;
    align-items: center;
    gap: 30px;
  }

  .voting-overview,
  .map-container,
  .tip-card {
    max-width: 100% !important;
    width: 100%;
  }

  .map-container {
    width: 80%;
  }
}
</style>