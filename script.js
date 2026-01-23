let activeTool = null;

const canvas = document.getElementById("can");
const rectBtn = document.getElementById("rectBtn");
const textBtn = document.getElementById("textBtn");

/* ---------- Sidebar resize ---------- */

const resizer = document.querySelector(".resize");
const sidebar = document.querySelector("#sidebar");

function initResizerFn(resizer, sidebar) {
  let startX, startWidth;

  resizer.addEventListener("mousedown", (e) => {
    startX = e.clientX;
    startWidth = parseInt(window.getComputedStyle(sidebar).width, 10);

    document.addEventListener("mousemove", resizeMove);
    document.addEventListener("mouseup", resizeUp);
  });

  function resizeMove(e) {
    const dx = e.clientX - startX;
    let newWidth = startWidth - dx;
    newWidth = Math.max(150, Math.min(600, newWidth));
    sidebar.style.width = newWidth + "px";
  }

  function resizeUp() {
    document.removeEventListener("mousemove", resizeMove);
    document.removeEventListener("mouseup", resizeUp);
  }
}

initResizerFn(resizer, sidebar);

/* ---------- Tool system ---------- */


function ractangleTool() {
function activateTool(tool) {
  activeTool = tool;

  document.querySelectorAll(".tool-btn").forEach(btn =>
    btn.classList.remove("active")
  );

  if (tool === "rectangle") {
    rectBtn.classList.add("active");
  }

  if(tool ==="text"){
    textBtn.classList.add("active");
  }
}
rectBtn.addEventListener("click", () => {
  activateTool("rectangle");
});
textBtn.addEventListener("click", () => {
  activateTool("text");
});



let startX = 0;
let startY = 0;
let isDrawing = false;
let currentRectangle = null;

canvas.addEventListener("mousedown", (e) => {
  if (activeTool !== "rectangle") return;

  const rect = canvas.getBoundingClientRect();
  startX = e.clientX - rect.left;
  startY = e.clientY - rect.top;


  isDrawing = true;

  const rectangle = document.createElement("div");
  rectangle.className = "rectangle";
  rectangle.style.left = startX + "px";
  rectangle.style.top = startY + "px";



  canvas.appendChild(rectangle);
  currentRectangle = rectangle;
});

canvas.addEventListener("mousemove", (e) => {
  if (!isDrawing || !currentRectangle) return;

  const rect = canvas.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;

  const width = x - startX;
  const height = y - startY;

  currentRectangle.style.width = Math.abs(width) + "px";
  currentRectangle.style.height = Math.abs(height) + "px";
  currentRectangle.style.left = (width < 0 ? x : startX) + "px";
  currentRectangle.style.top = (height < 0 ? y : startY) + "px";
});

canvas.addEventListener("mouseup", () => {
  isDrawing = false;
  currentRectangle = null;
});

}
ractangleTool();


// function addResizeHandles(el) {
//   const positions = ["nw","n","ne","e","se","s","sw","w"];

//   positions.forEach(pos => {
//     const h = document.createElement("div");
//     h.className = "resize-handle " + pos;
//     el.appendChild(h);
//   });
// }
