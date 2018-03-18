<template>
  <section class="container">
    <div class="text">
      <p>Your task as a active is to make you opponent believe that you are a <strong>stupid</strong> neural network. You <strong>must wait</strong> untill your opponent writes to you first.</p>
    </div>
    <div class="form">
      <label style="margin-bottom: 1rem;">Name: <input class="room" v-model="name" type="text" placeholder="enter your name" autofocus/></label>
    </div>
    <div v-if="waitingArray.length === 0">Please, wait until some passive arrives</div>
    <div v-else style="margin-top: 1rem; margin-bottom: 1rem">There are at best {{waitingArray.length}} passive waiting to chat </div>
    <div>
      <button @click="initiate" :disabled="waitingArray.length === 0" class="start" style="background: #E3F2FD;">Enter as active</button>
    </div>
  </section>
</template>

<script>
import { mapState } from "vuex";

export default {
  components: {
  },
  data() {
    return {
      name: '',
      rommsRef: this.$firebase.database().ref("allRooms"),
    }
  },
  computed: {
    room() {return this.waitingArray.length ? this.waitingArray[0].room : ''},
    waitingArray() { return this.allRooms.filter(x => x.active == null)} ,
    ...mapState({
      allRooms: state => state.allRooms
    })
  },  
  mounted() {
    this.$store.dispatch("setAllRoomsRef", this.rommsRef);
  },
  methods: {
    initiate() {
      let roomLink = this.room

      this.$firebase.database().ref("allRooms/"+this.waitingArray[0]['.key']).set({
        passive: this.waitingArray[0].passive,
        connectTimestamp: this.waitingArray[0].connectTimestamp ? this.waitingArray[0].connectTimestamp : null , 
        room: this.waitingArray[0].room,
        active: this.name
      })

      this.$router.push('/room/'+roomLink+'?role=active'+'&name='+this.name)
    }
  },
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

.start:disabled {
  opacity: 0.3;
  cursor: not-allowed;
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
