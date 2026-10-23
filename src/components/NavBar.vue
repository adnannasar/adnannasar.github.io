<script setup>
import { computed } from 'vue'
const props = defineProps({
  sections: { type: Array, required: true },
  activeId: { type: String, required: true },
  cv: { type: Boolean, default: false },
})
const emit = defineEmits(['select', 'toggle-cv'])
const description = computed(() => props.sections.find((s) => s.id === props.activeId)?.description ?? '')
</script>

<template>
  <nav class="nav" aria-label="Sections">
    <span class="nav-label">sections:</span>
    <div class="nav-list">
      <button
        v-for="(s, i) in sections"
        :key="s.id"
        type="button"
        class="nav-item"
        :class="{ 'is-active': s.id === activeId }"
        :aria-current="s.id === activeId ? 'page' : undefined"
        @click="emit('select', s.id)"
      >
        <span class="nav-shortcut">{{ i + 1 }}</span>
        <span>{{ s.label }}</span>
      </button>
      <label class="nav-toggle">
        <input type="checkbox" class="nav-checkbox" :checked="cv" @change="emit('toggle-cv', $event.target.checked)" />
        <span class="nav-toggle-label">CV</span>
      </label>
    </div>
    <div class="nav-description">
      <span class="nav-prompt">current</span>
      <span>{{ cv ? 'Full CV: all sections on one page' : description }}</span>
    </div>
  </nav>
</template>
