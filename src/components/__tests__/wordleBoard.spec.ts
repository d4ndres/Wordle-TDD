import { mount } from '@vue/test-utils'
import WordleBoard from '../WordleBoard.vue'
import GuessComponent from '../GuessComponent.vue'
import { VICTORY_MESSAGE, DEFEAT_MESSAGE, MAX_GUESS_LENGTH, MAX_GUESSES } from '@/const/const'



describe('WordleBoard', () => {
  const wordOfTheDay = 'TESTS'
  let wrapper: ReturnType<typeof mount>
  beforeEach(() => {
    wrapper = mount(WordleBoard, { props: { wordOfTheDay } })
  })

  async function playerTypesGuess(guess: string) {
    await wrapper.find("input[type=text]").setValue(guess)
  }

  async function playerPressesEnter() {
    await wrapper.find("input[type=text]").trigger("keydown.enter")
  }

  async function playerTypesAndSubmitGuess(guess: string) {
    await playerTypesGuess(guess)
    await playerPressesEnter()
  }

  describe("End of the game messages", () => {

    test('a victory message appears when the user makes a guess that matches the word of the day', async () => {
      await playerTypesAndSubmitGuess(wordOfTheDay)
      expect(wrapper.text()).toContain(VICTORY_MESSAGE)
    })


    describe.each([
      { numberOfGuesses: 0, shouldSeeDefeatMessage: false },
      { numberOfGuesses: 1, shouldSeeDefeatMessage: false },
      { numberOfGuesses: 2, shouldSeeDefeatMessage: false },
      { numberOfGuesses: 3, shouldSeeDefeatMessage: false },
      { numberOfGuesses: 4, shouldSeeDefeatMessage: false },
      { numberOfGuesses: MAX_GUESSES, shouldSeeDefeatMessage: true }
    ])("a defeat message appears if the player makes a incorrect guesses 6 times in a row", ({ numberOfGuesses, shouldSeeDefeatMessage }) => {
      test(`therefore for ${numberOfGuesses} guess(es), a defeat message should ${shouldSeeDefeatMessage ? "" : "not"} appear`, async () => {
        for (let i = 0; i < numberOfGuesses; i++) {
          await playerTypesAndSubmitGuess("WRONG")
        }
        if (shouldSeeDefeatMessage) {
          expect(wrapper.text()).toContain(DEFEAT_MESSAGE)
        } else {
          expect(wrapper.text()).not.toContain(DEFEAT_MESSAGE)
        }
      })
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
      { word: "TEST", reason: "word of the day must have 5 characters" },
      { word: "tests", reason: "word of the day must be all in uppercase" },
      { word: "QWERT", reason: "word of the day must be a valid English word" }
    ]
    )("Since $reason: $word is invalid, therefore a warning must be emitted", async ({ word }) => {
      // un mejor estándar entre jest y vitest
      // const spy = vi.spyOn(console, "warn")
      // spy.mockImplementation(() => null)
      // // esto permite usar el console.warn como si fuera un mock

      // vitest
      // console.warn = vi.fn()

      mount(WordleBoard, { props: { wordOfTheDay: word } })
      expect(console.warn).toHaveBeenCalled()
    })

    test("if a word of the day is a real word English word, no warning is emitted", async () => {
      mount(WordleBoard, { props: { wordOfTheDay: "ABORT" } })
      expect(console.warn).not.toHaveBeenCalled()
    })

  })

  describe("Player input", async () => {
    test(`player guesses are limited to ${MAX_GUESS_LENGTH} letters`, async () => {
      await playerTypesAndSubmitGuess(wordOfTheDay + "EXTRA")
      expect(wrapper.text()).toContain(VICTORY_MESSAGE)
    })

    test("the input gets cleared afeter each submission", async () => {
      await playerTypesAndSubmitGuess("WRONG")

      expect(wrapper.find<HTMLInputElement>('input[type=text]').element.value).toEqual("")
    })

    test("player guesses can only be submitted if they are real words", async () => {
      await playerTypesAndSubmitGuess("QWERT")
      expect(wrapper.text()).not.toContain(VICTORY_MESSAGE)
      expect(wrapper.text()).not.toContain(DEFEAT_MESSAGE)
    })
    test("player guesses are not case-sensitive", async () => {
      await playerTypesAndSubmitGuess(wordOfTheDay.toLowerCase())
      expect(wrapper.text()).toContain(VICTORY_MESSAGE)
    })
    test("player guesses can only contain letters", async () => {
      await playerTypesGuess("H33}T")
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


    test("non-letter character do not render on the screen while being typed", async () => {
      await playerTypesGuess("333")
      expect(wrapper.find<HTMLInputElement>('input[type=text]').element.value).toEqual("")
    })


    test("the player losses control after the max amount of guesses have been sent", async () => {
      const submits = async () => {
        for (let i = 0; i < MAX_GUESSES; i++) {
          await playerTypesAndSubmitGuess("WRONG")
        }
      }
      await submits()

      expect(wrapper.find("input[type=text]").exists()).toBe(false)

    })

    test("the player losses controle after the correct guess has been given", async () => {
      await playerTypesAndSubmitGuess(wordOfTheDay)

      expect(wrapper.find("input[type=text]").attributes("disabled")).not.toBeUndefined()
    })

  })

  describe("Integration tests. always autofocus in input", async () => {
    test("autofocus not undefined", async () => {
      expect(wrapper.find("input[type=text]").attributes("autofocus")).not.toBeUndefined()
    })

    test("autofocus is not undefined after a trigger blur", async () => {
      document.body.innerHTML = '<div id="app"></div>'
      wrapper = mount(WordleBoard, {
        props: { wordOfTheDay },
        attachTo: "#app"
      })
      await wrapper.find("input[type=text]").trigger("blur")
      expect(document.activeElement).toBe(wrapper.find("input[type=text]").element)

    })

  })

  test("All previous guesses are displayed on the screen", async () => {
    const guesses = ["GUESS", "HELLO", "CODER", "HAPPY", "WRONG"]

    for (const guess of guesses) {
      await playerTypesAndSubmitGuess(guess)
    }

    for (const guess of guesses) {
      expect(wrapper.text()).toContain(guess)
    }

  })

  describe(`there should always be exactly ${MAX_GUESSES} guess-component in the board`, async () => {
    test(`${MAX_GUESSES} guess-component are present a the start of the game`, async () => {
      expect(wrapper.findAllComponents(GuessComponent)).toHaveLength(MAX_GUESSES)
    })

    test(`${MAX_GUESSES} guess-component are present as the player wins the game`, async () => {
      await playerTypesAndSubmitGuess(wordOfTheDay)
      expect(wrapper.findAllComponents(GuessComponent)).toHaveLength(MAX_GUESSES)
    })

    test(`${MAX_GUESSES} guess-component are present as the player loses the game`, async () => {
      Array(5).forEach(async () => {
        await playerTypesAndSubmitGuess("WRONG")
      })
      expect(wrapper.findAllComponents(GuessComponent)).toHaveLength(MAX_GUESSES)
    })
  })

  describe("Displaying hits/feedback to the player", () => {
    describe("hints are not displayed until the player submits their guess", async () => {

      // console.log("aquiiiiiiiiiiiii", wrapper.find("[data-letter-feedback]").html());

      test("Feedback was being rendered before the player started typing their guess", async () => {
        expect(wrapper.find("[data-letter-feedback=false]").exists()).toBe(false)
      })

      test("Feedback was rendered while the player was typing their guess", async () => {
        await playerTypesGuess(wordOfTheDay)
        expect(wrapper.find("[data-letter-feedback=false]").exists()).toBe(false)
      })


      test( "Feedback was not rendered after the player submitted their guess", async () => {
        await playerTypesGuess(wordOfTheDay)
        await playerPressesEnter()
        expect(wrapper.find("[data-letter-feedback=correct]").exists()).toBe(true)
      })
    })

    describe.each([
      { position: 0, expectedFeedback: 'correct', reason: ''},
      { position: 1, expectedFeedback: 'almost', reason: ''},
      { position: 2, expectedFeedback: 'almost', reason: ''},
      { position: 3, expectedFeedback: 'incorrect', reason: ''},
      { position: 4, expectedFeedback: 'incorrect', reason: ''},

    ])("If the word of the day is 'World' and the player types 'WRONG", ({position, expectedFeedback, reason})=> {
      const wordOfTheDay = "WORLD"
      const playerGuess = "WRONG"

      test(`the feedback for ${playerGuess[position]} (index : ${position}) should be ${wordOfTheDay[position]}`, async () => {
        wrapper = mount(WordleBoard, {propsData: {wordOfTheDay}})
        await playerTypesAndSubmitGuess(playerGuess)
        const actualFeedback = wrapper.findAll("[data-letter]").at(position)?.attributes("data-letter-feedback")
        expect(actualFeedback, reason).toEqual(expectedFeedback)
      })
    })

  })

})
