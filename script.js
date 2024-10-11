let timer;
let isRunning = false;
let elapsedTime = 0; // elapsed time in seconds

// Load saved time from localStorage
if (localStorage.getItem("elapsedTime")) {
  elapsedTime = parseInt(localStorage.getItem("elapsedTime"));
}
if (localStorage.getItem("active")) {
  const state = JSON.parse(localStorage.getItem("active"));
  document.getElementById("display").innerText = state ? "Run" : "Stopped";
}

document.getElementById("startBtn").onclick = function () {
  if (!isRunning) {
    isRunning = true;
    document.getElementById("display").innerText = `${
      isRunning ? "Run" : "Stopped"
    }`;
    const currentTime = JSON.parse(localStorage.getItem("currentTime")) || 0;
    const startTime = Date.now() - parseInt(currentTime);
    localStorage.setItem("currentTime", "0");
    localStorage.setItem("startTime", JSON.stringify(startTime));
    isRunning = true;
    localStorage.setItem("active", isRunning);
  }
};

document.getElementById("pauseBtn").onclick = function () {
  if (JSON.parse(localStorage.getItem("active"))) {
    isRunning = false;
    document.getElementById("display").innerText = `${
      isRunning ? "Run" : "Stopped"
    }`;
    let currentTime =
      Date.now() - JSON.parse(localStorage.getItem("startTime"));
    localStorage.setItem("currentTime", currentTime);
    localStorage.setItem("active", isRunning);
    document.getElementById("timer").innerText =
      millisecondsToTime(currentTime);
  }
};

document.getElementById("stopBtn").onclick = function () {
  // Show a confirmation dialog
  const userConfirmed = confirm("Are you sure you want to reset timer?");

  // If the user confirms, clear localStorage and reload the page
  if (userConfirmed) {
    isRunning = false;
    document.getElementById("display").innerText = `${
      isRunning ? "Run" : "Stopped"
    }`;

    localStorage.setItem("currentTime", "0");
    localStorage.setItem("startTime", "0");
    document.getElementById("timer").innerText = "00:00:00";
  }
};

document.getElementById("saveBtn").onclick = function () {
  const date = new Date();

  // Retrieve the existing allDay array from local storage
  let allDay = JSON.parse(localStorage.getItem("allDay")) || [];
  const time = JSON.parse(localStorage.getItem("currentTime")) || 0;
  const comment = document.getElementById("comment").value;
  // Add a placeholder item or you can customize it
  allDay.push({
    date: date.toLocaleDateString("de-DE"),
    time: time,
    comment: comment,
  });

  // Save the allDay array back to local storage as a string
  if (parseInt(time) > 60000) {
    localStorage.setItem("allDay", JSON.stringify(allDay));
    isRunning = false;
    localStorage.setItem("active", isRunning);
    localStorage.setItem("currentTime", "0");
    localStorage.setItem("startTime", "0");
  } else {
    alert("Too short time, min time 60sec");
  }
  generateList();
};

function updateDisplay(time) {
  const hours = String(Math.floor(time / 3600)).padStart(2, "0");
  const minutes = String(Math.floor((time % 3600) / 60)).padStart(2, "0");
  const seconds = String(time % 60).padStart(2, "0");
  // document.getElementById(
  //   "display"
  // ).innerText = `${hours}:${minutes}:${seconds}`;
}

function generateList() {
  const data = JSON.parse(localStorage.getItem("allDay"));

  // Check if data exists
  if (!data || !Array.isArray(data)) {
    document.getElementById("list").innerHTML = "No data available";
    return;
  }

  // Create table elements
  let table =
    '<table border="2"><thead><tr><th>Date</th><th>Time h:m:s</th><th>Comment</th></tr></thead><tbody>';

  // Populate table with data
  data.forEach((d) => {
    table += `<tr><td>${d.date}</td><td>${millisecondsToTime(d.time)}</td><td>${
      d.comment || ""
    }</td></tr>`;
  });

  table += "</tbody></table>";

  // Adding the created table to the 'list' element
  document.getElementById("list").innerHTML = table;
}

function millisecondsToTime(ms) {
  // Calculate total seconds from milliseconds
  let totalSeconds = Math.floor(ms / 1000);

  // Calculate hours, minutes, and seconds
  const hours = Math.floor(totalSeconds / 3600);
  totalSeconds %= 3600; // remainder after extracting hours
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60; // remainder after extracting minutes

  // Format hours, minutes and seconds to ensure two digits
  const formatNumber = (num) => (num < 10 ? "0" + num : num);

  // Return formatted time
  return `${formatNumber(hours)}:${formatNumber(minutes)}:${formatNumber(
    seconds
  )}`;
}

document.getElementById("clearLS").onclick = function () {
  // Show a confirmation dialog
  const userConfirmed = confirm(
    "Are you sure you want to clear local storage?"
  );

  // If the user confirms, clear localStorage and reload the page
  if (userConfirmed) {
    localStorage.clear(); // Clear localStorage
    location.reload(); // Reload the page
  }
};
function templateTime() {
  let tempTime = Date.now() - JSON.parse(localStorage.getItem("startTime"));
  if (tempTime < Date.now()) {
    document.getElementById("temp").innerText = millisecondsToTime(tempTime);
  }
}
templateTime();

generateList();
