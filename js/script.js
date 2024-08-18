// Variables

const debug = true;
let currentZ = 10;
let currentActiveWindow = "window1";
const applications = [];

// Classes

class ApplicationContent {
  constructor(id, title, content) {
    this.id = id;
    this.title = title;
    this.content = content;
  }
}

class Application {
  constructor(
    id,
    window,
    startButton,
    taskbarButton,
    minimizeButton,
    closeButton
  ) {
    this.id = id;
    this.window = window;
    this.startButton = startButton;
    this.taskbarButton = taskbarButton;
    this.minimizeButton = minimizeButton;
    this.closeButton = closeButton;
  }

  setActive(active) {
    if (active) {
      this.taskbarButton.classList.add("taskbar-active");
      this.window.classList.add("window-active");
      currentActiveWindow = this.id;
      this.setTaskbarVisible(true);
    } else {
      this.taskbarButton.classList.remove("taskbar-active");
      this.window.classList.remove("window-active");
    }
  }

  setTaskbarVisible(visible) {
    if (visible) {
      this.taskbarButton.style.display = "block";
    } else {
      this.taskbarButton.style.display = "none";
    }
  }
}

// Functions

function log(message) {
  if (debug) console.log(message);
}

function init() {
  const windows = setupWindows();

  const startButton = document.getElementById("start-button");
  startButton.addEventListener("click", () => {
    deactivateAllApps();
    currentActiveWindow = "start-menu";
  });

  windows.forEach((w) => {
    const id = `window${w.id}`;
    const app = new Application(
      id,
      document.getElementById(id),
      document.getElementById(`${id}-start-button`),
      document.getElementById(`${id}-taskbar-button`),
      document.getElementById(`${id}-minimize-button`),
      document.getElementById(`${id}-close-button`)
    );
    applications.push(app);

    app.taskbarButton.addEventListener("click", () => {
      openApp(app);
    });
    app.window.addEventListener("mousedown", () => {
      setActiveApp(app);
    });
    makeDraggable(app.window);
    app.startButton.addEventListener("click", () => {
      openApp(app);
    });
    app.minimizeButton.addEventListener("click", () => {
      toggleAppDisplay(app);
    });
    app.closeButton.addEventListener("click", () => {
      app.setTaskbarVisible(false);
      toggleAppDisplay(app);
    });
  });
  openApp(applications[0]);

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
}

function setupWindows() {
  const windowTemplate = (id, title, content) => `
    <div
      class="toggleableWindow"
      id="window${id}"
      ${id == 1 ? "style='top: 90px; left: 150px'" : ""}
    >
      <div
        class="toggleableWindow-header d-flex flex-row justify-content-between"
        id="window${id}-header"
      >
        <p>${title}</p>
        <div class="d-flex flex-row">
          <button id="window${id}-minimize-button" class="ml-1">
            <i class="fa-regular fa-window-minimize"></i>
          </button>
          <button id="window${id}-close-button" class="ml-1">
            <i class="fa-regular fa-x"></i>
          </button>
        </div>
      </div>
      ${content}
    </div>
  `;

  const window1Content = `
  <div class="windowContent">
    <p>Welcome to this random website!</p>
    <p>Have a look around 👀</p>
  </div>
  `;

  const window2Content = `
  <div class="windowContent" style="text-align: center">
    <img src="img/frog_circle.png" alt="" />
  </div>
  `;

  const window3Content = `
  <div class="windowContent">
    Lorem ipsum dolor sit amet consectetur adipisicing elit. Illum molestias
    quisquam dolores autem impedit accusantium magnam distinctio corrupti
    accusamus sunt.
  </div>
  `;

  const windows = [
    new ApplicationContent(1, "Welcome!", window1Content),
    new ApplicationContent(
      2,
      "FrogFrogFrogFrogFrogFrogFrogFrogFrogFrogFrog",
      window2Content
    ),
    new ApplicationContent(3, "Lorem Ipsum", window3Content),
  ];

  windows.forEach((w) => {
    document.getElementById("desktop").innerHTML += windowTemplate(
      w.id,
      w.title,
      w.content
    );
  });

  return windows;
}

function openApp(app) {
  // If app is not visible, show it and set active
  if (app.window.style.visibility != "visible") {
    toggleAppDisplay(app);
    setActiveApp(app);
  } else {
    // if it is the active window, minimize it
    if (currentActiveWindow == app.id) {
      toggleAppDisplay(app);
    } else {
      // if it is not the active window, set it as active
      setActiveApp(app);
    }
  }
}

function setActiveApp(app) {
  deactivateAllApps();
  app.setActive(true);
  app.window.style.zIndex = currentZ++;
}

function deactivateAllApps() {
  applications.forEach((app) => {
    app.setActive(false);
  });
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

function toggleAppDisplay(app) {
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

// Start the application

init();
