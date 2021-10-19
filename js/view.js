"use strict";

// import everything from model.js file and call it "model" in this file
import * as model from "./model.js";

// object for storing css selectors for later use in querySelector method
export const DOMStrings = {
  seat: "#seat path",
  back: "#back path",
  seatBottom: "#seat_bottom path",
  colors: ".colors",
  restart: "#restart",
  save: "#save",
  option: ".option",
  contentContainer: ".content",
  extra: ".extra",
  selectedList: "#selected ul",
  preview: ".preview",
  linkButton: "#link_button",
  linkOutput: "#link_output",
  copyLinkButton: "#copy_link",
  selectedColor: ".selected_color",
  optionsHeader: ".options_header",
  optionsList: ".options",
};

// insert svg into DOM
export function insertSvg(dataSvg) {
  document.querySelector("#base").innerHTML = dataSvg;
}

// colorize chair parts with confugurable colors
export function colorizeSvg() {
  document.querySelector(DOMStrings.back).style.fill = model.chair.back;
  document.querySelector(DOMStrings.seat).style.fill = model.chair.seat;
  document.querySelector(DOMStrings.seatBottom).style.fill =
    model.chair.seatBottom;
}

// display saved in local storage features
export function renderFeatures() {
  // create array out of chair.features object in order to loop through it
  const featuresArray = Object.entries(model.chair.features);
  // loop through saved features
  for (const [key, value] of featuresArray) {
    // if value of the feature ("key") is false, add class "hide" to the corresponding image layer on the chair visualizer
    if (value === false) {
      document
        .querySelectorAll(`${DOMStrings.preview} img[data-feature="${key}"]`)
        .forEach((image) => {
          image.classList.add("hide");
        });
    } else {
      // if value of the feature ("key") is true, remove class "hide" to the corresponding image layer on the chair visualizer
      document
        .querySelectorAll(`${DOMStrings.preview} img[data-feature="${key}"]`)
        .forEach((image) => {
          image.classList.remove("hide");
        });
      // and add class "chosen" to the corresponding feature in options list
      document
        .querySelector(`${DOMStrings.option}[data-feature="${key}"]`)
        .classList.add("chosen");
      // add picture of selected feature to the selected features list
      document
        .querySelector(DOMStrings.selectedList)
        .append(createFeatureElement(key));
    }
  }
}

// change color of the chair part that was clicked on
export function changeColor(e) {
  e.target.style.fill = model.chosenColor;
  changeSelectedColor(e.target.closest("g").id);
}

function changeSelectedColor(chairPart) {
  document.querySelectorAll(DOMStrings.selectedColor).forEach((part) => {
    if (chairPart === part.dataset.part) {
      part.querySelector(".color").style.backgroundColor = model.chosenColor;
    }
  });
}

export function renderSelectedColors() {
  document.querySelector(
    `.selected_color[data-part="back"] .color`
  ).style.backgroundColor = model.chair.back;
  document.querySelector(
    `.selected_color[data-part="seat"] .color`
  ).style.backgroundColor = model.chair.seat;
  document.querySelector(
    `.selected_color[data-part="seat_bottom"] .color`
  ).style.backgroundColor = model.chair.seatBottom;
}

// remove "active" class from the previously chosen color and add it to the newly chosen one
export function changeActiveClass(element) {
  document.querySelector(".border.active").classList.remove("active");
  element.parentNode.classList.add("active");
}

// remove "chosen" class from all the feature options
export function resetChosenOptions() {
  document.querySelectorAll(DOMStrings.option).forEach((option) => {
    option.classList.remove("chosen");
  });
}

export function resetSelectedFeatures() {
  document.querySelector(`${DOMStrings.selectedList}`).innerHTML = "";
}

// Create featureElement to be appended to #selected ul
export function createFeatureElement(feature) {
  const li = document.createElement("li");
  li.dataset.feature = feature;

  const img = document.createElement("img");
  img.src = `images/features/feature-${feature}.png`;
  img.alt = capitalize(feature);

  const span = document.createElement("span");
  span.textContent = capitalize(feature);

  li.append(img);
  li.append(span);

  return li;
}

// capitalize string for alt attribute(s)
function capitalize(text) {
  return text.substring(0, 1).toUpperCase() + text.substring(1).toLowerCase();
}

