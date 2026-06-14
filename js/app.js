// /js/app.js

new Vue({
    el: '#app',
    data: {
        tab: 'stok', // Mengatur tab default halaman saat login berhasil
        state: {
            upbjjList: [],
            kategoriList: [],
            pengirimanList: [],
            paket: [],
            stok: [],
            tracking: [] // Tempat menampung array dari dataBahanAjar.json
        }
    },
    created: function() {
        // Memanggil fungsi fetch API dari services/api.js Anda
        APIService.getData()
            .then(data => {
                this.state.upbjjList = data.upbjjList || [];
                this.state.kategoriList = data.kategoriList || [];
                this.state.pengirimanList = data.pengirimanList || [];
                this.state.paket = data.paket || [];
                this.state.stok = data.stok || [];
                this.state.tracking = data.tracking || [];
                console.log("Data SITTA Berhasil Sinkron:", this.state);
            })
            .catch(err => {
                console.error("Gagal memuat berkas dummy JSON:", err);
            });
    }
});