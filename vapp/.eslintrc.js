module.exports = {
    "env": {
        "browser": true,
        "es6": true,
        "node": true
    },
    "extends": [
        "eslint:recommended",
        "plugin:vue/essential"
    ],
    "globals": {
        "Atomics": "readonly",
        "SharedArrayBuffer": "readonly"
    },
    "parserOptions": {
        "ecmaVersion": 8,
        "sourceType": "module"
    },
    "plugins": [
        "vue"
    ],
    "rules": {
        "semi": 1,
        "no-console": "off"
    }
};