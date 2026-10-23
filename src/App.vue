<script setup>
import { ref, computed, onMounted, onBeforeUnmount, nextTick } from 'vue'
import { profile, sections } from './content.js'
import { runCommand } from './commands.js'
import NavBar from './components/NavBar.vue'
import Header from './components/Header.vue'
import SectionBlock from './components/SectionBlock.vue'

const title = `${profile.user}@${profile.host}:~$`
const activeId = ref(sections[0].id)
const cv = ref(false)
const input = ref('')
const inputEl = ref(null)
const cli = ref([])
const now = ref(new Date())
const mainEl = ref(null)
let timer

const visible = computed(() => (cv.value ? sections : sections.filter((s) => s.id === activeId.value)))
const activeLabel = computed(() => sections.find((s) => s.id === activeId.value)?.label ?? '')
const clock = computed(() =>
  new Intl.DateTimeFormat('en-US', { hour: '2-digit', minute: '2-digit', hour12: true, timeZone: profile.timezone }).format(now.value),
)

function select(id) {
  activeId.value = id
  if (cv.value) {
    nextTick(() => document.getElementById(id)?.scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth', block: 'start' }))
  }
}
function step(d) {
  const i = sections.findIndex((s) => s.id === activeId.value)
  select(sections[(i + d + sections.length) % sections.length].id)
}
const api = { select, toggleCv: () => (cv.value = !cv.value), isCv: () => cv.value }

function submit() {
  const raw = input.value
  input.value = ''
  const out = runCommand(raw, api)
  if (out === 'clear') cli.value = []
  else if (out) cli.value.push({ cmd: raw.trim(), out })
}

function onKey(e) {
  if (e.metaKey || e.ctrlKey || e.altKey) return
  const t = e.target
  const typing = t instanceof HTMLElement && (t.tagName === 'INPUT' && t.type !== 'checkbox' || t.tagName === 'TEXTAREA')
  if (typing) {
    if (e.key === 'Escape') t.blur()
    return
  }
  if (e.key === 'ArrowRight' || e.key === 'l') return step(1), e.preventDefault()
  if (e.key === 'ArrowLeft' || e.key === 'h') return step(-1), e.preventDefault()
  const n = Number(e.key)
  if (Number.isInteger(n) && n >= 1 && n <= sections.length) return select(sections[n - 1].id)
  if (e.key.length === 1 && e.key !== ' ') inputEl.value?.focus() // typed char lands in the prompt
}

onMounted(() => {
  window.addEventListener('keydown', onKey)
  timer = setInterval(() => (now.value = new Date()), 30000)
})
onBeforeUnmount(() => {
  window.removeEventListener('keydown', onKey)
  clearInterval(timer)
})
</script>

<template>
  <div class="window">
    <div class="chrome">
      <span class="controls" aria-hidden="true"><i class="control c1"></i><i class="control c2"></i><i class="control c3"></i></span>
      <span class="chrome-title">{{ title }}</span>
    </div>

    <NavBar :sections="sections" :active-id="activeId" :cv="cv" @select="select" @toggle-cv="(v) => (cv = v)" />

    <div class="layout">
      <Header />
      <div class="header-rule" aria-hidden="true"></div>

      <main class="main" ref="mainEl">
        <div class="output" :key="cv ? 'cv' : activeId">
          <SectionBlock v-for="s in visible" :key="s.id" :section="s" />
        </div>
        <div v-if="cli.length" class="cli" aria-live="polite">
          <div v-for="(c, i) in cli" :key="i" class="cli-item">
            <div><span class="cli-prompt">&gt;&gt;&gt;</span> {{ c.cmd }}</div>
            <div v-for="(l, j) in c.out" :key="j" class="cli-line">{{ l }}</div>
          </div>
        </div>
      </main>
    </div>

    <footer class="status">
      <div class="status-line">
        <div class="status-left"><span>status: online</span><span class="status-section">active: {{ cv ? 'CV (all)' : activeLabel }}</span></div>
        <div class="status-center">Use ← / → or h/l to switch sections</div>
        <div class="status-right">{{ clock }} {{ profile.timezone }}</div>
      </div>
      <form class="prompt" @submit.prevent="submit" @click="inputEl?.focus()">
        <label for="cmd">&gt;&gt;&gt;</label>
        <input id="cmd" ref="inputEl" v-model="input" type="text" spellcheck="false" autocapitalize="off" autocomplete="off" autocorrect="off" placeholder="type help" aria-label="Command prompt. Type help for commands" />
        <span class="cursor" aria-hidden="true"></span>
      </form>
    </footer>
  </div>
</template>
