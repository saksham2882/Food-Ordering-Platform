# Food Delivery Platform - Backend

## 🚀 Project Overview

This is the backend for a **real-time food delivery platform**. It is a complete, full-featured backend system built with Node.js, Express, and MongoDB. The platform connects users, restaurants (shops), and delivery personnel in real-time. It is designed to be scalable, efficient, and easy to maintain.

## 🎯 Project Aim

The main goal of this project is to provide a robust and reliable backend for a food delivery service. This includes:

-   User authentication and authorization.
-   Management of restaurants (shops) and their menus (items).
-   Real-time order processing and tracking.
-   Real-time location tracking of delivery personnel.
-   A complete delivery assignment system.
-   Online payment processing.

## 🛠️ Tech Stack

| Technology | Description |
| --- | --- |
| **Node.js** | A JavaScript runtime environment that allows for the execution of JavaScript code on the server-side. It is known for its speed and efficiency. |
| **Express.js** | A minimal and flexible Node.js web application framework that provides a robust set of features for web and mobile applications. |
| **MongoDB** | A NoSQL database that stores data in flexible, JSON-like documents. It is known for its scalability and performance. |
| **Socket.IO** | A library that enables real-time, bidirectional, and event-based communication between web clients and servers. |
| **JWT (JSON Web Tokens)** | A compact, URL-safe means of representing claims to be transferred between two parties. It is used for authentication and authorization. |
| **Cloudinary** | A cloud-based image and video management service. It is used to store and serve all the images for the platform. |
| **Razorpay** | A payment gateway that allows for online payment processing. |
| **Nodemailer** | A module for Node.js applications to allow easy as cake email sending. |

## 📂 File and Folder Structure

```
backend/
├── config/
│   └── db.js
├── controllers/
│   ├── auth.controllers.js
│   ├── item.controllers.js
│   ├── order.controllers.js
│   ├── shop.controllers.js
│   └── user.controllers.js
├── middlewares/
│   ├── isAuth.js
│   └── multer.js
├── models/
│   ├── deliveryAssignment.model.js
│   ├── item.model.js
│   ├── order.model.js
│   ├── shop.model.js
│   └── user.model.js
├── routes/
│   ├── auth.routes.js
│   ├── item.routes.js
│   ├── order.routes.js
│   ├── shop.routes.js
│   └── user.routes.js
├── utils/
│   ├── cloudinary.js
│   ├── emailTemplate.js
│   ├── mail.js
│   └── token.js
├── .gitignore
├── index.js
├── package.json
├── README.md
└── socket.js
```

## 🏗️ Project Architecture

The project follows a layered architecture pattern, which is a variation of the Model-View-Controller (MVC) architecture. This architecture separates the application into three logical layers:

1.  **Presentation Layer (Routes)**: This layer is responsible for handling all incoming HTTP requests and sending responses back to the client. It is implemented using Express.js routes. The routes are defined in the `routes` directory.

2.  **Business Logic Layer (Controllers)**: This layer contains the core business logic of the application. It is responsible for processing the requests from the Presentation Layer, interacting with the Data Access Layer, and preparing the data for the response. The controllers are located in the `controllers` directory.

3.  **Data Access Layer (Models)**: This layer is responsible for all interactions with the database. It uses Mongoose models to define the schema for the data and to perform CRUD (Create, Read, Update, Delete) operations on the database. The models are defined in the `models` directory.

### Workflow

```
+----------------+      +------------------+      +----------------+
|                |      |                  |      |                |
|     Client     |----->|      Routes      |----->|   Controllers  |
|   (Frontend)   |      |  (Presentation)  |      | (Business Logic) |
|                |      |                  |      |                |
+----------------+      +------------------+      +----------------+
      ^                                                   |
      |                                                   v
      |                                           +----------------+
      |                                           |                |
      +-------------------------------------------|     Models     |
                                                  |   (Data Access)  |
                                                  |                |
                                                  +----------------+
                                                        ^
                                                        |
                                                        v
                                                  +----------------+
                                                  |                |
                                                  |    Database    |
                                                  |    (MongoDB)   |
                                                  |                |
                                                  +----------------+
```

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
-   `foodType` (String, enum: `['veg', 'non-veg']`, required): The food type of the item.
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

