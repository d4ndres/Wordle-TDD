import { mount } from '@vue/test-utils'
import WordleBoard from '../WordleBoard.vue'
import {VICTORY_MESSAGE, DEFEAT_MESSAGE, MAX_GUESS_LENGTH} from '@/const/const'



describe('WordleBoard', () => {
  const wordOfTheDay = 'TESTS'
  let wrapper : ReturnType<typeof mount>
  beforeEach( () => {
    wrapper = mount(WordleBoard, { props: { wordOfTheDay }})

  })

  async function playerSubmitsGuess(guess: string ){
    const guessInput = wrapper.find("input[type=text]")
    await guessInput.setValue(guess)
    await guessInput.trigger("keydown.enter")
  
  }

  describe("End of the game messages", () => {
    
    test('a victory message appears when the user makes a guess that matches the word of the day', async () => {
      await playerSubmitsGuess(wordOfTheDay)
      expect(wrapper.text()).toContain(VICTORY_MESSAGE)
    })
  
  
    test("a defeat message appears if the user makes a guess that is incorrect", async ()=> {
      await playerSubmitsGuess("WRONG")
      expect(wrapper.text()).toContain(DEFEAT_MESSAGE)
    })
  
    test("no end of game message appears if the user has not yet made a guess", async () => {
      expect(wrapper.text()).not.toContain(VICTORY_MESSAGE)
      expect(wrapper.text()).not.toContain(DEFEAT_MESSAGE)
    })

  })


  describe("Rules for define the word of the day", () => {
    beforeEach(() => {
      console.warn = vi.fn()
    })


    test.each([
      {word: "TEST", reason: "word of the day must have 5 characters"},
      {word: "tests", reason: "word of the day must be all in uppercase"},
      {word: "QWERT", reason: "word of the day must be a valid English word"}
    ]
    )("Since $reason: $word is invalid, therefore a warning must be emitted", async ({word}) => {
      // un mejor estándar entre jest y vitest
      // const spy = vi.spyOn(console, "warn")
      // spy.mockImplementation(() => null)
      // // esto permite usar el console.warn como si fuera un mock
      
      // vitest
      // console.warn = vi.fn()
  
      mount(WordleBoard, { props: { wordOfTheDay: word }})
      expect(console.warn).toHaveBeenCalled()
    })
  
    test("if a word of the day is a real word English word, no warning is emitted", async () => {
      mount(WordleBoard, { props: { wordOfTheDay: "ABORT" }})
      expect(console.warn).not.toHaveBeenCalled()
    })

  })

  describe("Player input", async () => {
    test(`player guesses are limited to ${MAX_GUESS_LENGTH} letters`,  async () => {
      await playerSubmitsGuess(wordOfTheDay + "EXTRA")
      expect(wrapper.text()).toContain(VICTORY_MESSAGE)
    })

    test("player guesses can only be submitted if they are real words", async() => {
      await playerSubmitsGuess("QWERT")
      expect(wrapper.text()).not.toContain(VICTORY_MESSAGE)
      expect(wrapper.text()).not.toContain(DEFEAT_MESSAGE)
    })
    test("player guesses are not case-sensitive", async () => {
      await playerSubmitsGuess(wordOfTheDay.toLowerCase())
      expect(wrapper.text()).toContain(VICTORY_MESSAGE)
    })
    test("player guesses can only contain letters", async () => {
      await playerSubmitsGuess("H33}T")
      // input.replace(/[^A-Z]+/gi ,"") // Todas las que no son letras
      // /.../ indica una expresión regular
      // ^ niega
      // + uno o más coincidencias
      // g global. no retorna con el primer match
      // i case insensitive. mayúsculas y minúsculas
      // A-Z letras de la A a la Z
      // 0-9 números del 0 al 9
      expect(wrapper.find<HTMLInputElement>('input[type=text]').element.value).toEqual("HT")
    })
  })

})
