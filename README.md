# FoodXpress: Food Delivery Platform 🍔

This is a full-stack **real-time food delivery platform** built with the MERN stack (MongoDB, Express, React, Node.js) and Socket.IO. It connects users, restaurants, and delivery personnel in a seamless, real-time environment.

[![React](https://img.shields.io/badge/React-blue?logo=react)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-purple?logo=vite)](https://vitejs.dev/)
[![Redux Toolkit](https://img.shields.io/badge/Redux_Toolkit-purple?logo=redux)](https://redux-toolkit.js.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-cyan?logo=tailwind-css)](https://tailwindcss.com/)
[![Leaflet](https://img.shields.io/badge/Leaflet-green?logo=leaflet)](https://leafletjs.com/)
[![Socket.IO](https://img.shields.io/badge/Socket.IO-black?logo=socketdotio)](https://socket.io/)
[![Sonner](https://img.shields.io/badge/Sonner-orange?logo=sonos)](https://sonner.emilkowal.ski/)
[![Axios](https://img.shields.io/badge/Axios-blue?logo=axios)](https://axios-http.com/)
[![Shadcn UI](https://img.shields.io/badge/Shadcn_UI-black?logo=shadcnui)](https://ui.shadcn.com/)
[![Node.js](https://img.shields.io/badge/Node.js-339933?logo=node.js&logoColor=white)](https://nodejs.org/)
[![Express.js](https://img.shields.io/badge/Express.js-black?logo=express&logoColor=white)](https://expressjs.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![JWT](https://img.shields.io/badge/JWT-grey?logo=jsonwebtokens&logoColor=white)](https://jwt.io/)
[![Cloudinary](https://img.shields.io/badge/Cloudinary-3448C5?logo=cloudinary&logoColor=white)](https://cloudinary.com/)
[![Razorpay](https://img.shields.io/badge/Razorpay-02042B?logo=razorpay&logoColor=white)](https://razorpay.com/)
[![Nodemailer](https://img.shields.io/badge/Nodemailer-0078D4?logo=mail.ru&logoColor=white)](https://nodemailer.com/about/)
[![Zod](https://img.shields.io/badge/Zod-black?logo=zod)](https://zod.dev/)
[![Morgan](https://img.shields.io/badge/Morgan-blue?logo=morgan)](https://github.com/expressjs/morgan)
[![Helmet](https://img.shields.io/badge/Helmet-blue?logo=helmet)](https://helmetjs.github.io/)
[![Express Rate Limit](https://img.shields.io/badge/Express_Rate_Limit-339933?logo=express)](https://github.com/expressjs/rate-limit)


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

## 🌐 Live Demo: [Link](https://foodxpress-in.vercel.app)

## 📝 Project Overview

The Real-Time Food Delivery Website is a comprehensive solution for online food ordering and delivery. It provides a platform for users to browse restaurants, place orders, and track their delivery in real-time. The project is designed with a multi-role system, catering to the needs of customers, restaurant owners, and delivery personnel. The frontend is a modern and responsive single-page application built with React, while the backend is a robust and scalable server built with Node.js and Express.

### 📸 ScreenShots

![Landing Page](./screenshots/user/banner.png) 

**NOTES:** For more specific screenshots, please visit the [screenshots](./screenshots) folder OR expand the below Interface details.

<details>
<summary><strong>📱 User Interface (Click to Expand)</strong></summary>

|                                                                               |
| :---------------------------------------------------------------------------: |
|      ![Sign Up](./screenshots/user/signup.png) <br> **Sign Up**               |
|         ![Menu](./screenshots/user/menu.png) <br> **Restaurant Menu**         |
|       ![Food Items](./screenshots/user/items.png) <br> **Food Items**         |
|   ![Item Details](./screenshots/user/item-dialog.png) <br> **Item Details**   |
|     ![Shop Listing](./screenshots/user/shop.png) <br> **Shop Listing**        |
|        ![Cart](./screenshots/user/cart.png) <br> **Shopping Cart**            |
|        ![Checkout](./screenshots/user/checkout.png) <br> **Checkout**         |  
|     ![Payment](./screenshots/user/upi-payment.png) <br> **Payment**           |
|  ![Order Placed](./screenshots/user/order-placed.png) <br> **Order Placed**   |
|   ![My Orders](./screenshots/user/my-orders.png) <br> **Order History**       |
| ![Order Details](./screenshots/user/order-details.png) <br> **Order Details** | 
| ![Live Tracking](./screenshots/user/track-order.png) <br> **Live Tracking**   |
|       ![Profile](./screenshots/user/profile.png) <br> **User Profile**        |

</details>

<details>
<summary><strong>🏪 Owner Interface (Click to Expand)</strong></summary>

|                                                                          |
| :----------------------------------------------------------------------: |
| ![Dashboard](./screenshots/owner/dashboard.png) <br> **Owner Dashboard** | 
| ![Manage Orders](./screenshots/owner/orders.png) <br> **Manage Orders**  |
| ![Add Item](./screenshots/owner/add-item.png) <br> **Add Food Item**     |
| ![Edit Shop](./screenshots/owner/edit-shop.png) <br> **Edit Shop**       |
| ![Profile](./screenshots/owner/profile.png) <br> **Owner Profile**       |

</details>

## ✨ Key Features

- **Multi-Role System:** Dedicated interfaces and functionalities for **Customers**, **Restaurant Owners**, and **Delivery Personnel**. 🧑‍🤝‍🧑
- **Secure Authentication:** Secure user authentication with **email/password** and **Google Auth**. 🔐
- **Restaurant and Menu Management:** Restaurant owners can create and manage their restaurant profile and menu items. 🍽️
- **Order Management:** Owners can view and manage incoming orders and update their status. 📈
- **Delivery Assignment System:** A system for assigning delivery tasks to available delivery personnel. 🛵
- **Online Payments:** Integration with **Razorpay** for secure online payments. 💳
- **Item Rating Feature:** Users can **rate** the food items they have ordered. ⭐
- **Delivery Boy Dashboard with Earning Tracking:** A dedicated dashboard for delivery boys to track their **earnings**. 💰
- **Real-Time Order and Delivery Boy Tracking:** Users can track their food orders and the delivery boy's location in **real-time** on a map. 🗺️
- **Responsive Design:** A fully responsive user interface that works on all devices. 📱
- **Modern Landing Page:** A visually stunning landing page showcasing features, testimonials, and popular categories. 🆕
- **Rich Profile Management:** Users can manage their details, view saved addresses, and update security settings. 👤


## 🏗️ System Architecture & Workflow

### 1. Customer Journey Flow

A high-level view of how a customer interacts with the platform.

```mermaid
graph TD
    A[Landing Page] -->|Login/Signup| B[Auth Pages]
    B -->|Success| C[Home Page]
    C -->|Select City| D[Shop Listing]
    D -->|Select Shop| E[Shop Details]
    E -->|Add Items| F[Cart]
    F -->|Checkout| G[Payment & Address]
    G -->|Order Placed| H[Order Success]
    H -->|Track| I[Live Tracking]
    I -->|Socket Updates| I
```

### 2. Order Fulfillment Workflow (Backend)

The detailed interaction between the User, Server, Database, Shop, and Delivery Boy during an order cycle.

```mermaid
sequenceDiagram
    participant User
    participant Server
    participant DB as MongoDB
    participant Shop
    participant DeliveryBoy

    Note over User, Server: 1. Order Placement
    User->>Server: POST /api/order/place-order
    Server->>DB: Save Order (Status: Pending)
    Server-->>Shop: Socket Emit: 'newOrder'
    Server-->>User: Response: Order Placed

    Note over Shop, Server: 2. Order Preparation
    Shop->>Server: POST /api/order/update-status (Preparing)
    Server->>DB: Update Status
    Server-->>User: Socket Emit: 'orderStatusUpdate'

    Note over Shop, Server: 3. Out for Delivery
    Shop->>Server: POST /api/order/update-status (Out for Delivery)
    Server->>DB: Update Status & Create Assignment
    Server-->>DeliveryBoy: Socket Emit: 'newDeliveryAssignment' (Broadcast)

    Note over DeliveryBoy, Server: 4. Delivery Assignment
    DeliveryBoy->>Server: GET /api/order/accept-order/:id
    Server->>DB: Update Assignment (Assigned)
    Server-->>DeliveryBoy: Response: Success

    Note over DeliveryBoy, User: 5. Live Tracking
    DeliveryBoy->>Server: Socket Emit: 'updateLocation'
    Server-->>User: Socket Emit: 'updateDeliveryLocation'

    Note over DeliveryBoy, Server: 6. Delivery Confirmation
    User->>DeliveryBoy: Shares Delivery OTP
    DeliveryBoy->>Server: POST /api/order/verify-delivery-otp
    Server->>DB: Mark Order Delivered
    Server-->>User: Socket Emit: 'orderStatusUpdate' (Delivered)
```


## 🚀 Role Specific Working

### 1. Customer Side Working
1.  **Authentication:** Users can **sign up** or **sign in** using their email and password or their Google account.
2.  **Location-Based Discovery:** The application prompts the user for their city to display a list of local restaurants.
3.  **Browse and Select:** Users can browse through the list of restaurants, view their menus, and add items to their cart.
4.  **Cart and Checkout:** Users can review their cart and proceed to a secure checkout page to provide their delivery address.
5.  **Place Order:** Users can place their order and choose between **Cash on Delivery (COD)** or **Online Payment** via Razorpay.
6.  **Real-Time Tracking:** After placing the order, users can track the order status and the delivery boy's location in real-time on a map.

### 2. Restaurant Owner Side Working
1.  **Registration:** Restaurant owners can sign up with the "Owner" role.
2.  **Shop Creation:** Owners can set up their restaurant's profile, including name, address, and images, through a dedicated dashboard.
3.  **Menu Management:** Owners can add, edit, or delete food items from their menu.
4.  **Order Management:** Owners receive new orders in real-time on their dashboard. They can update the order status (e.g., "Preparing," "Out for Delivery").

### 3. Delivery Partner Side Working
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

| Technology           | Purpose                                                                                      |
| :------------------- | :------------------------------------------------------------------------------------------- |
| **React**            | A JavaScript library for building user interfaces and managing component-based architecture. |
| **Vite**             | A next-generation frontend tooling that provides a faster and leaner development experience. |
| **React Router**     | For handling client-side routing and navigation between different pages.                     |
| **Redux Toolkit**    | The official, opinionated, batteries-included toolset for efficient Redux development.       |
| **Tailwind CSS**     | A utility-first CSS framework for rapidly building custom user interfaces.                   |
| **Axios**            | A promise-based HTTP client for making API requests to the backend.                          |
| **Firebase**         | Used for user authentication (Email/Password, Google Sign-In).                               |
| **Socket.IO Client** | For enabling real-time, bidirectional communication for order tracking.                      |
| **Shadcn UI**        | A collection of re-usable components built using Radix UI and Tailwind CSS.                  |
| **React Leaflet**    | React components for Leaflet maps to show real-time tracking.                                |
| **Lucide React**     | Beautiful & consistent icon library.                                                         |

### Backend

| Technology                | Description                                                                                                                                     |
| ------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------- |
| **Node.js**               | A JavaScript runtime environment that allows for the execution of JavaScript code on the server-side. It is known for its speed and efficiency. |
| **Express.js**            | A minimal and flexible Node.js web application framework that provides a robust set of features for web and mobile applications.                |
| **MongoDB**               | A NoSQL database that stores data in flexible, JSON-like documents. It is known for its scalability and performance.                            |
| **Socket.IO**             | A library that enables real-time, bidirectional, and event-based communication between web clients and servers.                                 |
| **JWT (JSON Web Tokens)** | A compact, URL-safe means of representing claims to be transferred between two parties. It is used for authentication and authorization.        |
| **Cloudinary**            | A cloud-based image and video management service. It is used to store and serve all the images for the platform.                                |
| **Razorpay**              | A payment gateway that allows for online payment processing.                                                                                    |
| **Nodemailer**            | A module for Node.js applications that simplifies email sending.                                                                          |
| **Winston**               | A logger for just about everything.                                                                                                             |
| **Zod**                   | TypeScript-first schema declaration and validation library.                                                                                     |
| **Helmet**                | Helps secure Express apps by setting various HTTP headers.                                                                                      |
| **Morgan**                | HTTP request logger middleware for node.js.                                                                                                     |
| **Express Rate Limit**    | Basic rate-limiting middleware for Express.                                                                                                     |

## 🗃️ Database Schema

The database schema is designed to be flexible and scalable. It consists of the following collections:

### `users`

Stores information about all users of the platform, including their role.

- `fullName` (String, required): The full name of the user.
- `email` (String, required, unique): The email address of the user.
- `password` (String): The hashed password of the user.
- `mobile` (String, required): The mobile number of the user.
- `role` (String, enum: `['user', 'owner', 'deliveryBoy']`, required): The role of the user.
- `resetOtp` (String): The OTP for resetting the password.
- `isOtpVerified` (Boolean, default: `false`): A flag to indicate if the OTP has been verified.
- `otpExpires` (Date): The expiration date of the OTP.
- `location` (Object): The location of the user.
  - `type` (String, enum: `['Point']`, default: `'Point'`): The type of the location.
  - `coordinates` (Array, default: `[0, 0]`): The coordinates of the location.
- `socketId` (String): The socket ID of the user.
- `isOnline` (Boolean, default: `false`): A flag to indicate if the user is online.

### `shops`

Stores information about the restaurants (shops).

- `name` (String, required): The name of the shop.
- `image` (String, required): The URL of the shop's image.
- `owner` (ObjectId, ref: `'User'`, required): The owner of the shop.
- `city` (String, required): The city where the shop is located.
- `state` (String, required): The state where the shop is located.
- `address` (String, required): The address of the shop.
- `items` (Array, ref: `'Item'`): A list of items available in the shop.

### `items`

Stores information about the food items on the menu.

- `name` (String, required): The name of the item.
- `image` (String, required): The URL of the item's image.
- `shop` (ObjectId, ref: `'Shop'`): The shop to which the item belongs.
- `category` (String, enum: `[...]`, required): The category of the item.
- `price` (Number, min: `0`, required): The price of the item.
- `foodType` (String, enum: `['veg', 'non-veg']`, required): The food type of the item.
- `rating` (Object): The rating of the item.
  - `average` (Number, default: `0`): The average rating of the item.
  - `userCount` (Number, default: `0`): The number of users who have rated the item.

### `orders`

Stores information about the orders placed by users.

- `user` (ObjectId, ref: `'User'`): The user who placed the order.
- `paymentMethod` (String, enum: `['COD', 'Online']`, required): The payment method for the order.
- `deliveryAddress` (Object): The delivery address for the order.
  - `text` (String): The text of the address.
  - `latitude` (Number): The latitude of the address.
  - `longitude` (Number): The longitude of the address.
- `totalAmount` (Number): The total amount of the order.
- `shopOrders` (Array): A list of shop orders.
  - `shop` (ObjectId, ref: `'Shop'`): The shop from which the order was placed.
  - `owner` (ObjectId, ref: `'User'`): The owner of the shop.
  - `subtotal` (Number): The subtotal of the shop order.
  - `shopOrderItems` (Array): A list of items in the shop order.
    - `item` (ObjectId, ref: `'Item'`, required): The item in the order.
    - `name` (String): The name of the item.
    - `price` (Number): The price of the item.
    - `quantity` (Number): The quantity of the item.
  - `status` (String, enum: `['Pending', 'Preparing', 'Out for Delivery', 'Delivered']`, default: `'Pending'`): The status of the shop order.
  - `assignment` (ObjectId, ref: `'DeliveryAssignment'`, default: `null`): The delivery assignment for the shop order.
  - `assignedDeliveryBoy` (ObjectId, ref: `'User'`): The delivery boy assigned to the shop order.
  - `deliveryOtp` (String, default: `null`): The OTP for delivery confirmation.
  - `otpExpires` (Date, default: `null`): The expiration date of the OTP.
  - `deliveredAt` (Date, default: `null`): The date and time when the order was delivered.
- `payment` (Boolean, default: `false`): A flag to indicate if the payment has been made.
- `razorpayOrderId` (String, default: `''`): The Razorpay order ID.
- `razorpayPaymentId` (String, default: `''`): The Razorpay payment ID.

### `deliveryAssignments`

Stores information about the delivery assignments for delivery personnel.

- `order` (ObjectId, ref: `'Order'`): The order for which the assignment is created.
- `shop` (ObjectId, ref: `'Shop'`): The shop from which the order is to be picked up.
- `shopOrderId` (ObjectId, required): The ID of the shop order.
- `broadcastedTo` (Array, ref: `'User'`): A list of delivery personnel to whom the assignment is broadcasted.
- `assignedTo` (ObjectId, ref: `'User'`, default: `null`): The delivery person to whom the assignment is assigned.
- `status` (String, enum: `['BroadCasted', 'Assigned', 'Completed']`, default: `'BroadCasted'`): The status of the assignment.
- `acceptedAt` (Date): The date and time when the assignment was accepted.


## 📖 API Endpoints Summary

### Authentication

| Route                      | Method | Purpose                         |
| -------------------------- | ------ | ------------------------------- |
| `/api/auth/signup`         | `POST` | Register a new user             |
| `/api/auth/signin`         | `POST` | Login a user                    |
| `/api/auth/signout`        | `GET`  | Logout a user                   |
| `/api/auth/send-otp`       | `POST` | Send an OTP to the user's email |
| `/api/auth/verify-otp`     | `POST` | Verify the OTP                  |
| `/api/auth/reset-password` | `POST` | Reset the user's password       |
| `/api/auth/google-auth`    | `POST` | Google authentication           |

### User

| Route                       | Method | Purpose                            |
| --------------------------- | ------ | ---------------------------------- |
| `/api/user/current`         | `GET`  | Get the current user               |
| `/api/user/update-location` | `POST` | Update the user's location         |
| `/api/user/update-profile`  | `PUT`  | Update user profile (Name, Mobile) |
| `/api/user/change-password` | `PUT`  | Change user password               |

### System

| Route         | Method | Purpose                        |
| ------------- | ------ | ------------------------------ |
| `/api/health` | `GET`  | Check server health and status |


### Shop

| Route                         | Method | Purpose                     |
| ----------------------------- | ------ | --------------------------- |
| `/api/shop/create-edit`       | `POST` | Create or edit a shop       |
| `/api/shop/get-my`            | `GET`  | Get the current user's shop |
| `/api/shop/get-by-city/:city` | `GET`  | Get all shops in a city     |

### Item

| Route                           | Method | Purpose                  |
| ------------------------------- | ------ | ------------------------ |
| `/api/item/add-item`            | `POST` | Add a new item to a shop |
| `/api/item/edit-item/:itemId`   | `POST` | Edit an item             |
| `/api/item/get-by-id/:itemId`   | `GET`  | Get an item by its ID    |
| `/api/item/delete/:itemId`      | `GET`  | Delete an item           |
| `/api/item/get-by-city/:city`   | `GET`  | Get all items in a city  |
| `/api/item/get-by-shop/:shopId` | `GET`  | Get all items in a shop  |
| `/api/item/search-items`        | `GET`  | Search for items         |
| `/api/item/rating`              | `POST` | Rate an item             |

### Order

| Route                                       | Method | Purpose                                                             |
| ------------------------------------------- | ------ | ------------------------------------------------------------------- |
| `/api/order/place-order`                    | `POST` | Place a new order                                                   |
| `/api/order/verify-payment`                 | `POST` | Verify an online payment                                            |
| `/api/order/my-orders`                      | `GET`  | Get all orders for the current user                                 |
| `/api/order/get-assignments`                | `GET`  | Get all delivery assignments for the current delivery boy           |
| `/api/order/get-current-order`              | `GET`  | Get the current order for the delivery boy                          |
| `/api/order/send-delivery-otp`              | `POST` | Send a delivery OTP to the user                                     |
| `/api/order/verify-delivery-otp`            | `POST` | Verify the delivery OTP                                             |
| `/api/order/update-status/:orderId/:shopId` | `POST` | Update the status of an order                                       |
| `/api/order/accept-order/:assignmentId`     | `GET`  | Accept a delivery assignment                                        |
| `/api/order/get-order-by-id/:orderId`       | `GET`  | Get an order by its ID                                              |
| `/api/order/get-today-deliveries`           | `GET`  | Get all deliveries for the current delivery boy for the current day |


## 📚 Detailed READMEs

For more detailed information about the frontend and backend, please refer to their respective README files:

- [Frontend README](./frontend/README.md)
- [Backend README](./backend/README.md)


## 🚀 Setup and Installation

### Prerequisites

- Node.js (v18.x or higher)
- npm (or yarn)
- MongoDB account (for the database)
- Cloudinary account (for image storage)
- Razorpay account (for payments)

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

## 🔗Contact Me

- **Email:** [agrahari0899@gmail.com](mailto:agrahari0899@gmail.com)
- **GitHub:** [@saksham2882](https://github.com/saksham2882)
- **LinkedIn:** [@saksham-agrahari](https://www.linkedin.com/in/saksham-agrahari/)
- **Portfolio:** [saksham-agrahari.vercel.app](https://saksham-agrahari.vercel.app)

---

<p align="center">
  Made with ❤️ by Saksham Agrahari
</p>
