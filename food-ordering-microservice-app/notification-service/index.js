const express = require('express');
const app = express();
app.use(express.json());

const PORT = 3004;

app.post('/sendnotification', (req, res) => {
  const { orderId, status, message } = req.body;

  res.status(200).json({
    message: 'Notification sent to user',
    orderId,
    status,
    notificationText: message || `Your order ${orderId} payment status: ${status}`
  });
});

app.listen(PORT, () => {
  console.log(`Notification Service is running on http://localhost:${PORT}`);
});