$(document).ready(function () {
  const database = window.firebaseDatabase;
  $("#confirmLogBtn").click(function () {
    // Lấy giá trị từ cả hai ô nhập liệu
    const licensePlateValue = $("#licensePlate").val();
    const cmndValue = $("#cmnd").val();

    // Kiểm tra nếu có ít nhất một giá trị không rỗng
    if (licensePlateValue || cmndValue) {
      retrieveAndDisplayData(licensePlateValue, cmndValue);
      $("#licensePlate").val("");
      $("#cmnd").val("");
    } else {
      alert("Vui lòng nhập ít nhất một giá trị.");
    }
  });

  // Hàm lấy dữ liệu từ Firebase và hiển thị lên trang web
  function retrieveAndDisplayData(licensePlateValue, cmndValue) {
    $("#vehicleTable tbody").empty();
    // Lấy dữ liệu từ Firebase theo giá trị biển số xe hoặc CMND
    database
      .ref("parking_log")
      .orderByChild("license_plate")
      .equalTo(licensePlateValue)
      .once("value")
      .then(function (snapshot) {
        const logs = snapshot.val();

        // Nếu không tìm thấy dữ liệu theo biển số xe, thử tìm theo CMND
        if (!logs) {
          return database
            .ref("parking_log")
            .orderByChild("cmnd")
            .equalTo(cmndValue)
            .once("value");
        }

        return snapshot;
      })
      .then(function (snapshot) {
        const logs = snapshot.val();

        // Hiển thị thông tin lên trang web
        for (const key in logs) {
          if (logs.hasOwnProperty(key)) {
            const licensePlate = logs[key].license_plate;
            const cmnd = logs[key].cmnd;
            const entryTime = logs[key].entry_time;
            const exitTime = logs[key].exit_time;

            // Hiển thị thông tin lên trang web
            displayVehicleInfo(licensePlate, cmnd, entryTime, exitTime);
          }
        }
      })
      .catch(function (error) {
        console.error("Error retrieving data:", error);
      });
  }

  // Hàm hiển thị thông tin trên trang web
  function displayVehicleInfo(licensePlate, cmnd, entryTime, exitTime) {
    const tableBody = $("#vehicleTable tbody");
    const newRow = `<tr><td>${licensePlate}</td><td>${cmnd}</td><td>${entryTime}</td><td>${exitTime}</td></tr>`;
    tableBody.prepend(newRow);
  }
});