## 👨‍💻 User Roles

The platform has three user roles, each with a specific set of permissions and responsibilities:

### **User**

A regular user of the platform who can perform the following actions:

-   **Authentication**: Register, log in, and log out of the platform.
-   **Browse**: Browse restaurants and their menus.
-   **Order**: Place orders from restaurants and track their status in real-time.
-   **Payment**: Make online payments for their orders.
-   **Rating**: Rate the food items they have ordered.
-   **Location**: Update their location to get a list of nearby restaurants.

### **Owner**

A restaurant owner who can manage their restaurant and orders. An owner can perform all the actions of a regular user, as well as the following:

-   **Shop Management**: Create and manage their restaurant (shop), including updating the shop's information and image.
-   **Menu Management**: Add, edit, and delete food items from their menu.
-   **Order Management**: View and manage all orders placed at their restaurant. They can update the status of the orders (e.g., from "Pending" to "Preparing").
-   **Delivery Assignment**: When an order is ready for delivery, the owner can mark it as "Out for Delivery", which triggers the delivery assignment process.

### **Delivery Boy**

A delivery person who is responsible for delivering the orders to the users. A delivery boy can perform the following actions:

-   **Authentication**: Register, log in, and log out of the platform.
-   **Availability**: Set their availability status to online or offline.
-   **Delivery Assignments**: View and accept delivery assignments that are broadcasted to them.
-   **Order Tracking**: Track the location of the user and the restaurant in real-time.
-   **Delivery Confirmation**: Verify the delivery of an order by entering an OTP provided by the user.
-   **Delivery History**: View their delivery history for the day.

## 📖 API Endpoints

### Authentication

#### `POST /api/auth/signup`

-   **Working**: Registers a new user on the platform. It takes the user's full name, email, password, mobile number, and role as input. It checks if a user with the same email already exists. If not, it hashes the password and creates a new user in the database. It then generates a JWT and sends it back to the client in a cookie.
-   **Request Body**:
    ```json
    {
      "fullName": "John Doe",
      "email": "john.doe@example.com",
      "password": "password123",
      "mobile": "1234567890",
      "role": "user"
    }
    ```
-   **Response**:
    ```json
    {
      "message": "User Registered Successfully",
      "user": {
        "_id": "...",
        "fullName": "John Doe",
        "email": "john.doe@example.com",
        "mobile": "1234567890",
        "role": "user"
      }
    }
    ```

#### `POST /api/auth/signin`

-   **Working**: Logs in a user. It takes the user's email and password as input. It checks if a user with the given email exists. If so, it compares the provided password with the hashed password in the database. If the passwords match, it generates a JWT and sends it back to the client in a cookie.
-   **Request Body**:
    ```json
    {
      "email": "john.doe@example.com",
      "password": "password123"
    }
    ```
-   **Response**:
    ```json
    {
      "message": "User Login Successfully",
      "user": {
        "_id": "...",
        "fullName": "John Doe",
        "email": "john.doe@example.com",
        "mobile": "1234567890",
        "role": "user"
      }
    }
    ```

#### `GET /api/auth/signout`

-   **Working**: Logs out a user by clearing the JWT cookie.
-   **Request Body**: None
-   **Response**:
    ```json
    {
      "message": "Logout Successfully"
    }
    ```

#### `POST /api/auth/send-otp`

-   **Working**: Sends an OTP to the user's email for password reset. It takes the user's email as input and generates a 6-digit OTP. It then saves the OTP and its expiration time in the user's document in the database and sends the OTP to the user's email.
-   **Request Body**:
    ```json
    {
      "email": "john.doe@example.com"
    }
    ```
-   **Response**:
    ```json
    {
      "message": "OTP Send Successfully"
    }
    ```

