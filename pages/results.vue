<template>
  <section class="container">
    <ol>
      <li v-for="res in results" :key="res.timestamp"><nuxt-link to="/room/silly-jellyfish-11">{{ res.room }}</nuxt-link>: (Passive) {{ res.passive }} vs (Active) {{ res.active }} – {{ res.result }}</li>
    </ol>
  </section>
</template>

<script>
import { mapState } from "vuex";

export default {
  data() {
    return {
      resultsRef: this.$firebase.database().ref("results"),
    };
  },
  computed: mapState(["results"]),
  mounted() {
    this.$store.dispatch("setResultsRef", this.resultsRef);
  },

};
</script>

<style scoped>
.container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
}
</style>
