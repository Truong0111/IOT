let firebaseConfig;
$.ajax({
  url: "http://localhost:3001/database_key",
  method: "GET",
  dataType: "json",
  async: false,
  success: function (data) {
    firebaseConfig = data;
  },
  error: function (xhr, status, error) {
    console.error(error);
  },
});

$(document).ready(function () {
  const app = firebase.initializeApp(firebaseConfig);
  const database = app.database();

  window.firebaseDatabase = database;
  // Add Vehicle form submit event
  $("#scanVehicle").submit(function (e) {
    e.preventDefault();
    const licensePlate = $(".licensePlate_2").val();

    // Kiểm tra xem biển số xe đã tồn tại trong Firebase Realtime Database chưa
    database
      .ref("parking_log")
      .orderByChild("license_plate")
      .equalTo(licensePlate)
      .once("value", function (snapshot) {
        if (snapshot.exists()) {
          // Nếu tồn tại, kiểm tra xem có bản ghi nào không có entry_time hoặc exit_time không
          let isRecordEntryWithoutTime = false;

          snapshot.forEach(function (childSnapshot) {
            const logId = childSnapshot.key;
            const record = childSnapshot.val();

            if (!record.entry_time || !record.exit_time) {
              isRecordEntryWithoutTime = true;
              // Cập nhật exit_time cho bản ghi hiện tại (nếu cần)
              if (!record.exit_time) {
                database.ref("parking_log/" + logId).update({
                  isCurrent: 0,
                  exit_time: moment()
                    .add(Math.floor(Math.random() * 24 * 60 * 60), "seconds")
                    .format("HH:mm:ss DD-MM-YYYY"),
                });
              }
            }
          });

          // Nếu có bản ghi không có entry_time hoặc exit_time, không thêm bản ghi mới
          if (!isRecordEntryWithoutTime) {
            // Thêm một dữ liệu mới
            database.ref("parking_log").push({
              isCurrent: 1,
              cmnd: "",
              license_plate: licensePlate,
              entry_time: moment().format("HH:mm:ss DD-MM-YYYY"),
            });
          }
        } else {
          // Nếu không tồn tại, thêm một dữ liệu mới
          database.ref("parking_log").push({
            isCurrent: 1,
            cmnd: "",
            license_plate: licensePlate,
            entry_time: moment().format("HH:mm:ss DD-MM-YYYY"),
          });
        }

        // Clear the input field
        $(".licensePlate_2").val("");
      });
  });

  // Thêm sự kiện cho nút Thống kê

  $("#showStatsBtn").click(function () {
    var dataIn = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];

    var dataOut = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];

    var dataInByHour = {
    labels: ["00","01","02","03","04","05","06","07","08","09","10","11","12","13","14","15","16","17","18","19","20","21","22","23"],
    datasets: [
      {
        label: "Số lượng xe vào",
        data: [],
      },
    ],
  };

  var dataOutByHour = {
    labels: ["00","01","02","03","04","05","06","07","08","09","10","11","12","13","14","15","16","17","18","19","20","21","22","23"],
    datasets: [
      {
        label: "Số lượng xe ra",
        data: [],
      },
    ],
  };

    const dateChoose = $("#dateChoose").val();

    var totalIn = 0;

    var totalOut = 0;

    const statCountIn = $("#statCountIn");

    const statCountOut = $("#statCountOut");

    var dateParts = dateChoose.split("-");
    var formattedDate = dateParts[2] + "-" + dateParts[1] + "-" + dateParts[0];

    database
      .ref("parking_log")
      .once("value")
      .then(function (snapshot) {
        const logs = snapshot.val();
        for (const key in logs) {
          if (logs.hasOwnProperty(key)) {
            var entry_date = logs[key].entry_time.substring(
              logs[key].entry_time.indexOf(" ") + 1
            );
            var exit_date = logs[key].exit_time.substring(
              logs[key].exit_time.indexOf(" ") + 1
            );

            if (entry_date === formattedDate) {
              totalIn++;
              var entryHour = logs[key].entry_time.substring(0, 2);
              dataIn[Number(entryHour)]++;
            }
            if (exit_date === formattedDate) {
              totalOut++;
              var exitHour = logs[key].exit_time.substring(0, 2);
              dataOut[Number(exitHour)]++;
            }
          }
        }

        addData(dataIn,dataInByHour);
        addData(dataOut,dataOutByHour);

        statCountIn.html(
          `<h3 id="statCountIn">Total count in: ${totalIn} </h3>`
        );
        statCountOut.html(
          `<h3 id="statCountOut">Total count out: ${totalOut}</h3>`
        );

        drawChartInOutInPie(totalIn, totalOut, formattedDate);

        drawChartInOutByHour(dataInByHour, dataOutByHour, formattedDate);
      })
      .catch(function (error) {
        console.log(error);
      });
  });

  function drawChartInOutInPie(totalIn, totalOut, date) {
    var divChart = $("#divChart");
    if (totalIn == 0 && totalOut == 0) {
      divChart.append(`<h3>Không có xe ra hoặc xe vào ngày ${date}</h3>`);
      return;
    }
    divChart.empty();
    divChart.append(
      `<h3>Biểu đồ thể hiện số lượng xe vào và số lượng xe ra ngày ${date}</h3>`
    );
    divChart.append(
      '<canvas class="statsChartInPie" width="300" height="300"></canvas>'
    );
    var canvas = $(".statsChartInPie");
    var ctx = canvas[0].getContext("2d");
    var data = {
      labels: ["Total in", "Total out"],
      datasets: [
        {
          data: [totalIn, totalOut],
          backgroundColor: ["red", "blue"],
        },
      ],
    };

    var myPieChart = new Chart(ctx, {
      type: "pie",
      data: data,
      options: {
        align: "center",
        responsive: false,
        display: true,
        title: {
          align: "center",
          display: true,
          position: top,
          text: "Pie Chart: In and out",
        },
      },
    });
  }

  function drawChartInOutByHour(dataInByHour, dataOutByHour, date) {
    var divChart = $("#divChart");
    divChart.append(
      `<h3>Biểu đồ thể hiện số lượng xe theo giờ ngày ${date}</h3>`
    );
    divChart.append(
      '<canvas class="statsChartInByHour" width="600" height="300"></canvas>'
    );
    var canvasIn = $(".statsChartInByHour");
    var ctxIn = canvasIn[0].getContext("2d");

    var chartIn = new Chart(ctxIn, {
      type: "line",
      data: dataInByHour,
    });

    divChart.append(
      `<h3>Biểu đồ thể hiện số lượng xe ra theo giờ ngày ${date}</h3>`
    );
    divChart.append(
      '<canvas class="statsChartOutByHour" width="600" height="300"></canvas>'
    );
    var canvasOut = $(".statsChartOutByHour");
    var ctxOut = canvasOut[0].getContext("2d");
    var chartOut = new Chart(ctxOut, {
      type: "line",
      data: dataOutByHour,
    });
  }

  function addData(json, data) {
    data.datasets[0].data = json;
  }
});
