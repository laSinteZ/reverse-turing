<template>
  <section class="container">
    <div key="keppa">{{ now }}</div>
    <div class="chat" ref="chat" id="chat">
      <div class="message" v-for="msg in messages" :key="msg.timestamp" :style="msg.role=='passive' ? 'background: #E3F2FD' : 'background: #F1F8E9'">{{ msg.message }}</div>
    </div>
    <div class="send" @keyup.enter="sendMessage">
      <input class="input" v-model="message" type="text" name="message" autofocus :style="role=='passive' ? 'background: #E3F2FD' : 'background: #F1F8E9'"/>
      <button class="button" type="button" style="cursor: pointer" @click="sendMessage">Send</button>
    </div>
    <div v-if="role === 'passive'" style="position: absolute; bottom: 0">
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
      chatRef: null,
      message: "",
      role: "passive",
      name: "unnamed",
      turing: true,

      now: 0
    };
  },
  computed: mapState(["messages"]),
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
        .post(
          "http://209.205.120.222:8080/cakechat_api/v1/actions/get_response",
          { context, emotion: "joy" }
        )
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

      if(this.turing){
        if(isRobot) {
          alert("You are right! This is a robot!");
          result = "Passive won";
        }
        else {
          alert("You are wrong! This is a robot!")
          result = "Bot won"
        }
      }
      else {
        if(isRobot) {
          alert("You are wrong! This is a human!")
          result = "Active won"
        }
        else {
          alert("You are right! This is a human!")
          result = "Passive won"
        }
      }

      this.resultsRef.push({
          result,
          timestamp,
          passive: this.messages[this.messages.findIndex(x => x.role==="passive")].name,
          active: this.messages[this.messages.findIndex(x => x.role==="active")].name,
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
    this.turing = this.$route.query.neural === 'yes'
    this.$store.dispatch("setMessagesRef", this.chatRef);

    window.setInterval(() => {
      this.now = Math.trunc((new Date()).getTime() / 1000);
    },1000);
  },

  // kostyl
  watch: {
    messages: function (val) {
      this.$nextTick(function() {
        let element = document.querySelectorAll("#chat")[0];
        element.scrollTop = element.scrollHeight;
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
  min-height: 70vh;
  max-height: 70vh;
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
  margin: .5rem;
  font-size: 16px;
}

</style>
