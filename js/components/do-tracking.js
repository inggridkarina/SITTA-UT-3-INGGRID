Vue.component('do-tracking', {
    props: ['data', 'paket'], // Menerima trackingData dan paketData via HTML
    template: '#tpl-tracking',
    data: function() {
        return {
            searchQuery: '',       // Menampung teks input user
            searchResult: null,    // Menampung objek data pengiriman yang ditemukan
            hasSearched: false     // Penanda status pencarian telah dilakukan
        }
    },
    methods: {
        handleSearch: function() {
            this.hasSearched = true;
            
            // Validasi jika string kosong
            if (!this.searchQuery || this.searchQuery.trim() === '') {
                this.searchResult = null;
                return;
            }

            // Normalisasi input ke huruf kecil (lowercase)
            const query = this.searchQuery.trim().toLowerCase();
            
            // Cek ke dalam array data yang dikirim oleh root instance
            if (!this.data || !Array.isArray(this.data)) {
                this.searchResult = null;
                return;
            }

            const found = this.data.find(item => {
                const itemDO = item.noDO ? item.noDO.trim().toLowerCase() : '';
                const itemNIM = item.nim ? item.nim.trim().toLowerCase() : '';
                
                // Pencarian fleksibel: COCOK jika Nomor DO mengandung query ATAU NIM mengandung query
                return itemDO.includes(query) || itemNIM.includes(query);
            });

            this.searchResult = found ? found : null;
        },
        
        handleReset: function() {
            this.searchQuery = '';
            this.searchResult = null;
            this.hasSearched = false;
        },

        getPaketName: function(kodePaket) {
            if (!this.paket || !Array.isArray(this.paket)) return kodePaket;
            const foundPaket = this.paket.find(p => p.kode === kodePaket);
            return foundPaket ? foundPaket.nama : kodePaket;
        }
    }
});