<template>
    <div class="main">
        <div v-if="loading" class="loading">
            <span></span>
        </div>
        <div v-else class="weather" :class="{ day: isDay, night: isNight }">
            <div class="weather-wrap">
                <currentWeather :isDay="isDay" :isNight="isNight" :currentWeather="currentWeather" />
                <HourlyWeatherVue :forecast="forecast" />
                <weeklyForecastVue :forecast="forecast" />
                <AdditionalInfo :currentWeather="currentWeather" />
            </div>
        </div>
    </div>
</template>

<script>
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, query, where, getDocs } from 'firebase/firestore';
import axios from 'axios';
import firebaseConfig from '../Firebase/firebase';
import currentWeather from '../components/currentWeather.vue';
import HourlyWeatherVue from '../components/HourlyWeather.vue'
import weeklyForecastVue from '../components/weeklyForecast.vue'
import AdditionalInfo from '@/components/AdditionalInfo.vue';

// Initialize Firebase app
initializeApp(firebaseConfig);

// Get Firestore instance
const db = getFirestore();

export default {
    name: 'myWeather',
    components: {
        currentWeather,
        HourlyWeatherVue,
        weeklyForecastVue,
        AdditionalInfo

    },
    props: ['APIkey', 'isDay', 'isNight'],
    data() {
        return {
            forecast: null,
            currentWeather: null,
            loading: true,
            currentTime: null
        }
    },
    created() {
        this.getWeather();
    },
    beforeDestroy() {
        this.$emit('resetDays')
    },
    methods: {
        async getWeather() {
            this.loading == true
            try {
                const cityQuerySnapshot = await getDocs(query(collection(db, 'cities'), where('city', '==', this.$route.params.city)));
                cityQuerySnapshot.forEach((doc) => {
                    this.currentWeather = doc.data().currentWeather;
                    axios.get(`https://api.openweathermap.org/data/3.0/onecall?lat=${this.currentWeather.coord.lat}&lon=${this.currentWeather.coord.lon}&exclude=current,minutley,alerts&units=imperial&appid=${this.APIkey}`)
                        .then((res) => {
                            this.forecast = res.data;
                            this.getCurrentTime(this.currentWeather)
                        })
                        .catch((error) => {
                            console.error(error);
                        })
                        .finally(() => {
                            this.loading = false
                        })
                });
            } catch (error) {
                console.error(error);
            }
        },




        getCurrentTime(data) {
            const dateObject = new Date();
            this.currentTime = dateObject.getHours()
            const sunrise = new Date(data.sys.sunrise * 1000).getHours()
            const sunset = new Date(data.sys.sunset * 1000).getHours()
            if (this.currentTime > sunrise && this.currentTime > sunset) {
                this.$emit("is-day")
            } else {
                this.$emit('is-night')
            }
        }

    }
}
</script>

<style lang="scss" scoped>
.weather {
    transition: 500ms ease;
    overflow: scroll;
    width: 100%;
    height: 100vh;

    .weather-wrap {
        overflow: hidden;
        max-width: 1024px;
        margin: 0 auto;
    }
}
</style>