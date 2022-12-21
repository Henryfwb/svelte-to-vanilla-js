// Set the date we're counting down to
var countDownDate = new Date("Dec 20, 2022 7:59:00").getTime();


function makeCard({ img, title, status, organization, LPLocation, description, videoURL=null, date, time }) {
  // Create all the needed items for the card using a helper function
  var card = createAndList("div", "card");
  var image = createAndList("div", "card-image");
  image.alt = "rocket image";
  image.style.backgroundImage = "url(" + img + ")"
  card.appendChild(image);
  var container = createAndList("div", "card-container");

  var cardData = createAndList("div", "card-data-container");
  var titlee = createAndList("h4", "card-title");
  titlee.innerHTML = title;
  var rocketStatus = createAndList("div", "card-rocket-status");
  var rocketStatusSpan = document.createElement("span");
  rocketStatusSpan.alt = "Rocket status";
  rocketStatusSpan.innerHTML = status;
  var launchInfo = createAndList("div", "launch-info");
  var launchInfoOrganization = document.createElement("h6");
  launchInfoOrganization.innerHTML = organization;
  var launchInfoLPLocation = document.createElement("h6");
  launchInfoLPLocation.innerHTML = LPLocation;
  // Append children
  cardData.appendChild(titlee);
  rocketStatus.appendChild(rocketStatusSpan);
  cardData.appendChild(rocketStatus);
  launchInfo.appendChild(launchInfoOrganization);
  launchInfo.appendChild(launchInfoLPLocation);
  cardData.appendChild(launchInfo);


  var launchTime = document.createElement("div");
  var countdown = createAndList("div", "countdown-timer");
  var h5Countdown = document.createElement("h5");
  h5Countdown.innerHTML = "T-";
  var countdownDays = document.createElement("span");
  countdownDays.style.gridColumnStart = 2;
  var countdownHours = document.createElement("span");
  countdownHours.style.gridColumnStart = 4;
  var countdownMinutes = document.createElement("span");
  countdownMinutes.style.gridColumnStart = 6;
  var countdownSeconds = document.createElement("span");
  countdownSeconds.style.gridColumnStart = 8;
  var countdownTextDays = document.createElement("p");
  countdownTextDays.innerHTML = "Days";
  countdownTextDays.style.gridColumnStart = 2;
  var countdownTextHours = document.createElement("p");
  countdownTextHours.innerHTML = "Hours";
  countdownTextHours.style.gridColumnStart = 4;
  var countdownTextMinutes = document.createElement("p");
  countdownTextMinutes.innerHTML = "Minutes";
  countdownTextMinutes.style.gridColumnStart = 6;
  var countdownTextSec = document.createElement("p");
  countdownTextSec.innerHTML = "Seconds";
  countdownTextSec.style.gridColumnStart = 8;
  // Add the childern
  countdown.appendChild(h5Countdown);
  countdown.appendChild(countdownDays);
  countdown.appendChild(countdownTextDays);
  countdown.appendChild(countdownHours);
  countdown.appendChild(countdownTextHours);
  countdown.appendChild(countdownMinutes);
  countdown.appendChild(countdownTextMinutes);
  countdown.appendChild(countdownSeconds);
  countdown.appendChild(countdownTextSec);
  // append countdown to their corresponding parent
  launchTime.appendChild(countdown);
  cardData.appendChild(launchTime);

  var desc = createAndList("p", "description");
  desc.innerHTML = description;
  cardData.appendChild(desc);

  var videoURLE = null;
  if (videoURL) {
    videoURLE = document.createElement("a");
    videoURLE.href = videoURL.url;
    videoURLE.innerHTML = "Stream Link";
  } else {
    videoURLE = createAndList("p", "noStream");
    videoURLE.innerHTML = "No stream available"
  }
  var center = document.createElement('center');
  center.appendChild(videoURLE);
  cardData.appendChild(center);
    
  var launchDate = createAndList("div", "rocket-date");
  var launchDateDate = document.createElement("h6");
  launchDateDate.innerHTML = date;
  var launchDateTime = document.createElement("h6");
  launchDateTime.innerHTML = `&nbsp;${time}hr`;
  launchDate.appendChild(launchDateDate);
  launchDate.appendChild(launchDateTime);

  cardData.appendChild(launchDate);
  container.appendChild(cardData);
  card.appendChild(container);

  const launches = document.getElementById("launches");
  launches.appendChild(card);

  // Start the timer
  var countDownDate = new Date(date + " " + time).getTime();
  var now = new Date().getTime();
  var distance = countDownDate - now;
  // If not launched update timer
  if (distance > 0) {
    setInterval(() => updateCountdown(countDownDate, countdownDays, countdownHours, countdownMinutes, countdownSeconds), 1000)
  } else {
    launched(countdown);
  }
}

