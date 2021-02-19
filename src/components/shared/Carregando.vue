<template>
  <div class="carregando" v-show="visivel">
    <h1>Carregando</h1>
  </div>
</template>

<script>
export default {
name: "Carregando",
  props: {
    visivel: Boolean,
  }
}
</script>

<style scoped>
.carregando{
  background-color: rgba(200,200,200,0.5);
  position: absolute;
  width: 100%;
  margin-right: 20px;
  height: 138px;
  line-height: 138px;
  z-index: 10;
  left:0;
  text-align: center;
}

.carregando h1{
  line-height: 1.5;
  display: inline-block;
  vertical-align: middle;
}
</style>
