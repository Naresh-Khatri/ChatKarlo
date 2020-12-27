<template>
  <q-page class="flex-center page" style="background:#333">
    <div v-if="!hasUsername" class="q-pa-md">
      <q-btn @click="dialog = true">start</q-btn>
      <q-dialog v-model="dialog" persistent>
        <div
          style="background-color:#02d7f2;box-shadow: none;"
          class="dialog-box"
        >
          <q-card-section class="row items-center">
            <q-avatar
              icon="account_circle"
              color="dark"
              style="color: #02d7f2"
            />
            <span class="q-ml-sm">Please enter a name to begin.</span>
          </q-card-section>

          <q-card-section class="row items-center">
            <q-input
              class="username-input"
              outlined
              v-model="username"
              v-on:keydown.enter="commitUsername()"
              color="dark"
              label="username"
              autofocus
            />
            <!-- <q-input standout="text-white" v-model="username" label="Standout" /> -->
          </q-card-section>

          <!-- Notice v-close-popup -->
          <q-card-actions align="right">
            <q-btn
              flat
              class="cpfont"
              label="Confirm"
              color="dark"
              v-close-popup
              @click="commitUsername()"
              :disable="!username"
            />
          </q-card-actions>
        </div>
      </q-dialog>
    </div>

    <div v-else class="q-pa-md row justify-center chat-box">
      <div style="width: 100%; max-width: 1000px; padding-bottom:150px">
      <div v-if="!messagesData" style="text-align:center; font-size:300px; opacity:.5">😶</div>
        <div v-for="(message, index) in messagesData" :key="index">
          <div
            style="color:white"
            :style="
              isOwner(message.id) ? 'text-align:right' : 'text-align:left'
            "
          >
            {{ message.name }}
          </div>
          <q-chat-message
            class="text-box"
            :style="message.big? 'font-size:180px':'font-size:25px'"
            :text="[...message.text]"
            :sent="isOwner(message.id)"
            size="7"
            :text-color="isOwner(message.id) ? 'white' : 'black'"
            :bg-color="isOwner(message.id) ? 'positive' : 'white'"
            
          />
        </div>
      </div>
      <q-input
        class="input-field"
        bg-color="primary"
        label-color="white"
        color="white"
        filled
        dark
        standout=""
        v-model="msgtext"
        label="Write a message"
        v-on:keydown.enter="sendmsg()"
      >
        <template v-slot:append>
          <q-btn
            round
            dense
            flat
            icon="send"
            @click="sendmsg()"
            color="white"
            :disabled="!msgtext"
          />
        </template>

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
      </template>-->
      </q-input>
    </div>
  </q-page>
</template>

<script>
import { store } from "../store/index";

const io = (window.io = require("socket.io-client"));
var socket = io("ws://" + window.location.hostname);

socket.on("message", msg => {
  store.state.messagesData.push(JSON.parse(msg));
  //document.getElementById('chat-box').scrollTop(0);
});
socket.on("counter", data=>{
  console.log(data.count)
})

export default {
  name: "PageIndex",
  data() {
    return {
      msgtext: "",
      dialog: false,
      hasUsername: true,
      username: ""
    };
  },
  computed: {
    messagesData() {
      return store.state.messagesData;
    }
  },
  mounted() {
    // setTimeout(() => {
    //   this.messagesData.push({
    //     name: "me",
    //     text: "this was sent second",
    //     stamp: "7 minutes ago",
    //     sent: true,
    //     id: "",
    //     bgColor: "amber-7"
    //   });
    //   console.log(this.messagesData);
    //   console.log(socket.id);
    // }, 1000);
  },
  methods: {
    isOwner(id) {
      return id == socket.id;
    },
    sendmsg() {
      if (this.msgtext == "") {
        this.$q.notify({ type:"negative", message:"input cannot be blank"})
        return;
      }

      let msgdata = {
        name: store.state.username,
        text: [this.msgtext],
        stamp: "7 minutes ago",
        id: socket.id,
        big: false
      };
      //this.messagesData.push(msgdata)
      socket.emit("message", msgdata);
      this.msgtext = "";
      //console.log(this.messagesData)
    },
    commitUsername() {
      store.state.username = this.username;
      this.hasUsername = true;
    }
  }
};
</script>
<style>
.input-field {
  position: fixed;
  font-size: 20px;
  bottom: 50px;
  width: 95%;
  max-width: 1000px;
  margin-top: 10px;
}
.chat-box {
  width: 80%;
  height: 70vh;
  overflow: auto;
  overflow-y: scroll;
  text-overflow: ellipsis;
}
.chat-box::-webkit-scrollbar {
  display: none;
}
.text-box {
  font-size: 25px;
  border-top-left-radius: 50px;
  border-top-right-radius: 50px;
  border-bottom-right-radius: 50px;
  border-bottom-left-radius: 50px;
}

.page {
  display: flex;
  flex-direction: column;
  justify-content: center;
}
@media (max-width: 600px) {
  .chat-box {
    width: 100%;
  }
  .input-field {
    bottom:10px
  }
}
</style>
