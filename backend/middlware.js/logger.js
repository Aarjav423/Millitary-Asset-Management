const Log = require("../models/Log");

const logger = (action) => async (req, res, next) => {
  res.on("finish", async () => {
    if (res.statusCode < 400) {
      await Log.create({
        userId: req.user?.id,
        action,
        details: {
          method: req.method,
          url: req.originalUrl,
          body: req.body,
          params: req.params,
        },
      });
    }
  });
  next();
};

module.exports = logger;
