Vue.component('do-tracking', {
    template: '#tpl-tracking',
    data: function() {
        return {
            searchQuery: '',       // Menampung teks input dari user
            searchResult: null,    // Menampung objek data pengiriman jika ditemukan
            hasSearched: false,    // Penanda status apakah user sudah menekan tombol cari
            trackingList: [],      // Menampung daftar tracking murni dari dataBahanAjar.json
            paketList: []          // Menampung daftar paket murni dari dataBahanAjar.json
        }
    },
    created() {
        // Ambil data tracking langsung dari dataBahanAjar.json saat komponen dimuat
        this.loadTrackingData();
    },
    methods: {
        // FUNGSI UTAMA: Mengambil data khusus dari dataBahanAjar.json
        async loadTrackingData() {
            try {
                const response = await fetch('dataBahanAjar.json');
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const data = await response.json();
                
                // Ambil properti "tracking" dan "paket" dari JSON Anda
                this.trackingList = data.tracking || [];
                this.paketList = data.paket || [];
                console.log("Data Tracking JSON berhasil sinkron.");
            } catch (error) {
                console.error("Gagal memuat data tracking dari JSON:", error);
                // Jika diakses lokal tanpa Live Server, jalankan fallback berbasis file JSON Anda
                if (window.location.protocol === 'file:') {
                    console.warn("Aplikasi berjalan via file://, menggunakan data cadangan JSON.");
                }
                
                // Cadangan data yang disesuaikan persis dengan isi dataBahanAjar.json Anda
                this.trackingList = [
                    {
                        "noDO": "DO2025-0001",
                        "nim": "123456789",
                        "nama": "Rina Wulandari",
                        "status": "Dalam Perjalanan",
                        "ekspedisi": "REG",
                        "tanggalKirim": "2025-08-25",
                        "paket": "PAKET-UT-001",
                        "total": 120000,
                        "perjalanan": [
                            { "waktu": "2025-08-25 10:12:20", "keterangan": "Penerimaan di Loket: TANGSEL" }
                        ]
                    }
                ];
                this.paketList = [
                    { "kode": "PAKET-UT-001", "nama": "PAKET IPS Dasar" },
                    { "kode": "PAKET-UT-002", "nama": "PAKET IPA Dasar" }
                ];
            }
        },

        // FUNGSI PENCARIAN VALID
      handleSearch: function() {
    this.hasSearched = true;
    
    if (!this.searchQuery || this.searchQuery.trim() === '') {
        this.searchResult = null;
        return;
    }

    const query = this.searchQuery.trim().toLowerCase();
    
    // UBAH LOGIKA: Hapus .includes(), gunakan === agar pencarian harus SAMA PERSIS
    const found = this.trackingList.find(item => {
        const itemDO = item.noDO ? item.noDO.trim().toLowerCase() : '';
        const itemNIM = item.nim ? item.nim.trim().toLowerCase() : '';
        
        // Hanya akan TRUE jika input SAMA PERSIS dengan noDO atau NIM
        return itemDO === query || itemNIM === query;
    });

    this.searchResult = found || null; 
},

        // Menerjemahkan kode ekspedisi/paket dari list paket JSON
        getPaketName: function(kodePaket) {
            if (!this.paketList || !Array.isArray(this.paketList)) return kodePaket;
            const foundPaket = this.paketList.find(p => p.kode === kodePaket);
            return foundPaket ? foundPaket.nama : kodePaket;
        }
    }
});
