module.exports.getName = (req, res) => {
  const data = {
    name: 'sabater',
    age: 21
  }
  res.send(data)
}