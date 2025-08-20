const validateReqBody = (validationSchema) => {
  return async (req, res, next) => {
    try {
      const validatedData = await validationSchema.validate(req.body);
      req.body = validatedData;
      next();
    } catch (error) {
      console.log(error.message);
      return res.status(400).json({ error: error.errors });
    }
  };
};

export default validateReqBody;
