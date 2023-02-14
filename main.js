const colorPicker = document.getElementById("colorPicker")
const picker = document.getElementById("picker")
const menuButton = document.getElementById("menuButton")
const menu = document.querySelector(".menu")
const screen = document.querySelector(".screen")
const controller = document.querySelector(".controller")
const controllerIconsArea = document.querySelector(".controller-icons-area")
const colorButtons = document.querySelectorAll(".color")
const framesContainer = document.querySelector(".frames-area")
const framesArea = document.querySelector(".frames")
const frame = document.querySelectorAll(".frame")
const objectsArea = document.querySelector(".objectsArea")
const object = document.querySelector("#object")
const trace = document.querySelector("#trace")
const fpsInput = document.querySelector("#fps")

const frameCount = document.querySelector("#frameCount")

const addButton = document.getElementById("add")
const addPanel = document.querySelector(".add-panel")

const trashButtons = document.querySelectorAll(".trash-icons")


eventListeners()

function eventListeners() {



    window.addEventListener("load", e => {
        setPicker()
        updateFrameCount()
    })

    document.addEventListener("keyup", e => {
        if (e.key == "d") {
            forward(false)
            currentFrame()
        } else if (e.key == "a") {
            backward()
        } else if (e.keyCode === 32) {
            forward(true)
        }
    })


    addButton.addEventListener("mouseenter", showAddPanel)
    addButton.addEventListener("mouseleave", hideAddPanel)
    addPanel.addEventListener("mouseleave", () => addPanel.classList.add("hidden"))


    addPanel.addEventListener("click", e => {
        if (e.target.id == "newFrame") {
            addFrame()
            updateFrameCount()
        } else if (e.target.id == "newObject") {
            addObject()
        }
    })

    // for(var i = 0; i < framesArea.children.length;) {
    //     framesArea.children[i].addEventListener("mouseenter", showTrashButton)
    //     framesArea.children[i].addEventListener("mouseleave", showTrashButton)
    //     i++
    // }

    fpsInput.addEventListener("change", getFps)


    screen.addEventListener("mousedown", dontShowController)

    screen.addEventListener("mouseup", viewableController)

    menuButton.addEventListener("click", showMenu)

    picker.addEventListener("input", pickerChange)

    for (let colorButton of colorButtons) {
        colorButton.addEventListener("click", changeBackground)
    }


    controller.addEventListener("mouseenter", showController)
    controller.addEventListener("mouseleave", hideController)

    controllerIconsArea.addEventListener("click", e => {
        if (e.target.id == "playButton") {
            startAnimation()
        } else if (e.target.id == "forwardButton") {
            forward(false)
        } else if (e.target.id == "backwardButton") {
            backward()
        }
    })


    object.addEventListener('mousedown', dragObject, false);
    objectsArea.addEventListener('mouseup', dropObject, false);

}



// function showAddPanel(e) {
//     addPanel.classList.toggle("hidden")
// }

function showAddPanel() {
    addPanel.classList.remove("hidden")
}
function hideAddPanel() {
    if (!addPanel.matches(":hover")) {
        addPanel.classList.add("hidden")
    }
}

function showTrashButton(e) {
    if (e.target.classList.contains("frame")) {
        e.target.firstElementChild.classList.toggle("hidden")
    }

}




function setPicker() {
    picker.value = "#ff00ff"
    colorPicker.style.backgroundColor = picker.value
    // framesArea.firstElementChild.classList.add("selected")
    // addListeners()
}
function changeBackground(e) {
    const color = getComputedStyle(e.target).getPropertyValue("--color")
    const r = hexToRgb(color).r
    const g = hexToRgb(color).g
    const b = hexToRgb(color).b
    screen.style.backgroundColor = `rgba(${r}, ${g}, ${b}, 1)`
}
function pickerChange(e) {
    colorPicker.style.backgroundColor = e.target.value
    const color = e.target.value
    const r = hexToRgb(color).r
    const g = hexToRgb(color).g
    const b = hexToRgb(color).b
    screen.style.backgroundColor = `rgba(${r}, ${g}, ${b}, 1)`
}


function dontShowController(e) {
    if (!e.target.classList.contains("controller-icons") && !e.target.classList.contains("controller-icons-area"))
        controller.classList.add("events-none")
}
function viewableController() {
    controller.classList.remove("events-none")
}



function showController() {
    controllerIconsArea.classList.add("show")
}
function hideController() {
    if (!controllerIconsArea.matches(":hover")) {
        controllerIconsArea.classList.remove("show")
    }
}



function showMenu() {
    menu.classList.toggle("active")
}






function updateFrameCount() {
    frameCount.textContent = "Frame sayısı: " + framesArea.children.length
}


