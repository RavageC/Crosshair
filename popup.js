"use strict";

const xArrays = [];
const yArrays = [];
const average = [];

let leftSpotMarker;
let topSpotMarker;
let leftZoomMarker;
let topZoomMarker;

let competitionType;
let competitionWeekYear;

const calcAverage = function () {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    chrome.tabs.sendMessage(tabs[0].id, { message: "cord" }, (response) => {
      const xyArrays = response.toString().split(",").map(Number);
      average.length = 0; // Empty Array

      const heightDivisor = xyArrays.pop();
      const widthDivisor = xyArrays.pop();
      console.log(xyArrays);

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

      leftSpotMarker = Math.floor(average[0] / widthDivisor - 9);
      topSpotMarker = Math.floor(average[1] / heightDivisor - 9);
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

const practice = function () {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    chrome.tabs.sendMessage(tabs[0].id, { message: "practice" }, () => {});
  });
};

const disableButtons = function () {
  document.getElementById("avgbtn").disabled = true;
  document.getElementById("hidecoords").disabled = true;
  document.getElementById("showcoords").disabled = true;
  document.getElementById("showhidetarget").disabled = true;
  document.getElementById("practice").disabled = true;
  document.getElementById("colorpicker").disabled = true;
  document.getElementById("X").disabled = true;
  document.getElementById("Y").disabled = true;
  document.getElementById("competitiontype").disabled = true;
  document.getElementById("competitionweekyear").disabled = true;
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
  document.getElementById("competitiontype").disabled = false;
  document.getElementById("avgtext").innerText = "Average Cross Colour";
};

chrome.runtime.onMessage.addListener((request, _sender, sendResponse) => {
  if (request.message === "avgonscreen") {
    let color = document.querySelector("#colorpicker").value;

    sendResponse(
      `${leftSpotMarker},${topSpotMarker},${leftZoomMarker},${topZoomMarker},${color}`
    );
    return true;
  } else if (request.message === "whichpic") {
    competitionType = document.querySelector("#competitiontype").value; // e.g: DC or MW
    competitionWeekYear = document.querySelector("#competitionweekyear").value; // Format WWYY

    sendResponse(`${competitionType}${competitionWeekYear}`);
  }
});

document.addEventListener("DOMContentLoaded", function (_event) {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    if (tabs[0].url.includes("www.botb.com/spot-the-ball")) {
      enableButtons();

      document
        .querySelector("#competitiontype")
        .addEventListener("change", function () {
          competitionType = document.querySelector("#competitiontype").value;
          competitionWeekYear = document.querySelector(
            "#competitionweekyear"
          ).value;

          const x = document.getElementById("competitionweekyear");
          const currentDate = new Date();
          let option;

          if (competitionType === "dc") {
            while (x.options.length > 0) {
              x.remove(0);
            }
            x.disabled = false;
            const firstWednesday = new Date(currentDate.getFullYear(), 0, 5);
            const numberOfDays = Math.floor(
              (currentDate - firstWednesday) / (24 * 60 * 60 * 1000)
            );
            const result = Math.floor(numberOfDays / 7);

            for (let i = result; i > 0; i--) {
              option = document.createElement("option");
              i < 10 ? (option.text = `0${i}22`) : (option.text = `${i}22`);
              x.add(option);
            }

            for (let i = 52; i > 5; i--) {
              option = document.createElement("option");
              i < 10 ? (option.text = `0${i}21`) : (option.text = `${i}21`);
              x.add(option);
            }
          } else if (competitionType === "mw") {
            while (x.options.length > 0) {
              x.remove(0);
            }
            x.disabled = false;
            const secondSaturday = new Date(currentDate.getFullYear(), 0, 8);
            const numberOfDays = Math.floor(
              (currentDate - secondSaturday) / (24 * 60 * 60 * 1000)
            );
            const result = Math.floor(numberOfDays / 7);
            for (let i = result; i > 0; i--) {
              option = document.createElement("option");
              i < 10 ? (option.text = `0${i}22`) : (option.text = `${i}22`);
              x.add(option);
            }

            for (let i = 52; i > 4; i--) {
              option = document.createElement("option");
              i < 10 ? (option.text = `0${i}21`) : (option.text = `${i}21`);
              x.add(option);
            }
          } else {
            x.disabled = true;
            while (x.options.length > 0) {
              x.remove(0);
            }
            document.getElementById("practice").disabled = true;
          }
        });

      document
        .querySelector("#competitionweekyear")
        .addEventListener("change", function () {
          competitionType = document.querySelector("#competitiontype").value;
          competitionWeekYear = document.querySelector(
            "#competitionweekyear"
          ).value;

          competitionWeekYear && competitionType != ""
            ? (document.getElementById("practice").disabled = false)
            : (document.getElementById("practice").disabled = true);
        });

      document.querySelector("#avgbtn").addEventListener("click", function () {
        calcAverage();
      });

      document
        .querySelector("#practice")
        .addEventListener("click", function () {
          practice();
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
