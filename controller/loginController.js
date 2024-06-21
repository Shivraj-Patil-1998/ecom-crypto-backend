async function loginAuth(req, res) {
  const users = [
    { username: 'info@simplileap.com', password: 'password1' },
    { username: 'keshav@simplileap.com', password: 'password2' },
    { username: 'justin@simplileap.com', password: 'password3' },
    { username: 'akshay@simplileap.com', password: 'password4' },
    { username: 'shivraj@simplileap.com', password: 'password5' },
  ];

  try {
    const { username, password } = req.body;
    const user = users.find(
      (u) => u.username === username && u.password === password
    );

    if (user) {
      res.status(200).json({ message: 'Login successful!' });
    } else {
      res.status(401).json({ message: 'Invalid username or password' });
    }
  } catch (error) {
    res.status(500).send({ error: error });
  }
}

module.exports = {
  loginAuth,
};
