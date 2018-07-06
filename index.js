"use strict"

window.addEventListener("DOMContentLoaded", () => {

  // References to relevant DOM elements
  var parentBox    = document.getElementById("parent")
  var wordBox      = document.getElementById("word")
  var nonceBox     = document.getElementById("nonce")
  var incButton    = document.getElementById("increment")
  var randomButton = document.getElementById("random")
  var hashDiv      = document.getElementById("hash")

  //TODO set default values

  // Handle clicking the increment button
  incButton.addEventListener("click", () => {

    // Increment the nonce
    var nonce = parseInt(nonceBox.value, 10)
    nonce++
    nonceBox.value = nonce

    // Update the hash
    updateHash(nonce)
  })

  // Handle clicking the random button
  randomButton.addEventListener("click", () => {

    // Generate the random 32-bit nonce
    var tempNonce = new Uint32Array(1)
    window.crypto.getRandomValues(tempNonce)
    var nonce = tempNonce[0]
    nonceBox.value = nonce

    // Update the hash
    updateHash(nonce)
  })

  /**
   * Calculate the sha256 hash of the parameters,a nd display the first 8 hexadigits
   * in the DOM
   * @param parent The first 8 hexadigits of the parent block's hash
   * @param word The new word you are adding to the story (no laeding or trailing spaces)
   * @param nonce An unsigned integer in decimal form
   */
  function updateHash(nonce) {
    console.log("update hash")
    // Read in the other values
    var parent = parentBox.value
    var word = wordBox.value

    var concat = parent + word + nonce
    var hash = sha256(concat).slice(0, 8)

    hashDiv.innerHTML = hash
  }

})
