"use strict";

// screen size of 550px, used for checking whether the page is rendered on a device smaller than 551px
// export let mql = window.matchMedia("(max-width: 550px)");

export const defaultColor = "#d7d6d7";

// default chosen color
export let chosenColor = defaultColor;

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

export let chair = defaultBaseColors;

export function configurateChair(urlParams) {
  if (urlParams === undefined) {
    // if there is saved "chair" object in the local storage, get it for later use; otherwise, use the "defaultBaseColors" object
    chair = JSON.parse(localStorage.getItem("chair")) || defaultBaseColors;
  } else {
    chair.back = urlParams.back;
    chair.seat = urlParams.seat;
    chair.seatBottom = urlParams.seatbottom;
    chair.features.casters = urlParams.casters === "true";
    chair.features.headrest = urlParams.headrest === "true";
    chair.features.armrests = urlParams.armrests === "true";
  }
}

// fetch basic chair svg picture
export async function loadSvg() {
  try {
    const response = await fetch("images/layers/base_cut-01.svg");
    const baseSvg = await response.text();
    return baseSvg;
  } catch (err) {
    // if svg could not be fetched, alert the message below
    alert("Error with fetching svg");
    // and print the error in the console
    console.log(err);
  }
}

// change the "chosenColor" variable
export function changeChosenColorVar(color) {
  chosenColor = color;
}

// reset the "chair" object to default (for the "restart" button)
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

// change feature property of "chair.features" object from true to false or from false to true
export function changeChairFeature(feature) {
  chair.features[feature] = !chair.features[feature];
}

export function generateLink(chosenColors) {
  // https://lelekaspb.github.io/chair-configurator/
  const back = chosenColors.back;
  const seat = chosenColors.seat;
  const seatbottom = chosenColors.seatBottom;
  const casters = chair.features.casters;
  const headrest = chair.features.headrest;
  const armrests = chair.features.armrests;
  const url = `https://baevastudios.com/advancedAnimation/chair-configurator/?back=${back}&seat=${seat}&seatbottom=${seatbottom}&casters=${casters}&headrest=${headrest}&armrests=${armrests}`;
  return url;
}

// get information about chair configuration stored in url parameters
export function getUrlParams() {
  const url = window.location;
  if (url.href.indexOf("?") !== -1) {
    const urlParams = new URLSearchParams(window.location.search);
    const chairViaLink = {
      back: urlParams.get("back"),
      seat: urlParams.get("seat"),
      seatbottom: urlParams.get("seatbottom"),
      casters: urlParams.get("casters"),
      headrest: urlParams.get("headrest"),
      armrests: urlParams.get("armrests"),
    };
    return chairViaLink;
  } else {
    return undefined;
  }
}
