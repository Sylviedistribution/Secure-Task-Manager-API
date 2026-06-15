module.exports = fn => {
  return (req, res, next) => {
    fn(req, res, next).catch(next); // forward any rejected promise to Express error handler
  };
};