Vue.component('app-modal', {
    template: '#tpl-modal',
    data() {
        return {
            visible: false,
            title: '',
            message: '',
            onConfirm: null
        };
    },
    methods: {
        open(title, message, callback) {
            this.title = title;
            this.message = message;
            this.onConfirm = callback;
            this.visible = true;
        },
        close() {
            this.visible = false;
        },
        confirm() {
            if (this.onConfirm) this.onConfirm();
            this.close();
        }
    }
});