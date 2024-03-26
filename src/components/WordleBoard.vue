<script setup lang="ts">
import {VICTORY_MESSAGE, DEFEAT_MESSAGE, MAX_GUESS_LENGTH} from '@/const/const'
import {ref, computed} from 'vue'
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

const formattedGuessInProgress = computed({
  get: () => guessInProgress.value.toUpperCase(),
  set: (newValue: string) => guessInProgress.value = newValue
  .substring(0, MAX_GUESS_LENGTH)
  .toUpperCase()
  .replace(/[^A-Z]+/gi ,"")
})

const onSubmit = () => {
  if(!englishWords.includes(guessInProgress.value)) return
  
  guessSubmitted.value = guessInProgress.value
}

</script>

<template>
  {{ formattedGuessInProgress }}
  <input 
  :maxlength="MAX_GUESS_LENGTH" 
  type="text" 
  v-model="formattedGuessInProgress" 
  @keydown.enter="onSubmit">
  <p v-if="guessSubmitted.length" 
  v-text="guessSubmitted === wordOfTheDay ? VICTORY_MESSAGE : DEFEAT_MESSAGE" ></p>
</template>
