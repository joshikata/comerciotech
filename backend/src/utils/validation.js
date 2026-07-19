const buildValidationDetails = (error) => {
  if (!error.errors) {
    return null;
  }

  return Object.values(error.errors).map((item) => ({
    field: item.path,
    message: item.message,
  }));
};

module.exports = {
  buildValidationDetails,
};
