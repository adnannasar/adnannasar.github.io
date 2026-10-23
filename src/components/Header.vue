<script setup>
import { ref, onMounted } from 'vue'
import { profile, links, email, skills } from '../content.js'
import { asciiPortrait, hasPhoto } from '../ascii-portrait.js'

const IMG = '/images/profile-picture.png'
const imageLoaded = ref(false)
const hovering = ref(false)

onMounted(() => {
  if (!hasPhoto) return
  const img = new Image()
  img.onload = () => { imageLoaded.value = true }
  img.onerror = () => { imageLoaded.value = false }
  img.src = IMG
})

let lastPointer = 'mouse'
const showImage = () => imageLoaded.value && (hovering.value = true)
const hideImage = () => (hovering.value = false)
const onEnter = (e) => { lastPointer = e.pointerType; if (e.pointerType === 'mouse') showImage() }
const onLeave = (e) => { if (e.pointerType === 'mouse') hideImage() }
// touch / keyboard: tap toggles (mouse users get hover instead)
const onClick = (e) => { if (lastPointer !== 'mouse' || e.detail === 0) imageLoaded.value && (hovering.value = !hovering.value) }
</script>

<template>
  <header class="header">
    <div class="header-content">
      <div>
        <h1 class="header-name">{{ profile.name }}</h1>
        <p class="header-role">{{ profile.role }}</p>
        <p class="header-tagline">{{ profile.tagline }}</p>
      </div>
      <div class="header-lines">
        <span>location: {{ profile.location }}</span>
        <span v-if="email">contact: {{ email }}</span>
        <span>status: {{ profile.status }}</span>
      </div>
      <div class="header-links">
        <a v-for="l in links" :key="l.url" :href="l.url" target="_blank" rel="noopener noreferrer">{{ l.label }}</a>
        <a v-if="email" :href="'mailto:' + email">Email</a>
      </div>
      <ul class="header-highlights" aria-label="Core strengths">
        <li v-for="s in skills" :key="s" class="chip">{{ s }}</li>
      </ul>
    </div>

    <div class="portrait">
      <p v-if="imageLoaded" class="portrait-hint">hover to display image</p>
      <div
        class="portrait-stack"
        :tabindex="imageLoaded ? 0 : undefined"
        :role="imageLoaded ? 'button' : undefined"
        :aria-label="imageLoaded ? 'Toggle between ASCII portrait and photo' : undefined"
        @pointerenter="onEnter"
        @pointerleave="onLeave"
        @pointerdown="lastPointer = $event.pointerType"
        @keydown.enter.prevent="onClick({ detail: 0 })"
        @keydown.space.prevent="onClick({ detail: 0 })"
        @blur="hideImage"
        @click="onClick"
      >
        <pre class="ascii" :class="{ 'is-hidden': hovering && imageLoaded }" aria-hidden="true">{{ asciiPortrait }}</pre>
        <img v-if="imageLoaded" class="portrait-image" :class="{ 'is-visible': hovering }" :src="IMG" :alt="profile.photoAlt" width="280" height="248" />
      </div>
    </div>
  </header>
</template>