#### `POST /api/auth/verify-otp`

-   **Working**: Verifies the OTP for password reset. It takes the user's email and the OTP as input. It checks if the OTP is valid and has not expired. If the OTP is valid, it sets the `isOtpVerified` flag to `true` in the user's document.
-   **Request Body**:
    ```json
    {
      "email": "john.doe@example.com",
      "otp": "123456"
    }
    ```
-   **Response**:
    ```json
    {
      "message": "OTP Verify Successfully"
    }
    ```

#### `POST /api/auth/reset-password`

-   **Working**: Resets the user's password. It takes the user's email and the new password as input. It checks if the OTP has been verified. If so, it hashes the new password and updates the user's password in the database.
-   **Request Body**:
    ```json
    {
      "email": "john.doe@example.com",
      "newPassword": "newpassword123"
    }
    ```
-   **Response**:
    ```json
    {
      "message": "Password Reset Successfully"
    }
    ```

#### `POST /api/auth/google-auth`

-   **Working**: Handles Google authentication. It takes the user's full name, email, mobile number, and role as input. It checks if a user with the same email already exists. If not, it creates a new user. It then generates a JWT and sends it back to the client in a cookie.
-   **Request Body**:
    ```json
    {
      "fullName": "John Doe",
      "email": "john.doe@example.com",
      "mobile": "1234567890",
      "role": "user"
    }
    ```
-   **Response**:
    ```json
    {
      "_id": "...",
      "fullName": "John Doe",
      "email": "john.doe@example.com",
      "mobile": "1234567890",
      "role": "user"
    }
    ```

### User

#### `GET /api/user/current`

-   **Working**: Gets the current user's information. It uses the `isAuth` middleware to get the user ID from the JWT. It then finds the user in the database and returns the user's information.
-   **Request Body**: None
-   **Response**:
    ```json
    {
      "_id": "...",
      "fullName": "John Doe",
      "email": "john.doe@example.com",
      "mobile": "1234567890",
      "role": "user"
    }
    ```

#### `POST /api/user/update-location`

-   **Working**: Updates the user's location. It takes the user's latitude and longitude as input and updates the user's location in the database.
-   **Request Body**:
    ```json
    {
      "lat": 12.9716,
      "lon": 77.5946
    }
    ```
-   **Response**:
    ```json
    {
      "message": "Location Updated"
    }
    ```

### Order

#### `POST /api/order/place-order`

-   **Working**: Places a new order. It takes the cart items, payment method, delivery address, and total amount as input. It groups the cart items by shop and creates a separate shop order for each shop. If the payment method is "Online", it creates a Razorpay order and returns the order details to the client. Otherwise, it creates a new order in the database and sends a real-time notification to the restaurant owner via Socket.IO.
-   **Request Body**:
    ```json
    {
      "cartItems": [
        {
          "id": "...",
          "name": "Pizza",
          "price": 200,
          "quantity": 1,
          "shop": "..."
        }
      ],
      "paymentMethod": "COD",
      "deliveryAddress": {
        "text": "123, Main Street",
        "latitude": 12.9716,
        "longitude": 77.5946
      },
      "totalAmount": 200
    }
    ```
-   **Response**:
    ```json
    {
      "message": "Order Placed Successfully",
      "newOrder": {
        "_id": "...",
        "user": "...",
        "paymentMethod": "COD",
        "deliveryAddress": {
          "text": "123, Main Street",
          "latitude": 12.9716,
          "longitude": 77.5946
        },
        "totalAmount": 200,
        "shopOrders": [
          {
            "shop": "...",
            "owner": "...",
            "subtotal": 200,
            "shopOrderItems": [
              {
                "item": "...",
                "name": "Pizza",
                "price": 200,
                "quantity": 1
              }
            ],
            "status": "Pending"
          }
        ]
      }
    }
    ```

#### `POST /api/order/verify-payment`

