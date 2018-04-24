export default (option, variation) =>
  option !== null && typeof option === 'object' && variation in option
    ? option[variation]
    : option
