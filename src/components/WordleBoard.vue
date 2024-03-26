<script setup lang="ts">
import {VICTORY_MESSAGE, DEFEAT_MESSAGE} from '@/const/const'
import {ref} from 'vue'
import englishWords from '@/mocks/englishWordsWith5Letters.json'


// defineProps<{ 
//   wordOfTheDay: string
// }>()

defineProps({
  wordOfTheDay: {
    type: String,
    validator: (wordOfTheDay: string ) => wordOfTheDay.length === 5
    && wordOfTheDay.toUpperCase() === wordOfTheDay
    && englishWords.includes(wordOfTheDay)
  }
})

const guessInProgress = ref("")
const guessSubmitted = ref("")

</script>

<template>
  <input type="text" v-model="guessInProgress" @keydown.enter="guessSubmitted = guessInProgress">
  <p v-if="guessSubmitted.length" v-text="guessSubmitted === wordOfTheDay ? VICTORY_MESSAGE : DEFEAT_MESSAGE" ></p>
</template>
