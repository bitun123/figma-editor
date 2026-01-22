let resizer = document.querySelector(".resize");
let sidebar = document.querySelector("#sidebar");
// resize the sidebar
function initResizerFn(resizer, sidebar) {
  let startX, startWidth;

  function re_mousedownHandler(e) {
    startX = e.clientX;
    startWidth = window.getComputedStyle(sidebar).width;
    startWidth = parseInt(startWidth, 10);
    document.addEventListener("mousemove", re_mousemoveHandler);
    document.addEventListener("mouseup", re_mouseupHandler);
  }

  function re_mousemoveHandler(e) {
    let dx = e.clientX - startX;
    let cw = startWidth - dx;

    const minWidth = 150;
    const maxWidth = 1200;

    cw = Math.max(minWidth, Math.min(maxWidth, cw));

    sidebar.style.width = cw + "px";
  }

  function re_mouseupHandler() {
    document.removeEventListener("mouseup", re_mouseupHandler);
    document.removeEventListener("mousemove", re_mousemoveHandler);
  }

  resizer.addEventListener("mousedown", re_mousedownHandler);
}
initResizerFn(resizer, sidebar);

// class sideBarResize {
//   constructor(resizer, sidebar) {
//     this.resizer = resizer;
//     this.sidebar = sidebar;
//     this.minWidth = 150;
//     this.maxWidth = 1200;
//     this.startX = 0;
//     this.startWidth = 0;

//     this.onMouseDown = this.onMouseDown.bind(this);
//     this.onMouseMove = this.onMouseMove.bind(this);
//     this.onMouseUp = this.onMouseUp.bind(this);
//     this.resizer.addEventListener("mousedown", this.onMouseDown);
//   }
//   onMouseDown(e) {
//     this.startX = e.clientX;
//     this.startWidth = window.getComputedStyle(this.sidebar).width;
//     this.startWidth = parseInt(this.startWidth, 10);
//     document.addEventListener("mousemove", this.onMouseMove);
//     document.addEventListener("mouseup", this.onMouseUp);
//   }

//   onMouseMove(e) {
//     let dx = e.clientX - this.startX;
//     let cw = this.startWidth - dx;

//     cw = Math.max(this.minWidth, Math.min(this.maxWidth, cw));

//     this.sidebar.style.width = cw + "px";
//   }
//   onMouseUp() {
//     this.resizer.removeEventListener("mouseup", this.onMouseUp);
//   }
// }

// const sideBarResize = new sideBarResize(resizer, sidebar);


// const toggleButton = document.querySelector(".toggle-button");
// toggleButton.addEventListener("click", () => {
//   sidebar.classList.toggle("collapsed");
// });
 

//ractangle area selection
// const canvas = document.querySelector("#canvas");
// let isDrawing = false;
// let startX = 0;
// let startY = 0;
// let selectionBox = null;

// canvas.addEventListener("mousedown",(e)=>{
// isDrawing = true;

// })



// const canvas = document.querySelector("#can");
// let startX = 0;
// let startY = 0;

// let isDrawing = false;

// let currentRactangle = null;

// let isMoving = false;

// let resizing = false;

// const history = [];

// function saveState() {
//   history.push(canvas.innerHTML);
// }

// canvas.addEventListener("mousedown",(e)=>{
// if(e.target.classList.contains("rectangle"))return;
// isDrawing = true;
// startX = e.offsetX;
// startY = e.offsetY;

// const ractangle = document.createElement("div");
// ractangle.classList.add("rectangle");
// ractangle.style.left = `${startX}px`
// ractangle.style.top = `${startY}px`


// const handleRact = document.createElement("div");
// handleRact.classList.add("handle");
// ractangle.appendChild(handleRact);

// canvas.appendChild(ractangle);
// currentRactangle = ractangle;

// saveState();

// })

const canvas = document.querySelector("#can");

let startX = 0;
let startY = 0;
let isDrawing = false;
let currentRectangle = null;

const history = [];

function saveState() {
  history.push(canvas.innerHTML);
}

canvas.addEventListener("mousedown", (e) => {
  if (e.target.classList.contains("rectangle")) return;

  const rect = canvas.getBoundingClientRect();

  startX = e.clientX - rect.left;
  startY = e.clientY - rect.top;

  isDrawing = true;

  const rectangle = document.createElement("div");
  rectangle.classList.add("rectangle");

  rectangle.style.left = `${startX}px`;
  rectangle.style.top = `${startY}px`;

  const handle = document.createElement("div");
  handle.classList.add("handle");
  rectangle.appendChild(handle);

  canvas.appendChild(rectangle);
  currentRectangle = rectangle;
});

canvas.addEventListener("mousemove", (e) => {
  if (!isDrawing || !currentRectangle) return;

  const rect = canvas.getBoundingClientRect();
  const currentX = e.clientX - rect.left;
  const currentY = e.clientY - rect.top;

  const width = currentX - startX;
  const height = currentY - startY;

  currentRectangle.style.width = `${Math.abs(width)}px`;
  currentRectangle.style.height = `${Math.abs(height)}px`;
  currentRectangle.style.left = `${width < 0 ? currentX : startX}px`;
  currentRectangle.style.top = `${height < 0 ? currentY : startY}px`;
});

// canvas.addEventListener("mouseup", () => {
//   isDrawing = false;
//   currentRectangle = null;
// });


// canvas.addEventListener("mousemove", (e) => {
//   if (!isDrawing || !currentRectangle) return;

//   const currentX = e.offsetX;
//   const currentY = e.offsetY;

//   const width = currentX - startX;
//   const height = currentY - startY;

//   currentRectangle.style.width = `${Math.abs(width)}px`;
//   currentRectangle.style.height = `${Math.abs(height)}px`;

//   currentRectangle.style.left = `${width < 0 ? currentX : startX}px`;
//   currentRectangle.style.top = `${height < 0 ? currentY : startY}px`;
// });

canvas.addEventListener("mouseup", () => {
  if (isDrawing) {
    saveState();
  }

  isDrawing = false;
  currentRectangle = null;
});