// add animation that moves option feature to selected features
export function animateFeatureIn(firstFrame, lastFrame) {
  // - create FLIP-animation to animate featureElement from img in target, to
  //   its intended position
  setDeltas(firstFrame, lastFrame);

  document
    .querySelector(`${DOMStrings.selectedList} > li:last-child`)
    .classList.add("animate-feature");

  document
    .querySelector(`${DOMStrings.selectedList} > li:last-child`)
    .addEventListener("animationend", function (e) {
      e.target.classList.remove("animate-feature");
    });
}

// add animation that moves existing feature element from selected back to options
export function animateFeatureOut(existingFeatureElement, optionToAnimate) {
  // - create FLIP-animation to animate featureElement to img in target
  const firstFrame = existingFeatureElement.getBoundingClientRect();
  const lastFrame = optionToAnimate.getBoundingClientRect();
  setDeltas(firstFrame, lastFrame);
  optionToAnimate.classList.add("animate-feature");
  existingFeatureElement.querySelector("img").style.opacity = 0;
  existingFeatureElement.querySelector("span").style.opacity = 0;

  optionToAnimate.addEventListener("animationend", function () {
    // remove picture of selected feature from the selected features list
    optionToAnimate.classList.remove("animate-feature");
    existingFeatureElement.remove();
    existingFeatureElement.querySelector("img").style.opacity = 1;
    existingFeatureElement.querySelector("span").style.opacity = 1;
  });
}

// add translate X-axis and Y-axis values to CSS OM for use in animating feature images
export function setDeltas(firstFrame, lastFrame) {
  const deltaX = firstFrame.left - lastFrame.left;
  const deltaY = firstFrame.top - lastFrame.top;
  document
    .querySelector(DOMStrings.contentContainer)
    .setAttribute("style", `--deltaX: ${deltaX}px; --deltaY: ${deltaY}px`);
}

// toggle "chosen" class on a feature option
export function toggleChosenClass(element) {
  element.closest(DOMStrings.option).classList.toggle("chosen");
}

// toggle "hide" class on image visualizer layers
export function toggleHideClass(feature) {
  document
    .querySelectorAll(`${DOMStrings.preview} img[data-feature="${feature}"]`)
    .forEach((item) => {
      item.classList.toggle("hide");
    });
}

// add clicked feature to the selected features list
export function addFeature(element, feature) {
  // create new li for reflecting chosen feature in selected features
  const featureElement = createFeatureElement(feature);
  // record first position of the image for FLIP animation
  const firstFrame = element
    .closest(DOMStrings.option)
    .querySelector("img")
    .getBoundingClientRect();
  // add picture of selected feature to the selected features list
  document.querySelector(DOMStrings.selectedList).append(featureElement);
  // record last position of the image for FLIP animation
  const lastFrame = document
    .querySelector(`${DOMStrings.selectedList} > li:last-child`)
    .getBoundingClientRect();
  // add FLIP animation
  animateFeatureIn(firstFrame, lastFrame);
}

// remove clicked feature from the selected features list
export function removeFeature(element, feature) {
  const existingFeatureElement = document.querySelector(
    `${DOMStrings.selectedList} li[data-feature="${feature}"]`
  );
  const optionToAnimate = element
    .closest(DOMStrings.option)
    .querySelector(DOMStrings.extra);
  // add FLIP animation
  animateFeatureOut(existingFeatureElement, optionToAnimate);
}

// get chosen chair parts colors to be used in the controller module
export function getChairColors() {
  return {
    seat: document.querySelector(DOMStrings.seat).style.fill,
    back: document.querySelector(DOMStrings.back).style.fill,
    seatBottom: document.querySelector(DOMStrings.seatBottom).style.fill,
  };
}

// output link into input field
export function outputLink(url) {
  document.querySelector(DOMStrings.linkOutput).value = url;
  document
    .querySelector(DOMStrings.linkOutput)
    .addEventListener("blur", clearInput);
}

// copy link into clipboard
export function copyLink() {
  const copiedText = document.querySelector(DOMStrings.linkOutput);
  copiedText.select();
  navigator.clipboard.writeText(copiedText.value);
  // the link is now copied
}

function clearInput(e) {
  e.target.value = "";
}
