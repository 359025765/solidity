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

## Solidity练习-植物大战僵尸实例
>本文只把跟重要的知识点相关的代码记录下来，方便加深记忆，对应的完整代码在resource目录下。
- [Chapter1 Making the Zombie Factory](#Chapter1)
- [Chapter2 Zombies Attack Their Victims](#Chapter2)

# Chapter1
建立一个名为`ZombieFactory`的智能合约，并创建个16位的DNA。
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
新建一个用于创建僵尸的函数，为了合约的安全起见，应该将该函数设置为私有。
```javascript
function _createZombie(string memory _name, uint _dna) private { 
    zombies.push(Zombie(_name, _dna));  //填充数组
}
```
在solidity中函数声明应该包含返回类型，`view`只能读取数据保证不修改状态，`pure`承诺不读取或修改状态；定义一个随机数`rand`，并利用keccak256哈希计算来加密DNA，最后`rand % dnaModulus`，以确保DNA为16位。
```javascript
function _generateRandomDna(string memory _name, uint _dna) private view returns (uint) {
    uint rand = uint(keccak256(abi.encodePacked(_str)));
    return rand % dnaModulus;
}
```
创建个可见性为`public`的函数，参数为`_name`，并分别调用`_generateRandomDna`和`_createZombie`。
```javascript
function createRandomZombie(string memory _name) public {
    uint randDna = _generateRandomDna(_name);
    _createZombie(_name, randDna);
}
```
`event`是能方便调用以太坊虚拟机日志功能的接口，是将结果相应给前端的一种方式，`event`在合约中可以被继承。声明一个名为`NewZombie`事件，修改`_createZombie`函数，生成`zombie`并保留`id`，获取方式为`zombies`数组长度减去1，最后调用事件。
```javascript
event NewZombie(uint zombieId, string name, uint dna);  // 声明一个名为"NewZombie"的事件
uint id = zombies.push(Zombie(_name, _dna)) - 1;
emit NewZombie(id, _name, _dna);  // 调用事件
```
web3.js中，提供了响应事件的方法，如下：
```javascript
var event = myContract.transfer(function(e, r) {
    console.log('Event are as following:-------');
    for (let [k,v] in r.entries()) {
        console.log(k + ':' + v);
    }
    console.log('Event ending-------');
});
event.stopWatching(); // 终止事件监听
```

# Chapter2
`address`：地址类型存储一个20字节，每个账号都有一个地址，你可以将其视为银行账号。它是你的唯一标识符，例如：`0x0cE446255506E92DF41614C46F1d6df9Cc969183`。在本节测试中，你需要声明一个`mapping`（映射）数据结构，key值是`address`value为`uint`，映射是一种存储有组织数据的方法。
```javascript
mapping (uint => address) public zombieToOwner;
```

在solidity中，存在一些全局变量；其中一个就是`msg.sender`，它指的是当前调用者（或智能合约中）的`address`。
```javascript
zombieToOwner[id] = msg.sender;
```

现在为了游戏的可玩性，我们要限制玩家不限次数的调用`createRandomZombie`函数来创建僵尸，所以我们要使用到`require`，`require`使得函数在执行过程中，当不满足条件时，停止执行。
```javascript
require(ownerZombieCount[msg.sender] == 0);
```

solidity中也引入了继承（Inheritance）的概念，可以将代码和逻辑拆分到不同的合约中去，便于管理，合约的继承用`is`关键字。
```javascript
contract ZombieFeeding is ZombieFactory {}
```



