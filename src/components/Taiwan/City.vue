<template>
  <g class="city-group" :id="data.code" :fill="`#${data.partyColor}`" @click="handleCityClick">
    <slot name="content"></slot>
  </g>
</template>

<script setup>
const props = defineProps({
  data: {
    type: Object,
    default: () => ({ name: '', code: '', partyColor: '' })
  }
});

const emit = defineEmits(['click-city']);

const handleCityClick = () => {
  emit('click-city', props.data.name);
};
</script>

<style scoped>
.city-group {
  cursor: pointer;
  transition: opacity 0.2s;
  pointer-events: visiblePainted;
}

.city-group:hover {
  opacity: 0.6;
}
</style>