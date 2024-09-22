                      require('dotenv').config();
const       express = require('express');
const      mongoose = require('mongoose');
const           jwt = require('jsonwebtoken');
const        socket = require('socket.io');
const        multer = require('multer');
const          cors = require('cors');

const          User = require('./models/user');
const    authRoutes = require('./routes/auth');
const   adminRoutes = require('./routes/admin');
const  marketRoutes = require('./routes/market');
const    chatRoutes = require('./routes/chat');
const messageRoutes = require('./routes/message');

const    app = express();
const   http = require('http');
const server = http.createServer(app);
const     io = socket(server);

let users = [];

const addUser = (userId, socketId) => {
  !users.some((user) => user.userId === userId) && users.push({ userId, socketId });
};

const removeUser = (socketId) => {
  users = users.filter((user) => user.socketId !== socketId);
};

const getUser = (userId) => {
  return users.find((user) => user.userId === userId);
};

io.on('connection', (socket) => {
  console.log('a user connected.');

  socket.on('addUser', (userId) => {
    addUser(userId, socket.id);
    io.emit('getUsers', users);
  });

  socket.on('sendMessage', ({ senderId, receiverId, text }) => {
    const user = getUser(receiverId);
    if (user) {
      io.to(user.socketId).emit('getMessage', { senderId, text });
    }
  });

  socket.on('disconnect', () => {
    console.log('a user disconnected!');
    removeUser(socket.id);
    io.emit('getUsers', users);
  });
});

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'images');
  },
  filename: (req, file, cb) => {
    cb(null, new Date().toISOString().replace(/:/g, '-') + '-' + file.originalname);
  },
});

const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === 'image/png' ||
    file.mimetype === 'image/jpg' ||
    file.mimetype === 'image/jpeg'
  ) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

app.use(
  cors({
         origin: process.env.CLIENT_URL, // configured to accept credentials from front end for session cookies to work
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(multer({ storage: storage, fileFilter: fileFilter }).single('image'));
app.use(express.static('public'));
app.use('/images', express.static('images'));

const authenticateJWT = (req, res, next) => {
  const token = req.headers.authorization && req.headers.authorization.split(' ')[1];

  if (token) {
    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
      if (err) {
        console.log('Token expired', req.user)
      } else {
        req.user = user;
      }
    });
  }
  next();
};

app.use(authRoutes);
app.use(authenticateJWT,   adminRoutes);
app.use(authenticateJWT,  marketRoutes);
app.use(authenticateJWT,    chatRoutes);
app.use(authenticateJWT, messageRoutes);

mongoose
  .connect(process.env.MONGO_KEY)
  .then(() => {
    server.listen(3000, () => {
      console.log('Server is running on port 3000');
    });
  })
  .catch((err) => {
    console.log(err);
  });
