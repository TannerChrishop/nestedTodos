var main = document.getElementById('main'), newItem = document.getElementById("newItem"), map = [];

// appends input box to selected list
function addToList(e) {

  if (e.target.id === "newItem") {

    e.target.parentNode.innerHTML = "<input onkeypress = 'captureInput(event)' id = 'todoItem' type = 'text'>";
  }
}

// captures user input and creates list item
function captureInput(e) {
  if (e.keyCode === 13) {

    var inputField = e.target, li = inputField.parentNode, plusLi = document.createElement('li');

    li.innerHTML = "";
    useMap(inputField.value, main, li, map);
    localStorage.setObj('map', map);
    parseMap(main, map);
  }
}

// appends new list to list item
function newList(e) {

  if (e.target.id === "newList") {

    var ul = e.target.parentNode.parentNode;

    useMap([], main, ul, map);
    localStorage.setObj('map', map);
    parseMap(main, map);
  }
}
// deletes clicked item and its children
function deleteItem(e) {

  if (e.target.id === "delete") {

    var li = e.target.parentNode;

    useMap(null, main, li, map);

    parseMap(main, map);

    localStorage.setObj('map', map);

  }
}

// updates array 'map' with a map of user input to store in localStorage
function useMap(value, ul, eventTarget, arr, prevArr) {

  for (var i = 0, olderSiblings = 0, olderSiblingArrays = 0; i < ul.children.length; i++) {

    if (i > 0 && ul.children[i - 1].children[2] && ul.children[i - 1].children[2].nodeName === "UL") {

      olderSiblingArrays++;
    }
    if (ul.children[i] === eventTarget) {

      if (Array.isArray(value)) return (arr.splice(i + olderSiblingArrays + 1, 0, value));

      else if (value === null) {

        if (prevArr === undefined) {

          if (main.children[i].children[2]) return arr.splice(i, main.children[i].children[2].children.length);

          else return arr.splice(i, 1);
          
        } else {

          var x = 1;

          if (Array.isArray(prevArr[i + 1 + olderSiblingArrays])) {

            x = prevArr[i - olderSiblings - olderSiblingArrays].length;

            prevArr[i+1].splice(i, x - i);
          }

          else return arr.splice(i + olderSiblingArrays, x);
        }
      } else return arr.splice(i + olderSiblings, 0, value);

    } else if (ul.children[i].children[2] && ul.children[i].children[2].nodeName === "UL") {

      if (prevArr !== arr) prevArr = arr;

      useMap(value, ul.children[i].children[2], eventTarget, arr[i + olderSiblingArrays + 1], prevArr);
    }
    olderSiblings++;
  }
}

// removes unneccessary plus signs 
function clearPlus(ul) {

  for (var k = 0; k < ul.children.length; k++) {

    var currentLi = ul.children[k];
    var liPlusSign = currentLi.children[0];

    if (liPlusSign && liPlusSign.id === 'newItem') ul.removeChild(currentLi);
  }
}

// parses array map stored in localStorage to recreate list in dom
function parseMap(ul, map) {

  ul.innerHTML = "";

  var siblingsArrays = 0;

  if (map.length === 0) {

    var plusLi = document.createElement('li');
    plusLi.innerHTML = "<span id = 'newItem'> + </span>";
    ul.appendChild(plusLi);
  }
  else {

    map.forEach(function (item, i) {

      var plusLi = document.createElement('li');
      plusLi.innerHTML = "<span id = 'newItem'> + </span>";

      clearPlus(ul);

      if (!Array.isArray(item)) {

        var mainLi = document.createElement('li');
        mainLi.innerHTML = "<span id = 'delete'> - </span>" + item + "<span> <img src = 'https://img.icons8.com/small/16/000000/down2.png' id = 'newList'/></span>";
        ul.appendChild(mainLi);

      } else {
        var nextUl = document.createElement('ul');
        nextUl.appendChild(plusLi);

        ul.children[i - siblingsArrays - 1].children[1].innerHTML = "";
        ul.children[i - siblingsArrays - 1].appendChild(nextUl);
        parseMap(ul.children[i - siblingsArrays - 1].children[2], item);
        siblingsArrays++;
      }
      ul.appendChild(plusLi);
    });
  }
}

// allows arrayed to be stored in localStorage
Storage.prototype.setObj = function (key, obj) {
  return this.setItem(key, JSON.stringify(obj));
};

Storage.prototype.getObj = function (key) {
  return JSON.parse(this.getItem(key));
};

if (localStorage.getObj('map')) {

  map = JSON.parse(localStorage.getItem('map'));
  parseMap(main, map);
}

// set up even listners
main.addEventListener('click', addToList);
main.addEventListener('click', newList);
main.addEventListener('click', deleteItem);

// clears localStorage and refreshes page
function reset() {

  localStorage.clear();
  location.reload();
}