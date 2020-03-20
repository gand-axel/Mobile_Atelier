import Vue from "nativescript-vue";
import Connexion from "./components/Connexion";

Vue.config.silent = false;

new Vue({
    render: h => h('frame', [h(Connexion)])
}).$start();
