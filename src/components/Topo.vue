<template>
  <b-container fluid>
    <b-row align-v="center" class="bg-light">
      <b-col class="text-center">
        <h1>Gimoveis</h1>
      </b-col>
      <b-col cols="auto" >
        <b-row>
          <b-col cols="auto">
            <b-row class="text-center" align-v="center">
              <b-col>
                <p class="nome-topo"><b>{{ $store.state.usuario.nome.split(" ")[0] }}</b></p>
              </b-col>

            </b-row>
            <b-row class="text-center m-0">
              <b-col>
                <b-button variant="link" class="text-decoration-none btn-logout">Sair</b-button>
              </b-col>
            </b-row>
          </b-col >
          <b-col cols="auto" class="m-0">
            <b-img right src="https://picsum.photos/250/250/?image=54" rounded="circle" alt="Circle image" width="60px" class="img-perfil"/>
          </b-col>
        </b-row>

      </b-col>
    </b-row>
  </b-container>
</template>

<script>
export default {
name: "Topo"
}
</script>

<style scoped>
.img-perfil{
  margin-top: 10px;
  margin-right: 10px;
}
.btn-logout{
  margin: 0;
  color:black;
}
.nome-topo{
  margin:0;
  margin-top:10px;
  margin-bottom:10px;
}
</style>