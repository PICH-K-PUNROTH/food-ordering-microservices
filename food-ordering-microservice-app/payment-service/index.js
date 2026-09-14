const express = require('express');
const app = express();
app.use(express.json());

const PORT = 3003;

app.post('/paymentprocess', (req, res) => {
  const { orderId, amount } = req.body;

  const isSuccess = Math.random() > 0.3;

  if (isSuccess) {
    res.status(200).json({
      status: 'Success',
      message: `Payment of $${amount} for order ${orderId} was successful`,
      orderId,
      transactionId: 'TXN' + Date.now()
    });
  } else {
    res.status(200).json({
      status: 'Failure',
      message: `Payment of $${amount} for order ${orderId} failed`,
      orderId
    });
  }
});

app.listen(PORT, () => {
  console.log(`Payment Service is running on http://localhost:${PORT}`);
});