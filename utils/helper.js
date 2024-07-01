async function padHexString(hexString) {
    const hexWithoutPrefix = hexString.startsWith('0x') ? hexString.substring(2) : hexString;
    const desiredLengthWithoutPrefix = 66 - 2;
    const paddedHexString = hexWithoutPrefix.padStart(desiredLengthWithoutPrefix, '0');
    return '0x' + paddedHexString;
  }

  module.exports = {
    padHexString,
  }