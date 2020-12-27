<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar>
        <!-- <q-btn
          flat
          dense
          round
          icon="menu"
          aria-label="Menu"
          @click="leftDrawerOpen = !leftDrawerOpen"
        /> -->

        <q-toolbar-title>
          Chat Karloz Fraaandz
        </q-toolbar-title>

        <div v-if="username">Logged in as <strong> {{username}} </strong></div>
      </q-toolbar>
    </q-header>

    

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
import { store } from "../store/index";

export default {
  name: 'MainLayout',
  data () {
    return {
      leftDrawerOpen: false,
    }
  },
   computed: {
    username() {
      return store.state.username;
    }
  },
}
</script>
