const logger = (request, response, next) => {
  console.log(`request Url:${request.url}`);
  console.log(`request method:${request.method}`);
  console.log(`request Header:${JSON.stringify(request.headers)}`);
  console.log(`request query:${JSON.stringify(request.query)}`);

  console.log(`request params:${JSON.stringify(request.params)}`);
  console.log(`request body:${JSON.stringify(request.body)}`);
  console.log(`request cookies:${JSON.stringify(request.cookies)}`);
  console.log("------------------------------");
  next();
};
module.exports = logger;
