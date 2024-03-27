<script setup lang="ts">
import {MAX_GUESS_LENGTH} from '@/const/const'
import {ref, onMounted} from 'vue'
import englishWords from '@/mocks/englishWordsWith5Letters.json'

onMounted( () => {
  const input = document.querySelector("input")
  input?.focus()
})

// La sintaxis es muy rara per se establece un valor por defecto a disabled
withDefaults(
  defineProps<{
    disabled?: boolean
  }>(), 
  {disabled : false }
)

const emit = defineEmits<{
    "guess-submitted": [guess : string]
  }>()

const guessInProgress = ref("")

const onSubmit = () => {
  if(!englishWords.includes(guessInProgress.value)) return
  emit("guess-submitted", guessInProgress.value)
  guessInProgress.value = ""
}

const handleInput = (event: Event) : void => {
  const target = event.target as HTMLInputElement
  guessInProgress.value = target.value.substring(0, MAX_GUESS_LENGTH)
    .toUpperCase()
    .replace(/[^A-Z]+/gi ,"")
  target.value = guessInProgress.value
}

const handleBlur = (event : Event) => {
  const target = event.target as  HTMLInputElement
  target.focus()
}

const handleRedirectToInput = () => {
  const input = document.querySelector("input")
  input?.focus()
}

</script>

<template>
    <input
    :disabled="disabled"
    class="input"
    :maxlength="MAX_GUESS_LENGTH" 
    type="text" 
    :value="guessInProgress"
    @input="handleInput"
    autofocus
    @blur="handleBlur"
    @keydown.enter="onSubmit">
  <ul @click="handleRedirectToInput" class="word">
    <li 
    class="letter" 
    v-for="(letter, index) in guessInProgress.padEnd(MAX_GUESS_LENGTH, ' ')" 
    :key="`${letter}-${index}`" 
    v-text="letter"
    :data-letter="letter"
    :class="{ 'current-focus': index === guessInProgress.length }"
    ></li>
  </ul>


</template>

<style scoped>

/* .input:disabled + .word .letter {
  background-color: lightgray;
  cursor: default;
} */

.input:focus + .word .current-focus {
  background-color: rgb(192, 208, 252);
}


.word {
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 0 auto;
  gap: 0.5rem;
  cursor: pointer;
}

.letter {
  display: flex;
  justify-content: center;
  align-items: center;
  list-style: none;
  font-size: 2rem;
  border: solid 1px #000;
  height: 3rem;
  width: 3rem;
}

.input {
  position: absolute;
  opacity: 0;
  width: 0;
  height: 0;
  background-color: red;
}

li:not([data-letter=" "]) {
  animation: pop 100ms;
}

@keyframes pop {
  0% {
    transform: scale(1);
  }
  100% {
    transform: scale(1.2);
  }
}

</style>
