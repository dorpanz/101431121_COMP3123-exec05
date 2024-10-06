const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const router = express.Router();

app.use(express.json());

router.get('/home', (req, res) => {
  res.sendFile(path.join(__dirname, 'home.html'));
});

router.get('/profile', (req, res) => {
  fs.readFile(path.join(__dirname, 'user.json'), 'utf8', (err, data) => {
    if (err) {
      res.status(500).send('Error reading user file');
    } else {
      res.json(JSON.parse(data));
    }
  });
});

router.post('/login', (req, res) => {
  const { username, password } = req.body;
  fs.readFile(path.join(__dirname, 'user.json'), 'utf8', (err, data) => {
    if (err) {
      res.status(500).json({ status: false, message: 'Server error' });
    } else {
      const user = JSON.parse(data);
      if (user.username !== username) {
        return res.json({ status: false, message: 'User Name is invalid' });
      }
      if (user.password !== password) {
        return res.json({ status: false, message: 'Password is invalid' });
      }
      res.json({ status: true, message: 'User Is valid' });
    }
  });
});

router.get('/logout/:username', (req, res) => {
  const username = req.params.username;
  res.send(`<b>${username} successfully logged out.</b>`);
});

app.use((err, req, res, next) => {
  res.status(500).send('Server Error');
});

app.use('/', router);

app.listen(process.env.PORT || 8081, () => {
  console.log('Web Server is listening at port ' + (process.env.PORT || 8081));
});