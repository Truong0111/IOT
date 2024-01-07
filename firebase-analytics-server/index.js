import admin from "firebase-admin";
import express from "express";
import moment from "moment";
import bodyParser from "body-parser";

function startServerFirebase() {
  const serviceAccount = {
    type: "service_account",
    project_id: "smartparking-a2b6c",
    private_key_id: "5f234701851b1357bf3dd82588c205b390182d80",
    private_key:
      "-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQCh0L2z7VrwKP0q\n15YNimIrxkDL0TM1aQIS/GdR46qpZcywwo7u41AMt+LXS2VFNnNXh8shEAGG8ONV\nSSbLtYqxoKH7nI4dmFWX6LI583g9K6v5fOel57dAXDtr6hxjPtp5dN6tp0K68mMW\nf1JspWbZBpBzoGXJAvfVr9zAlC5knQrJ8f4A0fHiRX0Bu5ITyF5hd4wO9xsAEKl0\npwYxWAZJpmwGDEWpDpXJqx16njWUZIFn6wychEZe/BqOq+gNkgEmgd984PIKMyXl\ncLw6/BbNuTqjeL2qqH2DVnDTIkd0hmp8xxr0oy7ep2mZaU1QW0QHTx8XiSFUePLJ\n2g4TUalhAgMBAAECggEAAr+ByUF5ruRzUDvzD23PNwEZ7pwx63FKGLpyosBkEJZr\nAIF9Xe88V8rzrkZYhPFkyhLDT19vNzR2F+ezIfiGT3fz6EsDWttQcNEB3dwVqaxJ\nMmZ9pKKnyQ8H71A9hS33FeL3OSnDB1vAdQxagP/aHEtxPpV1xREo1lczP44Er664\nJggNQFavCHXjuNUzYThq0NhJEeaQbnmmqEz12+u6o7LxLOprQU9AdDzF2+Z6K+ds\nmRig+pH3BlaSPnClInldsliV5im/KEbEIGy/7ya88mthisj50WT44+q3jIOwmJU4\nGWaIwW90fxh9PV9ho4k15hwiJXmaxsmkECLNAfZcwQKBgQDcDSkpI+N3pdlVY02/\n/0uiUlspRnyYKPQ5bZlS+nhRNQI8zC+hZ4eQ1DyvIXEmytPJLF7j4IStf9G/QUwt\nvM9NTkjLxEZjDxjcjvyOVBwrf3z4YvInTPGk2cl0dGm0vzEKETj5OF36OqyntiVw\n4DHj+4lFt1UM/shJtny3VxcN+QKBgQC8QBLUUC5VoaTszOiYtgAPuNWQDVXc/qdV\nIKwjt1BIav2v1XD1SBTCX6Sw5Wd2qerEiIxfM2LS/ooi8ovB4Nxsm6pqQyaPb4E8\n35FO0N6EObBsE1MoG0o3c5bE4nYTOHsr1edW39+OrWnGSiqOts8clGQJTsev9ekM\nB+U9uADwqQKBgQDcCbj373Aci1XYgXUUoPcDeHC5xEcAbCtSZZqkk9rN8UCshMy4\nC+tOUjvgL4OS88x05I56NV7WkvKs2WGQdrWgKsC2KSztDwKgQcafl9GXWWMgiOh1\njgYv/qrobSPqXihuVaxv4QJwHk3ZYlTsGvMocrTgZqOAXCDxPK5XMpnWGQKBgQCN\n/Kn3F48LKYOy1A7v9/5t3VS/dT95E1302FLeEYrtRD2aHRw49SgrP2aBwlXaa+jW\nWcO+noyAZlqcZ2LAVjELfhH4WjPAZjMNTfdUgjgDdVu6+Ix1KLg+wOFMGR9D+gr1\nEj6OCQeenu+0DwawY/QtM0OMva3h61HesCnY9mtHGQKBgFbsje6ALl51o0JOY2Hv\ntpXbc4mcqQs9Rzp+Mp59eawogJx58dP83Q/ZasM7yGHPo/d5QAO+q2k3zx87l2Uc\nzV6GyGqExdbkPVWEA0yLCi4agampIvg8a1zKci1f+8WaXnHzcHUdbrTwI7TVxGaK\n68gj2IGGhMM8OWXH1ods0kZ4\n-----END PRIVATE KEY-----\n",
    client_email:
      "firebase-adminsdk-xgplg@smartparking-a2b6c.iam.gserviceaccount.com",
    client_id: "112025445827851923541",
    auth_uri: "https://accounts.google.com/o/oauth2/auth",
    token_uri: "https://oauth2.googleapis.com/token",
    auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
    client_x509_cert_url:
      "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-xgplg%40smartparking-a2b6c.iam.gserviceaccount.com",
    universe_domain: "googleapis.com",
  };

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

  const app = express();
  const port = 3001;

  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL:
      "https://smartparking-a2b6c-default-rtdb.asia-southeast1.firebasedatabase.app",
  });

  const database = admin.database();

  app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content-Type, Accept"
    );
    next();
  });

  app.use(bodyParser.json());

  // Route để lấy dữ liệu từ Firebase
  app.get("/parking_log", async (req, res) => {
    try {
      const snapshot = await database.ref("/parking_log").once("value");
      const data = snapshot.val();
      res.json(data);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  });

  app.get("/parking_log_day", async (req, res) => {
    try {
      var receiveData = req.query;
      var sendData;
      if (receiveData.date == undefined || receiveData.date == null){
        sendData = {error: "07-01-2024"};
      }
      else {
        var dateParts = receiveData.date.split("-");
        var formattedDate = dateParts[0] + "-" + dateParts[1] + "-" + dateParts[2];
        
        var totalIn = 0;
        var totalOut = 0;
        var dataIn = [
          0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
          0,
        ];
        var dataOut = [
          0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
          0,
        ];
        var dataInByHour = {
          labels: [
            "00",
            "01",
            "02",
            "03",
            "04",
            "05",
            "06",
            "07",
            "08",
            "09",
            "10",
            "11",
            "12",
            "13",
            "14",
            "15",
            "16",
            "17",
            "18",
            "19",
            "20",
            "21",
            "22",
            "23",
          ],
          datasets: [
            {
              label: "Số lượng xe vào",
              data: [],
            },
          ],
        };
        var dataOutByHour = {
          labels: [
            "00",
            "01",
            "02",
            "03",
            "04",
            "05",
            "06",
            "07",
            "08",
            "09",
            "10",
            "11",
            "12",
            "13",
            "14",
            "15",
            "16",
            "17",
            "18",
            "19",
            "20",
            "21",
            "22",
            "23",
          ],
          datasets: [
            {
              label: "Số lượng xe ra",
              data: [],
            },
          ],
        };
        database
          .ref("/parking_log")
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

            addData(dataIn, dataInByHour);
            addData(dataOut, dataOutByHour);
            
            sendData = {
              "total_in": totalIn,
              "total_out": totalOut,
              "data_in_by_hour": dataInByHour,
              "data_out_by_hour": dataOutByHour,
            };
            res.json(sendData);
          })
          .catch(function (error) {
            res.json({error: "07-01-2024"});
            console.log(error);
          });
      }

    } catch (error) {
      console.log(error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  });

  // POST:
  // data: {
  //   license_plate: string
  // }
  app.post("/vehicle_in_out_post", async (req, res) => {
    try {
      const data = req.body;

      const license_plate = data.license_plate;

      const time = moment().format("HH:mm:ss DD-MM-YYYY");

      database
        .ref("/parking_log")
        .orderByChild("license_plate")
        .equalTo(license_plate)
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
                    exit_time: time,
                  });
                }
              }
            });

            // Nếu có bản ghi không có entry_time hoặc exit_time, không thêm bản ghi mới
            if (!isRecordEntryWithoutTime) {
              // Thêm một dữ liệu mới
              database.ref("/parking_log").push({
                isCurrent: 1,
                license_plate: license_plate,
                entry_time: time,
                exit_time: "",
              });
            }
          } else {
            // Nếu không tồn tại, thêm một dữ liệu mới
            database.ref("/parking_log").push({
              isCurrent: 1,
              license_plate: license_plate,
              entry_time: time,
              exit_time: "",
            });
          }
        });
      res.json({ success: true, data: data });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  });

  app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
  });
}

startServerFirebase();

function addData(json, data) {
  data.datasets[0].data = json;
}
