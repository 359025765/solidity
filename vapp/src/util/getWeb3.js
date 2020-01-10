import Web3 from 'web3';

let getWeb3 = new Promise(function (resolve) {
    let web3;
    try {
        if (window.ethereum) {
            web3 = new Web3(window.ethereum);
            window.ethereum.enable();
        } else {
            wbe3 = new Web3(new Web3.providers.HttpProvider('http://127.0.0.1:8545'));
        }
    } catch (error) {
        throw (error);
    }
    window.web3 = web3;
    resolve({
        web3() {
            return web3;
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
}).then(r => {
    return new Promise(function (resolve, reject) {
        r.web3().eth.getCoinbase((err, coinbase) => {
            if (err) {
                reject(new Error('Unable to retrieve coinbase'));
            } else {
                coinbase = r.web3().utils.toChecksumAddress(coinbase);
                console.log('retrieve coinbase: ' + coinbase);
                r = Object.assign({}, r, { coinbase });
                resolve(r);
            }
        });
    });
});
export default getWeb3;