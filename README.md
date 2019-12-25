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
- [Chapter3 Advanced Solidity Concepts](#Chapter3)

# Chapter1
建立一个名为`ZombieFactory`的智能合约，并创建个16位的DNA。
```javascript
pragma solidity >=0.5.0 <0.6.0;  // 指定solidity版本
contract ZombieFactory {  // 创建一个僵尸工厂
    uint dnaDigits = 16; // uint实际上等于uint256，你可以用更少的位声明uint8，uint16，uint32等
    uint dnaModulus = 10 ** dnaDigits;  // 为了确保僵尸的DNA为16位字符，等于10^16
}
```
创建个僵尸的结构体和用于存储僵尸的数组.
```javascript
struct Zombie {
    string name;
    uint dna;
}

Zombie[] public zombies;
```
新建一个用于创建僵尸的函数，为了合约的安全起见，应该将该函数设置为私有。`storage`的变量是永久储存在区块链变量，在函数外部声明的全局变量；而`memory`变量则是临时的区块链变量，当外部函数对某合约的调用完成时，内存型的变量将被移除，好比计算机的磁盘和RAM的区别。
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

现在为了游戏的可玩性，我们要限制玩家调用`createRandomZombie`函数来创建僵尸，所以我们要使用到`require`，`require`使得函数在执行过程中当不满足条件时，停止执行。
```javascript
require(ownerZombieCount[msg.sender] == 0);
```

solidity中也引入了继承（Inheritance）的概念，可以将代码和逻辑拆分到不同的合约中去，便于管理，合约的继承用`is`关键字。在**resource**目录下创建个`zombiefeeding.sol`文件
```javascript
import "./zombiefactory.sol";
contract ZombieFeeding is ZombieFactory {}
```

# Chapter3
solidity封装了两种函数的调用方式，`interal`和`external`，`interal`类似于`private`，只是从该合同继承的合同也能访问；`external`类似于`public`，不同的是这些函数只能在合同外部调用，因为合约初始化未完成不能调用自身函数。
```javascript
// external
contract A{
    function f(){}
}
contract B{
    //以`external`的方式调用另一合约中的函数
    function callExternal(A a){
        a.f();
    }
}
// internal
contract A{
    //默认是public函数
    function internalFunc() internal{}

    function callFunc(){
        //以`internal`的方式调用函数
        internalFunc();
    }
}
contract B is A{
    //子合约中调用
    function callFunc(){
        internalFunc();
    }
}
```

函数`modify`可以用来轻易改变一个函数的行为，比如用在函数前检查某种前置条件。修改器是一种合约属性，可以被继承，同时还可以被派生的合约重写。
```javascript
pragma solidity ^0.5.0;
contract Ownable {
    address public owner = msg.sender;
    // 限制只有创建者才能访问
    modifier onlyOwner(address _newOwner) {
        if (msg.sender != _newOwner) thorw;
        _;
    }
    function changeOwner(address _newOwner) onlyOwner (_newOwner) {
        return 1;
    }
}
```
如果同一个函数有多个修改器，他们之间的空格隔开，修饰器会依次执行。

`gas` 合约一经创建，每笔交易都会收取一定数量的`gas`，目的是限制执行交易所需要的工作量和交易支付手续费。EVM执行交易时，`gas`将按照特定的规则逐渐耗尽。<br/>
**使用struct结构体来节省gas的使用**。通常使用`uint8`，`uint16`，`uint32`，etc；没有任何好处，因为`uint`无论大小如何，solidity都会保存256位存储空间。但是`struct`不一样，它会将这些变量打包在一起减少存储量。For example:
```javascript
struct MiniMe {
    uint32 a;
    uint32 b;
    uint c;
}
```

变量的数据位置有三种类型，`memory`，`storage`，`calldata`。前两种已经介绍过，最后一种数据位置比较特殊，一般只有外部函数的参数（不包括返回参数）被强制指定为`calldata`。这种数据位置是只读的，不会持久化到区块链。

`view`函数不会消耗`gas`。因为`view`函数实际上并没有改变区块链上的任何内容，它们只负责读取数据。需要注意的是，如果从同一个`contract`中另一个不是`view`的函数调用，则仍然要`cost gas`。
```javascript
// 将memory于数组一起使用，在函数内部创建新的数组
function getArray() external pure returns(uint[] memory) {
    uint[] memory values = new uint[](3);  // memory 数组必须声明长度，后期solidity版本可能会修改
    values[0] = 1;
    values[1] = 2;
    values[2] = 3;
}
```






