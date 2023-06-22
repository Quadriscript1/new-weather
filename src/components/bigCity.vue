<template>
  <div @click="goToWeather" class="city">
    <i v-if="edit" @click="removeCity" class="fas fa-trash-alt edit" ref="edit "></i>
    <span>{{ city.city }}</span>
    <div class="weather">
      <span>{{ Math.round(this.city.currentWeather.main.temp) - 273 }}&deg;</span>
      <img :src="require(`../../public/conditions/${this.city.currentWeather.weather[0].icon}.svg`)" alt="">
    </div>
    <div class="video">
      <video :src="require(`../../public/videos/${this.city.currentWeather.weather[0].icon}.mp4`)"></video>
      <div class="bg-overlay"></div>
    </div>
  </div>
</template>

<script>

import firebaseConfig from "../Firebase/firebase"
import { initializeApp } from 'firebase/app';
import { getFirestore, collection } from 'firebase/firestore';
import { query, where, getDocs, deleteDoc } from 'firebase/firestore';


const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export default {
  name: "bigCity",
  props: ['city', 'edit'],
  data() {
    return {
      id: null
    }
  },
  created() {
    // console.log(this.city);
  },
  methods: {
    async removeCity() {
      const citiesCollectionRef = collection(db, 'cities');
      const cityQuery = query(citiesCollectionRef, where('city', '==', `${this.city.city}`));

      const querySnapshot = await getDocs(cityQuery);

      querySnapshot.forEach((doc) => {
        deleteDoc(doc.ref);

      });
    },
    goToWeather(e) {
      if (e.target === this.$refs.edit) {
        //
      } else {
        this.$router.push({ name: 'weather', params: { city: this.city.city } })
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.city {
  display: flex;
  position: relative;
  flex-direction: column;
  padding: 20px;
  flex-basis: 50%;
  min-height: 250px;
  color: #fff;
  box-shadow: 0 1px 2px 0 rgba($color: #000000, $alpha: 0.5);

  .edit {
    border-radius: 0px 15px 0 0;
    border: 10px solid rgb(77, 77, 77);
    background-color: rgb(77, 77, 77);
    z-index: 1;
    font-size: 20px;
    position: absolute;
    bottom: 0px;
    left: 0px;
  }

  span {
    z-index: 1;
    text-transform: capitalize;
    display: block;
    font-size: 25px;
    font-weight: 600;
  }

  .weather {
    display: flex;
    z-index: 1;
    justify-content: flex-end;
    align-items: flex-end;
    flex: 1;

    span {
      margin-right: 8px;
      font-size: 35px;
    }

    img {
      width: auto;
      height: 20px;
    }
  }

  .video {
    overflow: hidden;
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;

    video {
      height: 100%;

      @media (min-width: 900px) {
        height: auto;
        width: 100%;

      }
    }

    .bg-overlay {
      position: absolute;
      height: 100%;
      width: 100%;
      top: 0;
      background: rgba($color: #000000, $alpha: 0.2);
    }


  }
}
</style>