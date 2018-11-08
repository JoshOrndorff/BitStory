"use strict"

window.addEventListener("DOMContentLoaded", () => {

  // References to relevant DOM elements
  var parentBox     = document.getElementById("parent")
  var wordBox       = document.getElementById("word")
  var nonceBox      = document.getElementById("nonce")

  var incButton     = document.getElementById("increment")
  var decButton     = document.getElementById("decrement")
  var randomButton  = document.getElementById("random")

  var autoDiv       = document.getElementById("auto")
  var autoButton    = document.getElementById("auto-button")
  var diffBox       = document.getElementById("difficulty")

  var hashDiv       = document.getElementById("hash")

  var nextButton = document.getElementById("publish")

  // Populate default values if no values are entered or left over
  if (parentBox.value === "" && wordBox.value   === "") {
    wordBox.value = "BitStory"
  }

  if (nonceBox.value === ""){
    nonceBox.value = "0"
  }

  hashFromDOM();

  // Update the hash whenever the text changes
  parentBox.addEventListener("input", hashFromDOM)
  wordBox  .addEventListener("input", hashFromDOM)
  nonceBox .addEventListener("input", hashFromDOM)

  // Handle clicking the buttons
  incButton.addEventListener("click", () => {changeBy( 1)})
  decButton.addEventListener("click", () => {changeBy(-1)})
  randomButton.addEventListener("click", genRandom)
  autoButton.addEventListener("click", autoMine)
  nextButton.addEventListener("click", nextBlock)



  /**
   * Resets the hasher to build on the existing block
   */
  function nextBlock() {
    parentBox.value = hashDiv.innerHTML
    wordBox.focus()
    wordBox.select()
  }



  /**
   * Automatically mines until a block with appropriate difficulty
   */
  function autoMine() {
    // Variable difficulty for auto-mine
    var diff = parseInt(diffBox.value, 10)

    var parent = getParent()
    var word = getWord()
    var nonce = getNonce()
    var oldHash
    for (var hash = ""; hash !== oldHash && hash.slice(0, diff) !== "0".repeat(diff); nonce++) {

      oldHash = hash
      hash = getHash(parent, word, nonce)
    }
    nonceBox.value = --nonce

    hashFromDOM()
  }



  /**
   * Change the nonce in the DOM by n
   * @param n The amount to change by
   */
  function changeBy(n){
    var nonce = parseInt(nonceBox.value, 10)
    nonce += n
    nonceBox.value = nonce
    hashFromDOM()
  }



  /**
   * Generates a random 32-bit nonce, puts it in the DOM, and updates hashes.
   */
  function genRandom() {
    var nonce = new Uint32Array(1)
    window.crypto.getRandomValues(nonce)
    nonceBox.value = nonce[0]

    hashFromDOM()
  }



  /**
   * Reads in and validates, values from the DOM.
   * Enables auto-mine feature on secret code input
   */
  function hashFromDOM() {
    // Check for enabling auto-mine
    if (parentBox.value === "auto-mine") {
      autoDiv.style.display = "inline"
    }

    hashDiv.innerHTML = getHash(getParent(), getWord(), getNonce())
  }



  /**
   * Reads in and validates the parent hash from the DOM.
   * Treats parent case-insensatively because it most likely represents a hexadecimal number.
   * @return The validated parent hash
   */
  function getParent() {
    var parent = parentBox.value.toLowerCase()
    // No required validation yet
    return parent
  }



  /**
   * Reads in and validates the word from the DOM.
   * @return The validated word
   */
  function getWord() {
    var word = wordBox.value

    // Validate word: No spaces
    if (word.indexOf(" ") !== -1) {
      word = word.replace(" ", "");
      console.warn("Invalid word. Using " +  + " instead.")
    }

    return word
  }



  /**
   * Reads in and validates the nonce from the DOM.
   * @return The validated nonce
   */
  function getNonce() {
    var nonce = parseInt(nonceBox.value, 10)

    // Validation nonce: Must be a number
    if (isNaN(nonce)) {
      nonce = 0
      console.warn("Invalid nonce. Using 0 instead.")
    }

    return nonce
  }


  /**
   * Calculate the sha256 hash of the parameters, and return the first
   * 8 hexadigits as a string
   * @param parent
   * @param word
   * @param nonce
   * @return the hash
   */
  function getHash(parent, word, nonce) {
    var concat = parent + word + nonce
    var hash = sha256(concat).slice(0, 8)

    return hash
  }

})
