const mongoose = require("mongoose");
const { createError } = require("./errorHandler");

/**
 * Route-level middleware that validates the :id param is a well-formed
 * MongoDB ObjectId before the request reaches the controller.
 *
 * Returns 400 immediately so controllers never need to repeat this check.
 */
const validateObjectId = (req, res, next) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return next(createError(`Invalid application ID: "${req.params.id}"`, 400));
  }
  next();
};

module.exports = validateObjectId;
