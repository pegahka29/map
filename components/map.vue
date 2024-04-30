<script setup lang="ts">
import {onMounted, watchEffect} from "vue";
import {useGeolocation} from "@vueuse/core";
import leaflet from  "leaflet"
import {userMarker, nearbyMarkers} from "~/stores/mapStore";

let map : leaflet.Map
let userGeoMarker : leaflet.Marker
const {coords} = useGeolocation()
onMounted(()=>{
    map = leaflet.map("map").setView([userMarker.value.latitude, userMarker.value.longitude],13)
    leaflet.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(map);
})
watchEffect(()=>{
    if(coords.value.latitude !== Number.POSITIVE_INFINITY && coords.value.longitude !== Number.POSITIVE_INFINITY){
        userMarker.value.latitude = coords.value.latitude
        userMarker.value.longitude = coords.value.longitude
    }

})
</script>

<template>
    <div id="map"></div>
</template>

<style scoped>

</style>