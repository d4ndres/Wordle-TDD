<script setup lang="ts">
import { MAX_GUESS_LENGTH } from '@/const/const'

type Feedback = null | 'correct' | 'incorrect' | 'almost'


const props = defineProps<{
    guessField: string,
    answer: string 
  }>()

const hasFeedback = (position : number ) : Feedback  => {
  if ( props.guessField == '' ) return null
  if ( props.answer.includes(props.guessField[position])  ) {
    return props.answer[position] === props.guessField[position] ? 'correct' : 'almost'
  } else {
    return 'incorrect'
  }
} 
</script>

<template>
  <slot>
    <ul class="word">
      <li 
      :data-letter-feedback="hasFeedback(index)"
      class="letter" 
      v-for="(letter, index) in guessField.padEnd(MAX_GUESS_LENGTH, ' ')" :key="`${letter}-${index}`"
        v-text="letter" :data-letter="letter"></li>
      </ul>
  </slot>

</template>

<style scoped>
.word {
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 0 auto;
  gap: 0.5rem;
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

.input:not(:focus)+.word:hover .letter {
  background-color: cornsilk;
}

.letter[data-letter-feedback="correct"] {
  background-color: rgb(164, 231, 164);
}

.letter[data-letter-feedback="almost"] {
  background-color: rgb(235, 231, 182);
}

.letter[data-letter-feedback="incorrect"] {
  background-color: rgb(206, 206, 206);
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
