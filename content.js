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
        const competitionTitle =
          document.getElementsByClassName("competition_title")[0];
        const target = document.createElement("div");
        const targetImg = document.createElement("img");
        targetImg.src = chrome.runtime.getURL(
          "/assets/images/Targetwithcrosshair_cropped.png"
        );
        const targetParent = document.getElementById("botbSpotGameContainer");

        if (!document.getElementById("shortcut")) {
          const shortcut = document.createElement("div");
          competitionTitle.appendChild(shortcut);
          shortcut.setAttribute("id", "shortcut");
          shortcut.innerHTML = "Shortcut to show/hide draggable target: 't'";
        }

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

        document.addEventListener("keydown", showHideTarget);

        function showHideTarget(e) {
          switch (e.key) {
            case "t":
            case "T":
              if (document.getElementById("targetZone") == null) {
                const target = document.createElement("div");
                const targetImg = document.createElement("img");
                targetImg.src = chrome.runtime.getURL(
                  "/assets/images/Targetwithcrosshair_cropped.png"
                );

                if (!document.getElementById("shortcut")) {
                  const shortcut = document.createElement("div");
                  competitionTitle.appendChild(shortcut);
                  shortcut.setAttribute("id", "shortcut");
                  shortcut.innerHTML =
                    "Shortcut to show/hide draggable target: 't'";
                }

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
          }
        }
      } else {
        const target = document.getElementById("targetZone");
        savedCSS = target.style.cssText;
        target.remove();
      }
      sendResponse("Task Completed");
    } else if (request.message === "practice") {
      chrome.runtime.sendMessage({ message: "whichpic" }, function (response) {
        const competitionid = response;
        const competitionTitle =
          document.getElementsByClassName("competition_title")[0];

        fetch(`https://www.botb.com/winners/${response}`).then(function (
          response
        ) {
          if (response.status !== 200) {
            alert(
              "Looks like there was a problem. Status Code: " + response.status
            );
            return;
          }

          response.text().then(function (data) {
            const doc = new DOMParser().parseFromString(data, "text/html");

            if (document.getElementById("shortcut")) {
              competitionTitle.innerHTML = `Practice Spot The Ball - ${competitionid}`;
              const shortcut = document.createElement("div");
              competitionTitle.appendChild(shortcut);
              shortcut.setAttribute("id", "shortcut");
              shortcut.innerHTML =
                "Shortcut to show/hide draggable target: 't'";
            } else {
              competitionTitle.innerHTML = `Practice Spot The Ball - ${competitionid}`;
            }

            const currentDate = new Date().valueOf();
            const epoch = currentDate.toString();

            const gamePicture = doc
              .getElementsByClassName("view_image_trigger")[0]
              .getAttribute("data-competition_picture_guid");

            const spotImage = document.getElementById("botbSpotImage");

            spotImage.style.backgroundImage = `url("/umbraco/botb/spottheball/getcompetitionpicture/?competitionpictureguid=${gamePicture}&size=full&${epoch}")`;

            document.getElementById(
              "botbSpotZoomImage"
            ).src = `/umbraco/botb/spottheball/getcompetitionpicture/?competitionpictureguid=${gamePicture}&size=full&${epoch}`;

            const judgeSelection = doc
              .getElementById("judged_checkbox")
              .getAttribute("data-label");

            const xjudged = judgeSelection.substring(
              judgeSelection.indexOf("X") + 2,
              judgeSelection.indexOf("Y") - 1
            );

            const yjudged = judgeSelection.substring(
              judgeSelection.indexOf("Y") + 2,
              judgeSelection.lastIndexOf(")")
            );

            const instructions = document.createElement("div");
            competitionTitle.appendChild(instructions);
            instructions.innerHTML =
              "Press 'j' on your keyboard to show the judged co-ordinate and press 'r' to remove it.";

            document.addEventListener("keydown", judgeCoordinate);

            function judgeCoordinate(e) {
              switch (e.key) {
                case "j":
                case "J":
                  if (
                    !document.getElementById(
                      `botbSpotMarkerX${xjudged}Y${yjudged}`
                    )
                  ) {
                    const judgedCross = document.createElement("div");
                    const judgedParent =
                      document.getElementById("botbSpotImage");
                    const img = document.createElement("img");
                    img.src = chrome.runtime.getURL(
                      "/assets/images/winnercross.png"
                    );
                    judgedParent.appendChild(judgedCross);
                    judgedCross.appendChild(img);
                    judgedCross.classList.add("botbSpotMarker");
                    judgedCross.setAttribute(
                      "id",
                      `botbSpotMarkerX${xjudged}Y${yjudged}`
                    );
                    judgedCross.style.cssText = `left: ${Math.floor(
                      xjudged / 6 - 9
                    )}px; top: ${Math.floor(
                      yjudged / 6 - 9
                    )}px; transform: inherit;`;

                    const judgedCrossZoom = document.createElement("div");
                    const parentJudgedCrossZoom = document.getElementById(
                      "botbSpotZoomWrapper"
                    );
                    const imgZoom = document.createElement("img");
                    imgZoom.src = chrome.runtime.getURL(
                      "/assets/images/winnercross.png"
                    );
                    parentJudgedCrossZoom.appendChild(judgedCrossZoom);
                    judgedCrossZoom.appendChild(imgZoom);
                    judgedCrossZoom.classList.add("botbSpotZoomMarker");
                    judgedCrossZoom.setAttribute(
                      "id",
                      `botbSpotZoomMarkerX${xjudged}Y${yjudged}`
                    );
                    judgedCrossZoom.style.cssText = `left: ${
                      xjudged - 1
                    }px; top: ${yjudged - 1}px; display: block;`;
                  }
                  break;
                case "r":
                case "R":
                  const spotMarkers =
                    document.getElementsByClassName("botbSpotMarker");

                  for (let i = 0; i < spotMarkers.length; i++) {
                    if (
                      spotMarkers[i].children.length > 0 &&
                      spotMarkers[i].childNodes[0].src.includes(
                        "winnercross.png"
                      )
                    ) {
                      spotMarkers[i].remove();
                    } else {
                      continue;
                    }
                  }
                  break;
              }
              let options = { attributes: true },
                observer = new MutationObserver(callback);

              function callback(mutations) {
                for (let mutation of mutations) {
                  if (mutation.type === "attributes") {
                    document.removeEventListener("keydown", judgeCoordinate);
                  }
                }
                observer.disconnect();
              }
              observer.observe(spotImage, options);
            }
          });
        });
      });

      sendResponse("Task Completed");
    } else {
      return true;
    }
    return true;
  });
});
