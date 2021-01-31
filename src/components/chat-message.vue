<template>
  <div style="display:flex; position:relative;">
    <!-- <q-avatar icon="profile" color="primary" class="q-pt-md q-ma-sm" /> -->
    <div
      style="display:f lex; position:relat ive"
      :style="big ? 'font-size:180px' : 'font-size:25px'"
      :class="
        imgData && sent
          ? 'right'
          : imgData && !sent
          ? ''
          : sent
          ? 'sent-text-box'
          : 'received-text-box'
      "
    >
      <div v-if="text">
        {{ text }}
      </div>

      <div v-if="imgData">
        <img
          style="max-width:85%; border-radius:20px;"
          :class="sent ? 'right' : 'left'"
          :src="imgData"
        />
      </div>
      <div
        style="display:block;font-size:12px;color:white"
        :class="sent ? 'right' : 'left'"
      >
        {{ stamp }}
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: ["text", "sent", "stamp", "big", "imgData"],
  data() {
    return {};
  }
};
</script>

<style scoped>
.sent-text-box {
  font-size: 25px;
  margin-left: auto;
  color: #fff;
  background: rgb(0, 195, 255);
  padding: 10px 20px;
  max-width: 80%;
  border-radius: 25px;
}
.sent-text-box::after {
  content: "";
  white-space: pre;
}
.sent-text-box::before {
  content: "";
  position: absolute;
  bottom: 0;
  right: 0;
  border-top: 30px solid rgba(0, 0, 0, 0);
  border-right: 30px solid #00c3ff;
}
.right {
  margin-left: auto;
  float: right;
}
.left {
}

.received-text-box {
  font-size: 25px;

  position: relative;
  color: #fff;
  background: rgb(156, 97, 97);
  min-width: 20px;
  max-width: 80%;
  padding: 10px 20px;
  border-radius: 25px;
}
.received-text-box::after {
  content: "";
  white-space: pre;
}
.received-text-box::before {
  content: "";
  position: absolute;
  bottom: 0;
  left: 0;
  border-top: 30px solid rgba(0, 0, 0, 0);
  border-left: 30px solid rgb(156, 97, 97);

  width: 0px;
}
</style>
