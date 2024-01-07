var database;

const fetchData = async () => {
  $.ajax({
    url: "http://localhost:3001/parking_log",
    method: "GET",
    dataType: "json",
    async: false,
    success: function (data) {
      database = data;
      displayData(data);
      console.log("Get data success!");
    },
    error: function (xhr, status, error) {
      console.error(error);
    },
  });
};

const displayData = () => {
  const analyticsDataTbody = document.getElementById("analyticsData");

  const statCurrentCountData = document.getElementById("statCurrentCount");

  if (!analyticsDataTbody || !statCurrentCountData) return;

  analyticsDataTbody.innerHTML = "";
  statCurrentCountData.innerHTML = "";

  var currentTotalCount = 0;

  if (database == undefined || database == null) {
    statCurrentCountData.innerHTML = `Current total count: 0`;
    return;
  }

  Object.keys(database).forEach((key) => {
    const tr = document.createElement("tr");

    const licensePlateTd = document.createElement("td");
    licensePlateTd.textContent = database[key].license_plate;
    tr.appendChild(licensePlateTd);

    const entryTimeTd = document.createElement("td");
    entryTimeTd.textContent = database[key].entry_time;
    tr.appendChild(entryTimeTd);

    const exitTimeTd = document.createElement("td");
    exitTimeTd.textContent = database[key].exit_time;
    tr.appendChild(exitTimeTd);

    analyticsDataTbody.appendChild(tr);

    if (database[key].entry_time && !database[key].exit_time) {
      currentTotalCount++;
    }
  });

  statCurrentCountData.innerHTML = `Current total count: ${currentTotalCount}`;
};

const runFetchData = async () => {
  while (true) {
    await fetchData();
    await displayData();
    await new Promise((resolve) => setTimeout(resolve, 1000));
  }
};

runFetchData();

$(document).ready(function () {
  $("#confirmLogBtn").click(function () {
    const licensePlateValue = $("#licensePlate").val();
    if (licensePlateValue) {
      retrieveAndDisplayData(licensePlateValue);
      $("#licensePlate").val("");
    } else {
      alert("Vui lòng nhập biển số xe.");
    }
  });

  function retrieveAndDisplayData(licensePlateValue) {
    $("#vehicleTable tbody").empty();

    Object.keys(database).forEach((key) => {
      if (!database[key]);
      if (!database[key].license_plate);
      if (database[key].license_plate === licensePlateValue) {
        const licensePlate = database[key].license_plate;
        const entryTime = database[key].entry_time;
        const exitTime = database[key].exit_time;

        displayVehicleInfo(licensePlate, entryTime, exitTime);
        return;
      }
    });
  }

  function displayVehicleInfo(licensePlate, entryTime, exitTime) {
    const tableBody = $("#vehicleTable tbody");
    const newRow = `<tr><td>${licensePlate}</td><td>${entryTime}</td><td>${exitTime}</td></tr>`;
    tableBody.prepend(newRow);
  }
});
