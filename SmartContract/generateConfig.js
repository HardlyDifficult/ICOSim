const nebulas = require('nebulas');
const fs = require('fs');
const consts = require('../static/consts');

let account = nebulas.Account.NewAccount();

fs.writeFileSync('config.json', JSON.stringify({
  account : {
    privateKey : account.getPrivateKeyString(),
    address : account.getAddressString()
  },
  version : consts.CONF_VERSION

}, null, 2));

console.log(`config generated, new account: ${account.getAddressString()}`);
console.log('You can find the private key and address in contract/config.json');