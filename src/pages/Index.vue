<template>
  <q-page class="flex-center page bg-grey-10">
    <div v-if="!hasUsername" class="q-pa-md">
      <q-btn @click="dialog = true" color="primary">start</q-btn>
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

    <div v-else id="chat-box" class="q-pa-md row justify-center chat-box">
      <div style="width: 100%; max-width: 1000px; padding-bottom:150px">
        <div
          v-if="!messagesData"
          style="text-align:center; font-size:300px; opacity:.5"
        >
          😶
        </div>
        <div v-for="(message, index) in messagesData" :key="index">
          <div
            style="color:white; margin-top:5px; margin-bottom:-3px"
            :style="
              isOwner(message.id) ? 'text-align:right' : 'text-align:left'
            "
          >
            {{ message.name
            }}<span v-if="isOwner(message.id)" style="color:lightgreen"
              >(You)</span
            >
          </div>
          <chatMessage
            :text="message.text"
            :sent="isOwner(message.id)"
            :imgData="message.imgData"
            :big="message.big"
            :stamp="message.stamp"
          ></chatMessage>
          <!-- <q-chat-message
            class="text-box"
            :style="message.big ? 'font-size:180px' : 'font-size:25px'"
            :text="[...message.text]"
            :sent="isOwner(message.id)"
            size="7"
            :text-color="isOwner(message.id) ? 'white' : 'black'"
            :bg-color="isOwner(message.id) ? 'positive' : 'white'"
          >
          </q-chat-message> -->
        </div>
        <!-- Typing detector-->
        <div
          v-show="user != storeUsername"
          v-for="(user, index) in typingUsers"
          :key="index + user"
          style="color:white"
        >
          {{ user }}
          <!-- <span v-if="isOwner(message.id)" style="color:lightgreen"
              >(You)</span> -->
          <q-chat-message>
            <q-spinner-dots size="3rem" name="ewf" />
          </q-chat-message>
        </div>
      </div>
      <q-input
        @input="emitTyping()"
        class="input-field"
        bg-color="primary"
        label-color="white"
        color="white"
        filled
        rounded
        dark
        standout=""
        v-model="msgtext"
        label="Write a message"
        v-on:keydown.enter="sendmsg()"
      >
        <template v-slot:prepend>
          <q-btn
            color="warning"
            style="color:black"
            round
            icon="sentiment_satisfied_alt"
            @click="emojiDialog = true"
          >
          </q-btn>
        </template>
        <q-dialog v-model="emojiDialog">
          <q-card>
            <q-card-section class="row items-center q-pb-none">
              <div class="text-h6">Tap to send</div>
              <q-space />
              <q-btn icon="close" flat round dense v-close-popup />
            </q-card-section>

            <q-card-section class="grid-container">
              <q-avatar
                class="emoji-icons"
                v-for="(emoji, index) in emojis"
                :key="index"
                @click="sendEmoji(index)"
                >{{ emoji }}</q-avatar
              >
            </q-card-section>
          </q-card>
        </q-dialog>
        <label for="img-input">
          <input
            id="img-input"
            type="file"
            accept="image/*"
            @change="sendImage"
            style="display:none"
          />
          <template>
            <q-avatar icon="image" style="margin-top:4px" />
          </template>
        </label>
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
import { Notify } from "quasar";
import imageCompression from "browser-image-compression";
import axios from 'axios'
import moment from 'moment'

import chatMessage from "../components/chat-message.vue";
import emojiCard from "../components/emoji-card.vue";

var sentSound = new Audio(require("../assets/sent.wav"));
var receivedSound = new Audio(require("../assets/received.wav"));
const io = (window.io = require("socket.io-client"));

if (process.env.DEBUGGING) {
  var socket = io("ws://localhost:8069");
} else var socket = io("wss://" + window.location.hostname); //wss = wss over https

socket.on("message", msg => {
  store.state.messagesData.push(JSON.parse(msg));
  scrollBottom();
  if (msg.id == socket.id) receivedSound.play();
});
socket.on("counter", data => {
  if (data.count > 1)
    Notify.create({ type: "positive", message: "A new user joined chat", position:'top' });
  if (store.state.usersCount > data.count)
    Notify.create({ type: "negative", message: "A new user left chat", position:'top' });

  store.state.usersCount = data.count;
});
socket.on("typing", data => {
  if (store.state.typingUsers.indexOf(data.username) == -1)
    store.state.typingUsers.push(data.username);
  setTimeout(() => {
    if (store.state.typingUsers.indexOf(store.state.typingUsers)) {
      store.state.typingUsers.pop(store.state.typingUsers);
    } else clearInterval();
  }, 3000);
});
socket.on('newConnection', )
socket.on("connect", ()=>{
  
  //socket.emit("send-userinfo", {username:'',id:socket.io});
})
function scrollBottom() {
  const scrollElement = document.getElementById("chat-box");
  scrollElement.scrollTop = scrollElement.scrollHeight;
  console.log(scrollElement.scrollHeight)
}

