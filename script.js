// ===============================
// 1️⃣ Function: Multiply Variable Arguments
// ===============================
function multiply(...numbers) {
  if (numbers.length === 0) return 0;

  return numbers.reduce((acc, num) => acc * num, 1);
}

// Example usage:
console.log("Multiply result:", multiply(2, 3, 4)); // 24


// ===============================
// 2️⃣ Function: Fetch API Data
// ===============================
async function fetchUsers() {
  try {
    const response = await fetch("https://jsonplaceholder.typicode.com/users");
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching data:", error);
  }
}


// ===============================
// 3️⃣ Transform + Plot using tfjs-vis
// ===============================
async function runApp() {
  const users = await fetchUsers();

  // Transform data:
  // Count number of users per company
  const companyCount = {};

  users.forEach(user => {
    const company = user.company.name;
    companyCount[company] = (companyCount[company] || 0) + 1;
  });

  const chartData = Object.keys(companyCount).map(company => ({
    x: company,
    y: companyCount[company]
  }));

  // Plot Bar Chart
  const surface = { name: "Users Per Company", tab: "Charts" };

  tfvis.render.barchart(
    surface,
    chartData,
    {
      xLabel: "Company",
      yLabel: "Number of Users",
      height: 400
    }
  );
}