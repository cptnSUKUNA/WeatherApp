// Select DOM Elements
const searchInput = document.getElementById("searchInp");
const searchButton = document.getElementById("searchBtn");
const weatherArea = document.getElementById("weatherArea");

// OpenWeatherMap API Key (Replace with your own key)
const API_KEY = "YOUR_API_KEY";
const BASE_URL = "https://api.openweathermap.org/data/2.5/forecast";

// Event Listener for Search Button
searchButton.addEventListener("click", () => {
  const location = searchInput.value.trim();
  if (location) {
    fetchWeatherData(location);
  }
});

// Fetch Weather Data
async function fetchWeatherData(location) {
  try {
    const response = await fetch(
      `${BASE_URL}?q=${location}&units=metric&appid=${API_KEY}`
    );
    if (!response.ok) {
      throw new Error("Location not found!");
    }
    const data = await response.json();
    updateWeatherUI(data);
  } catch (error) {
    alert(error.message);
  }
}

// Update UI with Weather Data
function updateWeatherUI(data) {
  weatherArea.innerHTML = ""; // Clear previous content

  const currentDay = data.list[0]; // Current weather
  const nextDays = data.list.slice(1, 3); // Next two days

  // Create Current Day Card
  const currentCard = createWeatherCard(
    data.city.name,
    getDay(currentDay.dt),
    getDate(currentDay.dt),
    currentDay.main.temp,
    currentDay.weather[0].icon,
    currentDay.weather[0].description,
    currentDay.wind.speed
  );
  weatherArea.appendChild(currentCard);

  // Create Next Days Cards
  nextDays.forEach((day) => {
    const nextCard = createWeatherCard(
      null,
      getDay(day.dt),
      null,
      day.main.temp,
      day.weather[0].icon,
      day.weather[0].description
    );
    weatherArea.appendChild(nextCard);
  });
}

// Helper Function: Create Weather Card
function createWeatherCard(
  city,
  day,
  date,
  temp,
  icon,
  description,
  windSpeed = null
) {
  const col = document.createElement("div");
  col.className = "col-md-4";

  const card = `
    <div class="myCard rounded-4 text-white overflow-hidden">
      <div class="headCard d-flex align-items-center justify-content-between px-4 fw-medium">
        <p class="day mt-2">${day}</p>
        ${date ? `<p class="date mt-2">${date}</p>` : ""}
      </div>
      <div class="contentCard px-4 text-center">
        ${city ? `<h2 class="city mt-3 fs-4">${city}</h2>` : ""}
        <p class="display-4 fw-bold">${temp}<sup>o</sup>C</p>
        <img src="https://openweathermap.org/img/wn/${icon}@2x.png" alt="weather icon" class="w-25">
        <p class="statu mt-3 fs-6 text-info">${description}</p>
      </div>
      ${
        windSpeed
          ? `
          <div class="footerCard">
            <div class="wind px-4 mt-5 mb-3">
              <span><i class="fa-solid fa-wind me-2"></i> ${windSpeed} m/s</span>
            </div>
          </div>
        `
          : ""
      }
    </div>
  `;
  col.innerHTML = card;
  return col;
}

// Helper Functions: Format Date and Day
function getDay(timestamp) {
  return new Date(timestamp * 1000).toLocaleDateString("en-US", {
    weekday: "long",
  });
}

function getDate(timestamp) {
  return new Date(timestamp * 1000).toLocaleDateString("en-US", {
    day: "numeric",
    month: "long",
  });
}
