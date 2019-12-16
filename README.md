# 以太坊开发学习-Solidity

## 开发语言及工具：
* 合约开发语言：Solidity
* 合约编译器：solc
* 在线集成环境[Remix](https://remix.ethereum.org/)

## 安装Solidity编译器
`docker-compose up -d` 利用docker部署node环境

`docker exec -it node /bin/sh` 进入容器环境

`npm install -g solc` 全局安装solc编译器

`solcjs --version` 查看版本

## Solidity实例
建立一个新的智能合约，并创建个16位的dna。
```javascript
pragma solidity >=0.5.0 <0.6.0;  // 指定solidity版本
contract ZombieFactory {  // 创建一个僵尸工厂
    uint16 dnaDigits; // uint实际上等于uint256，你可以用更少的位声明uint8，uint16，uint32等
    uint dnaModules = 10 ** dnaDigits;  // 为了确保僵尸的dna为16位字符，等于10^16
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
在solidity中函数声明应该包含返回类型，`view`只能读取数据不能修改，`pure`不能访问函数里的任何值。
```javascript
function _createZombie(string memory _name, uint _dna) private {
    zombies.push(Zombie(_name, _dna));
}
```




