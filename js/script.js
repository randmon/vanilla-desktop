const nWindows = 3;
const debug = true;

let currentZ = 10;
let currentActiveWindow = "window1";

const log = (message) => {
  if (debug) console.log(message);
};

class Application {
  constructor(id, window, taskbarButton, minimizeButton) {
    this.id = id;
    this.window = window;
    this.taskbarButton = taskbarButton;
    this.minimizeButton = minimizeButton;
  }

  setActive(active) {
    if (active) {
      this.taskbarButton.classList.add("taskbar-active");
      this.window.classList.add("window-active");
      currentActiveWindow = this.id;
    } else {
      this.taskbarButton.classList.remove("taskbar-active");
      this.window.classList.remove("window-active");
    }
  }
}

const applications = [];
for (let i = 1; i <= nWindows; i++) {
  const id = `window${i}`;
  const app = new Application(
    id,
    document.getElementById(id),
    document.getElementById(`${id}-taskbar-button`),
    document.getElementById(`${id}-minimize-button`)
  );
  applications.push(app);

  app.taskbarButton.addEventListener("click", () => {
    taskbarButtonClicked(app);
  });
  app.minimizeButton.addEventListener("click", () => {
    toggleWindowDisplay(app);
  });
  app.window.addEventListener("mousedown", () => {
    setActiveApp(app);
  });
  makeDraggable(app.window);
}
setActiveApp(applications[0]);

function setActiveApp(app) {
  applications.forEach((a) => {
    a.setActive(false);
  });

  app.setActive(true);
  app.window.style.zIndex = currentZ++;
}

function makeDraggable(elmnt) {
  let pos1 = 0;
  let pos2 = 0;
  let pos3 = 0;
  let pos4 = 0;

  if (document.getElementById(`${elmnt.id}-header`)) {
    // if present, the header is where you move the DIV from:
    const header = document.getElementById(`${elmnt.id}-header`);
    header.onmousedown = dragMouseDown;
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

    document.onmousemove = startDragElement;
    document.onmouseup = stopDragElement;
  }

  function startDragElement(e) {
    e = e || window.event;
    e.preventDefault();
    // calculate the new cursor position:
    pos1 = pos3 - e.clientX;
    pos2 = pos4 - e.clientY;
    pos3 = e.clientX;
    pos4 = e.clientY;
    //Check max and min constraints
    const minY = 56;
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
    document.onmousemove = null;
    document.onmouseup = null;
  }
}

function taskbarButtonClicked(app) {
  // If app is not visible, show it and set active
  if (app.window.style.visibility != "visible") {
    toggleWindowDisplay(app);
    setActiveApp(app);
  } else {
    // if it is the active window, minimize it
    if (currentActiveWindow == app.id) {
      toggleWindowDisplay(app);
    } else {
      // if it is not the active window, set it as active
      setActiveApp(app);
    }
  }
}

function toggleWindowDisplay(app) {
  if (app.window.style.visibility != "visible") {
    log(`showing element [${app.window.id}]`);

    // put item in center of screen, 2/3 of screen height, if current position is not set
    if (app.window.style.top == "") {
      app.window.style.top = window.innerHeight / 3 + "px";
      app.window.style.left =
        window.innerWidth / 2 - app.window.offsetWidth / 2 + "px";
    }

    app.window.style.visibility = "visible";
    app.window.style.zIndex = currentZ++; // Overlay this item on top of everything else
    app.window.style.opacity = 1;

    setActiveApp(app);
  } else {
    log(`hiding element [${app.id}]`);
    app.window.style.opacity = "0";
    app.taskbarButton.classList.remove("taskbar-active");

    // wait for animation to finish before removing z-index
    setTimeout(() => {
      app.window.style.visibility = "hidden";
    }, 200);
  }
}

// Show desktop button hides all windows
const desktopButton = document.getElementById("desktop-button");
desktopButton.addEventListener("click", () => {
  applications.forEach((app) => {
    app.window.style.opacity = "0";
    app.taskbarButton.classList.remove("taskbar-active");

    setTimeout(() => {
      app.window.style.visibility = "hidden";
    }, 200);
  });
});

// on browser window resize, make sure windows are not out of bounds
window.addEventListener("resize", () => {
  applications.forEach((app) => checkWindowBounds(app.window));
});

function checkWindowBounds(windowElement) {
  // if window is out of bounds, move it back to center of screen
  const maxY = window.innerHeight - windowElement.offsetHeight;
  const maxX = window.innerWidth - windowElement.offsetWidth;
  if (windowElement.offsetTop > maxY) {
    windowElement.style.top = window.innerHeight / 3 + "px";
  }
  if (windowElement.offsetLeft > maxX) {
    windowElement.style.left =
      window.innerWidth / 2 - windowElement.offsetWidth / 2 + "px";
  }
}
