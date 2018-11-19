'use strict';

document.addEventListener('DOMContentLoaded', () => {

  // Setup the blockchain visualization properties
  var graphviz = d3.select('#graph').graphviz({fit: true, scale: 0.2});
  // Docs at https://github.com/magjac/d3-graphviz
  graphviz.zoom(false);
  // But most don't work as advertised
  //graphviz.fit(true);
  //graphviz.scale(0.6); // https://github.com/magjac/d3-graphviz#graphviz_scale

  // DOM Elements
  const minerBox      = document.getElementById('miner');
  const parentBox     = document.getElementById('parent');
  const wordBox       = document.getElementById('word');
  const nonceBox      = document.getElementById('nonce');
  const hashDiv       = document.getElementById('hash');
  const publishButton = document.getElementById('publish');

  // Event Handlers
  publishButton.addEventListener('click', publishBlockHandler);
  //TODO get blocks over the network

  // Global block store and DOT store
  const blocks = {};
  const dotLines = [];


  /**
   * Receives a block from the network and adds it to the blockchain
   */
  //TODO



  /**
   * Builds a new block from the data in the DOM and publishes it
   */
  function publishBlockHandler() {
    // Build block from DOM values
    const block = {
      miner:  minerBox.value,
      parent: parentBox.value,
      word:   wordBox.value,
      nonce:  nonceBox.value,
      hash:   hashDiv.innerHTML,
    }

    //TODO Send it out over the network

    // Add it to our own local graph
    addBlockToChain(block);
  }



  /**
   * Receives a block (either from a peer or created locally), adds it to the
   * known blocks, and renders it in the DOM
   * @param block The block that is being added
   */
  function addBlockToChain(block) {
    // If it's not actually a new block, don't bother re-drawing
    if (blocks.hasOwnProperty(block.hash)){
      return;
    }

    // Add block to global block store
    blocks[block.hash] = block;

    // Update the visualization
    dotLines.push(blockToDot(block));
    const dotCode = `
          digraph {
            node [style="filled", shape="box"];
            ${dotLines.join('')}
          }`;
    //console.log(dotCode);
    graphviz.renderDot(dotCode);
  }



  /**
   * Turns a single block into a snippet of DOT code
   */
  function blockToDot(b) {
    // Generate a color from the miner's name
    //TODO bad style relying on library imported from html directly
    const color = sha256(b.miner).slice(0, 6)

    // Genesis block situation
    if (b.parent === "") {
      b.parent = "genesis";
    }

    const nodeString = `
      "${b.hash}"
      [label ="word:${b.word}
      nonce:${b.nonce}
      parent:${b.parent}",
      fillcolor="#${color}"];
    `;
    const edgeString = `"${b.hash}" -> "${b.parent}";`;
    return nodeString + edgeString;
  }
});
