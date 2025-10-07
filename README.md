# Food Delivery Platform 🍔

This is a full-stack **real-time food delivery platform** built with the MERN stack (MongoDB, Express, React, Node.js) and Socket.IO. It connects users, restaurants, and delivery personnel in a seamless, real-time environment.

**Live Demo:** [Go to Site](https://yummigoo.onrender.com)

## 📜 Table of Contents

- [Project Overview](#-project-overview)
- [Key Features](#-key-features)
- [Working of the Complete Project](#-working-of-the-complete-project)
- [Folder Structure](#-folder-structure)
- [Tech Stack](#-tech-stack)
- [Database Schema](#-database-schema)
- [API Endpoints Summary](#-api-endpoints-summary)
- [Detailed READMEs](#-detailed-readmes)
- [Setup and Installation](#-setup-and-installation)
- [Contributing](#-contributing)
- [Contact](#-contact)

## 📝 Project Overview

The Real-Time Food Delivery Website is a comprehensive solution for online food ordering and delivery. It provides a platform for users to browse restaurants, place orders, and track their delivery in real-time. The project is designed with a multi-role system, catering to the needs of customers, restaurant owners, and delivery personnel. The frontend is a modern and responsive single-page application built with React, while the backend is a robust and scalable server built with Node.js and Express.


## ✨ Key Features

-   **Multi-Role System:** Dedicated interfaces and functionalities for **Customers**, **Restaurant Owners**, and **Delivery Personnel**. 🧑‍🤝‍🧑
-   **Secure Authentication:** Secure user authentication with **email/password** and **Google Auth**. 🔐
-   **Restaurant and Menu Management:** Restaurant owners can create and manage their restaurant profile and menu items. 🍽️
-   **Order Management:** Owners can view and manage incoming orders and update their status. 📈
-   **Delivery Assignment System:** A system for assigning delivery tasks to available delivery personnel. 🛵
-   **Online Payments:** Integration with **Razorpay** for secure online payments. 💳
-   **Item Rating Feature:** Users can **rate** the food items they have ordered. ⭐
-   **Delivery Boy Dashboard with Earning Tracking:** A dedicated dashboard for delivery boys to track their **earnings**. 💰
-   **Real-Time Order and Delivery Boy Tracking:** Users can track their food orders and the delivery boy's location in **real-time** on a map. 🗺️
-   **Responsive Design:** A fully responsive user interface that works on all devices. 📱


## 🚀 Working of the Complete Project

The platform operates with a seamless workflow for all user roles:

### 1. Customer Journey
1.  **Authentication:** Users can **sign up** or **sign in** using their email and password or their Google account.
2.  **Location-Based Discovery:** The application prompts the user for their city to display a list of local restaurants.
3.  **Browse and Select:** Users can browse through the list of restaurants, view their menus, and add items to their cart.
4.  **Cart and Checkout:** Users can review their cart and proceed to a secure checkout page to provide their delivery address.
5.  **Place Order:** Users can place their order and choose between **Cash on Delivery (COD)** or **Online Payment** via Razorpay.
6.  **Real-Time Tracking:** After placing the order, users can track the order status and the delivery boy's location in real-time on a map.

### 2. Restaurant Owner Journey
1.  **Registration:** Restaurant owners can sign up with the "Owner" role.
2.  **Shop Creation:** Owners can set up their restaurant's profile, including name, address, and images, through a dedicated dashboard.
3.  **Menu Management:** Owners can add, edit, or delete food items from their menu.
4.  **Order Management:** Owners receive new orders in real-time on their dashboard. They can update the order status (e.g., "Preparing," "Out for Delivery").

### 3. Delivery Partner Journey
1.  **Availability:** Delivery personnel can set their status to **online** to receive delivery requests.
2.  **Order Assignment:** When an order is marked as "Out for Delivery" by a restaurant owner, a notification is broadcasted to all nearby available delivery personnel.
3.  **Accepting Orders:** The first delivery person to accept the request is assigned the order.
4.  **Delivery and Tracking:** The delivery person picks up the order and their location is tracked by the customer in real-time until the order is delivered.

## 📂 Folder Structure

```
.
├── backend/
│   ├── config/
│   ├── controllers/
│   ├── middlewares/
│   ├── models/
│   ├── routes/
│   ├── utils/
│   ├── .gitignore
│   ├── index.js
│   ├── package.json
│   └── socket.js
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── assets/
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── pages/
│   │   └── redux/
│   ├── .gitignore
│   ├── eslint.config.js
│   ├── firebase.js
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
└── README.md
```

## 🛠️ Tech Stack

### Frontend

| Technology | Purpose |
| :--- | :--- |
| **React** | A JavaScript library for building user interfaces. |
| **Vite** | Next-generation frontend tooling for a faster development experience. |
| **Redux Toolkit** | For efficient and predictable state management. |
| **Tailwind CSS** | A utility-first CSS framework for rapid UI development. |
| **React Router** | For client-side routing and navigation. |
| **Leaflet** | An open-source JavaScript library for interactive maps. |
| **Socket.IO Client**| For real-time, bidirectional communication. |
| **Axios** | A promise-based HTTP client for making API requests. |
| **Firebase** | For user authentication (Email/Password, Google Sign-In). |
| **Recharts** | A composable charting library for data visualization. |

### Backend

| Technology | Description |
| --- | --- |
| **Node.js** | A JavaScript runtime for executing server-side code. |
| **Express.js** | A web application framework for Node.js. |
| **MongoDB** | A NoSQL database for storing data in flexible, JSON-like documents. |
| **Socket.IO** | Enables real-time, bidirectional, and event-based communication. |
| **JWT** | For authentication and authorization. |
| **Cloudinary** | A cloud-based service for image and video management. |
| **Razorpay** | A payment gateway for online payment processing. |
| **Nodemailer** | A module for sending emails from Node.js applications. |

## 🗃️ Database Schema

The database schema is designed to be flexible and scalable. It consists of the following collections:

### `users`

Stores information about all users of the platform, including their role.

-   `fullName` (String, required): The full name of the user.
-   `email` (String, required, unique): The email address of the user.
-   `password` (String): The hashed password of the user.
-   `mobile` (String, required): The mobile number of the user.
-   `role` (String, enum: `['user', 'owner', 'deliveryBoy']`, required): The role of the user.
-   `resetOtp` (String): The OTP for resetting the password.
-   `isOtpVerified` (Boolean, default: `false`): A flag to indicate if the OTP has been verified.
-   `otpExpires` (Date): The expiration date of the OTP.
-   `location` (Object): The location of the user.
    -   `type` (String, enum: `['Point']`, default: `'Point'`): The type of the location.
    -   `coordinates` (Array, default: `[0, 0]`): The coordinates of the location.
-   `socketId` (String): The socket ID of the user.
-   `isOnline` (Boolean, default: `false`): A flag to indicate if the user is online.

### `shops`

Stores information about the restaurants (shops).

-   `name` (String, required): The name of the shop.
-   `image` (String, required): The URL of the shop's image.
-   `owner` (ObjectId, ref: `'User'`, required): The owner of the shop.
-   `city` (String, required): The city where the shop is located.
-   `state` (String, required): The state where the shop is located.
-   `address` (String, required): The address of the shop.
-   `items` (Array, ref: `'Item'`): A list of items available in the shop.

### `items`

Stores information about the food items on the menu.

-   `name` (String, required): The name of the item.
-   `image` (String, required): The URL of the item's image.
-   `shop` (ObjectId, ref: `'Shop'`): The shop to which the item belongs.
-   `category` (String, enum: `[...]`, required): The category of the item.
-   `price` (Number, min: `0`, required): The price of the item.
-   `foodType` (String, enum: `['veg', 'non veg']`, required): The food type of the item.
-   `rating` (Object): The rating of the item.
    -   `average` (Number, default: `0`): The average rating of the item.
    -   `userCount` (Number, default: `0`): The number of users who have rated the item.

### `orders`

Stores information about the orders placed by users.

-   `user` (ObjectId, ref: `'User'`): The user who placed the order.
-   `paymentMethod` (String, enum: `['COD', 'Online']`, required): The payment method for the order.
-   `deliveryAddress` (Object): The delivery address for the order.
    -   `text` (String): The text of the address.
    -   `latitude` (Number): The latitude of the address.
    -   `longitude` (Number): The longitude of the address.
-   `totalAmount` (Number): The total amount of the order.
-   `shopOrders` (Array): A list of shop orders.
    -   `shop` (ObjectId, ref: `'Shop'`): The shop from which the order was placed.
    -   `owner` (ObjectId, ref: `'User'`): The owner of the shop.
    -   `subtotal` (Number): The subtotal of the shop order.
    -   `shopOrderItems` (Array): A list of items in the shop order.
        -   `item` (ObjectId, ref: `'Item'`, required): The item in the order.
        -   `name` (String): The name of the item.
        -   `price` (Number): The price of the item.
        -   `quantity` (Number): The quantity of the item.
    -   `status` (String, enum: `['Pending', 'Preparing', 'Out for Delivery', 'Delivered']`, default: `'Pending'`): The status of the shop order.
    -   `assignment` (ObjectId, ref: `'DeliveryAssignment'`, default: `null`): The delivery assignment for the shop order.
    -   `assignedDeliveryBoy` (ObjectId, ref: `'User'`): The delivery boy assigned to the shop order.
    -   `deliveryOtp` (String, default: `null`): The OTP for delivery confirmation.
    -   `otpExpires` (Date, default: `null`): The expiration date of the OTP.
    -   `deliveredAt` (Date, default: `null`): The date and time when the order was delivered.
-   `payment` (Boolean, default: `false`): A flag to indicate if the payment has been made.
-   `razorpayOrderId` (String, default: `''`): The Razorpay order ID.
-   `razorpayPaymentId` (String, default: `''`): The Razorpay payment ID.

### `deliveryAssignments`

Stores information about the delivery assignments for delivery personnel.

-   `order` (ObjectId, ref: `'Order'`): The order for which the assignment is created.
-   `shop` (ObjectId, ref: `'Shop'`): The shop from which the order is to be picked up.
-   `shopOrderId` (ObjectId, required): The ID of the shop order.
-   `broadcastedTo` (Array, ref: `'User'`): A list of delivery personnel to whom the assignment is broadcasted.
-   `assignedTo` (ObjectId, ref: `'User'`, default: `null`): The delivery person to whom the assignment is assigned.
-   `status` (String, enum: `['BroadCasted', 'Assigned', 'Completed']`, default: `'BroadCasted'`): The status of the assignment.
-   `acceptedAt` (Date): The date and time when the assignment was accepted.

## 📖 API Endpoints Summary

### Authentication

| Route | Method | Purpose |
| --- | --- | --- |
| `/api/auth/signup` | `POST` | Register a new user |
| `/api/auth/signin` | `POST` | Login a user |
| `/api/auth/signout` | `GET` | Logout a user |
| `/api/auth/send-otp` | `POST` | Send an OTP to the user's email |
| `/api/auth/verify-otp` | `POST` | Verify the OTP |
| `/api/auth/reset-password` | `POST` | Reset the user's password |
| `/api/auth/google-auth` | `POST` | Google authentication |

### User

| Route | Method | Purpose |
| --- | --- | --- |
| `/api/user/current` | `GET` | Get the current user |
| `/api/user/update-location` | `POST` | Update the user's location |

### Shop

| Route | Method | Purpose |
| --- | --- | --- |
| `/api/shop/create-edit` | `POST` | Create or edit a shop |
| `/api/shop/get-my` | `GET` | Get the current user's shop |
| `/api/shop/get-by-city/:city` | `GET` | Get all shops in a city |

### Item

| Route | Method | Purpose |
| --- | --- | --- |
| `/api/item/add-item` | `POST` | Add a new item to a shop |
| `/api/item/edit-item/:itemId` | `POST` | Edit an item |
| `/api/item/get-by-id/:itemId` | `GET` | Get an item by its ID |
| `/api/item/delete/:itemId` | `GET` | Delete an item |
| `/api/item/get-by-city/:city` | `GET` | Get all items in a city |
| `/api/item/get-by-shop/:shopId` | `GET` | Get all items in a shop |
| `/api/item/search-items` | `GET` | Search for items |
| `/api/item/rating` | `POST` | Rate an item |

### Order

| Route | Method | Purpose |
| --- | --- | --- |
| `/api/order/place-order` | `POST` | Place a new order |
| `/api/order/verify-payment` | `POST` | Verify an online payment |
| `/api/order/my-orders` | `GET` | Get all orders for the current user |
| `/api/order/get-assignments` | `GET` | Get all delivery assignments for the current delivery boy |
| `/api/order/get-current-order` | `GET` | Get the current order for the delivery boy |
| `/api/order/send-delivery-otp` | `POST` | Send a delivery OTP to the user |
| `/api/order/verify-delivery-otp` | `POST` | Verify the delivery OTP |
| `/api/order/update-status/:orderId/:shopId` | `POST` | Update the status of an order |
| `/api/order/accept-order/:assignmentId` | `GET` | Accept a delivery assignment |
| `/api/order/get-order-by-id/:orderId` | `GET` | Get an order by its ID |
| `/api/order/get-today-deliveries` | `GET` | Get all deliveries for the current delivery boy for the current day |

## 📚 Detailed READMEs

For more detailed information about the frontend and backend, please refer to their respective README files:

-   [Frontend README](./frontend/README.md)
-   [Backend README](./backend/README.md)


## 🚀 Setup and Installation

### Prerequisites

-   Node.js (v18.x or higher)
-   npm (or yarn)
-   MongoDB account (for the database)
-   Cloudinary account (for image storage)
-   Razorpay account (for payments)

### Backend Setup

1.  **Navigate to the backend directory:**
    ```bash
    cd backend
    ```
2.  **Install dependencies:**
    ```bash
    npm install
    ```
3.  **Create a `.env` file and add the following environment variables:**
    ```
    PORT=4000
    MONGO_URI=your-mongodb-connection-string
    JWT_SECRET=your-jwt-secret
    CLOUDINARY_CLOUD_NAME=your-cloudinary-cloud-name
    CLOUDINARY_API_KEY=your-cloudinary-api-key
    CLOUDINARY_API_SECRET=your-cloudinary-api-secret
    RAZORPAY_KEY_ID=your-razorpay-key-id
    RAZORPAY_KEY_SECRET=your-razorpay-key-secret
    EMAIL=your-email
    PASSWORD=your-email-password
    ```
4.  **Start the backend server:**
    ```bash
    npm start
    ```

### Frontend Setup

1.  **Navigate to the frontend directory:**
    ```bash
    cd frontend
    ```
2.  **Install dependencies:**
    ```bash
    npm install
    ```
3.  **Create a `.env` file and add the following environment variables:**
    ```
    # Firebase Configuration
    VITE_FIREBASE_API_KEY="your_firebase_api_key"
    VITE_FIREBASE_AUTH_DOMAIN="your_firebase_auth_domain"
    VITE_FIREBASE_PROJECT_ID="your_firebase_project_id"
    VITE_FIREBASE_STORAGE_BUCKET="your_firebase_storage_bucket"
    VITE_FIREBASE_MESSAGING_SENDER_ID="your_firebase_messaging_sender_id"
    VITE_FIREBASE_APP_ID="your_firebase_app_id"

    # Backend API URL
    VITE_API_URL="http://localhost:4000/api"
    ```
4.  **Start the frontend development server:**
    ```bash
    npm run dev
    ```


## 🙌 Contributing

Contributions are welcome! If you have any ideas, suggestions, or bug reports, please open an issue or create a pull request. 

## 📞 Contact

**Saksham Agrahari**

-   **GitHub:** [@saksham2882](https://github.com/saksham2882)
-   **Portfolio:** [saksham-agrahari.vercel.app](https://saksham-agrahari.vercel.app)
