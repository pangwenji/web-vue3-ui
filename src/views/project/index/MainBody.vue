<template>
    <router-view v-slot="{route,Component}">
        <component :is="Component" :key="route.path + '/' + (route.query?.parent || 0)"></component>
    </router-view>
</template>
<script>
import { defineComponent } from 'vue'
import { useRoute } from 'vue-router'

export default defineComponent({
    setup() { return {}},
})
</script>
