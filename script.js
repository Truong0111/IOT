var database;
function getDataDay(dateChoose){
  $.ajax({
    url: "http://localhost:3001/parking_log_day",
    method: "GET",
    dataType: "json",
    body: {date: dateChoose},
    async: false,
    success: function (data) {
      database = data;
      console.log("Get data success!");
    },
    error: function (xhr, status, error) {
      console.error(error);
    },
  });
}

$(document).ready(function () {
  $("#showStatsBtn").click(function () {
    const dateChoose = $("#dateChoose").val();
    const statCountIn = $("#statCountIn");
    const statCountOut = $("#statCountOut");

    var dateParts = dateChoose.split("-");
    var formattedDate = dateParts[2] + "-" + dateParts[1] + "-" + dateParts[0];

    getDataDay(formattedDate);

    var totalIn = database.total_in;
    var totalOut = database.total_out;
    var dataInByHour = database.data_in_by_hour;
    var dataOutByHour = database.data_out_by_hour;
    statCountIn.html(
      `<h3 id="statCountIn">Total count in: ${totalIn} </h3>`
    );
    statCountOut.html(
      `<h3 id="statCountOut">Total count out: ${totalOut}</h3>`
    );

    drawChartInOutInPie(totalIn, totalOut, formattedDate);

    drawChartInOutByHour(dataInByHour, dataOutByHour, formattedDate);
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
