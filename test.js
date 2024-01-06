$(document).ready(function () {
  const database = window.firebaseDatabase;
  $("#testBtn").click(function () {
    const newTestDataKey = database.ref().child("parking_log").push().key;

    const testData = {
      isCurrent: 0,
      license_plate: generateLicensePlate(),
      cmnd: generateRandomID(),
      entry_time: moment().format("HH:mm:ss DD-MM-YYYY"),
      exit_time: generateExitTime(),
    };

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

  $("#testBtnIn").click(function () {
    const newTestDataKey = database.ref().child("parking_log").push().key;

    const testData = {
      isCurrent: 1,
      license_plate: generateLicensePlate(),
      cmnd: generateRandomID(),
      entry_time: moment().format("HH:mm:ss DD-MM-YYYY"),
      exit_time: "",
    };

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

  $("#testBtnOut").click(function () {
    const licensePlate = $("#licensePlate_out").val();

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
        $("#licensePlate_out").val("");
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

  //Gen cmnd hoặc cccd
  function generateRandomID() {
    const digits = "0123456789";
    const randomIDLength = Math.random() < 0.5 ? 9 : 12;

    return Array.from(
      { length: randomIDLength },
      () => digits[Math.floor(Math.random() * digits.length)]
    ).join("");
  }

  //Gen giờ xe ra
  function generateExitTime() {
    var exit_time = moment()
      .add(Math.floor(Math.random() * 24 * 60 * 60), "seconds")
      .format("HH:mm:ss DD-MM-YYYY");

    return exit_time;
  }
});
