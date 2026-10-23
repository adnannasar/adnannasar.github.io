<script setup>
import { about, experience, education, skills, projects, links, email, profile } from '../content.js'
defineProps({ section: { type: Object, required: true } })
</script>

<template>
  <section class="section" :id="section.id" :aria-labelledby="section.id + '-title'">
    <div class="section-header">
      <h2 :id="section.id + '-title'" class="section-title">{{ section.title }}</h2>
      <p class="section-subtitle">{{ section.description }}</p>
    </div>
    <div class="section-body">
      <template v-if="section.id === 'about'">
        <p v-for="(l, i) in about" :key="i" class="para">{{ l }}</p>
      </template>

      <div v-else-if="section.id === 'experience'" class="stack">
        <article v-for="x in experience" :key="x.role + x.company" class="card">
          <div class="card-header">
            <div>
              <h3 class="card-title">{{ x.role }}</h3>
              <p class="card-subtitle">
                <a v-if="x.url" :href="x.url" target="_blank" rel="noopener noreferrer">{{ x.company }}</a>
                <template v-else>{{ x.company }}</template>
              </p>
            </div>
            <span v-if="x.period" class="card-meta">{{ x.period }}</span>
          </div>
          <p v-if="x.location" class="card-location">{{ x.location }}</p>
          <p v-if="x.description" class="card-body">{{ x.description }}</p>
        </article>
      </div>

      <div v-else-if="section.id === 'education'" class="stack">
        <article v-for="e in education" :key="e.title" class="card">
          <div class="card-header">
            <div>
              <h3 class="card-title">{{ e.title }}</h3>
              <p class="card-subtitle">{{ e.issuer }}</p>
            </div>
            <span class="card-meta">{{ e.date }}</span>
          </div>
        </article>
      </div>

      <ul v-else-if="section.id === 'skills'" class="list">
        <li v-for="s in skills" :key="s">{{ s }}</li>
      </ul>

      <div v-else-if="section.id === 'projects'" class="stack">
        <article v-for="p in projects" :key="p.name" class="card" :class="{ 'is-placeholder': p.placeholder }">
          <div class="card-header">
            <h3 class="card-title">
              <a v-if="p.url" :href="p.url" target="_blank" rel="noopener noreferrer">{{ p.name }}</a>
              <template v-else>{{ p.name }}</template>
            </h3>
            <span v-if="p.placeholder" class="card-meta">placeholder</span>
          </div>
          <p class="card-body">{{ p.description }}</p>
          <p v-if="p.tech && p.tech.length" class="card-tags">{{ p.tech.join('  ·  ') }}</p>
        </article>
        <p class="para muted">
          More on GitHub:
          <a :href="links.find((l) => l.label === 'GitHub').url" target="_blank" rel="noopener noreferrer">{{ links.find((l) => l.label === 'GitHub').url }}</a>
        </p>
      </div>

      <div v-else-if="section.id === 'contact'" class="stack">
        <p class="para">Based in {{ profile.location }}. The best way to reach me is LinkedIn.</p>
        <ul class="list plain">
          <li v-if="email"><span class="muted">email:</span> <a :href="'mailto:' + email">{{ email }}</a></li>
          <li v-for="l in links" :key="l.url">
            <span class="muted">{{ l.label.toLowerCase() }}:</span>
            <a :href="l.url" target="_blank" rel="noopener noreferrer">{{ l.url }}</a>
          </li>
        </ul>
      </div>
    </div>
  </section>
</template>
