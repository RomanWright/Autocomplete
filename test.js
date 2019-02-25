'use strict';
var autocomplete = function(current, wordList) {
  var winnowed = [];
  wordList.forEach(function(word) {
    if(current != '' && word.includes(current)) {
      winnowed.push(word);
    }
  })
  return winnowed;
};
var highlight = function(input, word) {
  var wordBits = [];
  while (typeof word == "string" && word.includes(input)) {
    var index = word.indexOf(input);
    wordBits.push(word.substring(0, index));
    wordBits.push("<span class='bold'>" + word.substring(index, index + input.length) + "</span>");
    word = word.substring(index + input.length);
    if(!word.includes(input)) {
      wordBits.push(word);
    }
  }
  var combined = '';
  wordBits.forEach(function(wBit) {
    combined += wBit;
  })
  return combined;
};
var display = function(textBox, ul, displayList) {
  var index = textBox.getAttribute("index");
  ul.innerHTML = '';
  for (var i = 0, len = displayList.length; i < len; i++) {
    var highlighted = highlight(textBox.value, displayList[i])
    if (i == index) {
      highlighted = "<span class = 'selected'>" + highlighted + "</span>";
    }
    var li = document.createElement("li");
    li.innerHTML = highlighted;
    li.setAttribute("textvalue", displayList[i]);
    setupClick(textBox, li, ul, displayList)
    ul.appendChild(li);
  }
};
var setupClick = function(textBox, li, ul, displayList) {
  li.addEventListener("click", function(event) {
    textBox.value = li.getAttribute("textvalue");
    textBox.setAttribute("index", 0)
    var winnowed = autocomplete(textBox.value, displayList);
    //display(textBox, ul, winnowed);
    ul.innerHTML = '';
  })
};
(function(){
  var fruits = ["apple", "banana", "grape", "orange", "grapefruit"];
  var winnowed = [];
  var textBox = document.getElementById("textinput");
  var suggestions = document.getElementById("suggestions");
  textBox.setAttribute("index", 0);
  textBox.addEventListener("keydown", myControlListener);
  textBox.addEventListener("input", myInputListener);
  function myControlListener(event) {
    winnowed = autocomplete(textBox.value, fruits);
    var index = textBox.getAttribute("index");
    switch (event.key) {
      case "ArrowDown":
        if (index < winnowed.length - 1) {
          index++;
        } else {
          index = 0;
        }
        event.preventDefault();
        break;
      case "ArrowUp":
        if (index > 0) {
          index--;
        } else {
          index = winnowed.length - 1;
        }
        event.preventDefault();
        break;
      case "Enter":
        if (winnowed.length == 0) {
          alert("no matching fruit");
          return;
        }
        textBox.value = winnowed[index];
        winnowed = autocomplete(textBox.value, fruits);
        textBox.setAttribute("index", index);
        suggestions.innerHTML = '';
        return;
      default:
        return;
    }
    textBox.setAttribute("index", index);
    display(textBox, suggestions, winnowed);
  }
  function myInputListener(event) {
    textBox.setAttribute("index", 0);
    winnowed = autocomplete(textBox.value, fruits);
    display(textBox, suggestions, winnowed);
  }
})();