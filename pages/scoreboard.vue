<template>
  <section class="container">
    <ul>
      <li v-for="usr in users" :key="usr.name">{{ usr.name }} : {{ usr.result }}</li>
    </ul>
  </section>
</template>

<script>
import { mapState } from "vuex";

export default {
  data() {
    return {
      resultsRef: this.$firebase.database().ref("results")
    };
  },
  computed: {
    users() {
      let allusers = this.results
        .map(x => x.passive.toLowerCase())
        .concat(this.results.map(x => x.active.toLowerCase()));
      return allusers.filter(function(item, pos) {
        return allusers.indexOf(item) == pos;
      }).map(
        x => { return { name: x, result: this.countScore(x) } }
      );
    },
    ...mapState({
      results: state => state.results
    })
  },
  methods: {
    countScore(n) {
      let name = n.toLowerCase();

      let passives = this.results.filter(x => x.passive.toLowerCase() == name);
      let passivesWon = passives.filter(x => x.winner == "passive");
      let actives = this.results.filter(x => x.active.toLowerCase()  == name);
      let activesWon = actives.filter(x => x.winner == "active");
      console.log(name + passives.length + actives.length + passivesWon.length + activesWon.length)
      let result = 100*passivesWon.length - 100*(passives.length-passivesWon.length) + 250*activesWon.length - 50*(actives.length - activesWon.length)
      return result
    }
  },
  mounted() {
    this.$store.dispatch("setResultsRef", this.resultsRef);
  }
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
