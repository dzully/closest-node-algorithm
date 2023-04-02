// Initialize the application
const screen = document.querySelector("#screen");
// get all the shapes on the screen
const shapes = [...document.querySelectorAll(".circle, .ellipse, .square")];

// create an array to store the positions of the shapes
let positions = [];

// loop through the shapes and store their positions
for (const shape of shapes) {
  // store the position of the shape
  positions.push({
    x: shape.offsetLeft,
    y: shape.offsetTop,
    width: shape.offsetWidth,
    height: shape.offsetHeight,
  });
}

// add event listeners to the shapes
for (const shape of shapes) {
  // add event listener to the shape
  shape.addEventListener("mousedown", startDragging);
}

// create a variable to store the active shape
let activeShape = null;
// create a variable to store the closest shape
let closestShape = null;

// create a function to start dragging
function startDragging(e) {
  // set the active shape to the shape that was clicked
  activeShape = e.target;
  // set the z-index of the active shape to 1
  activeShape.style.zIndex = 1;
  // set the opacity of the active shape to 0.5
  activeShape.style.opacity = 0.5;

  // add event listeners to the document
  document.addEventListener("mousemove", dragShape);
  document.addEventListener("mouseup", stopDragging);
}

// create a function to drag the shape
function dragShape(e) {
  // if there is no active shape, return
  if (activeShape === null) {
    return;
  }

  // get the x and y coordinates of the mouse
  const x = e.clientX - activeShape.offsetWidth / 2;
  const y = e.clientY - activeShape.offsetHeight / 2;

  // get the screen rectangle
  const screenRect = screen.getBoundingClientRect();

  // get the max x and y coordinates
  const maxX = screenRect.width - activeShape.offsetWidth;
  const maxY = screenRect.height - activeShape.offsetHeight;

  // set the left and top of the active shape
  activeShape.style.left = `${clamp(x, 0, maxX)}px`;
  activeShape.style.top = `${clamp(y, 0, maxY)}px`;

  // get the closest shape
  closestShape = null;
  // set the closest distance to the max safe integer
  let closestDistance = Number.MAX_SAFE_INTEGER;

  // loop through the shapes
  for (const shape of shapes) {
    // if the shape is not the active shape
    if (shape !== activeShape) {
      // get the distance between the active shape and the shape
      const distance = getDistance(activeShape, shape);
      // if the distance is less than the closest distance
      if (distance < closestDistance) {
        // set the closest distance to the distance
        closestDistance = distance;
        closestShape = shape;
      }
    }
  }

  // if the closest shape is not null
  if (closestShape !== null) {
    // get the closest rectangle
    const closestRect = closestShape.getBoundingClientRect();
    // get the active rectangle
    const activeRect = activeShape.getBoundingClientRect();
    // get the distance between the closest shape and the active shape
    const distanceXLeft = closestRect.left - activeRect.left;
    const distanceYTop = closestRect.top - activeRect.top;
    const distanceXRight = closestRect.right - activeRect.right;
    const distanceCenterX =
      closestRect.left +
      closestRect.width / 2 -
      activeRect.left -
      activeRect.width / 2;

    // if the distance is less than 20 pixels
    const distanceBottom = closestRect.bottom - activeRect.bottom;
    if (Math.abs(distanceXRight) < 10) {
      activeShape.style.left = `${activeRect.left + distanceXRight - 10}px`;
    }

    if (Math.abs(distanceBottom) < 10) {
      activeShape.style.bottom = `${activeRect.bottom + distanceBottom - 10}px`;
    }

    if (Math.abs(distanceCenterX) < 10) {
      activeShape.style.left = `${activeRect.left + distanceCenterX - 8}px`;
    }

    if (Math.abs(distanceXLeft) < 20) {
      activeShape.style.left = `${activeRect.left + distanceXLeft - 8}px`;
    }

    if (Math.abs(distanceYTop) < 20) {
      activeShape.style.top = `${activeRect.top + distanceYTop - 7}px`;
    }
  }

  const screenCenter = getScreenCenter();
  // Get the rectangle that bounds the active shape
  const activeRect = activeShape.getBoundingClientRect();
  // Calculate the distance between the center of the screen and the center of the active shape
  const distanceX = screenCenter.x - activeRect.left - activeRect.width / 2;
  const distanceY = screenCenter.y - activeRect.top - activeRect.height / 2;
  // If the distance between the center of the screen and the center of the active shape is less than 20 pixels in either the x or y direction
  if (Math.abs(distanceX) < 20 && Math.abs(distanceY) < 20) {
    // Set the position of the active shape to the center of the screen
    activeShape.style.left = `${screenCenter.x - activeRect.width / 2}px`;
    activeShape.style.top = `${screenCenter.y - activeRect.height / 2 - 10}px`;
  }
}

