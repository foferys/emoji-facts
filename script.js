// # Fase di preparazione
// Raccogliamo gli elementi di interesse dalla pagina
const mainSection = document.querySelector('main')
const nameField = document.querySelector('input')
const emojiElements = document.querySelectorAll('.emoji')
const generateButton = document.querySelector('#generate')

const storyTitle = document.querySelector('.story-title')
const storyText = document.querySelector('.story-text')
const homeButton = document.querySelector('#home')
const continueButton = document.querySelector('#continue')

// Preparo una variabile per la lista delle emoji scelte
const selectedEmojis = []

// Preparo una variabile per la lista di messaggi
const chatMessages = []

// Funzione che colora le emoji selezionate
function colorSelectedEmojis() {
  for (const element of emojiElements) {
    // Recupero l'emoji di ogni elemento
    const emoji = element.dataset.icon;

    // Se l'emoji è nella lista delle selezionate (perché al click viene aggiunta nell'array-vedi giu)
    if (selectedEmojis.includes(emoji)) {
      // Aggiungi la classe selected
      element.classList.add('selected')
    } else {
      // Rimuovi (se c'è la classe selected)
      element.classList.remove('selected')
    }
  }
}

// Informazioni necessarie per chiamare API
//https://sv443.net/jokeapi/v2/
const endpoint = 'https://v2.jokeapi.dev/joke/Any'

// Funzione che chiede a GPT di creare una storia
async function createStory(prompt) {
  // Lo aggiungo alla lista dei messaggi
  chatMessages.push(prompt)
  console.log(chatMessages)

  // Mostro la schermata di caricamento
  mainSection.className = 'loading'

  // || SIAMO PRONTI A CHIAMARE l'api!!!!

  // Chiamata
  const response = await fetch(`https://v2.jokeapi.dev/joke/${prompt.category && prompt.category.length > 0 ? 
    prompt.category.join(",") : 
    "any"}?contains=${prompt.word ? prompt.word : ""}`);


  // Elaboriamo la risposta
  const data = await response.json();
  console.log(data)

  // Recuperiamo la storia
  let storyQ = "";
  let storyAnsw = "";
  if(data.joke) {
    storyQ = data.joke;
    // storyAnsw = data.delivery;
    
  }else {
    storyQ = data.setup;
    storyAnsw = data.delivery;

  }
  console.log(storyQ)
  console.log(storyAnsw )

  if(!data.error) {
    // // Inseriamo la storia all'interno della pagina
    storyTitle.innerText = storyQ
    storyText.innerText = storyAnsw
  }else {
    storyTitle.innerText = "Parola non trovata";
    storyText.innerText = "prova con un'altra parola"

    setTimeout(() => {
      window.location.href="./";
    }, 4000)
  }

  // // Mostra la schermata result
  mainSection.className = 'result'
}

// # Fase di gestione eventi
// Per ogni elemento degli elementi emoji...
for (const element of emojiElements) {
  
  element.addEventListener('click', function () {
    // Recupera l'emoji
    const clickedEmoji = element.dataset.icon;

    // ! Controllo se c'è già, non fare niente
    if (selectedEmojis.includes(clickedEmoji)) {
      console.warn(`Emoji ${clickedEmoji} già presente`)
      return
    }

    // Inseriscila nella lista delle selezionate
    selectedEmojis.push(clickedEmoji)


    // Se ci sono più di 3 emoji, togli "la più vecchia"
    if (selectedEmojis.length > 3) {
      console.warn('Ci sono troppe emoji, tolgo la prima')
      selectedEmojis.shift()
    }

    // Colora gli elementi le cui emoji sono in lista
    colorSelectedEmojis()

    console.log(selectedEmojis)
  })
}


// Al click del bottone "GENERA"
generateButton.addEventListener('click', async function () {

  // Preparo il messaggio iniziale con la parola presa dal campo
  const prompt = {
    word: nameField.value,
    category: selectedEmojis
  }

  // Controlle se manca qualcosa
  // if (selectedEmojis.length < 3 || name.length < 2) {
  //   window.alert('Devi selezionare 3 emoji e inserire un nome')
  //   return
  // }

  

  // Crea storia
  createStory(prompt)
})

// Al click sul bottone avanti
continueButton.addEventListener('click', function () {
  // Prepariamo un nuovo prompt casuale
  const prompt = {
    word: chatMessages[0].word,
    category: chatMessages[0].category
  }

  // Crea storia
  createStory(prompt)

})

// Al click sul bottone home
homeButton.addEventListener('click', function () {
  // Ricarica la pagina
  window.location.reload()
})