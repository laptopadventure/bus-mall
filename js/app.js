'use strict';

//globals

//list of all BracketImages
const bracketItems = []
//BracketImages on display 1 to 3, BracketImages queued next from 3 to 6
let imageQueue = []
//area clicks are on
const voteArea = document.querySelector('section')
//button for viewing results
const button = document.querySelector('.show-results')
//how many clicks the player has left
let clicksRemaining = 10

//helpers

function pick(array) {
  return array[Math.floor(Math.random() * array.length)]
}

function advanceQueue() {
  let displayed = []
  //add 3 to the end (uniques only!)
  while(imageQueue.length < 9) {
    let bracketImage = pick(bracketItems)
    if(imageQueue.includes(bracketImage)) {
      continue
    }
    imageQueue.push(bracketImage)
  }
  //take 3 from the start
  for(let i = 0; i < 3; i++) {
    displayed[i] = imageQueue.shift()
  }
  return displayed
}

//constructors

function BracketImage(name, extension = 'jpg') {
  this.views = 0
  this.likes = 0
  this.src = `img/${name}.${extension}`
  this.alt = name
  bracketItems.push(this)
  this.render = function(renderPosition, clear = false) {
    let possiblePositions = voteArea.querySelectorAll('img')
    let thisPosition = possiblePositions[renderPosition]
    thisPosition.src = !clear && this.src || ""
    thisPosition.alt = !clear && this.alt || ""
  }
}

//constructed

new BracketImage("bag")
new BracketImage("banana")
new BracketImage("bathroom")
new BracketImage("boots")
new BracketImage("breakfast")
new BracketImage("bubblegum")
new BracketImage("chair")
new BracketImage("cthulhu")
new BracketImage("dog-duck")
new BracketImage("dragon")
new BracketImage("pen")
new BracketImage("pet-sweep")

//main

function roll(clear = false) {
  console.log(clear)
  let displayed = advanceQueue()
  for(let i = 0; i < displayed.length; i++) {
    let bracketImage = imageQueue[i]
    bracketImage.views++
    bracketImage.render(i, clear)
  }
}

voteArea.addEventListener('click', onClick)

function onClick(event) {
  //validate it
  if(!event.target.alt) {
    return
  }

  //handle image
  clicksRemaining--
  for(let i = 0; i < bracketItems.length; i++) {
    let bracketImage = bracketItems[i]
    if(bracketImage.alt == event.target.alt) {
      bracketImage.likes++
      console.log(bracketImage.likes)
      break
    }
      
  }
  //reroll
  roll(!clicksRemaining)
  if(!clicksRemaining) {
    //game end
    voteArea.removeEventListener('click', onClick)
    button.addEventListener('click', onButtonClick)
    button.classList.add('enabled-button')
  }
}

function onButtonClick(event) {
  button.removeEventListener('click', onButtonClick)
  button.classList.remove('enabled-button')
  const labels = [];
  const likes = []
  const views = []

  for(let i = 0; i < bracketItems.length; i++) {
    labels.push(bracketItems[i].alt)
    likes.push(bracketItems[i].likes)
    views.push(bracketItems[i].views)
  }

  const data = {
    labels: bracketItems.map(bracketImage => bracketImage.alt),
    datasets: [{
      label: 'Views',
      data: bracketItems.map(bracketImage => bracketImage.views),
      backgroundColor: [
        'rgba(240, 5, 130, 0.8)',
      ],
      borderColor: [
        'rgba(0, 0, 0, 0.8)',
      ],
      borderWidth: 1
    }, {
      label: 'Likes',
      data: bracketItems.map(bracketImage => bracketImage.likes),
      backgroundColor: [
        'rgb(252, 186, 3)',
      ],
      borderColor: [
        'rgba(0, 0, 0, 0.8)',
      ],
      borderWidth: 2
    }]
  };

  const config = {
    type: 'bar',
    data: data,
    options: {},
  };

  let myChart = new Chart(
    document.getElementById('myChart'),
    config
  );
  myChart.canvas.parentNode.style.height = '800px';
  myChart.canvas.parentNode.style.width = '800px';

}

roll()