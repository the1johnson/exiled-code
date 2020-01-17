<template>
  <div class="container">
    <h1 class="mt-3">Elective Signup Tool</h1>
    <div class="row mt-3">

      <div class="col-sm">
        <div class="jumbotron">
          <h2 class="display-6">Prep Academy</h2>
          <p class="lead">View the elective class list for prep academy.</p>
          <router-link to="/classes/prep" class="btn btn-primary btn-lg">Class List</router-link>
        </div>
      </div>
      <div class="col-sm">
        <div class="jumbotron">
          <h2 class="display-6">Senior Academy</h2>
          <p class="lead">View the elective class list for senior academy.</p>
          <router-link to="/classes/senior" class="btn btn-primary btn-lg">Class List</router-link>
        </div>
      </div>
      <div class="col-sm">
        <div class="jumbotron">
          <h2 class="display-6">Admin</h2>
          <p class="lead">Administrative portal to add and edit class information.</p>
          <router-link to="/admin" class="btn btn-primary btn-lg">Admin Login</router-link>
        </div>
      </div>

      </div>
    </div>
</template>

<script>
  export default {
    name: 'home'
  }
</script>