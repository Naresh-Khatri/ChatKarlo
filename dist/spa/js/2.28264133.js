(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([[2],{8041:function(e,t,s){"use strict";s("d924")},"8b24":function(e,t,s){"use strict";s.r(t);var a=function(){var e=this,t=e.$createElement,s=e._self._c||t;return s("q-page",{staticClass:"flex-center page bg-grey-10"},[e.hasUsername?s("div",{staticClass:"q-pa-md row justify-center chat-box"},[s("div",{staticStyle:{width:"100%","max-width":"1000px","padding-bottom":"150px"}},[e.messagesData?e._e():s("div",{staticStyle:{"text-align":"center","font-size":"300px",opacity:".5"}},[e._v("\n        😶\n      ")]),e._l(e.messagesData,(function(t,a){return s("div",{key:a},[s("div",{staticStyle:{color:"white"},style:e.isOwner(t.id)?"text-align:right":"text-align:left"},[e._v("\n          "+e._s(t.name)),e.isOwner(t.id)?s("span",{staticStyle:{color:"lightgreen"}},[e._v("(You)")]):e._e()]),s("q-chat-message",{staticClass:"text-box",style:t.big?"font-size:180px":"font-size:25px",attrs:{text:[].concat(t.text),sent:e.isOwner(t.id),size:"7","text-color":e.isOwner(t.id)?"white":"black","bg-color":e.isOwner(t.id)?"positive":"white"}})],1)})),e._l(e.typingUsers,(function(t,a){return s("div",{directives:[{name:"show",rawName:"v-show",value:t!=e.storeUsername,expression:"user != storeUsername"}],key:a+t,staticStyle:{color:"white"}},[e._v("\n          "+e._s(t)+"\n          "),s("q-chat-message",[s("q-spinner-dots",{attrs:{size:"3rem",name:"ewf"}})],1)],1)}))],2),s("q-input",{staticClass:"input-field",attrs:{"bg-color":"primary","label-color":"white",color:"white",filled:"",dark:"",standout:"",label:"Write a message"},on:{input:function(t){return e.emitTyping()},keydown:function(t){return!t.type.indexOf("key")&&e._k(t.keyCode,"enter",13,t.key,"Enter")?null:e.sendmsg()}},scopedSlots:e._u([{key:"prepend",fn:function(){return[s("q-btn",{staticStyle:{color:"black"},attrs:{color:"warning",round:"",icon:"sentiment_satisfied_alt"},on:{click:function(t){e.emojiDialog=!0}}})]},proxy:!0},{key:"append",fn:function(){return[s("q-btn",{attrs:{round:"",dense:"",flat:"",icon:"send",color:"white",disabled:!e.msgtext},on:{click:function(t){return e.sendmsg()}}})]},proxy:!0},{key:"before",fn:function(){},proxy:!0}]),model:{value:e.msgtext,callback:function(t){e.msgtext=t},expression:"msgtext"}},[s("q-dialog",{model:{value:e.emojiDialog,callback:function(t){e.emojiDialog=t},expression:"emojiDialog"}},[s("q-card",[s("q-card-section",{staticClass:"row items-center q-pb-none"},[s("div",{staticClass:"text-h6"},[e._v("Close icon")]),s("q-space"),s("q-btn",{directives:[{name:"close-popup",rawName:"v-close-popup"}],attrs:{icon:"close",flat:"",round:"",dense:""}})],1),s("q-card-section",{staticClass:"grid-container"},e._l(e.emojis,(function(t,a){return s("q-avatar",{key:a,staticClass:"emoji-icons",on:{click:function(t){return e.sendEmoji(a)}}},[e._v(e._s(t))])})),1)],1)],1)],1)],1):s("div",{staticClass:"q-pa-md"},[s("q-btn",{attrs:{color:"primary"},on:{click:function(t){e.dialog=!0}}},[e._v("start")]),s("q-dialog",{attrs:{persistent:""},model:{value:e.dialog,callback:function(t){e.dialog=t},expression:"dialog"}},[s("div",{staticClass:"dialog-box",staticStyle:{"background-color":"#02d7f2","box-shadow":"none"}},[s("q-card-section",{staticClass:"row items-center"},[s("q-avatar",{staticStyle:{color:"#02d7f2"},attrs:{icon:"account_circle",color:"dark"}}),s("span",{staticClass:"q-ml-sm"},[e._v("Please enter a name to begin.")])],1),s("q-card-section",{staticClass:"row items-center"},[s("q-input",{staticClass:"username-input",attrs:{outlined:"",color:"dark",label:"username",autofocus:""},on:{keydown:function(t){return!t.type.indexOf("key")&&e._k(t.keyCode,"enter",13,t.key,"Enter")?null:e.commitUsername()}},model:{value:e.username,callback:function(t){e.username=t},expression:"username"}})],1),s("q-card-actions",{attrs:{align:"right"}},[s("q-btn",{directives:[{name:"close-popup",rawName:"v-close-popup"}],staticClass:"cpfont",attrs:{flat:"",label:"Confirm",color:"dark",disable:!e.username},on:{click:function(t){return e.commitUsername()}}})],1)],1)])],1)])},n=[],i=(s("c975"),s("4360"));const o=window.io=s("8e27");var r=o("wss://"+window.location.hostname);r.on("message",(e=>{i["b"].state.messagesData.push(JSON.parse(e))})),r.on("counter",(e=>{i["b"].state.usersCount=e.count})),r.on("typing",(e=>{-1==i["b"].state.typingUsers.indexOf(e.username)&&i["b"].state.typingUsers.push(e.username),setTimeout((()=>{i["b"].state.typingUsers.indexOf(i["b"].state.typingUsers)?i["b"].state.typingUsers.pop(i["b"].state.typingUsers):clearInterval()}),3e3)}));var c={name:"PageIndex",data(){return{msgtext:"",dialog:!1,hasUsername:!1,emojiDialog:!1,username:"",onlineCount:0,emojis:["😂","😭","🥺","🤣","❤️","✨","😍","🙏","😊","🥰","🙄","🤔","🔥","🤤","👌"]}},computed:{messagesData(){return i["b"].state.messagesData},typingUsers(){return i["b"].state.typingUsers},storeUsername(){return i["b"].state.username}},mounted(){console.log("stored username = "+localStorage.getItem("username")),localStorage.getItem("username")&&(this.hasUsername=!0,i["b"].state.username=localStorage.getItem("username"),i["b"].state.users.push(this.username))},methods:{isOwner(e){return e==r.id},sendmsg(){if(""==this.msgtext)return void this.$q.notify({type:"negative",message:"input cannot be blank"});let e={name:i["b"].state.username,text:[this.msgtext],stamp:"7 minutes ago",id:r.id,big:!1};r.emit("message",e),this.msgtext=""},sendEmoji(e){let t={name:i["b"].state.username,text:[this.emojis[e]],stamp:"7 minutes ago",id:r.id,big:!0};r.emit("message",t),this.emojiDialog=!1},emitTyping(){r.emit("typing",{username:i["b"].state.username,id:r.id})},commitUsername(){i["b"].state.username=this.username,this.hasUsername=!0,localStorage.setItem("username",this.username),i["b"].state.users.push(this.username)}}},l=c,m=(s("8041"),s("2877")),u=Object(m["a"])(l,a,n,!1,null,null,null);t["default"]=u.exports},d924:function(e,t,s){}}]);