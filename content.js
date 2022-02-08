"use strict";

const xArray = [];
const yArray = [];
let savedCSS;

window.addEventListener("load", function (_event) {
  chrome.runtime.onMessage.addListener((request, _sender, sendResponse) => {
    if (request.message === "cord") {
      xArray.length = 0;
      yArray.length = 0;
      let numCoords = document.getElementsByClassName("botbSpotCoords");
      numCoords = Array.from(numCoords);
      for (const coord of numCoords) {
        const xcord = coord.innerHTML.substring(
          coord.innerHTML.indexOf("-") + 1,
          coord.innerHTML.indexOf(" ")
        );

        const ycord = coord.innerHTML.substring(
          coord.innerHTML.lastIndexOf("-") + 1,
          coord.innerHTML.length
        );

        if (xcord === "" || ycord === "&nbsp;") {
          continue;
        }

        xArray.push(xcord);
        yArray.push(ycord);
      }
      sendResponse(`${[xArray, yArray]}`);

      chrome.runtime.sendMessage(
        { message: "avgonscreen" },
        function (response) {
          const responseArray = response.toString().split(",");
          const colorPicked = responseArray.pop();
          const markers = responseArray.map(Number);

          if (
            !document.getElementById(
              `botbSpotMarkerX${markers[2] + 9}Y${markers[3] + 9}`
            )
          ) {
            const elem = document.createElement("div");
            const parentElem = document.getElementById("botbSpotImage");
            const img = document.createElement("img");
            img.src = chrome.runtime.getURL(
              `/assets/images/big${colorPicked}marker.png`
            );
            parentElem.appendChild(elem);
            elem.appendChild(img);
            elem.classList.add("botbSpotMarker");
            elem.setAttribute(
              "id",
              `botbSpotMarkerX${markers[2] + 9}Y${markers[3] + 9}`
            );
            elem.style.cssText = `left: ${markers[0]}px; top: ${markers[1]}px; transform: inherit;`;

            const elemZoom = document.createElement("div");
            const parentElemZoom = document.getElementById(
              "botbSpotZoomWrapper"
            );
            const imgZoom = document.createElement("img");
            imgZoom.src = chrome.runtime.getURL(
              `/assets/images/big${colorPicked}marker.png`
            );
            parentElemZoom.appendChild(elemZoom);
            elemZoom.appendChild(imgZoom);
            elemZoom.classList.add("botbSpotZoomMarker");
            elemZoom.setAttribute(
              "id",
              `botbSpotZoomMarkerX${markers[2] + 9}Y${markers[3] + 9}`
            );
            elemZoom.style.cssText = `left: ${markers[2] - 1}px; top: ${
              markers[3] - 1
            }px; display: block;`;
          } else {
            const elem = document.getElementById(
              `botbSpotMarkerX${markers[2] + 9}Y${markers[3] + 9}`
            );
            if (elem.hasChildNodes()) {
              elem.removeChild(elem.firstChild);
            }

            const img = document.createElement("img");

            img.src = chrome.runtime.getURL(
              `/assets/images/big${colorPicked}marker.png`
            );
            elem.appendChild(img);

            const elemZoom = document.getElementById(
              `botbSpotZoomMarkerX${markers[2] + 9}Y${markers[3] + 9}`
            );
            if (elemZoom.hasChildNodes()) {
              elemZoom.removeChild(elemZoom.firstChild);
            }
            const imgZoom = document.createElement("img");

            imgZoom.src = chrome.runtime.getURL(
              `/assets/images/big${colorPicked}marker.png`
            );
            elemZoom.appendChild(imgZoom);
          }
        }
      );
    } else if (request.message === "hidecoords") {
      let coordsPreviewHide = document.getElementsByClassName("botbSpotMarker");
      let coordsZoomedHide =
        document.getElementsByClassName("botbSpotZoomMarker");

      for (const coordOnScreen of coordsPreviewHide) {
        coordOnScreen.style.display = "none";
      }

      for (const coordInZoom of coordsZoomedHide) {
        coordInZoom.style.display = "none";
      }

      sendResponse("Task Completed");
    } else if (request.message === "showcoords") {
      let coordsPreviewShow = document.getElementsByClassName("botbSpotMarker");
      let coordsZoomedShow =
        document.getElementsByClassName("botbSpotZoomMarker");

      for (const coordOnScreen of coordsPreviewShow) {
        coordOnScreen.style.display = "block";
      }

      for (const coordInZoom of coordsZoomedShow) {
        coordInZoom.style.display = "block";
      }
      sendResponse("Task Completed");
    } else if (request.message === "showhidetarget") {
      if (document.getElementById("targetZone") == null) {
        const target = document.createElement("div");
        const targetImg = document.createElement("img");
        targetImg.src = chrome.runtime.getURL(
          "/assets/images/Targetwithcrosshair_cropped.png"
        );
        const targetParent = document.getElementById("botbSpotGameContainer");

        targetParent.prepend(target);
        target.appendChild(targetImg);

        target.setAttribute("id", "targetZone");
        target.setAttribute("draggable", "true");
        savedCSS == undefined
          ? (target.style.cssText = "position: absolute; z-index: 101;")
          : (target.style.cssText = savedCSS);

        let newPosX = 0,
          newPosY = 0,
          startPosX = 0,
          startPosY = 0;

        target.addEventListener("mousedown", function (e) {
          e.preventDefault();

          startPosX = e.clientX;
          startPosY = e.clientY;

          document.addEventListener("mousemove", mouseMove);

          document.addEventListener("mouseup", function () {
            document.removeEventListener("mousemove", mouseMove);
          });
        });

        function mouseMove(e) {
          newPosX = startPosX - e.clientX;
          newPosY = startPosY - e.clientY;

          startPosX = e.clientX;
          startPosY = e.clientY;

          target.style.top = target.offsetTop - newPosY + "px";
          target.style.left = target.offsetLeft - newPosX + "px";
        }
      } else {
        const target = document.getElementById("targetZone");
        savedCSS = target.style.cssText;
        target.remove();
      }
      sendResponse("Task Completed");
    } else {
      return true;
    }
    return true;
  });
});
