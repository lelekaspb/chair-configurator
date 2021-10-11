window.addEventListener("DOMContentLoaded", start);

const defaultColor = "#d7d6d7";

// default chosen color
let chosenColor = "#d7d6d7";

// default chosen colors for chair parts
const defaultBaseColors = {
  back: chosenColor,
  seat: chosenColor,
  seatBottom: chosenColor,
  features: {
    headrest: false,
    armrests: false,
    casters: false,
  },
};

// if there is saved "shoe" object in the local storage, get it for later use; otherwise, use the "defaultShoe" object
let chair = JSON.parse(localStorage.getItem("chair")) || defaultBaseColors;

// initiate app when DOM contents are loaded
function start() {
  loadSvg();
}

// fetch basic chair svg picture
async function loadSvg() {
  try {
    const response = await fetch("images/layers/base_cut-01.svg");
    const baseSvg = await response.text();
    // pass it further for displaying and adding event listeners
    renderUI(baseSvg);
  } catch (err) {
    // if svg could not be fetched, alert the message below
    alert("Error with fetching svg");
    // and print the error in the console
    console.log(err);
  }
}

// controlling function for inserting svg into DOM, giving it default color, rendering color palette, and adding event listeners
function renderUI(dataSvg) {
  insertSvg(dataSvg);
  colorizeSvg();
  renderFeatures();
  registerEventListeners();
}

// insert svg into DOM
function insertSvg(dataSvg) {
  document.querySelector("#base").innerHTML = dataSvg;
}

function colorizeSvg() {
  document.querySelector("#back path").style.fill = chair.back;
  document.querySelector("#seat path").style.fill = chair.seat;
  document.querySelector("#seat_bottom path").style.fill = chair.seatBottom;
}

function renderFeatures() {
  const featuresArray = Object.entries(chair.features);

  for (const [key, value] of featuresArray) {
    if (value === false) {
      document
        .querySelectorAll(`.preview img[data-feature="${key}"]`)
        .forEach((image) => {
          image.classList.add("hide");
        });
    } else {
      document
        .querySelectorAll(`.preview img[data-feature="${key}"]`)
        .forEach((image) => {
          image.classList.remove("hide");
        });
      document
        .querySelector(`.option[data-feature="${key}"]`)
        .classList.add("chosen");
    }
  }
}

// add event listeners
function registerEventListeners() {
  document.querySelector("#seat_bottom").addEventListener("click", changeColor);
  document.querySelector("#seat").addEventListener("click", changeColor);
  document.querySelector("#back").addEventListener("click", changeColor);

  document
    .querySelector(".colors")
    .addEventListener("click", changeCurrentColor);

  document.querySelector("#restart").addEventListener("click", resetChair);

  document.querySelector("#save").addEventListener("click", saveConfiguration);

  document.querySelectorAll(".option").forEach((option) => {
    option.addEventListener("click", toggleFeature);
  });
}

function changeColor(e) {
  e.target.style.fill = chosenColor;
}

function changeCurrentColor(e) {
  if (e.target.classList.contains("color")) {
    chosenColor = e.target.dataset.color;
    changeActiveClass(e.target);
  }
}

function resetChair() {
  resetChairColors();
  renderFeatures();
  resetChosenOptions();
}

function resetChairColors() {
  chosenColor = defaultColor;
  chair = defaultBaseColors;
  colorizeSvg();
  changeActiveClass(
    document.querySelector(`.color[data-color="${defaultColor}"]`)
  );
}

function resetChosenOptions() {
  document.querySelectorAll(".option").forEach((option) => {
    option.classList.remove("chosen");
  });
}

function changeActiveClass(element) {
  document.querySelector(".border.active").classList.remove("active");
  element.parentNode.classList.add("active");
}

function saveConfiguration() {
  updateChairObject();
  updateLocalStarage("chair", chair);
}

function updateChairObject() {
  chair.back = document.querySelector("#back path").style.fill;
  chair.seat = document.querySelector("#seat path").style.fill;
  chair.seatBottom = document.querySelector("#seat_bottom path").style.fill;
}

// save changed colors array or shoe object in local storage
function updateLocalStarage(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

function toggleFeature(e) {
  e.target.closest(".option").classList.toggle("chosen");
  const feature = e.target.closest(".option").dataset.feature;
  document
    .querySelectorAll(`.preview img[data-feature="${feature}"]`)
    .forEach((item) => {
      item.classList.toggle("hide");
    });

  chair.features[feature] = !chair.features[feature];
}
