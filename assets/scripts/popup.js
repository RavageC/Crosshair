"use strict";

// visual indication of your average coord on screen on the picture
// 1) Understanding the problem
// - How to calculate average - add all X coordinates and divide by how many there are. Do the same with Y coordinates
// - How will this be visually indicated? - Show a crosshair on the screen which is visually different to the crosshairs shown by botb normally(color swap would probably be enough) Would be nice to show the X and Y coord value on the picture aswell: Ideally the X and Y coordinate values are also displayed in text boxes on the extension itself
// - How do I get the coordinates? *RESEARCH REQUIRED* Believe this can be taken using the sources of the pages as you can find it displayed on the webpage itself

// 2) Breaking up into sub-problems
// - Create function that calculates average using an array
// - Set output of the average function to be number boxes on the extension popup
// - Confirm how coordinate values will be captured from the web page *RESEARCH REQUIRED* <div class="botbSpotCoords">X-2357 Y-1431</div> <- Looks like a string, so will need to be converted to a number
// - Setup array to take in values captured from the web page (could be down as a array.push() - will this trigger automatically or will the extension need a button to do this?)
// - Set code to feed in the array of the values captured from the web page then confirm output goes into text boxes correctly
// - *RESEARCH REQUIRED* Find a way to display a crosshair on the average pixel of the picture
// - *RESEARCH REQUIRED* Find a way for extension to determine the maximum pixel sixe of the picture (mostly needed to stop negative values and to stop numbers ever exceeding the picture size)
// - *RESEARCH REQUIRED* Find a way to display the average X and Y coord text on the picture itself

const calcAverage = function (xArray, yArray) {
  let xSum = 0;
  let ySum = 0;
  for (let i = 0; i < xArray.length; i++) {
    xSum += xArray[i];
  }
  for (let i = 0; i < yArray.length; i++) {
    ySum += yArray[i];
  }
  const xAverage = xSum / xArray.length;
  const yAverage = ySum / yArray.length;
  const average = [xAverage, yAverage];
  return average;
};

console.log(document.getElementsByClassName("botbSpotCoords").value);

const xArray = [1090, 1000, 1500];
const Yarray = [700, 950, 1000];
// const xyAverage = calcAverage(xArray, Yarray);
// document.getElementById("X").value = xyAverage[0];
// document.getElementById("Y").value = xyAverage[1];

document.querySelector(".avgbtn").addEventListener("click", function () {
  const xyAverage = calcAverage(xArray, Yarray);
  document.getElementById("X").value = xyAverage[0];
  document.getElementById("Y").value = xyAverage[1];
});
