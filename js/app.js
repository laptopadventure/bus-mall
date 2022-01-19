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
  this.render = function(renderPosition) {
    let possiblePositions = voteArea.querySelectorAll('img')
    let thisPosition = possiblePositions[renderPosition]
    thisPosition.src = this.src
    thisPosition.alt = this.alt
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

function roll() {
  let displayed = advanceQueue()
  for(let i = 0; i < displayed.length; i++) {
    let bracketImage = imageQueue[i]
    bracketImage.views++
    bracketImage.render(i)
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
  if(clicksRemaining) {
    roll()
    return
  }
  //game end
  voteArea.removeEventListener('click', onClick)
  button.addEventListener('click', onButtonClick)
  button.classList.add('enabled-button')
}

function onButtonClick(event) {
  button.removeEventListener('click', onButtonClick)
  button.classList.remove('enabled-button')
  let ul = button.parentElement.appendChild(document.createElement('ul'))
  for(let i = 0; i < bracketItems.length; i++) {
    let bracketImage = bracketItems[i]
    let li = ul.appendChild(document.createElement('li'))
    li.textContent = `${bracketImage.alt} was seen ${bracketImage.views} and liked ${bracketImage.likes} times.`
  }
}

roll()