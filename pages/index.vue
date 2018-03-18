<template>
  <section class="container">
    <h2>Choose your path</h2>
    <div>
      <nuxt-link class="start" style="background: #E3F2FD;" :to="'/active'">Active (cheat &amp; trick people)</nuxt-link>
      <nuxt-link class="start" style="background: #F1F8E9;" :to="'/passive'">Passive (detect who is who)</nuxt-link>
    </div>
    <div style="position: absolute; bottom: 0">
      <nuxt-link class="start" to="/results">Results</nuxt-link>
      <nuxt-link class="start" to="/scoreboard">Scoreboard</nuxt-link>
    </div>
  </section>
</template>

<script>

export default {
  components: {
  },
  data() {
    return {
    }
  },
  mounted() {
  }
}
</script>

<style scoped>
.container {
  min-height: 100vh;
  flex-direction: column;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
}

.room {
  min-width: 285px;
  font-size: 16px;
  padding-left: 4px;
}

.start {
  display: inline-block;
  border: 1px solid black;
  padding: 1rem 2rem;
  cursor: pointer;
  text-decoration: none;
  color: black;
  min-width: 100px;
  margin: .5rem;
}

.form {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
}

.start:visited {
  color: black;
  text-decoration: none;
}

</style>
