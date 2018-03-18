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
      <button @click="initiate" class="start" style="background: #F1F8E9;">Enter as passive</button>
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
      neural: false,
      hash: "no",
      neuralRate: 70,
      roomsRef: this.$firebase.database().ref("allRooms"),
    }
  },
  mounted() {
    if (Math.random() * 100 > this.neuralRate) this.neural = true;
    this.neural ? this.hash = "yes" : this.hash = "no"
  },
  methods: {
    initiate() {
      let connectTimestamp = Date.now();
      this.roomsRef.push({
        room: this.room,
        passive: this.name,
        active: this.neural ? "neural" : null,
        connectTimestamp
      })
      this.$router.push('/room/'+this.room+'?role=passive'+'&name='+this.name+'&neural='+this.hash)
    }
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
  font-size: 16px;
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
