import "./assets/main.css";

import {createApp} from "vue";
import App from "./App.vue";
import "./assets/main.css";
import {createPinia} from "pinia";
import {createRouter, createWebHistory} from 'vue-router'
import kredi_component from "@/components/veri/Kredi/kredi_component.vue";
import sube_component from "@/components/veri/Sube/sube_component.vue";
import home_component from "@/components/veri/Home/home_component.vue";
import kredi_ekleme_component from "@/components/veri/Kredi/kredi_ekleme_component.vue";
import kredi_content_component from "@/components/veri/Kredi/kredi_content_component.vue";
import sube_content_component from "@/components/veri/Sube/sube_content_component.vue";
import sube_ekleme_component from "@/components/veri/Sube/sube_ekleme_component.vue";

const app = createApp(App);
const pinia = createPinia();

const routes = [
    {path: "/", component: home_component},
    {
        path: "/kredi",
        component: kredi_component,
        children: [{path: "/kredi/list", component: kredi_content_component},
            {path: "/kredi/ekle", component: kredi_ekleme_component}]
    },
    // {path: "/kredi/list", component: kredi_component},
    // {path: "/kredi/ekle", component: kredi_ekleme_component},
    {
        path: "/sube",
        component: sube_component,
        children: [{path: "/sube/list", component: sube_content_component},
            {path: "/sube/ekle", component: sube_ekleme_component}]
},
{
    path: "/sube/list", component
:
    sube_component
}
,
]
;

const router = createRouter({
    history: createWebHistory(),
    linkActiveClass: "link-active",
    linkExactActiveClass: "link-exact-active",
    routes,
});


app.use(pinia)
app.use(router);
app.mount("#app");
// createApp(App).mount("#app");
