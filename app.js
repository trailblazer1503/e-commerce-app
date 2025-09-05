const express = require('express');
const mongoose = require('mongoose');
const { createServer } = require("http");
const { Server } = require("socket.io");
const jsonWebToken = require("jsonwebtoken"); // you forgot to import this

require("dotenv").config();

const productRouter = require('./route/router');
const brandRoute = require('./route/brandRoute');
const authRouter = require('./route/userRouter.js');
const orderRouter = require('./route/orderRoute.js');

const app = express();
app.use(express.json());

// connect DB
mongoose.connect(process.env.DB_URL)
  .then(() => console.log('Connected to database'))
  .catch((err) => console.log('An error occurred ', err));

// routes
app.use('/brands', brandRoute);
app.use('/auth', authRouter);
app.use('/product', productRouter);
app.use('/orders', orderRouter);

// http + socket.io
const httpServer = createServer(app);
const ioServer = new Server(httpServer, {
  cors: {
    origin: "*",
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"]
  }
});

app.set("ioServer", ioServer);


ioServer.use((socket, next) => {
  try {
    const auth = socket.handshake.headers.authorization;
    if (!auth) return next(new Error("No authorization header"));

    const [type, token] = auth.split(" ");
    if (type.toLowerCase() !== "bearer") {
      return next(new Error("Invalid auth type"));
    }

    const value = jsonWebToken.verify(token, process.env.JWT_KEY);
    socket.handshake.auth.decoded = value;
    next();
  } catch (err) {
    next(new Error("Unauthorized: " + err.message));
  }
});


ioServer.on("connection", (socket) => {
  const decoded = socket.handshake.auth.decoded;
  console.log("User connected:", socket.id);
  console.log("Decoded user:", decoded);

  // socket.on("join", (userId) => {
  //   socket.join(userId); // Each user joins their own room
  //   console.log(`User ${userId} joined room`);
  // });
  const userId = decoded.userId.toString();
  socket.join(userId); // Each user joins their own room
  
    console.log(`User ${userId} joined room`);
  

  socket.on("disconnect", () => {
    socket.leave(decoded.userId);
    console.log("Goodbye", socket.id, "with user ID", decoded.userId);
  });
});


httpServer.listen(3000, () => {
  console.log('Server started on port 3000');
});
