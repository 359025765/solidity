import state from '../store/state';

export const getContract = async(contract) => {
    const web3 = state.web3;
    try {
        const metaCoinArtifact = require('../contracts/' + contract);        
        const deployNetwork = metaCoinArtifact.networks[web3.networkId];
        let meta = new window.web3.eth.Contract(
            metaCoinArtifact.abi,
            deployNetwork.address
        );
        return meta;
    } catch (error) {
        throw error;
    }
};
