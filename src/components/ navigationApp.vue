<template>
  <div>
    <header v-if="addCityActive" class="container add-city">
      <nav>
        <span>Add City</span>
        <div class="right">
          <i @click="editCities" ref="editCities" class="fas fa-edit"></i>
          <i @click="reloadApp" class="fas fa-sync"></i>
          <i @click="addCity" class="fas fa-plus"></i>
        </div>
      </nav>
    </header>
    <header v-else :class="{ day: isDay, night: isNight }">
      <nav>
        <router-link class="router-link" :to="{ name: 'AddCity' }">
          <i class="fas fa-plus"></i>
        </router-link>
        <span>
          {{ new Date().toLocaleString('en-us', { weekday: 'short' }) }}
          {{ new Date().toLocaleString('en-us', { month: 'short' }) }}
          {{ new Date().toLocaleString('en-us', { day: '2-digit' }) }}
        </span>
        <span>
          &deg;C
        </span>
      </nav>
    </header>
  </div>
</template>

<script>

export default {
  data() {
    return {
      active: this.addCityActive
    }
  },
  props: ['addCityActive', 'isDay', 'isNight'],
  methods: {
    addCity() {
      this.$emit('add-city')
    },
    reloadApp() {
      location.reload()
    },
    editCities() {
      this.$refs.editCities.classList.toggle('edit-active')
      this.$emit('edit-city')
    },
    checkRoutes() {
      if (this.$route.name === 'AddCity') {
        this.active = true
      } else {
        this.active = false
      }
    },
  },
  mounted() {
    this.checkRoutes()

  }
}
</script>

<style lang="scss" scoped>
.add-city {
  background-color: #313640;
  box-shadow: 0 4px 6px -1px rgba($color: #000000, $alpha: 0.1), 0 2px 4px -1px rgba($color: #000000, $alpha: 0.5);
}


header {
  z-index: 99;
  position: fixed;
  max-width: 1024px;
  width: 100%;

  nav {
    display: flex;
    color: #fff;
    padding: 30px 0;
    justify-content: space-between;
  }

  .router-link {
    color: #fff;
  }


  .edit-active {
    color: red;
  }

  .right {
    i {
      font-size: 20px;
    }

    i:nth-child(2),
    i:nth-child(3) {
      margin-left: 16px;
    }
  }

  span {
    font-weight: 600;
  }
}
</style>