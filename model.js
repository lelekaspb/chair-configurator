"use strict";

export const defaultColor = "#d7d6d7";

// default chosen color
export let chosenColor = "#d7d6d7";

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
export let chair =
  JSON.parse(localStorage.getItem("chair")) || defaultBaseColors;

// fetch basic chair svg picture
export async function loadSvg() {
  try {
    const response = await fetch("images/layers/base_cut-01.svg");
    const baseSvg = await response.text();
    // pass it further for displaying and adding event listeners
    // renderUI(baseSvg);
    return baseSvg;
  } catch (err) {
    // if svg could not be fetched, alert the message below
    alert("Error with fetching svg");
    // and print the error in the console
    console.log(err);
  }
}

export function changeChosenColorVar(color) {
  chosenColor = color;
}

export function resetChairToDefault() {
  chair = defaultBaseColors;
}

// get colors from the svg and store them in the "chair" object
export function updateChairObject(chosenColorsObject) {
  chair.back = chosenColorsObject.back;
  chair.seat = chosenColorsObject.seat;
  chair.seatBottom = chosenColorsObject.seatBottom;
}

// save changed "chair" object in local storage
export function updateLocalStarage(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

export function changeChairFeature(feature) {
  chair.features[feature] = !chair.features[feature];
}
