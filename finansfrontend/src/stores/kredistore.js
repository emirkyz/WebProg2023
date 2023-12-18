import {defineStore} from "pinia";
import axios from "axios";
import {useLoadingState} from "@/stores/loading_state";
import {useMusteriStore} from "@/stores/musteristore";

export const useKrediStore = defineStore("kredi", {
    state: () => ({
        krediler: [],
        selectedCredit: null,
        id_order: "?sırala=ar_id",
        total_credits: 0,
        sayfa: 0,
        adet: 10,
        at_end: false,
        net_error: false,
    }),
    actions: {
        init() {
            this.sayfa = 0;
            this.adet = 10;
            this.at_end = false;
            this.yukle();
        },
        yukle(sayfa = 0, siralama = this.id_order) {
            const loading = useLoadingState();
            loading.yuklemeyeBasla();
            this.selectedCredit = null;
            axios
                .get(
                    `http://127.0.0.1:5000/api/v1/kredi/s/${sayfa}/k/${this.adet}${siralama}`,
                )
                .then((response) => {
                    // if(response.data.length === 0){
                    //     this.at_end = true;
                    //     this.sayfa -= 1;
                    //     this.krediler = this.cached_kredi;
                    //     loading.yuklemeyiBitir();
                    //     return;
                    // }
                    if (response.status === 200) {
                        this.net_error = false;
                    }
                    this.at_end = false;
                    this.krediler = response.data;
                    loading.yuklemeyiBitir();
                })
                .catch(error => {
                    if (!error.response) {
                        // network error
                        this.net_error = true;
                        this.total_credits = 0;
                        console.log("Network Error");
                    } else {
                        this.net_error = false;
                    }

                });
        },
        get_all_kredi() {
            axios
                .get(`http://127.0.0.1:5000/api/v1/kredi/k/100000000000`)
                .then((response) => {
                    this.total_credits = response.data.length;
                });
        },
        krediEkle(kredi) {
            axios
                .post("http://127.0.0.1:5000/api/v1/kredi/", kredi)
                .then((response) => {
                    const kredi = response.data;
                    const musteri = useMusteriStore();
                    musteri.kredi_skor_guncelle(kredi["kredi_musteri_id"])
                    this.krediler.push(kredi);
                }).catch(error => {
                if (!error.response) {
                    // network error
                    this.net_error = true;
                    this.total_credits = 0;
                    console.log("Network Error");
                } else {
                    this.net_error = false;
                }

            });
        },
        krediDuzenle(kredi, kredi_id) {
            axios.put('http://127.0.0.1:5000/api/v1/sube/' + kredi_id, kredi).then((response) => {
                const kredi = response.data;

                this.yukle(this.sayfa = 0);
            })
        },
        krediSil(kredi) {
            if (confirm("Krediyi silmek istediğinize emin misiniz?")) {
                console.log(kredi["id"]);
            }
            axios.delete('http://127.0.0.1:5000/api/v1/kredi/' + kredi["id"]).then((response) => {
                const kredi = response.data;

                this.yukle();
            })
            this.sayfa = 0;
            console.log(this.total_credits)
            this.total_credits -= 1;
        },
        sonraki_sayfa() {
            if ((this.sayfa + 1) * this.adet >= this.total_credits) {
                this.at_end = true;
                return;
            }
            if (this.krediler.length === 0) {
                this.at_end = true;
                return;
            }
            if (this.krediler.length < 10) {
                this.at_end = true;
                return;
            }
            this.sayfa += 1;
            this.yukle(this.sayfa);
        },
        onceki_sayfa() {
            if (this.krediler.length === 0) {
                return;
            }
            if (this.sayfa === 0) {
                return;
            }
            this.at_end = false;
            this.sayfa -= 1;
            this.yukle(this.sayfa);
        },
        order_by_id() {
            if (this.id_order === "?sırala=ar_id") {
                this.sayfa = 0;
                this.id_order = "?sırala=az_id";
                this.yukle();
            } else {
                this.sayfa = 0;
                this.id_order = "?sırala=ar_id";
                this.yukle();
            }
        },
    },
});
