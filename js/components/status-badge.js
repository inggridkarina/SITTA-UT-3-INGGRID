Vue.component('status-badge', {
    template: '#tpl-badge',
    props: ['qty', 'safety'],
    computed: {
        statusText() {
            if (this.qty === 0) return 'Kosong';
            if (this.qty < this.safety) return 'Menipis';
            return 'Aman';
        },
        badgeClass() {
            return {
                'badge-danger': this.qty === 0,      // Merah
                'badge-warning': this.qty > 0 && this.qty < this.safety, // Orange
                'badge-success': this.qty >= this.safety // Hijau
            };
        }
    }
});