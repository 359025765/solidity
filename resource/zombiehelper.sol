pragma solidity >=0.5.0 <0.6.0;

import "./zombiefeeding.sol";

contract ZombieHelper is ZombieFeeding {
    modifier permission(uint _level, uint _zombieId) {
        require(zombies[_zombieId].level >= _level, '等级太低，不允操作');
        require(msg.sender == zombieToOwner[_zombieId], 'dna错误');
        _;
    }

    function changeName(uint _zombieId, string calldata _newName) external permission(2, _zombieId) {
        zombies[_zombieId].name = _newName;
    }

    function changeDna(uint _zombieId, uint _newDna) external permission(20, _zombieId) {
        zombies[_zombieId].dna = _newDna;
    }

    function getZombiesByOwner(address _owner) external view returns (uint[] memory) {
        uint[] memory result = new uint[](ownerZombieCount[_owner]);
        uint count = 0;
        for (uint i = 0; i < zombies.length; i++) {
            if (zombieToOwner[i] == _owner) {
                result[count] = i;
                count++;
            }
        }
        return result;
    }
}
