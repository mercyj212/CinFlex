import {createRouter, createWebHistory} from 'vue-router';

import Home from '../views/Index.vue';
import Login from '../views/Login.vue';
import Movies from '../views/Movies.vue';
import TvShows from '../views/TvShows.vue';
import MyList from '../views/MyList.vue';


const routes = [
    {
        path: '/',
        name: 'Home',
        component: Home,
    },
    
    {
        path: '/login',
        name: 'Login',
        component: Login
    },

    {
        path: '/movies',
        name: 'Movies',
        component: Movies,
        meta: { requiresAuth: true }
    },

    {
        path: '/tvshows',
        name: 'TvShows',
        component: TvShows,
        meta: { requiresAuth: true }
    },

    {
        path: '/mylist',
        name: 'MyList',
        component: MyList,
        meta: { requiresAuth: true }
    }
    
];

const router = createRouter({
    history: createWebHistory(),
    routes
});

// protect router
router.beforeEach((to, from, next) => {
    const isAuthenticated = !! localStorage.getItem('token');

    if (to.meta.requiresAuth && !isAuthenticated) {
        console.log('Access denied. Please log in first.');
        
        localStorage.setItem('redirectMessage', 'Please log in to continue'); // set message
        next('/');
    }else {
        next();
    }
});

export default router;