// create a function to clamp a value between a min and max
function getScreenCenter() {
  // Get the rectangle that bounds the screen
  const screenRect = screen.getBoundingClientRect();
  // Return an object with the x and y coordinates of the center of the screen
  return {
    x: screenRect.left + screenRect.width / 2,
    y: screenRect.top + screenRect.height / 2,
  };
}

// create a function to clamp a value between a min and max
function stopDragging() {
  if (activeShape === null) {
    return;
  }

  // remove event listeners from the document
  activeShape.style.zIndex = 0;
  activeShape.style.opacity = 1;
  activeShape = null;

  // remove event listeners from the document
  savePositions();
}

// create a function to save the positions of the shapes
function savePositions() {
  // create an array to store the positions
  positions = [];
  // loop through the shapes
  for (const shape of shapes) {
    // push the position of the shape to the positions array
    positions.push({
      x: shape.offsetLeft,
      y: shape.offsetTop,
      width: shape.offsetWidth,
      height: shape.offsetHeight,
    });
  }
}

// create a function to load the positions of the shapes
function getDistance(a, b) {
  // get the rectangles that bound the shapes
  const aRect = a.getBoundingClientRect();
  const bRect = b.getBoundingClientRect();

  // get the center of the rectangles
  const aCenter = {
    x: aRect.left + aRect.width / 2,
    y: aRect.top + aRect.height / 2,
  };
  const bCenter = {
    x: bRect.left + bRect.width / 2,
    y: bRect.top + bRect.height / 2,
  };

  // return the distance between the centers of the rectangles
  return Math.sqrt((aCenter.x - bCenter.x) ** 2 + (aCenter.y - bCenter.y) ** 2);
}

// create a function to load the positions of the shapes
function clamp(value, min, max) {
  // return the value clamped between the min and max
  return Math.min(Math.max(value, min), max);
}

// create a function to load the positions of the shapes
screen.addEventListener("mousemove", highlightClosestShape);

// create a function to load the positions of the shapes
function highlightClosestShape(e) {
  if (activeShape === null) {
    return;
  }

  // get the closest shape
  let closestDistance = Number.MAX_SAFE_INTEGER;
  // create a variable to store the closest shape
  let newClosestShape = null;
  // loop through the shapes
  for (const shape of shapes) {
    // if the shape is not the active shape
    if (shape !== activeShape) {
      // get the distance between the closest shape and the active shape
      const distance = getDistance(activeShape, shape);
      // if the distance is less than the closest distance
      if (distance < closestDistance) {
        closestDistance = distance;
        newClosestShape = shape;
      }
    }
  }
  // if the closest shape is not null and the closest shape is not the new closest shape
  if (closestShape !== null && closestShape !== newClosestShape) {
    // remove the border from the closest shape
    closestShape.style.border = "none";
  }
  // if the new closest shape is not null
  if (newClosestShape !== null) {
    // add a border to the new closest shape
    newClosestShape.style.border = "2px solid purple";
  }

  // set the closest shape to the new closest shape
  closestShape = newClosestShape;
}

// This function is called when the page is loaded and ready to be manipulated
document.querySelector("#reset").addEventListener("click", () => {
  // loop through the shapes
  for (let i = 0; i < shapes.length; i++) {
    const shape = shapes[i];
    const position = positions[i];
    shape.style.left = `${position.x}px`;
    shape.style.top = `${position.y}px`;
    shape.style.width = `${position.width}px`;
    shape.style.height = `${position.height}px`;
    shape.style.border = "none";
  }
});