-   **Working**: Verifies an online payment. It takes the Razorpay payment ID and the order ID as input. It fetches the payment details from Razorpay and checks if the payment was successful. If so, it updates the order's payment status to `true` and sends a real-time notification to the restaurant owner via Socket.IO.
-   **Request Body**:
    ```json
    {
      "razorpay_payment_id": "...",
      "orderId": "..."
    }
    ```
-   **Response**:
    ```json
    {
      "_id": "...",
      "user": "...",
      "paymentMethod": "Online",
      "deliveryAddress": {
        "text": "123, Main Street",
        "latitude": 12.9716,
        "longitude": 77.5946
      },
      "totalAmount": 200,
      "shopOrders": [
        {
          "shop": "...",
          "owner": "...",
          "subtotal": 200,
          "shopOrderItems": [
            {
              "item": "...",
              "name": "Pizza",
              "price": 200,
              "quantity": 1
            }
          ],
          "status": "Pending"
        }
      ],
      "payment": true,
      "razorpayOrderId": "...",
      "razorpayPaymentId": "..."
    }
    ```

#### `GET /api/order/my-orders`

-   **Working**: Gets all orders for the current user. It uses the `isAuth` middleware to get the user ID from the JWT. It then finds all orders in the database that belong to the user and returns them.
-   **Request Body**: None
-   **Response**:
    ```json
    [
      {
        "_id": "...",
        "user": "...",
        "paymentMethod": "COD",
        "deliveryAddress": {
          "text": "123, Main Street",
          "latitude": 12.9716,
          "longitude": 77.5946
        },
        "totalAmount": 200,
        "shopOrders": [
          {
            "shop": "...",
            "owner": "...",
            "subtotal": 200,
            "shopOrderItems": [
              {
                "item": "...",
                "name": "Pizza",
                "price": 200,
                "quantity": 1
              }
            ],
            "status": "Pending"
          }
        ]
      }
    ]
    ```

#### `GET /api/order/get-assignments`

-   **Working**: Gets all delivery assignments for the current delivery boy. It uses the `isAuth` middleware to get the user ID from the JWT. It then finds all delivery assignments in the database that have been broadcasted to the delivery boy and returns them.
-   **Request Body**: None
-   **Response**:
    ```json
    [
      {
        "assignmentId": "...",
        "orderId": "...",
        "shopName": "My Shop",
        "deliveryAddress": {
          "text": "123, Main Street",
          "latitude": 12.9716,
          "longitude": 77.5946
        },
        "items": [
          {
            "item": "...",
            "name": "Pizza",
            "price": 200,
            "quantity": 1
          }
        ],
        "subtotal": 200
      }
    ]
    ```

#### `GET /api/order/get-current-order`

-   **Working**: Gets the current order for the delivery boy. It uses the `isAuth` middleware to get the user ID from the JWT. It then finds the delivery assignment in the database that is currently assigned to the delivery boy and returns the order information.
-   **Request Body**: None
-   **Response**:
    ```json
    {
      "_id": "...",
      "user": {
        "_id": "...",
        "fullName": "John Doe",
        "email": "john.doe@example.com",
        "mobile": "1234567890",
        "location": {
          "type": "Point",
          "coordinates": [77.5946, 12.9716]
        }
      },
      "shopOrder": {
        "_id": "...",
        "shop": "...",
        "owner": "...",
        "subtotal": 200,
        "shopOrderItems": [
          {
            "item": "...",
            "name": "Pizza",
            "price": 200,
            "quantity": 1
          }
        ],
        "status": "Out for Delivery"
      },
      "deliveryAddress": {
        "text": "123, Main Street",
        "latitude": 12.9716,
        "longitude": 77.5946
      },
      "deliveryBoyLocation": {
        "lat": 12.9716,
        "lon": 77.5946
      },
      "customerLocation": {
        "lat": 12.9716,
        "lon": 77.5946
      }
    }
    ```

#### `POST /api/order/send-delivery-otp`

