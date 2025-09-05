<template>
    <div>
         <NavbarHome  
            :isLoggedIn="isLoggedIn"
            @login="handleLogin"
            @logout="handleLogout"
        />

        <div v-if="message" class="bg-red-500 text-white p-3 text-center">
            {{ message }}
        </div>
    
        <router-view></router-view>
    </div>

</template>

<script>
    import NavbarHome from './components/NavbarHome.vue';
    

    export default {
        components: {
            NavbarHome,
            
        },
        data() {
            return {
                isLoggedIn: !!localStorage.getItem('token'),
                message: '',
            };
        },
       watch: {
        $route() {
            const msg = localStorage.getItem('redirectMessage');
            if (msg) {
                this.message = msg;
                localStorage.removeItem('redirectMessage');
                setTimeout(() => {
                    this.message = '';
                }, 3000);
            }
        }
       },
        methods: {
             handleLogin(token) {
            localStorage.setItem('token', token);
            this.isLoggedIn = true;
            this.$router.push('/movies');
        },
        handleLogout() {
            localStorage.removeItem('token');
            this.isLoggedIn = false;
            this.$router.push('/');
        }
    }
};
</script>