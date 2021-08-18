// Start location will be in the following format:
window.onload = () => {
  localStorage.clear();
};
window.addEventListener("load", function () {
  document.querySelector("#leading-msg").innerHTML = "Pick Starting point";
  document.getElementsByClassName("grid-container")[0].style.pointerEvents =
    "auto";
});
document
  .getElementById("obstacles-btn")
  .addEventListener("click", generateObstacles);
document.getElementById("clear-btn").addEventListener("click", clearBoard);
document
  .getElementById("start-btn")
  .addEventListener("click", findShortestPath);

let board = document.getElementsByClassName("grid-container")[0];
let gridSize = 36;
let noPath = false;

for (let row = 0; row < gridSize; row++) {
  for (let col = 0; col < gridSize; col++) {
    board.innerHTML += `<div class="grid-item ${row}-${col}" onclick="clickedBox"></div>`;
  }
}
let boxes = document.querySelectorAll("body > main > div > div.grid-item");
for (let i = 0; i < boxes.length; i++) {
  const box = boxes[i];
  box.addEventListener("click", clickedBox);
}

var grid = [];
for (var i = 0; i < gridSize; i++) {
  grid[i] = [];
  for (var j = 0; j < gridSize; j++) {
    grid[i][j] = "Empty";
  }
}

var findShortestPath = function (startCoordinates, grid) {
  let graph_Obstacles = JSON.parse(localStorage.getItem("obstacles"));

  graph_Obstacles.forEach((obstacle) => {
    let str = obstacle.split("-");
    let dft = parseInt(str[0]);
    let dfl = parseInt(str[1]);
    grid[dft][dfl] = "Obstacle";
  });
  var distanceFromTop = startCoordinates[0];
  var distanceFromLeft = startCoordinates[1];

  // Each "location" will store its coordinates
  // and the shortest path required to arrive there
  var location = {
    distanceFromTop: distanceFromTop,
    distanceFromLeft: distanceFromLeft,
    path: [],
    cords: [],
    status: "Start",
  };

  // Initialize the queue with the start location already inside
  var queue = [location];
  let orangeBoxes = [];

  // Loop through the grid searching for the goal
  while (queue.length > 0) {
    // Take the first location off the queue

    var currentLocation = queue.shift();
    let currentGridBox = `${currentLocation.distanceFromTop}-${currentLocation.distanceFromLeft}`;

    // Explore North
    var newLocation = exploreInDirection(currentLocation, "North", grid);
    if (newLocation.status === "Goal") {
      localStorage.setItem("visited", JSON.stringify(orangeBoxes));
      return newLocation.path;
    } else if (newLocation.status === "Valid") {
      orangeBoxes.push(currentGridBox);
      queue.push(newLocation);
    }

    // Explore East
    var newLocation = exploreInDirection(currentLocation, "East", grid);
    if (newLocation.status === "Goal") {
      localStorage.setItem("visited", JSON.stringify(orangeBoxes));
      return newLocation.path;
    } else if (newLocation.status === "Valid") {
      orangeBoxes.push(currentGridBox);
      queue.push(newLocation);
    }

    // Explore South
    var newLocation = exploreInDirection(currentLocation, "South", grid);
    if (newLocation.status === "Goal") {
      localStorage.setItem("visited", JSON.stringify(orangeBoxes));
      return newLocation.path;
    } else if (newLocation.status === "Valid") {
      orangeBoxes.push(currentGridBox);
      queue.push(newLocation);
    }

    // Explore West
    var newLocation = exploreInDirection(currentLocation, "West", grid);
    if (newLocation.status === "Goal") {
      localStorage.setItem("visited", JSON.stringify(orangeBoxes));
      return newLocation.path;
    } else if (newLocation.status === "Valid") {
      orangeBoxes.push(currentGridBox);
      queue.push(newLocation);
    }
  }
  noPathFound();
  // No valid path found
  return false;
};

