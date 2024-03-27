<script setup lang="ts">
import { VICTORY_MESSAGE, DEFEAT_MESSAGE, MAX_GUESS_LENGTH, MAX_GUESSES } from '@/const/const'
import { ref, watch, computed } from 'vue'
import englishWords from '@/mocks/englishWordsWith5Letters.json'
import GuessInput from '@/components/GuessInput.vue'
import confetti from 'canvas-confetti'
import GuessComponent from '@/components/GuessComponent.vue'


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


const timesGuessed = ref(0)
const guessesSubmitted = ref<string[]>(Array(MAX_GUESSES).fill(""))

const handleGuessSubmitted = (guess: string) => {
  guessesSubmitted.value.splice(timesGuessed.value, 1, guess)
  timesGuessed.value++
}

const isGameOver = computed(() => timesGuessed.value >= MAX_GUESSES ||  guessesSubmitted.value.includes(props.wordOfTheDay))

// watch(isGameOver, (newValue) => {
//   if (newValue) {
//     confetti()
//   }
// })


</script>

<template>
  
  <ul class="tries">
    <GuessComponent v-for="(guess, index) in guessesSubmitted" :key="`${guess}-${index}`" :guessField="guess">
      <template #default v-if="index == timesGuessed">
        <GuessInput :disabled="isGameOver" @guess-submitted="handleGuessSubmitted" />
      </template>
    </GuessComponent>
  </ul>
  <p v-if="isGameOver" v-text="guessesSubmitted.includes(wordOfTheDay) ? VICTORY_MESSAGE : DEFEAT_MESSAGE"></p>
</template>

<style scoped>
  .tries {
    padding: 0;
    display: flex;
    flex-direction: column;
    gap: .5rem;
  }
</style>
