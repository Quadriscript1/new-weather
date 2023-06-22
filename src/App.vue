<template>
  <div class="main">
    <div v-if="isLoading" class="loading">

    </div>
    <div v-else id="app">
      <Modal v-if="modalOpen" v-on:close-modal="toggleModal" :APIkey="APIkey" :cities="cities" />
      <navigationApp v-on:add-city="toggleModal" v-on:edit-city="toggleEdit" :addCityActive="addCityActive" :isDay="isDay"
        :isNight="isNight" />
      <router-view :weather="weather" :edit="edit" :APIkey="APIkey" v-on:is-day="dayTime" v-on:is-night="nightTime"
        v-on:resetDays="resetDays" :isDay="isDay" :isNight="isNight" v-on:add-city="toggleModal" />
    </div>
  </div>
</template>

<script>
import navigationApp from "./components/ navigationApp.vue";
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs } from 'firebase/firestore';
import { onSnapshot } from 'firebase/firestore';
import { doc, updateDoc } from 'firebase/firestore';
import firebaseConfig from './Firebase/firebase'
import axios from "axios"
import Modal from './components/Modal.vue'



const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
// Get a list of cities from your database
async function getCities(db) {
  const citiesCol = collection(db, 'cities');
  const citySnapshot = await getDocs(citiesCol);
  const cityList = citySnapshot.docs.map(doc => doc.data());
  return cityList;
}

export default {
  data() {
    return {
      isDay: null,
      isNight: null,
      cities: [],
      weather: [],
      APIkey: "9aacbd1c97fef8874ed90cf22e8bfc67",
      modalOpen: null,
      edit: null,
      addCityActive: null,
      isLoading: true
    };
  },
  components: {
    navigationApp,
    Modal
  },
  async created() {
    await this.fetchCities()
    this.checkRoutes();
  },
  methods: {
    async fetchCities() {
      const citiesCol = collection(db, 'cities');
      const citySnapshot = await getDocs(citiesCol);
      this.cities = citySnapshot.docs.map(doc => doc.data());
    },
    getCityWeather() {
      const citiesCollection = collection(db, 'cities');
      onSnapshot(citiesCollection, async (snapshot) => {
        if (snapshot.docs.length === 0) {
          this.isLoading = false
        }
        snapshot.docChanges().forEach(async (change) => {
          // console.log(change);
          // console.log(change.type);
          if (change.type === 'added' && !change.doc.Nd) {
            const cityData = change.doc.data();
            try {
              const response = await axios.get(
                `https://api.openweathermap.org/data/2.5/weather?q=${cityData.city}&APPID=${this.APIkey}`
              );
              const weatherData = response.data;
              await updateDoc(doc(db, 'cities', change.doc.id), {
                currentWeather: weatherData

              });
              this.weather.push(cityData);
              this.isLoading = false

            } catch (error) {
              console.log(error);
            }
          } else if (change.type === 'added' && change.doc.Nd) {
            const cityData = change.doc.data();
            this.weather.push(cityData);
          } else if (change.type === 'removed') {
            const cityData = change.doc.data();
            this.weather = this.weather.filter(city => city.city !== cityData.city)
          }
        });
      });
    },
    async getWeather() {
      try {
        const cities = await getCities(db); // Retrieve cities data
        this.cities = cities; // Update the 'cities' data property
        console.log(this.cities); // Display cities in the console

        // Call API or perform other actions with the cities data
        // ...
      } catch (error) {
        console.error(error);
      }
    },
    toggleModal() {
      this.modalOpen = !this.modalOpen
    },
    toggleEdit() {
      this.edit = !this.edit
    },
    checkRoutes() {
      if (this.$route.name === 'AddCity') {
        this.addCityActive = true
      } else {
        this.addCityActive = false
      }
    },
    dayTime() {
      this.isDay = !this.isDay
    },
    nightTime() {
      this.isNight = !this.isNight
    },
    resetDays() {
      this.isDay = false
      this.isNight = false
    }
  },
  watch: {
    $route() {
      this.checkRoutes();
    }
  },

  mounted() {
    this.getCityWeather()
  }

};
</script>
<style lang="scss" >
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

.day {
  transition: 500ms ease all;
  background-color: rgb(59, 150, 249);
  box-shadow: 0 4px 6px -1px rgba($color: #000000, $alpha: 0.1), 0 2px 4px -1px rgba($color: #000000, $alpha: 0.5);

}

.night {
  transition: 500ms ease all;
  background-color: rgb(20, 42, 95);
  box-shadow: 0 4px 6px -1px rgba($color: #000000, $alpha: 0.1), 0 2px 4px -1px rgba($color: #000000, $alpha: 0.5);

}

#app {
  margin: 0 auto;
  height: 100Vh;
  max-width: 1024px;

  .container {
    padding: 0 20px;

  }
}

.loading {
  @keyframes spin {
    to {
      transform: rotateZ(360deg);
    }
  }

  display: flex;
  height: 100%;
  width: 100%;
  justify-content: center;
  align-items: center;

  span {
    display: block;
    width: 60px;
    height: 60px;
    margin: 0 auto;
    border: 2px solid transparent;
    border-top-color: #142a5f;
    border-radius: 50%;
    animation: spin ease 1000ms infinite;
  }
}
</style>
