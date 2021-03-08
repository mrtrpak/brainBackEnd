const validatedEmail = email => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

export const handleRegister = (db, bcrypt) => (req, res) => {
  const { name, email, password } = req.body;
  let hash = bcrypt.hashSync(password);

  if (password.length < 8 || password.length > 100 || !validatedEmail(email)) {
    return res.status(400).json('information entered incorrectly');
  } else {
    db.transaction(trx => {
      trx.insert({
        hash: hash,
        email: email
      })
        .into('login')
        .returning('email')
        .then(loginEmail => {
          return trx('users')
            .returning('*')
            .insert({
              name: name,
              email: loginEmail[0],
              joined: new Date()
            })
            .then(user => {
              res.json(user[0]);
            })
        })
        .then(trx.commit).catch(trx.rollback);
    })
      .catch(() => res.status(400).json('unable to register'));
  };
};