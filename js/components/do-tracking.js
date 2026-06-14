Vue.component('do-tracking', {
    template: '#tpl-tracking',
    data: function() {
        return {
            searchQuery: '',
            searchResult: null,
            hasSearched: false,
            trackingList: [],
            paketList: []
        }
    },
    created() {
        this.loadTrackingData();
    },
    methods: {
        async loadTrackingData() {
            try {
                // Catatan: Pastikan file dataBahanAjar.json berada di folder yang bisa diakses
                const response = await fetch('dataBahanAjar.json');
                if (!response.ok) throw new Error('Gagal memuat JSON');
                const data = await response.json();
                
                this.trackingList = data.tracking || [];
                this.paketList = data.paket || [];
            } catch (error) {
                console.error("Error loading JSON:", error);
                // Fallback data tetap dipertahankan
                this.trackingList = [
                    { "noDO": "DO2025-0001", "nim": "123456789", "nama": "Rina Wulandari", "status": "Dalam Perjalanan", "ekspedisi": "REG", "tanggalKirim": "2025-08-25", "paket": "PAKET-UT-001", "total": 120000, "perjalanan": [{ "waktu": "2025-08-25 10:12:20", "keterangan": "Penerimaan di Loket: TANGSEL" }] }
                ];
                this.paketList = [
                    { "kode": "PAKET-UT-001", "nama": "PAKET IPS Dasar" },
                    { "kode": "PAKET-UT-002", "nama": "PAKET IPA Dasar" }
                ];
            }
        },

        handleSearch: function() {
            this.hasSearched = true;
            
            if (!this.searchQuery) {
                this.searchResult = null;
                return;
            }

            const query = this.searchQuery.trim().toLowerCase();
            
            // Logika pencarian yang lebih aman (mengkonversi NIM ke string)
            this.searchResult = this.trackingList.find(item => {
                const itemDO = String(item.noDO || '').trim().toLowerCase();
                const itemNIM = String(item.nim || '').trim().toLowerCase();
                
                return itemDO === query || itemNIM === query;
            }) || null;
        },

        handleReset: function() {
            this.searchQuery = '';
            this.searchResult = null;
            this.hasSearched = false;
        },

        getPaketName: function(kodePaket) {
            const foundPaket = this.paketList.find(p => p.kode === kodePaket);
            return foundPaket ? foundPaket.nama : kodePaket;
        }
    }
});
