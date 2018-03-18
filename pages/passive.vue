<template>
  <section class="container">
    <div class="text">
      <p>Your task as a passive is to detect as fast as possible, who are you facing - a real human or a robot.
        Please wait untill someone connet and when start a talk. You <strong>must</strong> write first.</p>
    </div>
    <div class="form">
      <label style="margin-bottom: 1rem;">Name: <input class="room" v-model="name" type="text" placeholder="enter your name" autofocus/></label>
    </div>
    <div>
      <nuxt-link class="start" style="background: #F1F8E9;" :to="'/room/'+room+'?role=passive'+'&name='+name+'&neural='+neural">Enter as passive</nuxt-link>
    </div>
  </section>
</template>

<script>
import AppLogo from '~/components/AppLogo.vue'
import { hri } from 'human-readable-ids'

export default {
  components: {
    AppLogo
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

.text {
  max-width: 500px;
  text-align: left;
  margin-bottom: 2rem;
}

</style>
