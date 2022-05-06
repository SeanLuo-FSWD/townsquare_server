function errorHandlingMiddleware(error, req, res, next) {
  if (error.status) {
    res.status(error.status).send({ message: error.message });
  } else {
    res.status(500).send({ message: error.toString() });
  }
}

export default errorHandlingMiddleware;
