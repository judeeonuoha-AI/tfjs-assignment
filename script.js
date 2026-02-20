/**
 * ✅ ASSIGNMENT PART 1:
 * Write a JS function that accepts a variable number of arguments,
 * multiplies through, and returns the result.
 *
 * Using the rest parameter (...numbers) allows any number of inputs.
 */
const multiplyAll = (...numbers) => {
  // If nothing is passed, return 0 (as you specified).
  if (numbers.length === 0) return 0;

  // Reduce multiplies all values together:
  // start accumulator at 1 so it doesn't kill multiplication.
  return numbers.reduce((acc, current) => acc * current, 1);
};

// Test the function in the console
console.log("multiplyAll(2, 3, 4) =>", multiplyAll(2, 3, 4)); // 24
console.log("multiplyAll(5, 10) =>", multiplyAll(5, 10));     // 50
console.log("multiplyAll() =>", multiplyAll());               // 0

/**
 * Helper: Fetch users from the public endpoint.
 * ✅ ASSIGNMENT PART 2 requires remote API call.
 */
async function fetchUsers() {
  const endpoint = "https://jsonplaceholder.typicode.com/users";

  // Fetch remote data (API call)
  const response = await fetch(endpoint);

  // If request fails, throw an error so caller can handle it
  if (!response.ok) {
    throw new Error(`HTTP Error ${response.status}: ${response.statusText}`);
  }

  // Convert response to JSON
  return response.json();
}

/**
 * ✅ ASSIGNMENT PART 2 (Option A):
 * Transform retrieved data and plot a BAR CHART using tfjs-vis.
 *
 * We’ll group users by their city and count how many per city.
 */
async function renderUserCityDistributionChart() {
  try {
    // 1) Get users from API
    const users = await fetchUsers();

    // 2) Transform data: count users per city
    const cityCounts = users.reduce((acc, user) => {
      const city = user?.address?.city || "Unknown";
      acc[city] = (acc[city] || 0) + 1;
      return acc;
    }, {});

    // 3) Convert to format tfjs-vis likes for barchart: { index, value }
    const chartData = Object.entries(cityCounts).map(([city, count]) => ({
      index: city,
      value: count
    }));

    // 4) Create a tfjs-vis "surface" (recommended way)
    //    parent must be a DOM element, name is chart title.
    const container = document.getElementById("city-canvas");
    const surface = { name: "Users by City", parent: container };

    // 5) Chart options
    const opts = {
      xLabel: "City Name",
      yLabel: "Number of Users",
      height: 400
    };

    // 6) Render the bar chart
    tfvis.render.barchart(surface, chartData, opts);
  } catch (error) {
    console.error("Failed to render city bar chart:", error);
  }
}

/**
 * ✅ ASSIGNMENT PART 2 (Option B):
 * Transform retrieved data and plot a LINE CHART using tfjs-vis.
 *
 * Note:
 * The JSONPlaceholder /users endpoint doesn’t contain actual registration dates.
 * So we create (synthesize) dates to show growth over time using the user index.
 */
async function renderDateChart() {
  try {
    // 1) Get users from API
    const users = await fetchUsers();

    // 2) Transform data into time-series points (x = date, y = total users)
    //    We'll generate a simple "growth" line:
    //    user 1 => Jan 1, user 2 => Feb 1, etc.
    const timeData = users.map((user, index) => ({
      x: new Date(2025, index, 1),  // Jan, Feb, Mar... of 2025
      y: index + 1                  // cumulative total
    }));

    // 3) Create a surface for the line chart
    const container = document.getElementById("date-canvas");
    const surface = { name: "User Registration Growth (Synthetic Dates)", parent: container };

    // 4) Line chart options
    const opts = {
      xLabel: "Registration Date",
      yLabel: "Total Users",
      height: 400,
      zoomToFit: true
    };

    // 5) tfjs-vis linechart expects { values: [points] } or multiple series.
    tfvis.render.linechart(surface, { values: timeData }, opts);

    console.log("Line chart rendered (dates were synthesized).");
  } catch (error) {
    console.error("Error rendering date line chart:", error);
  }
}

// Run both charts
renderUserCityDistributionChart();
renderDateChart();