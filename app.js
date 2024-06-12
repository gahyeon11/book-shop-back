const express = require('express');
const app = express();
const port = 9999;

const userRouter = require('./routes/users');
const bookRouter = require('./routes/books');
const categoryRouter = require('./routes/category');
const likeRouter = require('./routes/likes');
const cartRouter = require('./routes/carts');
const orderRouter = require('./routes/orders');

const cors = require('cors');

// 특정 origin을 허용하는 경우
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true,
  exposedHeaders: ["Authorization"]
}));

// Body Parser Middleware (필요한 경우)
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 로그 추가
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

app.use("/users", userRouter);
app.use("/books", bookRouter);
app.use("/category", categoryRouter);
app.use("/likes", likeRouter);
app.use("/carts", cartRouter);
app.use("/orders", orderRouter);

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});


