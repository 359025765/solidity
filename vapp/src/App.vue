<template>
    <el-container id="app">
        <el-row>
            <el-col :span="24"><div class="grid-content bg-purple-dark"></div></el-col>
        </el-row> 
    </el-container>
</template>

<script>
import {mapState} from 'vuex';
import state from "./store/state";

export default {
    name: 'App',
    components: {},
    async beforeCreate() {
        if (!this.$store.state.web3.web3Instance) {
            await this.$store.dispatch('getWeb3Instance');
            await this.$store.dispatch('getContractInstance', 'Book.json');
        }
    },
    computed: mapState({
        contractInstance: state => state.contractInstance,
        coinbase: state => state.web3.coinbase
    }),
    watch: {
        // contractInstance: function(val) {
            // console.log(val);
        // }
    }
};
</script>

<style>
#app {
    font-family: "Helvetica Neue",Helvetica,"PingFang SC","Hiragino Sans GB","Microsoft YaHei","微软雅黑",Arial,sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
    margin-top: 60px;
  }
*:before,
*:after {
    box-sizing: border-box;
    margin: 0;
}
html, body {
    margin: 0;
    padding: 0;
    font-size: 14px;
    text-align: center;
}
</style>