<template>
  <div>
    <HttpRequest />
  </div>
</template>
<script>
import HttpRequest from './components/HttpRequest.vue'

export default {
  name: "app",
  components: {
    HttpRequest,
  }
};
</script>