<template>
  <section class="container">
    <div class="form">
      <label style="margin-bottom: 1rem;">Name: <input class="room" v-model="name" type="text" placeholder="enter your name" autofocus/></label>
      <label>Room ID: <input class="room" v-model="room" type="text" /></label>
    </div>
    <div>
      <nuxt-link class="start" style="background: #E3F2FD;" :to="'/room/'+room+'?role=active'+'&name='+name+'&neural='+neural">Enter as active</nuxt-link>
      <nuxt-link class="start" style="background: #F1F8E9;" :to="'/room/'+room+'?role=passive'+'&name='+name+'&neural='+neural">Enter as passive</nuxt-link>
    </div>
    <div style="position: absolute; bottom: 0">
      <nuxt-link class="start" to="/results">Results</nuxt-link>
    </div>
  </section>
</template>

<script>
import { hri } from 'human-readable-ids'

export default {
  components: {
  },
  data() {
    return {
      room: hri.random(),
      name: '',
      neural: 'asdasdas',
      neuralRate: 70
    }
  },
  mounted() {
    if (Math.random() * 100 > this.neuralRate) this.neural = "yes";
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
