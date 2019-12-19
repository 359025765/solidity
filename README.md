# 以太坊开发学习-Solidity

## 开发语言及工具：
* 合约开发语言：Solidity
* 合约编译器：solc
* 在线集成环境：[Remix](https://remix.ethereum.org/)

## 安装Solidity编译器
`docker-compose up -d` 利用docker部署node环境

`docker exec -it node /bin/sh` 进入容器环境

`npm install -g solc` 全局安装solc编译器

`solcjs --version` 查看版本

## Solidity版植物大战僵尸实例
建立一个新的智能合约，并创建个16位的DNA。
```javascript
pragma solidity >=0.5.0 <0.6.0;  // 指定solidity版本
contract ZombieFactory {  // 创建一个僵尸工厂
    uint dnaDigits = 16; // uint实际上等于uint256，你可以用更少的位声明uint8，uint16，uint32等
    uint dnaModulus = 10 ** dnaDigits;  // 为了确保僵尸的DNA为16位字符，等于10^16
}
```
创建个只属于僵尸的结构体和用于存储僵尸的数组.
```javascript
struct Zombie {
    string name;
    uint dna;
}

Zombie[] public zombies;
```
新建一个创建僵尸的函数，为了合约的安全起见，应该将该函数设置为私有。
```javascript
function _createZombie(string memory _name, uint _dna) private { 
    zombies.push(Zombie(_name, _dna));  //填充数组
}
```
声明一个`_generateRandomDna`函数，在solidity中函数声明应该包含返回类型，`view`只能读取数据保证不修改状态，`pure`承诺不读取或修改状态；定义一个随机数`rand`，并利用keccak256哈希计算来加密DNA，最后`rand % dnaModulus`，以确保DNA为16位。
```javascript
function _generateRandomDna(string memory _name, uint _dna) private view returns (uint) {
    uint rand = uint(keccak256(abi.encodePacked(_str)));
    return rand % dnaModulus;
}
```
创建个`public`的`function`名字为`createRandomZombie`，参数为`_name`，并分别调用`_generateRandomDna`和`_createZombie`。
```javascript
function createRandomZombie(string memory _name) public {
    uint randDna = _generateRandomDna(_name);
    _createZombie(_name, randDna);
}
```
添加事件。事件是能方便调用以太坊虚拟机日志功能的接口，是将事件相应给前端的一种方式，事件在合约中可以被继承。声明一个名为`NewZombie`事件，修改`_createZombie`函数，获取`id`，获取方式为`zombies`数组长度减去1，最后调用事件。
```
event NewZombie(uint zombieId, string name, uint dna);
uint id = zombies.push(Zombie(_name, _dna)) - 1;
emit NewZombie(id, _name, _dna);
```






