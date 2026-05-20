<template>
    <div>
        <p>SPA app welcome!</p>
        <div class="space-x-3 bg-sky-50 font-bold">
            <router-link :to="{ name: 'home' }">Home</router-link>
            <router-link :to="{ name: 'dashboard' }">Dashboard</router-link>
            <router-link :to="{ name: 'register' }">Register</router-link>
            <router-link :to="{ name: 'login' }">Login</router-link>
        </div>
        <router-view />
    </div>
</template>
