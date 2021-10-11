"use strict";

window.addEventListener("DOMContentLoaded", start);

const defaultColor = "#d7d6d7";

// default chosen color
let chosenColor = "#d7d6d7";

// default chosen colors and features parts
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

// if there is saved "chair" object in the local storage, get it for later use; otherwise, use the "defaultBaseColors" object
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

// colorize chair parts with confugurable colors
function colorizeSvg() {
  document.querySelector("#back path").style.fill = chair.back;
  document.querySelector("#seat path").style.fill = chair.seat;
  document.querySelector("#seat_bottom path").style.fill = chair.seatBottom;
}

// display saved in local storage features
function renderFeatures() {
  // create array out of chair.features object in order to loop through it
  const featuresArray = Object.entries(chair.features);

  // loop through saved features
  for (const [key, value] of featuresArray) {
    // if value of the feature ("key") is false, add class "hide" to the corresponding image layer on the chair visualizer
    if (value === false) {
      document
        .querySelectorAll(`.preview img[data-feature="${key}"]`)
        .forEach((image) => {
          image.classList.add("hide");
        });
    } else {
      // if value of the feature ("key") is true, remove class "hide" to the corresponding image layer on the chair visualizer
      document
        .querySelectorAll(`.preview img[data-feature="${key}"]`)
        .forEach((image) => {
          image.classList.remove("hide");
        });
      // and add class "chosen" to the corresponding feature in options list
      document
        .querySelector(`.option[data-feature="${key}"]`)
        .classList.add("chosen");
      // add picture of selected feature to the selected features list
      document.querySelector("#selected ul").append(createFeatureElement(key));
    }
  }
}

// add event listeners
function registerEventListeners() {
  // for svg parts
  document.querySelector("#seat_bottom").addEventListener("click", changeColor);
  document.querySelector("#seat").addEventListener("click", changeColor);
  document.querySelector("#back").addEventListener("click", changeColor);

  // for color palette
  document
    .querySelector(".colors")
    .addEventListener("click", changeCurrentColor);

  // for restart button
  document.querySelector("#restart").addEventListener("click", resetChair);

  // for save button
  document.querySelector("#save").addEventListener("click", saveConfiguration);

  // for all feature options
  document.querySelectorAll(".option").forEach((option) => {
    option.addEventListener("click", toggleFeature);
  });
}

// change color of the chair part that was clicked on
function changeColor(e) {
  e.target.style.fill = chosenColor;
}

// change the "chosenColor" variable
function changeCurrentColor(e) {
  if (e.target.classList.contains("color")) {
    chosenColor = e.target.dataset.color;
    // highlight the chosen color as active
    changeActiveClass(e.target);
  }
}

// reset chair configuration to default
function resetChair() {
  resetChairColors();
  renderFeatures();
  resetChosenOptions();
  resetSelectedFeatures();
}

// change chair parts' colors to default color
function resetChairColors() {
  // change the "chosenColor" variable
  chosenColor = defaultColor;
  // change chair object
  chair = defaultBaseColors;
  // colorize chair parts based on newly changed chair object
  colorizeSvg();
  // highlight the default color on the color palette
  changeActiveClass(
    document.querySelector(`.color[data-color="${defaultColor}"]`)
  );
}

// remove "chosen" class from all the feature options
function resetChosenOptions() {
  document.querySelectorAll(".option").forEach((option) => {
    option.classList.remove("chosen");
  });
}

function resetSelectedFeatures() {
  document.querySelector("#selected ul").innerHTML = "";
}

// remove "active" class from the previously chosen color and add it to the newly chosen one
function changeActiveClass(element) {
  document.querySelector(".border.active").classList.remove("active");
  element.parentNode.classList.add("active");
}

// save current configuration of the chair into local storage
function saveConfiguration() {
  // save the current configuration in the "chair" object
  updateChairObject();
  // update local storage
  updateLocalStarage("chair", chair);
}

// get colors from the svg and store them in the "chair" object
function updateChairObject() {
  chair.back = document.querySelector("#back path").style.fill;
  chair.seat = document.querySelector("#seat path").style.fill;
  chair.seatBottom = document.querySelector("#seat_bottom path").style.fill;
}

// save changed "chair" object in local storage
function updateLocalStarage(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

// toggle the feature option that was clicked on
function toggleFeature(e) {
  const feature = e.target.closest(".option").dataset.feature;

  // change the "chair" object
  chair.features[feature] = !chair.features[feature];

  // toggle the "chosen" class on the feature option
  e.target.closest(".option").classList.toggle("chosen");
  // un-hide the corresponding image layer on the visualizer
  document
    .querySelectorAll(`.preview img[data-feature="${feature}"]`)
    .forEach((item) => {
      item.classList.toggle("hide");
    });

  if (chair.features[feature]) {
    // create new li for reflecting chosen feature in selected features list
    const featureElement = createFeatureElement(feature);
    // record first position of the image for FLIP animation
    const firstFrame = e.target
      .closest(".option")
      .querySelector("img")
      .getBoundingClientRect();
    // add picture of selected feature to the selected features list
    document.querySelector("#selected ul").append(featureElement);
    // record last position of the image for FLIP animation
    const lastFrame = document
      .querySelector("#selected > ul > li:last-child")
      .getBoundingClientRect();
    // add FLIP animation
    animateFeatureIn(firstFrame, lastFrame);
  } else {
    const existingFeatureElement = document.querySelector(
      `#selected ul li[data-feature="${feature}"]`
    );
    const optionToAnimate = e.target.closest(".option").querySelector(".extra");
    // add FLIP animation
    animateFeatureOut(existingFeatureElement, optionToAnimate);
  }
}

// add animation that moves option feature to selected features
function animateFeatureIn(firstFrame, lastFrame) {
  // - create FLIP-animation to animate featureElement from img in target, to
  //   its intended position
  setDeltas(firstFrame, lastFrame);

  document
    .querySelector("#selected > ul > li:last-child")
    .classList.add("animate-feature");

  document
    .querySelector("#selected > ul > li:last-child")
    .addEventListener("animationend", function (e) {
      e.target.classList.remove("animate-feature");
    });
}

// add animation that moves existing feature element from selected back to options
function animateFeatureOut(existingFeatureElement, optionToAnimate) {
  // - create FLIP-animation to animate featureElement to img in target
  const firstFrame = existingFeatureElement.getBoundingClientRect();
  const lastFrame = optionToAnimate.getBoundingClientRect();
  setDeltas(firstFrame, lastFrame);
  optionToAnimate.classList.add("animate-feature");
  existingFeatureElement.querySelector("img").style.opacity = 0;

  optionToAnimate.addEventListener("animationend", function () {
    // remove picture of selected feature from the selected features list
    optionToAnimate.classList.remove("animate-feature");
    existingFeatureElement.remove();
    existingFeatureElement.querySelector("img").style.opacity = 1;
  });
}

function setDeltas(firstFrame, lastFrame) {
  const deltaX = firstFrame.left - lastFrame.left;
  const deltaY = firstFrame.top - lastFrame.top;
  document
    .querySelector(".content")
    .setAttribute("style", `--deltaX: ${deltaX}px; --deltaY: ${deltaY}px`);
}

// Create featureElement to be appended to #selected ul
function createFeatureElement(feature) {
  const li = document.createElement("li");
  li.dataset.feature = feature;

  const img = document.createElement("img");
  img.src = `images/features/feature-${feature}.png`;
  img.alt = capitalize(feature);

  li.append(img);

  return li;
}

function capitalize(text) {
  return text.substring(0, 1).toUpperCase() + text.substring(1).toLowerCase();
}
