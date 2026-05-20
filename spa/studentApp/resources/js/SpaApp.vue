<template>
    <div class="ml-2.5 mt-2.5">
        <p>SPA app welcome!</p>
        <div class="space-x-3 bg-sky-50 font-bold my-2 p-2 rounded">
            <router-link :to="{ name: 'home' }">Home</router-link>
            <router-link :to="{ name: 'dashboard' }">Dashboard</router-link>
            <router-link :to="{ name: 'register' }">Register</router-link>
            <router-link :to="{ name: 'login' }">Login</router-link>
        </div>
        <router-view />
    </div>
</template>
