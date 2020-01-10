import state from '../store/state';

export const getContract = async(contract) => {
    const web3 = state.web3;
    try {
        const metaCoinArtifact = require('../contracts/' + contract);        
        const deployNetwork = metaCoinArtifact.networks[web3.networkId];
        const web3Instance = web3.web3Instance();
        return new web3Instance.eth.Contract(
            metaCoinArtifact.abi,
            deployNetwork.address
        );
    } catch (error) {
        throw error;
    }
};
