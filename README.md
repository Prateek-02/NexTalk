# NexTalk

**A full stack real-time chat application** built with Node.js, Express, MongoDB and React.  
NexTalk allows users to register, login and message other users in real time with a responsive UI.

---

## 🚀 Features

✅ User authentication (Register & Login)  
✅ Real-time messaging  
✅ Persistent message storage  
✅ REST APIs for backend  
✅ React frontend with routing and state management  
✅ Clean & responsive UI  

---

## 🗂 Project Structure
```
NexTalk/
├── backend/ # Backend server source code
│ ├── controllers/ # Logic for handling API requests
│ ├── routes/ # API route definitions
│ ├── models/ # Database models (User, Message, etc.)
│ ├── middleware/ # Auth & other middleware
│ ├── utils/ # Helper functions
│ ├── config/ # DB connection config
│ └── server.js # Backend entry point
├── frontend/ # React frontend source code
│ ├── public/ # Static files
│ ├── src/
│ │ ├── components/ # UI components
│ │ ├── pages/ # App pages (Chat, Login, Register)
│ │ ├── services/ # API calls logic
│ │ ├── hooks/ # Custom hooks
│ │ ├── utils/ # Helper utilities
│ │ ├── App.js # Main React component
│ │ └── index.js # App entry point
├── .gitignore
├── package.json # Root package config (optional)
└── README.md # This file
```
yaml
Copy code

---

## 🛠 Tech Stack

**Backend**  
✔ Node.js  
✔ Express  
✔ MongoDB (Mongoose)  
✔ JWT for authentication  
✔ CORS support

**Frontend**  
✔ React  
✔ React Router  
✔ Axios or fetch API  
✔ CSS / UI framework of choice

---

## 🧩 Installation

### 1) Clone the repository

```bash
git clone https://github.com/Prateek-02/NexTalk.git
cd NexTalk
2) Setup Backend
bash
Copy code
cd backend
npm install
Create a .env file in backend/ with:

ini
Copy code
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_here
CLIENT_URL=http://localhost:3000
Start the backend server:

bash
Copy code
npm run start
3) Setup Frontend
bash
Copy code
cd ../frontend
npm install
npm start
Frontend should now run at:

arduino
Copy code
http://localhost:3000
📌 Environment Variables
Backend .env

ini
Copy code
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=some_secret_key
CLIENT_URL=http://localhost:3000
Frontend .env (if used)

ini
Copy code
REACT_APP_API_URL=http://localhost:5000
📡 API Endpoints (Sample)
Method	Endpoint	Description
POST	/api/auth/register	Register a user
POST	/api/auth/login	Login a user
GET	/api/users	Fetch users
POST	/api/messages	Send a message
GET	/api/messages/:chatId	Get messages by chat

Update these if actual endpoints differ.

🧠 Usage
Register a user account

Login with credentials

View user list / contacts

Start chatting in real time

🎨 UI / Pages
Login Page

Register Page

Main Chat Dashboard

Message Threads

Online Status Indicator

(Adjust based on the actual React implementation.)

📦 Scripts
Backend

powershell
Copy code
npm start
Frontend

powershell
Copy code
npm start
🚢 Deployment
To deploy:

✔ Host backend on Heroku / Railway / Render
✔ Host frontend on Vercel / Netlify
✔ Use MongoDB Atlas for production DB

🤝 Contributing
Contributions are welcome:

Fork

Create branch: git checkout -b feature/your-feature

Commit: git commit -m "feat: your message"

Push: git push origin feature/your-feature

Open a Pull Request

📝 License
This project is licensed under the MIT License.

🙏 Acknowledgements
Thanks to:

Node.js & Express.js

React

MongoDB & Mongoose

Axios / fetch

Community contributors

yaml
Copy code
