// https://www.w3schools.com/howto/howto_js_draggable.asp
// Make the DIV element draggable:
let window1 = document.getElementById("window1");
let window2 = document.getElementById("window2");
let window3 = document.getElementById("window3");
dragElement(window1);
dragElement(window2);
dragElement(window3);

function dragElement(elmnt) {
    var pos1 = 0,
        pos2 = 0,
        pos3 = 0,
        pos4 = 0;
    if (document.getElementById(elmnt.id + "header")) {
        // if present, the header is where you move the DIV from:
        let header = document.getElementById(elmnt.id + "header");
        header.onmousedown = dragMouseDown;
        // when click on header, set z-index to currentZ
        header.onclick = function() {}
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
        console.log(currentZ);

        document.onmouseup = closeDragElement;
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
        elmnt.style.top = (elmnt.offsetTop - pos2) + "px";
        elmnt.style.left = (elmnt.offsetLeft - pos1) + "px";
    }

    function closeDragElement() {
        // stop moving when mouse button is released:
        document.onmouseup = null;
        document.onmousemove = null;
    }
}

let currentZ = 10;

let window1Toggle = document.getElementById("window1Toggle");
window1Toggle.addEventListener("click", () => toggleWindowDisplay(window1));
window1.childNodes[1].childNodes[3].childNodes[1].addEventListener("click", () => toggleWindowDisplay(window1));

let window2Toggle = document.getElementById("window2Toggle");
window2Toggle.addEventListener("click", () => toggleWindowDisplay(window2));
window2.childNodes[1].childNodes[3].childNodes[1].addEventListener("click", () => toggleWindowDisplay(window2));

let window3Toggle = document.getElementById("window3Toggle");
window3Toggle.addEventListener("click", () => toggleWindowDisplay(window3));
window3.childNodes[1].childNodes[3].childNodes[1].addEventListener("click", () => toggleWindowDisplay(window3));

// make nav link show and hide the window
function toggleWindowDisplay(elmnt) {
    if (elmnt.style.visibility != "visible") {
        console.log("showing element");

        // put item in center of screen, 2/3 of screen height, if current position is not set
        if (elmnt.style.top == "") {
            elmnt.style.top = (window.innerHeight / 3) + "px";
            elmnt.style.left = (window.innerWidth / 2) - (elmnt.offsetWidth / 2) + "px";
        }

        elmnt.style.visibility = "visible";
        elmnt.style.zIndex = currentZ++; // Overlay this item on top of everything else
        elmnt.style.opacity = 1;
        console.log(currentZ);
    } else {
        console.log("hiding element");
        elmnt.style.opacity = "0";
        // wait for animation to finish before removing z-index
        setTimeout(() => {
            elmnt.style.visibility = "hidden";
        }, 200);
    }
}

let desktopButton = document.getElementById("desktopButton");
desktopButton.addEventListener("click", () => {
    window1.style.opacity = "0";
    window2.style.opacity = "0";
    window3.style.opacity = "0";
    setTimeout(() => {
        window1.style.visibility = "hidden";
        window2.style.visibility = "hidden";
        window3.style.visibility = "hidden";
    }, 200);
});

// on window resize, make sure windows are not out of bounds
window.addEventListener("resize", () => {
    checkWindowBounds(window1);
    checkWindowBounds(window2);
    checkWindowBounds(window3);
});

function checkWindowBounds(elmnt) {
    // if window is out of bounds, move it back to center of screen
    const maxY = window.innerHeight - elmnt.offsetHeight;
    const maxX = window.innerWidth - elmnt.offsetWidth;
    if (elmnt.offsetTop > maxY) {
        elmnt.style.top = (window.innerHeight / 3) + "px";
    }
    if (elmnt.offsetLeft > maxX) {
        elmnt.style.left = (window.innerWidth / 2) - (elmnt.offsetWidth / 2) + "px";
    }
}

let homeMenu = document.getElementById("homeMenu");