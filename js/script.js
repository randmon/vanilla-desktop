const amountWindows = 3;
const debug = false;
let currentZ = 10;

// https://www.w3schools.com/howto/howto_js_draggable.asp
// Make the windows draggable:
for (let i = 1; i <= amountWindows; i++) {
  const window = document.getElementById(`window${i}`);
  dragElement(window);
}

const log = (message) => {if (debug) console.log(message);};

function dragElement(elmnt) {
  let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
  if (document.getElementById(`${elmnt.id}header`)) {
    // if present, the header is where you move the DIV from:
    let header = document.getElementById(`${elmnt.id}header`);
    header.onmousedown = dragMouseDown;
    // when click on header, set z-index to currentZ
    header.onclick = function () {};
  } else {
    // otherwise, move the DIV from anywhere inside the DIV:
    elmnt.onmousedown = dragMouseDown;
  }

  function dragMouseDown(e) {
    e = e || window.event;
    e.preventDefault();
    // get the mouse cursor position at startup:
    pos3 = e.clientX;
    pos4 = e.clientY;

    elmnt.style.zIndex = currentZ++;
    log(currentZ);

    document.onmouseup = stopDragElement;
    document.onmousemove = elementDrag;
  }

  function elementDrag(e) {
    e = e || window.event;
    e.preventDefault();
    // calculate the new cursor position:
    pos1 = pos3 - e.clientX;
    pos2 = pos4 - e.clientY;
    pos3 = e.clientX;
    pos4 = e.clientY;
    //Check max and min constraints
    const minY = 46;
    const minX = 0;
    const maxY = window.innerHeight - elmnt.offsetHeight;
    const maxX = window.innerWidth - elmnt.offsetWidth;
    if (elmnt.offsetTop - pos2 < minY) {
      pos2 = elmnt.offsetTop - minY;
    }
    if (elmnt.offsetLeft - pos1 < minX) {
      pos1 = elmnt.offsetLeft - minX;
    }
    if (elmnt.offsetTop - pos2 > maxY) {
      pos2 = elmnt.offsetTop - maxY;
    }
    if (elmnt.offsetLeft - pos1 > maxX) {
      pos1 = elmnt.offsetLeft - maxX;
    }
    // set the element's new position:
    elmnt.style.top = elmnt.offsetTop - pos2 + "px";
    elmnt.style.left = elmnt.offsetLeft - pos1 + "px";
  }

  function stopDragElement() {
    // stop moving when mouse button is released:
    document.onmouseup = null;
    document.onmousemove = null;
  }
}

// Make the windows minimizable:

for (let i = 1; i <= amountWindows; i++) {
  const windowName = "window" + i;
  const window = document.getElementById(windowName);
  const windowToggle = document.getElementById(`${windowName}-taskbar-button`);
  windowToggle.addEventListener("click", () => toggleWindowDisplay(window));
  window.childNodes[1].childNodes[3].childNodes[1].addEventListener(
    "click",
    () => toggleWindowDisplay(window)
  );
}

function toggleWindowDisplay(elmnt) {
  if (elmnt.style.visibility != "visible") {
    log(`showing element [${elmnt.id}]`);

    // put item in center of screen, 2/3 of screen height, if current position is not set
    if (elmnt.style.top == "") {
      elmnt.style.top = window.innerHeight / 3 + "px";
      elmnt.style.left = window.innerWidth / 2 - elmnt.offsetWidth / 2 + "px";
    }

    elmnt.style.visibility = "visible";
    elmnt.style.zIndex = currentZ++; // Overlay this item on top of everything else
    elmnt.style.opacity = 1;
  } else {
    log(`hiding element [${elmnt.id}]`);
    elmnt.style.opacity = "0";
    // wait for animation to finish before removing z-index
    setTimeout(() => {
      elmnt.style.visibility = "hidden";
    }, 200);
  }
}

let desktopButton = document.getElementById("desktopButton");
desktopButton.addEventListener("click", () => {
  for (let i = 1; i <= amountWindows; i++) {
    const window = document.getElementById("window" + i);
    window.style.opacity = "0";
    setTimeout(() => {
      window.style.visibility = "hidden";
    }, 200);
  }
});

// on window resize, make sure windows are not out of bounds
window.addEventListener("resize", () => {
  for (let i = 1; i <= amountWindows; i++) {
    const window = document.getElementById("window" + i);
    checkWindowBounds(window);
  }
});

function checkWindowBounds(elmnt) {
  // if window is out of bounds, move it back to center of screen
  const maxY = window.innerHeight - elmnt.offsetHeight;
  const maxX = window.innerWidth - elmnt.offsetWidth;
  if (elmnt.offsetTop > maxY) {
    elmnt.style.top = window.innerHeight / 3 + "px";
  }
  if (elmnt.offsetLeft > maxX) {
    elmnt.style.left = window.innerWidth / 2 - elmnt.offsetWidth / 2 + "px";
  }
}

const homeButton = document.getElementById("home-button");