export default {
  name: "PageIndex",
  components: { chatMessage,  },
  data() {
    return {
      msgtext: "",
      dialog: false,
      hasUsername: false,
      emojiDialog: false,
      username: "",
      onlineCount: 0,
      emojis: [
        "😂",
        "😭",
        "🥺",
        "🤣",
        "❤️",
        "✨",
        "😍",
        "🙏",
        "😊",
        "🥰",
        "🙄",
        "🤔",
        "🔥",
        "🤤",
        "👌"
      ]
    };
  },
  computed: {
    messagesData() {
      return store.state.messagesData;
    },
    typingUsers() {
      return store.state.typingUsers;
    },
    storeUsername() {
      return store.state.username;
    }
  },
  mounted() {
    console.log("id = " + socket.id)
    console.log("stored username = " + localStorage.getItem("username"));
    if (localStorage.getItem("username")) {
      this.hasUsername = true;
      store.state.username = localStorage.getItem("username");
      store.state.users.push(this.username);
      //socket.emit('send-nickname', store.state.username)
      // let userinfo = {
      //   username: store.state.username, 
      //   id: socket.id
      // };
       //socket.emit("send-userinfo", store.state.username);
    }
  },
  methods: {
    isOwner(id) {
      return id == socket.id;
    },
    sendmsg() {
      if (this.msgtext == "") {
        this.$q.notify({ type: "negative", message: "input cannot be blank" });
        return;
      }
      sentSound.play();

      let msgdata = {
        name: store.state.username,
        //text: [this.msgtext],
        stamp: moment().format('LT'),
        id: socket.id,
        big: false
      };
      console.log(store.state.messagesData[-1].id)
      socket.emit("message", msgdata);
      // socket.emit("typingEnd", {
      //   username: store.state.username,
      //   id: socket.id
      // });
       this.msgtext = "";
    },

    async sendImage(e) {
      // var files = e.target.files || e.dataTransfer.files;
      // if (!files.length) return;

      const options = {
        maxSizeMB: 1,
        maxWidthOrHeight: 640,
        useWebWorker: true
      };
      try {
        console.log(e.target.files[0]);
        const compressedFile = await imageCompression(
          e.target.files[0],
          options
        );
        console.log(
          "compressedFile instanceof Blob",
          compressedFile instanceof Blob
        ); // true
        console.log(
          `compressedFile size ${compressedFile.size / 1024 / 1024} MB`
        ); // smaller than maxSizeMB
        await this.uploadToServer(compressedFile);
      } catch (error) {
        console.log(error);
      }
    },
    async uploadToServer(img) {
      var reader = new FileReader();
      reader.readAsDataURL(img);
      reader.onload = e => {
        let msgdata = {
          name: store.state.username,
          stamp:moment().format('LT'),
          id: socket.id,
          big: false,
          imgData: reader.result
        };
        socket.emit("message", msgdata);
      };
    },
    sendEmoji(index) {
      let msgdata = {
        name: store.state.username,
        text: [this.emojis[index]],
        stamp: moment().format('LT')  ,
        id: socket.id,
        big: true
      };
      socket.emit("message", msgdata);
      this.emojiDialog = false;
    },
    emitTyping() {
      socket.emit("typing", {
        username: store.state.username,
        id: socket.id
      });
    },
    commitUsername() {
      store.state.username = this.username;
      this.hasUsername = true;
      localStorage.setItem("username", this.username);
      store.state.users.push(this.username);
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
  overflow-y: auto;
  text-overflow: ellipsis;
}
.chat-box::-webkit-scrollbar {
  display: none;
}

.grid-container {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  grid-template-rows: 1fr 1fr 1fr;
  gap: 0px 0px;
  grid-template-areas:
    ". . ."
    ". . ."
    ". . .";
}
.emoji-icons {
  font-size: 150px;
  cursor: pointer;
}
.emoji-icons:hover {
  transition: 0.2s;
  filter: brightness(0.6);
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
    bottom: 10px;
  }
  .grid-container {
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-template-rows: 1fr 1fr;
    gap: 0px 0px;
    grid-template-areas:
      ".  ."
      ".  ."
      ".  .";
  }
}
</style>
