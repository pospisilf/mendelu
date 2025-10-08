import nodemailer from 'nodemailer';

// In a real application, these would be environment variables
const EMAIL_USER = 'your-email@example.com';
const EMAIL_PASS = 'your-email-password';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: EMAIL_USER,
    pass: EMAIL_PASS,
  },
});

interface OrderDetails {
  orderId: string;
  customerName: string;
  customerEmail: string;
  items: Array<{
    name: string;
    quantity: number;
    price: number;
  }>;
  total: number;
}

export const sendOrderConfirmation = async (orderDetails: OrderDetails) => {
  const { orderId, customerName, customerEmail, items, total } = orderDetails;

  const mailOptions = {
    from: EMAIL_USER,
    to: customerEmail,
    subject: `Order Confirmation - Order #${orderId}`,
    html: `
      <h1>Thank you for your order!</h1>
      <p>Dear ${customerName},</p>
      <p>Your order has been received and is being processed.</p>
      <h2>Order Details</h2>
      <p>Order ID: ${orderId}</p>
      <h3>Items:</h3>
      <ul>
        ${items
          .map(
            item => `
          <li>${item.name} x ${item.quantity} - $${(
            item.price * item.quantity
          ).toFixed(2)}</li>
        `
          )
          .join('')}
      </ul>
      <h3>Total: $${total.toFixed(2)}</h3>
      <p>We will send you another email when your order ships.</p>
      <p>Thank you for shopping with us!</p>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('Order confirmation email sent successfully');
  } catch (error) {
    console.error('Error sending order confirmation email:', error);
    throw error;
  }
}; 