function dragObject(e) {
    objectsArea.addEventListener('mousemove', divMove, true);
}

let lastPosition = {
    x: object.offsetLeft,
    y: object.offsetTop
}

function divMove(e) {
    let offset = objectsArea.getBoundingClientRect();


    let pos = {
        x: (e.pageX - offset.left) - 25,
        y: (e.pageY - offset.top) - 25
    }

    objectLocation(pos)

    lastPosition = pos

}
function dropObject() {
    objectsArea.removeEventListener('mousemove', divMove, true);
}



function hexToRgb(hex) {
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : null;
}



function getFps(e) {
    return fpsInput.value
}

function startAnimation() {
    const fps = getFps()
    const frameCount = framesArea.children.length

    const time = 1000 / fps

    var i = 0;                  //  set your counter to 1

    function myLoop() {
        setTimeout(function () {
            let locationData
            let frames = getFrames()



            // if (framesArea.children[i].dataset.location != "") {
            //     locationData = JSON.parse(framesArea.children[i].dataset.location)
            // } else {
            //     locationData = lastPosition
            // }
            // playEffect(i)

            if (frames[i].dataset.location != "") {
                objectLocation(JSON.parse(frames[i].dataset.location))

            } else {

            }
            i++;
            if (i < frameCount) {
                myLoop();
            }
        }, time)
    }

    myLoop();
}



function getFrames() {
    let frames = []
    for (let i = 0; i < framesArea.children.length;) {
        frames.push(framesArea.children[i])
        i++
    }

    return frames.length < 1 ? "empty" : frames

}
function currentFrame(direct) {
    let frames = getFrames()
    let selectedFrame

    if (frames == "empty") {
        return "empty"
    } else {
        for (let frame of frames) {
            if (frame.classList.contains("selected")) {
                selectedFrame = frame
            }
        }
        return selectedFrame
    }



}
function forward(save) {
    let selectedFrame = currentFrame()
    let nextSibling = selectedFrame.nextElementSibling

    if(selectedFrame != "empty") {
        if(nextSibling != null) {
            selectedFrame.classList.remove("selected")
            nextSibling.classList.add("selected")
        } else {
            nextSibling = selectedFrame
        }

        if(nextSibling.dataset.location != "" && nextSibling != selectedFrame) {
            objectLocation(JSON.parse(nextSibling.dataset.location))
        } 
    }

    if(save) {
        selectedFrame.classList.add("filled")
        saveLocation(selectedFrame, lastPosition)
        traceLocation(JSON.parse(selectedFrame.dataset.location))
    }


}
function backward() {
    let selectedFrame = currentFrame()
    let previousSibling = selectedFrame.previousElementSibling || null
    let secondPreviousSibling = previousSibling != null ? previousSibling.previousElementSibling : null

    if(selectedFrame != "empty") {
        if(previousSibling != null) {
            if(previousSibling.dataset.location != "") {
                objectLocation(JSON.parse(previousSibling.dataset.location))
            }
            selectedFrame.classList.remove("selected")
            previousSibling.classList.add("selected")
            if(secondPreviousSibling != null && secondPreviousSibling.dataset.location != "") {
                traceLocation(JSON.parse(secondPreviousSibling.dataset.location))
            }
        } else {
            previousSibling = selectedFrame
        }
    }
}


function selectFrame(e) {
    let frames = getFrames()

    if(e.target.classList.contains("frame")) {
        for(let frame of frames) {
            if(frame.classList.contains("selected")) {
                frame.classList.remove("selected")
            }
        }
    
        e.target.classList.add("selected")

        objectLocation(JSON.parse(e.target.dataset.location))
        if(e.target.previousElementSibling != null && e.target.previousElementSibling.dataset.location != "") {
            traceLocation(JSON.parse(e.target.previousElementSibling.dataset.location))
        }
    }

    
}




function saveLocation(selectedFrame, lastPosition) {
    selectedFrame.dataset.location = JSON.stringify(lastPosition)
}

function traceLocation(locationData) {
    trace.style.top = locationData.y + "px"
    trace.style.left = locationData.x + "px"
}

function objectLocation(locationData) {
    object.style.top = locationData.y + "px"
    object.style.left = locationData.x + "px"
}




function addFrame() {
    framesArea.innerHTML += `<div onmouseover="showTrashButton(event)" onmouseout="showTrashButton(event)" onclick="selectFrame(event)" class="frame" data-location="">
    <i onclick="deleteFrame(event)" class="fa-regular hidden trash-icons fa-trash-can"></i>
    
</div>`
}

function deleteFrame(e) {
    e.target.parentElement.remove()
    updateFrameCount()
}

// function addObject() {

// }

// function saveAnimationToStorage(selectedFrame) {
//     // Yarın burdan devam et
// }