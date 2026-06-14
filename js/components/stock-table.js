Vue.component('ba-stock-table', {
    template: '#tpl-stock',
    data() {
        return {
            stokList: [],
            upbjjList: [],
            kategoriList: [],
            sortBy: 'judul',
            filters: { upbjj: '', kategori: '', warningStock: false },
            isEdit: false,
            form: { kode: '', judul: '', kategori: '', upbjj: '', lokasiRak: '', harga: 0, qty: 0, safety: 0, catatanHTML: '' }
        };
    },
    filters: {
        formatRupiah(value) {
            if (!value) return 'Rp 0';
            return 'Rp ' + Number(value).toLocaleString('id-ID');
        },
        formatBuah(value) {
            return (value || 0) + ' buah';
        }
    },
    watch: {
        'filters.upbjj': function (newVal) {
            console.log(`[WATCHER 1] User mengubah filter wilayah ke: ${newVal}`);
            this.handleUpbjjChange();
        },
        'sortBy': function (newVal) {
            console.log(`[WATCHER 2] Sorting tabel diubah berdasarkan: ${newVal}`);
        }
    },
    computed: {
        filteredAndSortedStocks() {
            let result = [...this.stokList];

            if (this.filters.upbjj) {
                result = result.filter(s => s.upbjj === this.filters.upbjj);
            }
            if (this.filters.kategori) {
                result = result.filter(s => s.kategori === this.filters.kategori);
            }
            if (this.filters.warningStock) {
                result = result.filter(s => s.qty <= s.safety || s.qty === 0);
            }

            return result.sort((a, b) => {
                if (this.sortBy === 'harga' || this.sortBy === 'qty') {
                    return a[this.sortBy] - b[this.sortBy];
                }
                return (a.judul || '').localeCompare(b.judul || '');
            });
        }
    },
    created() {
        this.loadJsonBahanAjar();
    },
    methods: {
        async loadJsonBahanAjar() {
            try {
                // Berfungsi universal, baik di local server (HTTP) maupun di Netlify (HTTPS)
                const response = await fetch('dataBahanAjar.json');
                
                if (!response.ok) {
                    throw new Error(`Gagal membaca file JSON. Status HTTP: ${response.status}`);
                }
                
                const data = await response.json();
                this.stokList = data.stok || [];
                this.upbjjList = data.upbjjList || [];
                this.kategoriList = data.kategoriList || [];
                console.log("Data JSON berhasil dimuat dari server.");
                
            } catch (error) {
                console.error("Gagal memuat dataBahanAjar.json via Fetch API:", error);
                
                // PERBAIKAN: Deteksi cerdas. Hanya tampilkan alert jika diakses lewat protokol file:/// (bukan Netlify)
                if (window.location.protocol === 'file:') {
                    alert("Peringatan Lokal: Gunakan ekstensi 'Live Server' agar browser diizinkan membaca file JSON.");
                }
                
                // Fallback aman agar aplikasi tidak kosong total jika server mengalami kendala sesaat
                this.upbjjList = ["Jakarta", "Surabaya", "Makassar", "Padang", "Denpasar"];
                this.kategoriList = ["MK Wajib", "MK Pilihan", "Praktikum", "Problem-Based"];
                this.stokList = [
                    { "kode": "EKMA4116", "judul": "Pengantar Manajemen", "kategori": "MK Wajib", "upbjj": "Jakarta", "lokasiRak": "R1-A3", "harga": 65000, "qty": 28, "safety": 20, "catatanHTML": "<em>Edisi 2024, cetak ulang</em>" },
                    { "kode": "EKMA4115", "judul": "Pengantar Akuntansi", "kategori": "MK Wajib", "upbjj": "Jakarta", "lokasiRak": "R1-A4", "harga": 60000, "qty": 7, "safety": 15, "catatanHTML": "<strong>Cover baru</strong>" }
                ];
            }
        },
        handleUpbjjChange() {
            this.filters.kategori = '';
        },
        resetFilters() {
            this.filters.upbjj = '';
            this.filters.kategori = '';
            this.filters.warningStock = false;
        },
        saveData() {
            if (!this.form.kode || !this.form.judul) {
                alert('Kode dan Judul bahan ajar wajib diisi!');
                return;
            }
            if (this.isEdit) {
                const idx = this.stokList.findIndex(s => s.kode === this.form.kode);
                if (idx !== -1) {
                    Vue.set(this.stokList, idx, { ...this.form });
                }
                this.isEdit = false;
            } else {
                this.stokList.push({ 
                    ...this.form, 
                    catatanHTML: this.form.catatanHTML || '<span>Data ditambahkan manual.</span>' 
                });
            }
            this.resetForm();
        },
        editData(item) {
            this.isEdit = true;
            this.form = { ...item };
        },
        cancelEdit() {
            this.isEdit = false;
            this.resetForm();
        },
        confirmDelete(kode) {
            if (this.$root.$refs.modal) {
                this.$root.$refs.modal.open(
                    'Konfirmasi Hapus',
                    `Apakah Anda yakin ingin menghapus bahan ajar dengan kode ${kode}?`,
                    () => {
                        this.stokList = this.stokList.filter(s => s.kode !== kode);
                    }
                );
            } else {
                if (confirm(`Apakah Anda yakin ingin menghapus bahan ajar dengan kode ${kode}?`)) {
                    this.stokList = this.stokList.filter(s => s.kode !== kode);
                }
            }
        },
        resetForm() {
            this.form = { kode: '', judul: '', kategori: '', upbjj: '', lokasiRak: '', harga: 0, qty: 0, safety: 0, catatanHTML: '' };
        }
    }
});