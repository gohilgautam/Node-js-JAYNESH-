function calc(num1, num2, operator) {
    switch (operator) {
      case "1":
        return num1 + num2;
      case "2":
        return num1 - num2;
      case "3":
        return num1 * num2;
      case "4":
        return num2 !== 0 ? num1 / num2 : "Cannot divide by zero";
      default:
        return "Invalid operator";
    }
  }
  
  module.exports = calc;