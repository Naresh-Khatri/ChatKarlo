<template>
  <div style="display:flex; position:relative;">
    <div :class="sent ? 'sent-text-box' : 'received-text-box'">
      {{ text[0] }}
    </div>
  </div>
</template>

<script>
export default {
  props: ["text", "sent"],
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
  content: "\A";
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
.received-text-box {
  font-size: 25px;

  display: inline-flex;

  position: relative;
  color: #fff;
  background: #494949;
  min-width: 20px;
  max-width: 80%;
  padding: 10px 20px;
  border-radius: 25px;
}
.received-text-box::after {
  content: "\A";
  white-space: pre;
}
.received-text-box::before {
  content: "";
  position: absolute;
  bottom: 0;
  left: 0;
  border-top: 30px solid rgba(0, 0, 0, 0);
  border-left: 30px solid #494949;
  width: 0px;
}
</style>
