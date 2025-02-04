const ErrorRoute = (request, response, next) => {
  response.json({ message: "route not found" });
  next();
};
module.exports = ErrorRoute;
