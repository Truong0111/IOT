$(document).ready(function () {
  // Initialize Firebase
  const firebaseConfig = {
    apiKey: "AIzaSyBF5zWqZw_B-hF8nUxTnWtcqJ24PizoSXU",
    authDomain: "smartparking-a2b6c.firebaseapp.com",
    databaseURL:
      "https://smartparking-a2b6c-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "smartparking-a2b6c",
    storageBucket: "smartparking-a2b6c.appspot.com",
    messagingSenderId: "63647793735",
    appId: "1:63647793735:web:e92b59c16ef9ab25e6a762",
    measurementId: "G-8R5GWVQRWH",
  };
  const app = firebase.initializeApp(firebaseConfig);
  const database = app.database();

  // Log Vehicle button click event
  // Thêm sự kiện cho nút Confirm
  $("#confirmLogBtn").click(function () {
    // Lấy giá trị từ cả hai ô nhập liệu
    const licensePlateValue = $("#licensePlate").val();
    const cmndValue = $("#cmnd").val();

    // Kiểm tra nếu có ít nhất một giá trị không rỗng
    if (licensePlateValue || cmndValue) {
      // Gọi hàm để xử lý thông tin
      retrieveAndDisplayData(licensePlateValue, cmndValue);

      // Xóa giá trị trong cả hai ô nhập liệu
      $("#licensePlate").val("");
      $("#cmnd").val("");
    } else {
      // Nếu cả hai ô đều rỗng, thông báo cho người dùng
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
                  .format("HH:mm:ss DD-MM-YYYY")
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

  // Test Data button click event
  $("#testBtn").click(function () {
    // Generate a unique key for the new test data
    const newTestDataKey = database
      .ref()
      .child("parking_log")
      .push().key;

    const testData = {
      license_plate: generateLicensePlate(),
      cmnd: generateRandomID(),
      entry_time: moment().format("HH:mm:ss DD-MM-YYYY"),
      exit_time: generateExitTime(),
    };

    // Add the test data to Firebase Realtime Database
    database
      .ref("parking_log/" + newTestDataKey)
      .set(testData)
      .then(function () {
        console.log("Test data added successfully");
      })
      .catch(function (error) {
        console.error("Error adding test data:", error);
      });
  });

  // Thêm sự kiện cho nút Thống kê

  $("#showStatsBtn").click(function () {

    const dateChoose = $("#dateChoose").val();

    var totalIn = 0;

    var totalOut = 0;

    const statCountIn = $("#statCountIn");

    const statCountOut = $("#statCountOut");

    database
      .ref("parking_log")
      .once("value")
      .then(function (snapshot) {
        const logs = snapshot.val();

        for (const key in logs) {
          if (logs.hasOwnProperty(key)) {
            var entry_date = logs[key].entry_time.substring(logs[key].entry_time.indexOf(" ") + 1);
            var exit_date = logs[key].exit_time.substring(logs[key].exit_time.indexOf(" ") + 1);
            var dateParts = dateChoose.split('-');
            var formattedDate = dateParts[2] + '-' + dateParts[1] + '-' + dateParts[0];

            

            if(entry_date === formattedDate){
              totalIn++;
            }
            if(exit_date === formattedDate){
              totalOut++;
            }
          }
        }
        statCountIn.html(`<h3 id="statCountIn">Total count in: ${totalIn} </h3>`);
        statCountOut.html(`<h3 id="statCountOut">Total count out: ${totalOut}</h3>`);
      })
      .catch(function (error) {
        console.log(error);
      });
  });

  //Gen bien so xe
  function generateLicensePlate() {
    const letters = "ABCDEFHJKLMNPRSTVWXYZ";
    const numbers = "0123456789";

    const randomProvince = Array.from(
      { length: 2 },
      () => numbers[Math.floor(Math.random() * numbers.length)]
    );

    const randomLetter = letters[Math.floor(Math.random() * letters.length)];
    const randomNumber = numbers[Math.floor(Math.random() * numbers.length)];

    const randomNumbers = Array.from(
      { length: 5 },
      () => numbers[Math.floor(Math.random() * numbers.length)]
    );

    return (
      randomProvince.join("") +
      randomLetter +
      randomNumber +
      randomNumbers.join("")
    );
  }

  //Gen cmnd or cccd
  function generateRandomID() {
    const digits = "0123456789";
    const randomIDLength = Math.random() < 0.5 ? 9 : 12;

    return Array.from(
      { length: randomIDLength },
      () => digits[Math.floor(Math.random() * digits.length)]
    ).join("");
  }

  //Gen gio ra
  function generateExitTime() {
    var exit_time = moment()
      .add(Math.floor(Math.random() * 24 * 60 * 60), "seconds")
      .format("HH:mm:ss DD-MM-YYYY");

    return exit_time;
  }
});
