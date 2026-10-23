<script setup>
defineProps({ result: { type: Object, required: true } })
defineEmits(['run'])
</script>

<template>
  <div class="out">
    <template v-if="result.type === 'whoami'">
      <h1 class="name">{{ result.name }}</h1>
      <p>{{ result.tagline }}</p>
      <p class="dim">📍 {{ result.location }}</p>
    </template>

    <template v-else-if="result.type === 'help'">
      <p>Available commands (type one, or tap a button below):</p>
      <ul class="plain">
        <li v-for="c in result.items" :key="c.name">
          <button type="button" class="link-btn" @click="$emit('run', c.name)">{{ c.name }}</button>
          <span class="dim"> - {{ c.desc }}</span>
        </li>
      </ul>
    </template>

    <template v-else-if="result.type === 'text'">
      <p v-for="(l, i) in result.lines" :key="i">{{ l }}</p>
    </template>

    <template v-else-if="result.type === 'list'">
      <ul class="bullets"><li v-for="s in result.items" :key="s">{{ s }}</li></ul>
    </template>

    <template v-else-if="result.type === 'experience'">
      <article v-for="x in result.items" :key="x.role + x.company" class="card">
        <h2>{{ x.role }} <span class="dim">@</span>
          <a v-if="x.url" :href="x.url" target="_blank" rel="noopener noreferrer">{{ x.company }}</a>
          <span v-else>{{ x.company }}</span>
        </h2>
        <p v-if="x.period || x.location" class="dim">{{ [x.period, x.location].filter(Boolean).join(' · ') }}</p>
        <p v-if="x.description">{{ x.description }}</p>
      </article>
      <h2 class="section">Education &amp; certifications</h2>
      <article v-for="e in result.education" :key="e.title" class="card">
        <h2>{{ e.title }}</h2>
        <p class="dim">{{ e.issuer }} · {{ e.date }}</p>
      </article>
    </template>

    <template v-else-if="result.type === 'projects'">
      <article v-for="p in result.items" :key="p.name" class="card" :class="{ placeholder: p.placeholder }">
        <h2>
          <a v-if="p.url" :href="p.url" target="_blank" rel="noopener noreferrer">{{ p.name }}</a>
          <span v-else>{{ p.name }}</span>
        </h2>
        <p>{{ p.description }}</p>
        <p v-if="p.tech && p.tech.length" class="dim">{{ p.tech.join(' · ') }}</p>
      </article>
      <p v-if="result.github">More on GitHub:
        <a :href="result.github.url" target="_blank" rel="noopener noreferrer">{{ result.github.url }}</a>
      </p>
    </template>

    <template v-else-if="result.type === 'contact'">
      <p>📍 {{ result.location }}</p>
      <p v-if="result.email">✉ <a :href="'mailto:' + result.email">{{ result.email }}</a></p>
      <p>Best way to reach me is LinkedIn:</p>
      <ul class="plain">
        <li v-for="l in result.links" :key="l.url">
          <span class="dim">{{ l.label }}: </span>
          <a :href="l.url" target="_blank" rel="noopener noreferrer">{{ l.url }}</a>
        </li>
      </ul>
    </template>

    <template v-else-if="result.type === 'links'">
      <ul class="plain">
        <li v-for="l in result.items" :key="l.url">
          <span class="dim">{{ l.label }}: </span>
          <a :href="l.url" target="_blank" rel="noopener noreferrer">{{ l.url }}</a>
        </li>
      </ul>
    </template>

    <template v-else>
      <p class="err">{{ result.message }}</p>
    </template>
  </div>
</template>
