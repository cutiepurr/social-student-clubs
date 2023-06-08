var admin = new Vue({
    name: "admin",
    el: "main",
    data() {
        return {
            count: {
                club: 0,
                user: 0,
                admin: 0
            }
        };
    },
    created() {
        this.getCount();
    },
    methods: {
        getCount: function() {
            let instance = this;
            for (let db of ['club', 'user', 'admin']) {
                let xhttp = new XMLHttpRequest();
                xhttp.onreadystatechange = function () {
                    if (this.readyState === 4 && this.status === 200) {
                        instance.count[db] = JSON.parse(this.responseText);
                    }
                };
                xhttp.open("GET", `/api/count/${db}`, true);
                xhttp.send();
            }
        }
    }
});

