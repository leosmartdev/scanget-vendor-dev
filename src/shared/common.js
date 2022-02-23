
export const sortAlphaNum = (a, b) => {

  var reA = /[^a-zA-Z]/g;
  var reN = /[^0-9]/g;
  var AInt = parseInt(a, 10);
  var BInt = parseInt(b, 10);

  if (isNaN(AInt) && isNaN(BInt)) {
    var aA = a.replace(reA, "");
    var bA = b.replace(reA, "");
    if (aA === bA) {
      var aN = parseInt(a.replace(reN, ""), 10);
      var bN = parseInt(b.replace(reN, ""), 10);
      return aN === bN ? 0 : aN > bN ? 1 : -1;
    } else {
      return aA > bA ? 1 : -1;
    }
  } else if (isNaN(AInt)) {//A is not an Int
    return 1;//to make alphanumeric sort first return -1 here
  } else if (isNaN(BInt)) {//B is not an Int
    return -1;//to make alphanumeric sort first return 1 here
  } else {
    return AInt > BInt ? 1 : -1;
  }
}