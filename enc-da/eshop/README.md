# Coffee & Tea E-Shop

A simple e-commerce application for selling coffee, tea, and related accessories. Built with React, TypeScript, and Material-UI.

## Features

- Browse products by category (Coffee, Tea, Accessories)
- Add products to shopping cart
- User registration and login
- Checkout process
- Order confirmation emails
- Responsive design with pastel color scheme

## Prerequisites

- Node.js (v14 or higher)
- npm (v6 or higher)

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd da-eshop
```

2. Install dependencies:
```bash
npm install
```

3. Configure email service:
   - Open `src/utils/emailService.ts`
   - Update `EMAIL_USER` and `EMAIL_PASS` with your email credentials
   - Note: For Gmail, you'll need to use an App Password if 2FA is enabled

## Running the Application

1. Start the development server:
```bash
npm run dev
```

2. Open your browser and navigate to:
```
http://localhost:5173
```

## Project Structure

```
src/
  ├── components/     # Reusable UI components
  ├── context/       # React context providers
  ├── data/          # JSON data files
  ├── pages/         # Page components
  ├── types/         # TypeScript type definitions
  ├── utils/         # Utility functions
  ├── App.tsx        # Main application component
  └── main.tsx       # Application entry point
```

## Technologies Used

- React
- TypeScript
- Material-UI
- React Router
- Nodemailer

## Notes

- This is a frontend-only demo application
- Data is stored in JSON files
- Email functionality requires valid email credentials
- No actual payment processing is implemented
