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

    var x = e.target, y = x.parentNode, plusLi = document.createElement('li');
    y.innerHTML = x.value + "<span id = 'newList'> * </span>";
    plusLi.innerHTML = "<span id = 'newItem'> + </span>";
    y.parentNode.appendChild(plusLi);
    useMap(x.value, main, y, map);
    localStorage.setObj('map', map);
  }
}

// appends new list to list item
function newList(e) {

  if (e.target.id === "newList") {

    e.target.innerHTML = "";
    var x = e.target.parentNode, ul = document.createElement('ul'), plusLi = document.createElement('li');
    plusLi.innerHTML = "<span id = 'newItem'> + </span>";
    x.appendChild(ul);
    ul.appendChild(plusLi);
    useMap([], main, x, map);
    localStorage.setObj('map', map);
  }
}

// updates array 'map' with a map of user input to store in localStorage
function useMap(value, domTree, eventTarget, arrDepth) {

  for (var i = 0, j = 0, w = 0; i < domTree.children.length; i++) {

    if (i > 0 && domTree.children[i - 1].children[1]) {

      w++;
    }
    if (domTree.children[i] === eventTarget) {

      if (Array.isArray(value)) {

        return (arrDepth.splice(i + w + 1, 0, value));
      } else {
        return arrDepth.splice(i + w + j, 0, value);
      }
    }
    else if (domTree.children[i].children[1] && domTree.children[i].children[1].nodeName === "UL") {

      useMap(value, domTree.children[i].children[1], eventTarget, arrDepth[i + w + 1]);
    }
    j++;
  }
}

// parses array map stored in localStorage to recreate list in dom
function parseMap(tree, map) {

  var l = 0;

  if (map.length === 0) {
    var plusLi = document.createElement('li');
    plusLi.innerHTML = "<span id = 'newItem'> + </span>";
    tree.appendChild(plusLi);
  }
  else {

    map.forEach(function (item, i) {

      var plusLi = document.createElement('li');
      plusLi.innerHTML = "<span id = 'newItem'> + </span>";

      for (var k = 0; k <= tree.children.length - 1; k++) {

        if (tree.children[k].children[0] && tree.children[k].children[0].id === 'newItem') {

          tree.removeChild(tree.children[k]);
        }
      }

      if (!Array.isArray(item)) {

        var mainLi = document.createElement('li');
        mainLi.innerHTML = item + "<span id = 'newList'> * </span>";
        tree.appendChild(mainLi);

      } else {
        var ul = document.createElement('ul');
        ul.appendChild(plusLi);
        tree.children[i - l - 1].children[0].innerHTML = "";
        tree.children[i - l - 1].appendChild(ul);
        parseMap(tree.children[i - l - 1].children[1], item);
        l++;
      }
      tree.appendChild(plusLi);
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

//set up even listners
main.addEventListener('click', addToList);
main.addEventListener('click', newList);