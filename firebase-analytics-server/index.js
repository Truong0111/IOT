import admin from "firebase-admin";
import express from "express";

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

  // Route để lấy dữ liệu từ Firebase
  app.get("/parking_log_json", async (req, res) => {
    try {
      const snapshot = await admin.database().ref("/parking_log").once("value");
      const data = snapshot.val();
      res.json(data);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  });

  app.get("/database_key", async (req, res) => {
    try {
      res.json(firebaseConfig);
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
