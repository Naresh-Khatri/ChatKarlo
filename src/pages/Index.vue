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
        <div
          v-if="!messagesData"
          style="text-align:center; font-size:300px; opacity:.5"
        >
          😶
        </div>
        <div v-for="(message, index) in messagesData" :key="index">
          <div
            style="color:white"
            :style="
              isOwner(message.id) ? 'text-align:right' : 'text-align:left'
            "
          >
            {{ message.name
            }}<span v-if="isOwner(message.id)" style="color:lightgreen"
              >(You)</span
            >
          </div>
          <q-chat-message
            class="text-box"
            :style="message.big ? 'font-size:180px' : 'font-size:25px'"
            :text="[...message.text]"
            :sent="isOwner(message.id)"
            size="7"
            :text-color="isOwner(message.id) ? 'white' : 'black'"
            :bg-color="isOwner(message.id) ? 'positive' : 'white'"
          >
          </q-chat-message>
          <div
            v-show="user == storeUsername"
            v-for="(user, index) in typingUsers"
            :key="index"
            style="color:white"
          >
            {{ user }}
            <!-- <span v-if="isOwner(message.id)" style="color:lightgreen"
              >(You)</span> -->
            <q-chat-message>
              <q-spinner-dots
                v-if="!isOwner(message.id)"
                size="3rem"
                name="ewf"
              />
            </q-chat-message>
          </div>
        </div>
      </div>
      <q-input
        @input="emitTyping()"
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
              <div class="text-h6">Close icon</div>
              <q-space />
              <q-btn icon="close" flat round dense v-close-popup />
            </q-card-section>

            <q-card-section class="grid-container">
              <q-avatar class="emoji-icons" v-for="(emoji, index) in emojis" :key="index" @click="sendEmoji(index)">{{emoji}}</q-avatar>
            </q-card-section>
          </q-card>
        </q-dialog>
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
if (process.env.DEBUGGING) {
  var socket = io("ws://localhost:8081");
  setTimeout(() => {
    store.state.username = "instance " + store.state.onlineUsers;
  }, 500);
} else var socket = io("wss://" + window.location.hostname); //wss = wss over https

socket.on("message", msg => {
  store.state.messagesData.push(JSON.parse(msg));
});
socket.on("counter", data => {
  console.log(data.count + " online");
  store.state.onlineUsers = data.count;
});
socket.on("typing", data => {
  console.log(data);

  if (store.state.typingUsers.indexOf(data.username) == -1)
    store.state.typingUsers.push(data.username);
  console.log(store.state.typingUsers + " is typing");
  setTimeout(() => {
    store.state.typingUsers = [];
  }, 3000);
});

export default {
  name: "PageIndex",
  data() {
    return {
      msgtext: "",
      dialog: false,
      hasUsername: true,
      emojiDialog: true,
      username: "",
      onlineCount: 0,
      emojis:['😂','😭','🥺','🤣','❤️','✨','😍','🙏','😊','🥰','🙄','🤔','🔥','🤤','👌']
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
        this.$q.notify({ type: "negative", message: "input cannot be blank" });
        return;
      }

      let msgdata = {
        name: store.state.username,
        text: [this.msgtext],
        stamp: "7 minutes ago",
        id: socket.id,
        big: false
      };
      socket.emit("message", msgdata);
      this.msgtext = "";
    },
    sendEmoji(index){
      let msgdata = {
        name: store.state.username,
        text: [this.emojis[index]],
        stamp: "7 minutes ago",
        id: socket.id,
        big: true,
      };
      socket.emit("message", msgdata);
      this.emojiDialog = false
    },
    emitTyping() {
      this.typingUsers.forEach(user => {
        console.log(user);
      });
      socket.emit("typing", { username: store.state.username, id: socket.id });
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
.emoji-icons{
  font-size:150px;
  cursor:pointer;
}
.emoji-icons:hover{
  transition:.2s;
  filter:brightness(.6)
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
}
</style>
