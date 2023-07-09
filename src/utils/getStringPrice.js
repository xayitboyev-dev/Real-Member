module.exports = (amout) => {
    const string = amout.toString();
    return string.substring(0, string.length - 2) + " UZS";
};