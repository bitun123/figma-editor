const canvas = document.getElementById("can");

const textBtn = document.getElementById("textBtn");
const rectBtn = document.getElementById("rectBtn");
let activeTool = null;
function activateTool(tool) {
  activeTool = tool;

  document
    .querySelectorAll(".tool-btn")
    .forEach((btn) => btn.classList.remove("active"));
  if (tool === "rectangle") rectBtn.classList.add("active");
  if (tool === "text") textBtn.classList.add("active");
}
rectBtn.onclick = () => activateTool("rectangle");
textBtn.onclick = () => activateTool("text");

// SideBar resize
function reSizeSidebar() {
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
}
reSizeSidebar();
/* ---------- Tool function ---------- */
// Rectangle Tool
function ractangleTool() {
  const propContent = document.querySelector(".prop-main-content");
  const emptyState = document.querySelector(".empty-state");

  const history = [];

  function saveState() {
    history.push({
      canvas: canvas.innerHTML,
      size: getSize(),
    });
    if (history.length > 30) history.shift();

    function getSize() {
      return Array.from(document.querySelectorAll(".rectangle")).map((div) => ({
        width: parseInt(div.style.width) || div.offsetWidth,
        height: parseInt(div.style.height) || div.offsetHeight,
      }));
    }
  }

  // console.log(history);
  document.addEventListener("keydown", (e) => {
    if (e.ctrlKey && e.key === "z") undo();
  });

  function undo() {
    if (!history.length) return;
    canvas.innerHTML = history.pop();
    rebindAll();
  }

  /* ---------------- DRAW RECTANGLES ---------------- */

  let startX = 0,
    startY = 0;
  let isDrawing = false;
  let currentRectangle = null;

  canvas.addEventListener("mousedown", (e) => {
    if (activeTool !== "rectangle") return;
    if (e.target.classList.contains("resize-handle")) return;

    deselectAll();

    const rect = canvas.getBoundingClientRect();
    startX = e.clientX - rect.left;
    startY = e.clientY - rect.top;

    const rectangle = document.createElement("div");
    rectangle.className = "rectangle selected";
    rectangle.style.left = startX + "px";
    rectangle.style.top = startY + "px";

    canvas.appendChild(rectangle);
    addResizeHandles(rectangle);
    enableResize(rectangle);
    enableMove(rectangle);
    enableSelect(rectangle);

    updateLayersPanel();
    currentRectangle = rectangle;
    isDrawing = true;

    saveState();
  });

  canvas.addEventListener("mousemove", (e) => {
    if (!isDrawing || !currentRectangle) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const w = x - startX;
    const h = y - startY;

    currentRectangle.style.width = Math.abs(w) + "px";
    currentRectangle.style.height = Math.abs(h) + "px";
    currentRectangle.style.left = (w < 0 ? x : startX) + "px";
    currentRectangle.style.top = (h < 0 ? y : startY) + "px";
  });

  canvas.addEventListener("mouseup", () => {
    isDrawing = false;
    currentRectangle = null;
  });

  /* ---------------- SELECTION ---------------- */

  function deselectAll() {
    document
      .querySelectorAll(".rectangle")
      .forEach((r) => r.classList.remove("selected"));
    updateLayersPanel();
  }

  function enableSelect(rect) {
    rect.addEventListener("mousedown", (e) => {
      if (e.target.classList.contains("resize-handle")) return;
      deselectAll();
      rect.classList.add("selected");
      updateLayersPanel();
      e.stopPropagation();
    });
  }

  /* ---------------- MOVE ---------------- */

  function enableMove(rect) {
    let startX,
      startY,
      startLeft,
      startTop,
      moving = false;

    rect.addEventListener("mousedown", (e) => {
      if (e.target.classList.contains("resize-handle")) return;

      moving = true;
      startX = e.clientX;
      startY = e.clientY;

      startLeft = rect.offsetLeft;
      startTop = rect.offsetTop;

      document.addEventListener("mousemove", (e) => {
        move(e);
      });
      document.addEventListener("mouseup", (e) => {
        stopMove(e);
      });
    });

    function move(e) {
      if (!moving) return;
      rect.style.left = startLeft + (e.clientX - startX) + "px";
      rect.style.top = startTop + (e.clientY - startY) + "px";
    }

    function stopMove(e) {
      moving = false;
      document.removeEventListener("mousemove", () => move(e));
      document.removeEventListener("mouseup", () => stopMove(e));
      saveState();
    }
  }

  /* ---------------- RESIZE ---------------- */

  function addResizeHandles(el) {
    ["se"].forEach((p) => {
      const h = document.createElement("div");
      h.className = "resize-handle " + p;
      el.appendChild(h);
    });
  }

  function enableResize(rect) {
    let dir, sx, sy, sw, sh, sl, st;

    rect.addEventListener("mousedown", (e) => {
      if (!e.target.classList.contains("resize-handle")) return;

      e.stopPropagation();
      dir = [...e.target.classList].find((c) => c.length <= 2);

      sx = e.clientX;
      sy = e.clientY;

      sw = rect.offsetWidth;
      sh = rect.offsetHeight;
      sl = rect.offsetLeft;
      st = rect.offsetTop;

      document.addEventListener("mousemove", resizeMove);
      document.addEventListener("mouseup", stopResize);
    });

    function resizeMove(e) {
      const dx = e.clientX - sx;
      const dy = e.clientY - sy;

      let nw = sw,
        nh = sh,
        nl = sl,
        nt = st;

      if (dir.includes("e")) nw = sw + dx;
      if (dir.includes("s")) nh = sh + dy;
      if (dir.includes("w")) {
        nw = sw - dx;
        nl = sl + dx;
      }
      if (dir.includes("n")) {
        nh = sh - dy;
        nt = st + dy;
      }

      if (nw > 10) {
        rect.style.width = nw + "px";
        rect.style.left = nl + "px";
      }
      if (nh > 10) {
        rect.style.height = nh + "px";
        rect.style.top = nt + "px";
      }
    }

    function stopResize() {
      document.removeEventListener("mousemove", resizeMove);
      document.removeEventListener("mouseup", stopResize);
      saveState();
    }
  }

  /* ---------------- REBIND AFTER UNDO ---------------- */

  function rebindAll() {
    document.querySelectorAll(".rectangle").forEach((rect) => {
      enableResize(rect);
      enableMove(rect);
      enableSelect(rect);
    });
  }

  const layerList = document.getElementById("layerList");
  let layerCounter = 1;

  function updateLayersPanel() {
    layerList.innerHTML = "";

    const rectangles = document.querySelectorAll(".rectangle");

    rectangles.forEach((rect, index) => {
      const li = document.createElement("li");
      li.className = "layer-item";
      li.textContent = "Rectangle " + (index + 1);

      if (rect.classList.contains("selected")) {
        li.classList.add("active");
      }

      li.addEventListener("click", () => {
        selectFromLayer(rect);
      });

      layerList.prepend(li);
    });
  }

  function updatePropertiesPanel(rect) {
    if (!rect) return;
    const x = rect.offsetLeft;
    const y = rect.offsetTop;
    const w = rect.offsetWidth;
    const h = rect.offsetHeight;
    propContent.innerHTML = `
    <div class="propContent">
    <div class="top-Content">
        <h1 class="first-h1">X: ${x}px</h1>
        <h1 class="second-h1">Y: ${y}px</h1>
    </div>
    <div class="bottomContent">
        <h1> W: ${w}px</h1>
        <h1> H: ${h}px</h1>
    </div>
    </div>
  `;
    emptyState.style.display = "none";
  }

  function selectFromLayer(rect) {
    deselectAll();
    rect.classList.add("selected");
    updateLayersPanel();
    updatePropertiesPanel(rect);
  }

  const bgPicker = document.querySelector("#bgPicker");

  bgPicker.addEventListener("input", (e) => {
    if (activeTool !== "rectangle") return;
    const rectangles = document.querySelectorAll(".rectangle.selected");
    rectangles.forEach((rect) => {
      rect.style.backgroundColor = e.target.value;
    });
  });
  const borderPicker = document.querySelector("#borderPicker");
  borderPicker.addEventListener("input", () => {
    if (activeTool !== "rectangle") return;
    const rectangles = document.querySelectorAll(".rectangle.selected");
    rectangles.forEach((rect) => {
      rect.style.borderColor = borderPicker.value;
    });
  });
}

