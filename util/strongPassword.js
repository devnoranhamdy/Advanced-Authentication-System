const isStrongPassword = (password) => {
    const Regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return Regex.test(password);
  };
  
  module.exports = isStrongPassword;