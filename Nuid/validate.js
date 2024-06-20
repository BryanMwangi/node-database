const REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{8}-[0-9a-f]{12}$/i;

module.exports = function validate(nuid) {
  return typeof nuid === "string" && REGEX.test(nuid);
};
