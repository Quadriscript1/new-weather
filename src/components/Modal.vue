<template>
  <div @click="closeModal" class="modal" ref="modal">
    <vue-element-loading :active="loading" spinner="bar-fade-scale" />
    <div class="modal-wrap" ref="modalWrap">
      <label for="city-name">Enter Location:</label>
      <input type="text" name="city-name" placeholder="Search By City Name" v-model="city">
      <button @click="addCity">Add</button>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import firebaseConfig from "../Firebase/firebase"
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc } from 'firebase/firestore';
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
export default {
  name: "modalSearch",
  props: ['APIkey', 'cities'],
  data() {
    return {
      city: '',
      loading:false,
    }
  },
  mounted() {
    // console.log(this.cities);
  },
  methods: {
    closeModal(e) {
      if (e.target === this.$refs.modal) {
        this.$emit('close-modal')
      }

    },
    async addCity() {
      this.loading = true
      const collectionRef = collection(db, 'cities');
      if (this.city === "") {
        alert("field can't be empty")
      }
      else if (this.cities.some((res) => res.city === this.city.toLowerCase())) {
        this.$toast.error(`${this.city} already exists`, {
              timeout: 3000,
              position:'top-right',
              closeOnClick: true,
          });
        this.loading = false
      }
      else {
        try {
          const res = await axios.get(
            `https://api.openweathermap.org/data/2.5/weather?q=${this.city}&APPID=${this.APIkey}`
          );
          const data = await res.data
          await addDoc(collectionRef, {
            city: this.city.toLocaleLowerCase(),
            currentWeather: data
          });
          this.loading = false
          this.$emit('close-modal')
          location.reload();
        } catch (error) {      
          this.loading = false
          this.$toast.error(`${this.city} does not exist, please try again`, {
              timeout: 1000,
              position:'top-right',
              closeOnClick: true,
          });
          // alert(`${this.city} does not exist, please try again`)
          this.loading = false
        }
      }
    },

  }
}
</script>

<style lang="scss" scoped>
.modal {
  z-index: 101;
  background: rgba(0, 0, 0, 0.5);
  position: fixed;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;

  label {
    color: #fff;
  }
  
  .modal-wrap {
    max-width: 500px;
    border-radius: 8px;
    width: 80%;
    padding: 20px;
    background-color: #31363d;
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);

    input {
      color: #fff;
      border: none;
      background-color: transparent;
      border-bottom: 1px solid #fff;
      padding: 6px 4px;
      margin: 10px 0 20px;
      width: 100%;

      &:focus {
        outline: none;
      }
    }

    button {
      background-color: #222325;
      color: #fff;
      padding: 6px 20px;
      border-radius: 8px;
      border: none;
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
    }
  }
}
</style>