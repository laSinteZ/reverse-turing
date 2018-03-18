<template>
  <section class="container">
    <div class="overlay" v-if="done"><nuxt-link to="/" class="answer" style="color: black">TRY AGAIN</nuxt-link></div>
    <h1 v-if="isWaiting" style="color: red">Please wait for your opponent...</h1>

    <h1 v-if="!isWaiting && role=='passive'">Detect, human or robot!</h1>
    <h1 v-if="!isWaiting && role=='passive' && messages.length==0">Send first message!</h1>

    <h1 v-if="!isWaiting && role=='active' ">Make other human think that you are a neural network!</h1>
    <h1 v-if="!isWaiting && role=='active' && messages.length==0">Wait for their first message!</h1>

    <div v-if="role === 'passive' && !isWaiting">{{ wasted }}</div>
    <div v-if="!isWaiting" class="chat" ref="chat" id="chat">
      <div class="message" v-for="msg in messages" :key="msg.timestamp" :style="msg.role=='passive' ? 'background: #E3F2FD' : 'background: #F1F8E9'">{{ msg.message }}</div>
    </div>
    <div class="send" @keyup.enter="sendMessage" v-if="!isWaiting">
      <input class="input" v-model="message" type="text" name="message" autofocus :style="role=='passive' ? 'background: #E3F2FD' : 'background: #F1F8E9'"/>
      <button class="button" type="button" style="cursor: pointer" @click="sendMessage">Send</button>
    </div>
    <div v-if="role === 'passive' && !isWaiting" style="position: absolute; bottom: 0">
      <button class="answer" type="button" style="background: green" @click="()=>submitResult(false)">Human</button>
      <button class="answer" type="button" style="background: red" @click="()=>submitResult(true)">Robot</button>
    </div>
  </section>
</template>

<script>
import { mapState } from "vuex";
import axios from "axios";

export default {
  data() {
    return {
      resultsRef: this.$firebase.database().ref("results"),
      rommsRef: this.$firebase.database().ref("allRooms"),

      chatRef: null,
      message: "",
      role: "passive",
      name: "unnamed",
      turing: false,
      neuralReady: false,
      done: false,

      now: 0,
      start: 0
    };
  },
  computed: {
    wasted() {
      return this.now-this.start;
    },
    waitTime() {
      return (Math.floor(Math.random() * (15 - 7 + 1)) + 7 )*1000;
    },
    room() {
      return this.$route.params.id;
    },
    activeName() {
      return this.activeRoom[0] && this.activeRoom[0].active
        ? this.activeRoom[0].active
        : null;
    },
    activeRoom() {
      return this.allRooms.filter(x => x.room == this.room);
    },
    isWaiting() {
      return (
        (this.role == "passive" && this.activeName == null) ||
        (this.role == "passive" && !this.neuralReady)
      );
    },
    ...mapState({
      messages: state => state.messages,
      allRooms: state => state.allRooms
    })
  },
  methods: {
    sendMessage() {
      if (this.message) {
        let timestamp = Date.now();
        this.chatRef.push({
          message: this.message,
          timestamp: timestamp,
          role: this.role,
          name: this.name
        });

        if (this.turing && this.role === "passive")
          this.receiveMessageFromNeural();
        this.message = "";
      }
    },
    receiveMessageFromNeural() {
      let timestamp = Date.now();
      let context = [];
      context.push(this.message);

      axios
        .post("https://eora.pw/cakechat_api/v1/actions/get_response", {
          context,
          emotion: "joy"
        })
        .then(({ data }) => {
          let waitTime = data.response.length * 300;
          setTimeout(() => {
            this.chatRef.push({
              message: data.response,
              role: "active",
              timestamp: timestamp,
              name: "neural"
            });
          }, data.response.length * 200);
        })
        .catch(error => ({ error }));
    },
    submitResult(isRobot) {
      let timestamp = Date.now();
      let result = "";
      let winner = "";
      this.done = true;

      if (this.turing) {
        if (isRobot) {
          alert("You are right! This is a robot!");
          result = "Passive won";
          winner = "passive";
        } else {
          alert("You are wrong! This is a robot!");
          result = "Bot won";
          winner = "active";
        }
      } else {
        if (isRobot) {
          alert("You are wrong! This is a human!");
          result = "Active won";
          winner = "active";
        } else {
          alert("You are right! This is a human!");
          result = "Passive won";
          winner = "passive";
        }
      }

      this.resultsRef.push({
        winner,
        result,
        timestamp,
        start: this.start*1000,
        wasted: this.wasted,
        passive: this.messages[
          this.messages.findIndex(x => x.role === "passive")
        ].name,
        active: this.messages[this.messages.findIndex(x => x.role === "active")]
          .name,
        room: this.$route.params.id
      });

    }
  },
  mounted() {
    this.chatRef = this.$firebase
      .database()
      .ref("chat/room/" + this.$route.params.id);
    this.role = this.$route.query.role;
    this.name = this.$route.query.name;

    if (this.$route.query.neural) this.turing = this.$route.query.neural.indexOf("a") != -1;
    this.turing
      ? window.setTimeout(() => {
          this.neuralReady = true;
        }, this.waitTime)
      : (this.neuralReady = true);

    this.$store.dispatch("setMessagesRef", this.chatRef);
    this.$store.dispatch("setAllRoomsRef", this.rommsRef);

    // if(this.role=="active" && this.activeRoom.active == null){
    //   this.$firebase.database().ref("allRooms/"+this.activeRoom['.key']).set({
    //     passive: this.activeRoom.passive,
    //     connectTimestamp: this.activeRoom.connectTimestamp ? this.activeRoom.connectTimestamp : null , 
    //     room: this.activeRoom.room,
    //     active: this.name
    //   })
    // }

    window.setInterval(() => {
      this.now = Math.trunc(new Date().getTime() / 1000);
    }, 1000);
  },

  // kostyl
  watch: {
    isWaiting: function() {
      this.start = Math.trunc(new Date().getTime() / 1000);
    },
    messages: function(val) {
      this.$nextTick(function() {
        let element = document.querySelectorAll("#chat")[0];
        if (element) element.scrollTop = element.scrollHeight;
      });
    }
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

.chat {
  min-width: 500px;
  border: 1px solid black;
  min-height: 60vh;
  max-height: 60vh;
  overflow-y: scroll;
  border-bottom: none;
}

.input {
  width: 450px;
  border: 1px solid green;
  font-size: 16px;
  height: 22px;
  outline: none;
  padding-left: 4px;
}

.button {
  border: 1px solid black;
  width: 50px;
  font-size: 16px;
  height: 22px;
  border-left: none;
  outline: none;
}

.message {
  padding: 4px;
}

.answer {
  display: inline-block;
  border: 1px solid black;
  padding: 1rem 2rem;
  cursor: pointer;
  text-decoration: none;
  color: white;
  min-width: 100px;
  margin: 0.5rem;
  font-size: 16px;
}

.overlay {
  height: 100vh;
  width: 100vw;
  background: white;
  z-index: 10000;
  position: absolute;
  display: flex;
  align-items: center;
  justify-content: center;
  top: 0;
  left: 0;
}
</style>
