const express = require('express');
const axios = require('axios');
const app = express();
app.use(express.json());

const PORT = 3002;

const PAYMENT_SERVICE_URL = 'http://localhost:3003/paymentprocess';
const NOTIFICATION_SERVICE_URL = 'http://localhost:3004/sendnotification';

let orders = [];
let orderIdCounter = 1;

app.post('/addorder', async (req, res) => {
  const { customerName, item, amount } = req.body;
  const orderId = orderIdCounter++;

  const newOrder = { orderId, customerName, item, amount, status: 'Placed' };
  orders.push(newOrder);

  try {
    console.log(`Order API -> Payment API: processing payment for order ${orderId}`);
    const paymentResponse = await axios.post(PAYMENT_SERVICE_URL, { orderId, amount });

    const paymentStatus = paymentResponse.data.status;
    newOrder.status = paymentStatus === 'Success' ? 'Payment Successful' : 'Payment Failed';
    console.log(`Payment API -> Order API: payment status = ${paymentStatus}`);

    console.log(`Order API -> Notification API: sending ${paymentStatus} notification`);
    const notificationResponse = await axios.post(NOTIFICATION_SERVICE_URL, {
      orderId,
      status: paymentStatus,
      message: `Hi ${customerName}, your order #${orderId} payment was a ${paymentStatus}.`
    });

    res.status(200).json({
      message: 'Order processed',
      order: newOrder,
      paymentResult: paymentResponse.data,
      notificationResult: notificationResponse.data
    });
  } catch (error) {
    res.status(500).json({ message: 'Error processing order', error: error.message });
  }
});

app.get('/vieworder', (req, res) => {
  const { orderId } = req.query;
  if (orderId) {
    const order = orders.find(o => o.orderId === parseInt(orderId));
    return res.status(200).json({ message: 'Order details', data: order || null });
  }
  res.status(200).json({ message: 'All orders', data: orders });
});

app.delete('/cancelorder', (req, res) => {
  const { orderId } = req.body;
  const order = orders.find(o => o.orderId === parseInt(orderId));
  if (!order) return res.status(404).json({ message: `Order ${orderId} not found` });
  order.status = 'Cancelled';
  res.status(200).json({ message: `Order ${orderId} has been cancelled`, data: order });
});

app.listen(PORT, () => {
  console.log(`Order Service is running on http://localhost:${PORT}`);
});