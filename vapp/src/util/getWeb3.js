import Web3 from 'web3';

export default new Promise(async (resolve, reject) => {
    let web3Provider;
    if (window.ethereum) {
        web3Provider = window.ethereum;
        try {
            await window.ethereum.enable();
        } catch(err) {
            reject('user denied account access');
        }
    } else if (window.web3) {
        web3Provider = web3.currentProvider;
    } else {
        web3Provider = new Web3.providers.HttpProvider('http://127.0.0.1:8545')
    }
    resolve({
        web3() {
            return new Web3(web3Provider);
        }
    });
}).then(r => {
    return new Promise(function (resolve, reject) {
        r.web3().eth.net.getId((err, netWorkId) => {
            if (err) {
                reject(new Error('Unable to retrieve netWorkId'));
            } else {
                console.log('retrieve netWorkId: ' + netWorkId);
                r = Object.assign({}, r, { netWorkId });
                resolve(r);
            }
        });
    });
});