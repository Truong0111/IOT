const express = require('express');
const admin = require('firebase-admin');

const serviceAccount = require('../credential.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://smartparking-a2b6c-default-rtdb.asia-southeast1.firebasedatabase.app'
});

const app = express();
const port = 3000;

// Middleware để cho phép CORS (nếu bạn chạy server và client trên các domain khác nhau)
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

// Route để lấy dữ liệu từ Firebase
app.get('/analytics', async (req, res) => {
  try {
    const snapshot = await admin.database().ref('/parking_log').once('value');
    const data = snapshot.val();
    res.json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