// This function will check a location's status
// (a location is "valid" if it is on the grid, is not an "obstacle",
// and has not yet been visited by our algorithm)
// Returns "Valid", "Invalid", "Blocked", or "Goal"
var locationStatus = function (location, grid) {
  var gridSize = grid.length;
  var dft = location.distanceFromTop;
  var dfl = location.distanceFromLeft;

  if (
    location.distanceFromLeft < 0 ||
    location.distanceFromLeft >= gridSize ||
    location.distanceFromTop < 0 ||
    location.distanceFromTop >= gridSize
  ) {
    // location is not on the grid--return false
    return "Invalid";
  } else if (grid[dft][dfl] === "Goal") {
    return "Goal";
  } else if (grid[dft][dfl] !== "Empty") {
    // location is either an obstacle or has been visited
    return "Blocked";
  } else {
    return "Valid";
  }
};

// Explores the grid from the given location in the given
// direction
var exploreInDirection = function (currentLocation, direction, grid) {
  var newPath = currentLocation.path.slice();
  newPath.push(direction);

  var dft = currentLocation.distanceFromTop;
  var dfl = currentLocation.distanceFromLeft;

  if (direction === "North") {
    dft -= 1;
  } else if (direction === "East") {
    dfl += 1;
  } else if (direction === "South") {
    dft += 1;
  } else if (direction === "West") {
    dfl -= 1;
  }
  let coordinates = [].push(`${dft}-${dfl}`);

  var newLocation = {
    distanceFromTop: dft,
    distanceFromLeft: dfl,
    path: newPath,
    cords: coordinates,
    status: "Unknown",
  };

  newLocation.status = locationStatus(newLocation, grid);

  // If this new location is valid, mark it as 'Visited'
  if (newLocation.status === "Valid") {
    var firstOut = `${newLocation.distanceFromTop}-${newLocation.distanceFromLeft}`;
    setTimeout(() => {
      document.getElementsByClassName(firstOut)[0].style.backgroundColor =
        "orange";
    }, 2);
    grid[newLocation.distanceFromTop][newLocation.distanceFromLeft] = "Visited";
  }

  return newLocation;
};

// OK. We have the functions we need--let's run them to get our shortest path!

// Create a 4x4 grid
// Represent the grid as a 2-dimensional array

document
  .getElementById("start-btn")
  .addEventListener("click", visualiseAlgorithm);
