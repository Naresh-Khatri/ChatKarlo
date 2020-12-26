<template>
  <q-page class="flex-center page">
    <div class="q-pa-md row justify-center chat-box">
      <div style="width: 100%; max-width: 1000px; padding-bottom:150px">
        <q-chat-message
          name="me"
          avatar="https://cdn.quasar.dev/img/avatar3.jpg"
          :text="['hey, how are you?']"
          stamp="7 minutes ago"
          sent
          bg-color="amber-7"
        />
        <q-chat-message
          name="Jane"
          avatar="https://cdn.quasar.dev/img/avatar5.jpg"
          :text="[
            'doing fine, how r you?',
            'I just feel like typing a really, really, REALLY long message to annoy you...'
          ]"
          size="6"
          stamp="4 minutes ago"
          text-color="white"
          bg-color="primary"
        />
        <q-chat-message
          name="Jane"
          avatar="https://cdn.quasar.dev/img/avatar5.jpg"
          :text="['Did it work?']"
          stamp="1 minutes ago"
          size="8"
          text-color="white"
          bg-color="primary"
        />
        <div v-for="(message, index) in messagesData" :key="index">
          <q-chat-message
            :name="message.name"
            :text="[...message.text]"
            :sent="isOwner(message.id)"
            size="8"
            :text-color="isOwner(message.id) ? 'black' : 'white'"
            :bg-color="isOwner(message.id) ? 'amber-7' : 'primary'"
          />
        </div>
      </div>
      <div id='anchor'></div>
    </div>
    <q-input
      class="input-field"
      bottom-slots
      v-model="msgtext"
      label="Write a message"
      counter
      v-on:keydown.enter="sendmsg()"
    >
      <template v-slot:before>
        <!-- <q-avatar>
          <img src="https://cdn.quasar.dev/img/avatar5.jpg" />
        </q-avatar> -->
      </template>

      <!-- <template v-slot:append>
        <q-icon
          v-if="text !== ''"
          name="close"
          @click="text = ''"
          class="cursor-pointer"
        />
        <q-icon name="schedule" />
      </template> -->

      <!-- <template v-slot:hint>
        Field hint
      </template>

      <template v-slot:after>
        <q-btn round dense flat icon="send" />
      </template> -->
    </q-input>
  </q-page>
</template>

<script>
import { store } from "../store/index";

const io = (window.io = require("socket.io-client"));
var socket = io("ws://localhost:8081");

socket.on("message", msg => {
  store.state.messagesData.push(JSON.parse(msg));
 document.getElementById('chat-box').scrollTop(0); 
});

export default {
  name: "PageIndex",
  data() {
    return {
      msgtext: ""
    };
  },
  computed: {
    messagesData() {
      return this.$store.state.messagesData;
    }
  },
  mounted() {
    setTimeout(() => {
      this.messagesData.push({
        name: "me",
        text: "this was sent second",
        stamp: "7 minutes ago",
        sent: true,
        id: "",
        bgColor: "amber-7"
      });
      console.log(this.messagesData);
      console.log(socket.id);
    }, 1000);
  },
  methods: {
    isOwner(id) {
      return id == socket.id;
    },
    sendmsg() {
      console.log("sending mesg");
      let msgdata = {
        name: "me",
        text: [this.msgtext],
        stamp: "7 minutes ago",
        id: socket.id
      };
      //this.messagesData.push(msgdata)
      socket.emit("message", msgdata);
      this.msgtext = "";
    }
  }
};
</script>
<style scoped>
.input-field {
  position: sticky;
  bottom: 30px;
  width: 100%;
  max-width: 1000px;
  margin-top: 10px;
}
.chat-box{
  width: 80%;
  height: 80vh;
   white-space: nowrap; 
    overflow:auto;
    overflow-y: scroll;
    text-overflow: ellipsis;
  
}
.page {
  display: flex;
  flex-direction: column;
  justify-content: center;
}
</style>
