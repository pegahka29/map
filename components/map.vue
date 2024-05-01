<script setup lang="ts">
import { ref } from 'vue';
import { onMounted, watchEffect } from 'vue';
import { useGeolocation } from '@vueuse/core';
import leaflet from 'leaflet';
import { userMarker, nearbyMarkers } from '~/stores/mapStore';

let map: leaflet.Map;
let userGeoMarker: leaflet.Marker | null = null;
let firstLocation: leaflet.LatLng | null = null;
const selectedMarkers = ref<leaflet.Marker[]>([]);
const { coords } = useGeolocation();

onMounted(() => {
    navigator.geolocation.getCurrentPosition(
        (position) => {
            // Success: User's location obtained
            const { latitude, longitude } = position.coords;
            userMarker.value.latitude = latitude;
            userMarker.value.longitude = longitude;
        },
        (error) => {
            // Error: Unable to obtain user's location
            console.error('Error getting user location:', error.message);
        }
    );

    map = leaflet.map('map').setView(
        [userMarker.value.latitude, userMarker.value.longitude],
        13
    );
    leaflet
        .tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 19,
            attribution:
                '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        })
        .addTo(map);

    map.on('click', (e) => {
        if (selectedMarkers.value.length < 1) {
            const { lat, lng } = e.latlng;
            const marker = leaflet.marker([lat, lng]).addTo(map);
            selectedMarkers.value.push(marker);
            if (selectedMarkers.value.length === 1) {
                computeDistance(selectedMarkers.value);
            }
        }
    });
    firstLocation = leaflet.latLng(userMarker.value.latitude, userMarker.value.longitude);
});

watchEffect(() => {
    if (
        coords.value.latitude !== Number.POSITIVE_INFINITY &&
        coords.value.longitude !== Number.POSITIVE_INFINITY
    ) {
        userMarker.value.latitude = coords.value.latitude;
        userMarker.value.longitude = coords.value.longitude;
        if (!userGeoMarker) {
            userGeoMarker = leaflet.marker([
                userMarker.value.latitude,
                userMarker.value.longitude
            ]).addTo(map);
        } else {
            userGeoMarker.setLatLng([
                userMarker.value.latitude,
                userMarker.value.longitude
            ]);
        }
        map.setView(
            [userMarker.value.latitude, userMarker.value.longitude],
            13
        );
    }
});

function computeDistance(markers: leaflet.Marker[]) {
    if (firstLocation) {
        const latlng1 = firstLocation;
        const latlng2 = markers[0].getLatLng();
        const distance = latlng1.distanceTo(latlng2);
        console.log('Distance between the first location and the second location:', distance);
        const distanceInKilometers = distance / 1000;
        console.log('Distance between the first location and the second location (kilometers):', distanceInKilometers.toFixed(2));
    } else {
        console.error('First location is not available');
    }
}
</script>

<template>
    <div id="map"></div>
</template>

<style scoped>
</style>