ractangleTool();

//Text Tool

const textToolBtn = document.getElementById("textBtn");

let isDragging = false;
let currentBox = null;
let offsetX = 0;
let offsetY = 0;

canvas.addEventListener("dblclick", (e) => {
  if (activeTool !== "text") return;
  const box = document.createElement("div");
  box.className = "text-box";
  box.contentEditable = true;
  box.innerText = "";

  const text = canvas.getBoundingClientRect();
  box.style.left = e.clientX - text.left + "px";
  box.style.top = e.clientY - text.top + "px";
  canvas.appendChild(box);

  box.focus();
  makeDraggable(box);
});

const fontSizeSelect = document.getElementById("fontSizeSelect");
let textBox = null;

fontSizeSelect.addEventListener("input", () => {
  if (!textBox) return;

  const size = fontSizeSelect.value;

  if (size > 0) {
    textBox.style.fontSize = size + "px";
  }
});
const textColor = document.querySelector("#text-color");

textColor.addEventListener("input", () => {
  if (!textBox) return;

  textBox.style.color = textColor.value;
});

function makeDraggable(elem) {
  elem.addEventListener("click", () => {
    fontSizeSelect.value = parseInt(getComputedStyle(elem).fontSize);
  });
  elem.addEventListener("mousedown", (e) => {
    if (elem.contentEditable === "true") return;

    isDragging = true;
    currentBox = elem;
    textBox = elem;

    const rect = elem.getBoundingClientRect();
    offsetX = e.clientX - rect.left;
    offsetY = e.clientY - rect.top;

    // font size input sync
  });

  elem.addEventListener("dblclick", () => {
    elem.contentEditable = true;
    elem.focus();
  });

  elem.addEventListener("blur", () => {
    elem.contentEditable = false;
  });
  document.addEventListener("mousemove", (e) => {
    if (!isDragging || !currentBox) return;

    const rect = canvas.getBoundingClientRect();
    currentBox.style.left = e.clientX - rect.left - offsetX + "px";
    currentBox.style.top = e.clientY - rect.top - offsetY + "px";
  });

  document.addEventListener("mouseup", () => {
    isDragging = false;
    currentBox = null;
  });
}
