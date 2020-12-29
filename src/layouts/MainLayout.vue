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
        <div v-if="username">
          <div>
            Logged in as <strong> {{ username }} </strong>
          </div>
          <q-btn-dropdown color="primary" :label="'🟢'+ usersCount +' online'">
            <q-list>
              <q-item clickable v-close-popup >
                <q-item-section>
                  <q-item-label>Photos</q-item-label>
                </q-item-section>
              </q-item>
            </q-list>
          </q-btn-dropdown>
        </div>
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
  name: "MainLayout",
  data() {
    return {
      leftDrawerOpen: false
    };
  },

  computed: {
    username() {
      return store.state.username;
    },
    usersCount() {
      return store.state.usersCount;
    }

  }
};
</script>
