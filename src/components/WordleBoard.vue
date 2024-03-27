<script setup lang="ts">
import {VICTORY_MESSAGE, DEFEAT_MESSAGE, MAX_GUESS_LENGTH} from '@/const/const'
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

const onSubmit = () => {
  if(!englishWords.includes(guessInProgress.value)) return
  guessSubmitted.value = guessInProgress.value
}

const handleInput = (event: Event) : void => {
  const target = event.target as HTMLInputElement
  guessInProgress.value = target.value.substring(0, MAX_GUESS_LENGTH)
    .toUpperCase()
    .replace(/[^A-Z]+/gi ,"")
  target.value = guessInProgress.value
}

</script>

<template>
  {{ guessInProgress }}
  <input 
  :maxlength="MAX_GUESS_LENGTH" 
  type="text" 
  :value="guessInProgress"
  @input="handleInput"
  @keydown.enter="onSubmit">
  <p v-if="guessSubmitted.length" 
  v-text="guessSubmitted === wordOfTheDay ? VICTORY_MESSAGE : DEFEAT_MESSAGE" ></p>
</template>
