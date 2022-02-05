"use strict";

const xArrays = [];
const yArrays = [];
const average = [];

let leftSpotMarker;
let topSpotMarker;
let leftZoomMarker;
let topZoomMarker;

const calcAverage = function () {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    chrome.tabs.sendMessage(tabs[0].id, { message: "cord" }, (response) => {
      const xyArrays = response.toString().split(",").map(Number);
      average.length = 0; // Empty Array

      for (let i = 0; i < xyArrays.length; i++) {
        if (i < xyArrays.length / 2) {
          xArrays.push(xyArrays[i]); // First half of the xyArrays is X Co-ordinates
        } else {
          yArrays.push(xyArrays[i]); // Second half of the xyArrays is Y Co-ordinates
        }
      }

      let xSum = 0; // Initiate and reset xSum
      let ySum = 0; // Initiate and reset ySum

      for (let i = 0; i < xArrays.length; i++) {
        xSum += xArrays[i];
      }
      for (let i = 0; i < yArrays.length; i++) {
        ySum += yArrays[i];
      }
      const xAverage = xSum / xArrays.length;
      const yAverage = ySum / yArrays.length;
      average.push(xAverage, yAverage);

      document.getElementById("X").value = average[0];
      document.getElementById("Y").value = average[1];

      leftSpotMarker = Math.floor(average[0] / 6 - 9);
      topSpotMarker = Math.floor(average[1] / 6 - 9);
      leftZoomMarker = Math.floor(average[0] - 9);
      topZoomMarker = Math.floor(average[1] - 9);
      return true;
    });
  });
};

const hideCoordinates = function () {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    chrome.tabs.sendMessage(tabs[0].id, { message: "hidecoords" }, () => {});
  });
};

const showCoordinates = function () {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    chrome.tabs.sendMessage(tabs[0].id, { message: "showcoords" }, () => {});
  });
};

const showhidetarget = function () {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    chrome.tabs.sendMessage(
      tabs[0].id,
      { message: "showhidetarget" },
      () => {}
    );
  });
};

const disableButtons = function () {
  document.getElementById("avgbtn").disabled = true;
  document.getElementById("hidecoords").disabled = true;
  document.getElementById("showcoords").disabled = true;
  document.getElementById("showhidetarget").disabled = true;
  document.getElementById("colorpicker").disabled = true;
  document.getElementById("X").disabled = true;
  document.getElementById("Y").disabled = true;
  document.getElementById("avgtext").style.fontSize = "small";
  document.getElementById("avgtext").innerText =
    "Enables when playing Spot The Ball";
};

const enableButtons = function () {
  document.getElementById("avgbtn").disabled = false;
  document.getElementById("hidecoords").disabled = false;
  document.getElementById("showcoords").disabled = false;
  document.getElementById("showhidetarget").disabled = false;
  document.getElementById("colorpicker").disabled = false;
  document.getElementById("X").disabled = false;
  document.getElementById("Y").disabled = false;
  document.getElementById("avgtext").innerText = "Average Cross Colour";
};

chrome.runtime.onMessage.addListener((request, _sender, sendResponse) => {
  if (request.message === "avgonscreen") {
    let color = document.querySelector("#colorpicker").value;

    sendResponse(
      `${leftSpotMarker},${topSpotMarker},${leftZoomMarker},${topZoomMarker},${color}`
    );
    return true;
  }
});

document.addEventListener("DOMContentLoaded", function (_event) {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    if (tabs[0].url.includes("www.botb.com/spot-the-ball")) {
      enableButtons();

      document.querySelector("#avgbtn").addEventListener("click", function () {
        calcAverage();
      });

      document
        .querySelector("#hidecoords")
        .addEventListener("click", function () {
          hideCoordinates();
        });

      document
        .querySelector("#showcoords")
        .addEventListener("click", function () {
          showCoordinates();
        });

      document
        .querySelector("#showhidetarget")
        .addEventListener("click", function () {
          showhidetarget();
        });
    } else {
      disableButtons();
    }
  });
});