function createAndList(type, className) {
  var element = document.createElement(type);
  element.classList.add(className);
  return element;
}

function launched(countdowntimer) {
    countdowntimer.childNodes.forEach(child => {
      child.style.display = "none";
    })
    const text = document.createElement("h2");
    text.innerHTML = "LAUNCHED!";
    text.style.textAlign = "center";
    countdowntimer.style.display = "flex";
    countdowntimer.appendChild(text)
}

function updateCountdown(date, edays, ehours, eminutes, eseconds) {
  var countDownDate = date;
  var now = new Date().getTime();

  // Find the distance between now and the count down date
  var distance = countDownDate - now;

  if (distance < -2000) return;

  // If the count down is finished, write some text
  if (distance < 0) {
    // timer done do smth
    const countdowntimer = edays.parentElement;
    launched(countdowntimer)
    return;
  }

  // Time calculations for days, hours, minutes and seconds
  var days = Math.floor(distance / (1000 * 60 * 60 * 24));
  var hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
  var seconds = Math.floor((distance % (1000 * 60)) / 1000);

  // Display the result

  edays.innerHTML = days
  ehours.innerHTML = hours
  eminutes.innerHTML = minutes
  eseconds.innerHTML = seconds
}



// Run this function to reload the "cards" won't delete them yet

async function reload() {
  // remove existing cards
  // for some reason this function doesnt remove them all
  removeChildren("launches");
  removeChildren("launches");
  removeChildren("launches");
  removeChildren("launches");

  const data = await getData();
  data.forEach(element => {
    makeCard({
      "img": element.image, videoURL: element.vidURLs[0],
      "description": element.mission ? element.mission.description : "",
      "date": convertDate(element.net),
      "time": convertTime(element.net),
      "LPLocation": element.pad.name,
      "organization": element.launch_service_provider.name,
      "status": element.status.abbrev,
      "title": element.name
    });
  });
}

reload();

function removeChildren(id) {
  const launch = document.getElementById(id);
  launch.childNodes.forEach(child => {
    // child.style.display = "none";
    launch.removeChild(child)
  })
}

async function getData() {
  // Launch Library API https://ll.thespacedevs.com/2.2.0/launch/upcoming/
  const limit = 12; // Null means no limit
  const apiUrl = `https://ll.thespacedevs.com/2.2.0/launch/upcoming/?format=json&${limit ? "limit=" + limit : ""}&mode=detailed`;
  try {
    const response = await fetch(apiUrl, {
      headers: {
        Authorization: "Token 47b21c00d00eb148a57e6a8156f6efc6689db480",
      },
    });
    if (response.ok) {
      const jsonResponse = await response.json();
      // console.log(jsonResponse.results);
      return jsonResponse.results;
    }
  } catch (error) {
    console.log(`Uh,oh! ${error}`);
  }
};

function convertDate(dateString) {
  let newDate = new Date(dateString);
  //console.log(newDate);
  let readableDate = newDate.toLocaleDateString({ 
    year: 'numeric', 
    month:'numeric', 
    day: 'numeric' 
  })
  return readableDate;
}

function convertTime(timeString) {
  let newTime = new Date(timeString);
  // console.log(newTime);
  let readableTime = newTime.toLocaleTimeString("en-IN", { 
    hour12: false, 
    hour: '2-digit', 
    minute: '2-digit', 
    second: '2-digit'  
  })
  return readableTime;
}