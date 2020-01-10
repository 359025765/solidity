<template>
    <el-container id="app">
        <el-row>
            <el-col :span="24">
                <el-card shadow="hover" class="mgb20" style="height:252px;">
                    <div class="user-info">
                        <img src="./assets/drizzle-logo.png" class="user-avator" alt />
                        <div class="user-info-cont">
                            <div class="user-info-name">address</div>
                            <div>{{account}}</div>
                        </div>
                    </div>
                </el-card>
                <!-- <div class="grid-content bg-purple-dark"></div> -->
            </el-col>
        </el-row> 
    </el-container>
</template>

<script>
import {mapState} from 'vuex';
import state from "./store/state";

export default {
    name: 'App',
    components: {},
    data() {
        return {
            account: 'xxxxx'
        }
    },
    async beforeCreate() {
        if (!this.$store.state.web3.web3Instance) {
            await this.$store.dispatch('getWeb3Instance');
            await this.$store.dispatch('getContractInstance', 'Book.json');
        }
    },
    computed: mapState({
        contractInstance: state => state.contract,
        coinbase: state => state.web3.coinbase
    }),
    watch: {
        contractInstance: async function(val) {
            await this.$store.dispatch('getAccount');
            this.account = this.$store.state.account;
        }
    }

};
</script>

<style>
.mgb20 {
    margin-bottom: 20px;
}
.user-avator {
    width: 120px;
    height: 120px;
    border-radius: 50%;
}
.user-info {
    display: flex;
    align-items: center;
    padding-bottom: 20px;
    border-bottom: 2px solid #ccc;
    margin-bottom: 20px;
}
.user-info-cont {
    padding-left: 50px;
    flex: 1;
    font-size: 14px;
    color: #999;
}
.user-info-name{
    font-size: 30px;
    font-weight: bold;
    color: rgb(45, 140, 240);
}
</style>