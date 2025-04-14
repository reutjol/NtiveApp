---

# 📱 Coffee Station – React Native App

A cross-platform mobile application for ordering coffee via a user-friendly interface.  
Built with **React Native**, this client app allows users to browse the menu, customize drinks, place orders, track order status in real-time, and view order history.

Part of the full Coffee Station system (see [Backend Repo](https://github.com/reutjol/appCoffee)).

---

## 🧰 Tech Stack

- **React Native** – Core framework
- **React Navigation** – App navigation between screens
- **Axios** – HTTP requests to backend
- **AsyncStorage** – Local user session/token storage
- **Socket.IO Client** – Real-time communication with backend
- **Expo** (optional) – For running and testing

---

## 🧭 Features

- 🔑 **Authentication** – Login system using email & token (JWT)
- ☕ **Coffee Menu** – Browse and search drinks
- 🛒 **Ordering Flow** – Customize coffee & submit order
- 🕒 **Real-Time Updates** – Order status updates via WebSocket
- 📜 **Order History** – View past purchases
- 👤 **User Profile** – Basic user info & logout option
- 🧺 **Cart** – Supports multi-item orders with clear cart logic

---

## 🗂️ Project Structure

```
NtiveApp/
├── assets/               # Images, logos
├── components/           # Reusable UI components (buttons, cards)
├── screens/              # Main app pages (Home, Cart, Profile, etc.)
├── context/              # AuthContext and global state management
├── utils/                # API handlers and helper functions
├── App.js                # Root component
├── socket.js             # Socket.IO client setup
└── package.json
```

---

## 📱 App Screens Overview

### 🏠 Home Screen
- Displays coffee menu with search bar
- Navigable list of products

### ☕ Product Screen
- Customization of selected coffee:
  - Size, milk type, extras
- “Add to Cart” button

### 🛒 Cart Screen
- Displays all selected items
- “Make Order” triggers submission to backend
- Clears cart after order is placed

### 🕘 History Screen
- List of all past coffee orders
- Retrieved from `/orders/history` API

### 👤 Profile Screen
- Displays user name and email
- Logout option (clears token from AsyncStorage)

### 👨‍🍳 Barista Dashboard (admin)
- Displays real-time order queues:
  - New, In-Process, Done
- Live updates with Socket.IO

---

## 🔌 Socket.IO – Real-Time Sync

Upon placing an order or status update:
- The app receives order status via **WebSocket event**
- Screens automatically reflect updates in the queue or user’s order status

```js
import { io } from 'socket.io-client';
const socket = io('https://your-backend-url');

socket.on('orderUpdate', updatedOrder => {
  // Update app state with new order info
});
```

---

## 🧪 Run the App Locally

### 1. Clone the repo:
```bash
git clone https://github.com/reutjol/NtiveApp
cd NtiveApp
```

### 2. Install dependencies:
```bash
npm install
```

### 3. Set backend URL in `.env` or `utils/api.js`

### 4. Start the app:
```bash
npx react-native run-android
# or
npx expo start
```

---

## 🧠 Concepts & Architecture Highlights

- Component-based design for maintainability
- Context API for auth/session management
- Persistent login via AsyncStorage
- Full RESTful integration with backend
- WebSocket support via Socket.IO client
- Clean UX flow mimicking real coffee ordering

---

## 📎 Related Repositories

- **Backend API** – [Coffee Station Backend](https://github.com/reutjol/appCoffee)

---

## 🧑‍💻 Developed by

[Reut Uzan](https://www.linkedin.com/in/reut-uzan-096948197/)  

```

### 💡 רוצה שאעזור לך:
- להעלות את הקובץ הזה ישירות כ־`README.md` ל־GitHub?
- להכין מצגת קצרה לפרויקט לפי התוכן הזה?
- לבנות README גם לפרויקטים נוספים שלך?

רק תגידי מה את צריכה ואכין לך הכול מותאם אישית 💪
