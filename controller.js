"use strict";

// import everything from model.js file and call it "model" in this file
import * as model from "./model.js";
// import everything from view.js file and call it "view" in this file
import * as view from "./view.js";

// initiate app when DOM contents are loaded
async function start() {
  const svgData = await model.loadSvg();
  renderUI(svgData);
}

// controlling function for inserting svg into DOM, giving it default color, rendering color palette, and adding event listeners
function renderUI(svgData) {
  view.insertSvg(svgData);
  view.colorizeSvg();
  view.renderFeatures();
  registerEventListeners();
}

// add event listeners
function registerEventListeners() {
  // for svg parts
  document
    .querySelector(view.DOMStrings.seatBottom)
    .addEventListener("click", view.changeColor);
  document
    .querySelector(view.DOMStrings.seat)
    .addEventListener("click", view.changeColor);
  document
    .querySelector(view.DOMStrings.back)
    .addEventListener("click", view.changeColor);

  // for color palette
  document
    .querySelector(view.DOMStrings.colors)
    .addEventListener("click", changeCurrentColor);

  // for restart button
  document
    .querySelector(view.DOMStrings.restart)
    .addEventListener("click", resetChair);

  // for save button
  document
    .querySelector(view.DOMStrings.save)
    .addEventListener("click", saveConfiguration);

  // for all feature options
  document.querySelectorAll(view.DOMStrings.option).forEach((option) => {
    option.addEventListener("click", toggleFeature);
  });
}

// change the "chosenColor" variable
function changeCurrentColor(e) {
  if (e.target.classList.contains("color")) {
    model.changeChosenColorVar(e.target.dataset.color);
    // highlight the chosen color as active
    view.changeActiveClass(e.target);
  }
}

// reset chair configuration to default
function resetChair() {
  // color the chair with default color
  resetChairColors();
  // remove all features
  view.renderFeatures();
  // remove highlight on all options (features)
  view.resetChosenOptions();
  // clear the selected features ul
  view.resetSelectedFeatures();
}

// change chair parts' colors to default color
function resetChairColors() {
  // change the "chosenColor" variable
  model.changeChosenColorVar(model.defaultColor);
  // change chair object
  model.resetChairToDefault();
  // colorize chair parts based on newly changed chair object
  view.colorizeSvg();
  // highlight the default color on the color palette
  view.changeActiveClass(
    document.querySelector(`.color[data-color="${model.defaultColor}"]`)
  );
}

// save current configuration of the chair into local storage
function saveConfiguration() {
  // save the current configuration in the "chair" object
  const chosenColors = view.getChairColors();
  model.updateChairObject(chosenColors);
  // update local storage
  model.updateLocalStarage("chair", model.chair);
}

// toggle the feature option that was clicked on
function toggleFeature(e) {
  const feature = e.target.closest(view.DOMStrings.option).dataset.feature;

  // change the "chair" object
  model.changeChairFeature(feature);

  // toggle the "chosen" class on the feature option
  view.toggleChosenClass(e.target);
  // un-hide the corresponding image layer on the visualizer
  view.toggleHideClass(feature);

  // if the feature was changed to true, animate adding the feature to the selected features list
  if (model.chair.features[feature]) {
    view.addFeature(e.target, feature);
  } else {
    // if the feature was changed to false, animate removing the feature from the selected features list
    view.removeFeature(e.target, feature);
  }
}

// start the app
start();