function visualiseAlgorithm() {
  
  let startTime = performance.now();
  
  // SETTING START NODE AND END NODE

  let startNode = localStorage.getItem("start").split("-");
  let dft1 = parseInt(startNode[0]);
  let dfl1 = parseInt(startNode[1]);
  grid[dft1][dfl1] = "Start";

  let endNode = localStorage.getItem("goal").split("-");
  let dft2 = parseInt(endNode[0]);
  let dfl2 = parseInt(endNode[1]);
  grid[dft2][dfl2] = "Goal";

  let path = findShortestPath([dft1, dfl1], grid);
  let gridPath = getDirections(path, `${dft1}-${dfl1}`);

  gridPath.forEach((grid) => {
    setTimeout(() => {
      document.getElementsByClassName(grid)[0].style.backgroundColor = "green";
      document
        .getElementsByClassName(grid)[0]
        .classList.add("animate__animated", "animate__heartBeat");
      document.getElementsByClassName(
        `${dft1}-${dfl1}`
      )[0].style.backgroundColor = "pink";
      document.getElementsByClassName(
        `${dft2}-${dfl2}`
      )[0].style.backgroundColor = "blue";
    }, 3);
  });
  let endTime = performance.now();
  let executionTime = endTime - startTime
  document.getElementsByClassName('finish-time')[0].innerHTML=`Finish Time : ${parseInt(executionTime)}ms`
  
}
// GETS grid coordinates in accordance to shortest path
function getDirections(path, startNode) {
  let newCoord = [startNode];
  let str = startNode.split("-");
  let dft = parseInt(str[0]);
  let dfl = parseInt(str[1]);

  // CONVERTING PATH OF DIRECTION TO GRID COORDINATES
  for (let i = 0; i < path.length; i++) {
    const direction = path[i];
    if (direction === "North") {
      dft -= 1;
      newCoord.push(`${dft}-${dfl}`);
    } else if (direction === "East") {
      dfl += 1;
      newCoord.push(`${dft}-${dfl}`);
    } else if (direction === "South") {
      dft += 1;
      newCoord.push(`${dft}-${dfl}`);
    } else if (direction === "West") {
      dfl -= 1;
      newCoord.push(`${dft}-${dfl}`);
    }
  }
  return newCoord;
}
// WHEN CLICKING ON GRID BOX FOR FIRST TIME IT MARKS THE START NODE
// SECOND CLICK MARKS THE END NODE
// ANY CLICK AFTER THAT MARKS WALLS OR OBSTACLES
function clickedBox(e) {
  const box = e.target;

  let obstacles = [];
  let str = box.classList[1].split("-");
  let dft = parseInt(str[0]);
  let dfl = parseInt(str[1]);
  if (localStorage.getItem("startNode") == undefined) {
    localStorage.setItem("startNode", true);
    box.style.backgroundColor = "green";
    localStorage.setItem("start", `${dft}-${dfl}`);
    document.querySelector("#leading-msg").innerHTML = "Pick Ending Point";
  } else if (localStorage.getItem("endNode") == undefined) {
    localStorage.setItem("endNode", true);
    box.style.backgroundColor = "blue";
    document.getElementById("obstacles-btn").disabled = false;

    localStorage.setItem("goal", `${dft}-${dfl}`);
  } else if (localStorage.getItem("obstacles") == undefined) {
    if (
      box.classList[1] != localStorage.getItem("start") ||
      box.classList[1] != localStorage.getItem("goal")
    ) {
      box.style.backgroundColor = "black";
    }

    obstacles.push(`${dft}-${dfl}`);
    localStorage.setItem("obstacles", JSON.stringify(obstacles));
    document.getElementById("start-btn").disabled = false;
  } else {
    if (
      box.classList[1] != localStorage.getItem("start") ||
      box.classList[1] != localStorage.getItem("goal")
    ) {
      box.style.backgroundColor = "black";
    }
    obstacles = JSON.parse(localStorage.getItem("obstacles"));
    obstacles.push(`${dft}-${dfl}`);
    localStorage.setItem("obstacles", JSON.stringify(obstacles));
    document.querySelector("#leading-msg").innerHTML = "Create Obstacles";
  }
}
function clearBoard() {
  
  localStorage.clear();
  boxes.forEach((box) => {
    box.style.backgroundColor = "white";
  });
  for (var i = 0; i < gridSize; i++) {
    grid[i] = [];
    for (var j = 0; j < gridSize; j++) {
      grid[i][j] = "Empty";
    }
  }
  let board = document.getElementsByClassName("grid-container")[0];
  board.style.opacity = "100%";
  document.getElementsByClassName('finish-time')[0].innerHTML=`Finish Time : `
  document.getElementsByClassName("nopath-msg")[0].style.display = "none";
  document.getElementById("start-btn").disabled = true;
  document.getElementById("obstacles-btn").disabled = true;


}
// GENERATES RANDOM OBSTACLES AROUND THE TILE
function generateObstacles() {
  let start = localStorage.getItem("start");
  let goal = localStorage.getItem("goal");
  const max_obs = 5;
  for (let j = 0; j < max_obs; j++) {
    for (let i = 0; i < 50; i++) {
      let dft = Math.floor(Math.random() * gridSize);
      let dfl = Math.floor(Math.random() * gridSize);
      let obstacles = [];
      if (`${dft}-${dfl}` != start || `${dft}-${dfl}` != goal) {
        document.getElementsByClassName(
          `${dft}-${dfl}`
        )[0].style.backgroundColor = "black";
        grid[dft][dfl] = "Obstacle";
        obstacles.push(`${dft}-${dfl}`);
        localStorage.setItem("obstacles", JSON.stringify(obstacles));
        document.getElementById("start-btn").disabled = false;
      }
    }
  }
}

function noPathFound() {
  let board = document.getElementsByClassName("grid-container")[0];
  board.style.opacity = "50%";
  document.getElementsByClassName("nopath-msg")[0].style.display = "block";
  
  
}