-   **Working**: Sends a delivery OTP to the user. It takes the order ID and the shop order ID as input. It generates a 6-digit OTP and saves it in the shop order document in the database. It then sends the OTP to the user's email.
-   **Request Body**:
    ```json
    {
      "orderId": "...",
      "shopOrderId": "..."
    }
    ```
-   **Response**:
    ```json
    {
      "message": "OTP successfully send to: John Doe"
    }
    ```

#### `POST /api/order/verify-delivery-otp`

-   **Working**: Verifies the delivery OTP. It takes the order ID, the shop order ID, and the OTP as input. It checks if the OTP is valid and has not expired. If the OTP is valid, it updates the shop order's status to "Delivered" and deletes the delivery assignment.
-   **Request Body**:
    ```json
    {
      "orderId": "...",
      "shopOrderId": "...",
      "otp": "123456"
    }
    ```
-   **Response**:
    ```json
    {
      "message": "Order Delivered Successfully"
    }
    ```

#### `POST /api/order/update-status/:orderId/:shopId`

-   **Working**: Updates the status of an order. It takes the order ID and the shop ID as URL parameters and the new status as input. It updates the shop order's status in the database and sends a real-time notification to the user via Socket.IO. If the new status is "Out for Delivery", it creates a new delivery assignment and broadcasts it to all available delivery personnel in the area.
-   **Request Body**:
    ```json
    {
      "status": "Preparing"
    }
    ```
-   **Response**:
    ```json
    {
      "shopOrder": {
        "_id": "...",
        "shop": "...",
        "owner": "...",
        "subtotal": 200,
        "shopOrderItems": [
          {
            "item": "...",
            "name": "Pizza",
            "price": 200,
            "quantity": 1
          }
        ],
        "status": "Preparing"
      },
      "assignedDeliveryBoy": null,
      "availableBoys": [],
      "assignment": null
    }
    ```

#### `GET /api/order/accept-order/:assignmentId`

-   **Working**: Accepts a delivery assignment. It takes the assignment ID as a URL parameter. It updates the assignment's status to "Assigned" and assigns the delivery to the current delivery boy.
-   **Request Body**: None
-   **Response**:
    ```json
    {
      "message": "Delivery assignment accepted successfully."
    }
    ```

#### `GET /api/order/get-order-by-id/:orderId`

-   **Working**: Gets an order by its ID. It takes the order ID as a URL parameter and returns the order's information.
-   **Request Body**: None
-   **Response**:
    ```json
    {
      "_id": "...",
      "user": "...",
      "paymentMethod": "COD",
      "deliveryAddress": {
        "text": "123, Main Street",
        "latitude": 12.9716,
        "longitude": 77.5946
      },
      "totalAmount": 200,
      "shopOrders": [
        {
          "shop": "...",
          "owner": "...",
          "subtotal": 200,
          "shopOrderItems": [
            {
              "item": "...",
              "name": "Pizza",
              "price": 200,
              "quantity": 1
            }
          ],
          "status": "Pending"
        }
      ]
    }
    ```

#### `GET /api/order/get-today-deliveries`

-   **Working**: Gets all deliveries for the current delivery boy for the current day. It uses the `isAuth` middleware to get the user ID from the JWT. It then finds all orders that were delivered by the delivery boy on the current day and returns a list of the number of deliveries per hour.
-   **Request Body**: None
-   **Response**:
    ```json
    [
      {
        "hour": 10,
        "count": 2
      },
      {
        "hour": 12,
        "count": 1
      }
    ]
    ```

## API Endpoints Summary

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


## 🚀 Setup and Installation

1.  **Clone the repository:**

    ```bash
    git clone https://github.com/saksham2882/Food-Ordering-Platform.git
    ```

2.  **Install dependencies:**

    ```bash
    npm install
    ```

3.  **Create a `.env` file in the root directory and add the following environment variables:**

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

4.  **Start the server:**

    ```bash
    npm start
    ```

## ✍️ Author

**Saksham Agrahari**

-   GitHub: [saksham2882](https://github.com/saksham2882)
- Portfolio: [Saksham Agrahari](https://saksham-agrahari.vercel.app)