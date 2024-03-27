<script setup lang="ts">
import { VICTORY_MESSAGE, DEFEAT_MESSAGE, MAX_GUESS_LENGTH, MAX_GUESSES } from '@/const/const'
import { ref, watch, computed } from 'vue'
import englishWords from '@/mocks/englishWordsWith5Letters.json'
import GuessInput from '@/components/GuessInput.vue'
import confetti from 'canvas-confetti'

// defineProps<{ 
//   wordOfTheDay: string
// }>()

const props = defineProps({
  wordOfTheDay: {
    type: String,
    validator: (wordOfTheDay: string) => wordOfTheDay.length === MAX_GUESS_LENGTH
      && wordOfTheDay.toUpperCase() === wordOfTheDay
      && englishWords.includes(wordOfTheDay),
    required: true
  }
})

const guessesSubmitted = ref<string[]>([])

// watch(()=> guessSubmitted.value, (newValue) => {
//   const wordOfTheDay = props.wordOfTheDay;
//   if (newValue === wordOfTheDay) {
//     confetti()
//   }
// })

watch(() => guessesSubmitted.value, (newValue) => {
  const wordOfTheDay = props.wordOfTheDay;
  if (newValue.includes(wordOfTheDay)) {
    confetti()
  }
})

const isGameOver = computed(() => guessesSubmitted.value.length === MAX_GUESSES || guessesSubmitted.value.includes(props.wordOfTheDay))


</script>

<template>
  <GuessInput @guess-submitted="guess => guessesSubmitted.push(guess)" />
  <ul class="try">
    <li v-for="(guess, index) in guessesSubmitted" :key="`${guess}-${index}`">
      {{ guess }}
    </li>
  </ul>
  <p v-if="isGameOver" v-text="guessesSubmitted.includes(wordOfTheDay) ? VICTORY_MESSAGE : DEFEAT_MESSAGE"></p>
</template>
