<template>
	<div>
		<div class="container-fluid">
			<div class="row mb-5">
				<div class="col-sm-10 offset-sm-1">
					<div class="row">
						<div class="col-sm-4">
							<div class="position-relative">
								<label for="s-name" class="m-0">First or Last Name</label>
								<input id="s-name" class="w-100" v-model="searchInputs.name" type=text>
								<span class="submit position-absolute d-flex justify-content-center"><img class="icon align-self-center" src="@/assets/search-icon.svg"></span>
							</div>
						</div>
						<div class="col-sm-3">
							<label for="s-dep" class="m-0">Department</label>
							<input id="s-dep" class="w-100" v-model="searchInputs.department" type=text>
						</div>
						<div class="col-sm-3">
							<div class="position-relative">
								<label for="s-hob" class="m-0">Hobbies/Interests</label>
								<select id="s-hob" class="w-100" v-model="searchInputs.hobbies">
									<option value="">test</option>
								</select>
								<img src="@/assets/drop-icon.svg" class="icon drop">
							</div>
						</div>
						<div class="col-sm-2">
							<div class="position-relative">
								<label for="s-sort" class="m-0">Sort By</label>
								<select id="s-sort" class="w-100" v-model="searchInputs.sort">
									<option value="">test</option>
								</select>
								<img src="@/assets/drop-icon.svg" class="icon drop">
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
		<div class="overflow-hidden">
			<div class="container-fluid">
				<div class="row">
					<div v-for="(boojer, index) in boojers" :key="index" class="col-3 mb-5">
						<div class="position-relative">
							<div class="bg-span bg-gray"></div>
							<img :src="boojer.image" class="img-fluid boojer-img" :alt="boojer.name">
						</div>
						<span class="mt-4 d-block font-weight-bold">{{boojer.name}}</span>
						<span class="d-block title text-uppercase">{{boojer.title}}</span>
					</div>
					<div class="col-3 mb-5 last-boojer d-flex">
						<div class="white text-center w-100 align-self-center">
							<div class="">
								<span class="d-block mb-4">You?</span>
								<a href="#" class="btn">Work With Us <img class="align-bottom icon" src="@/assets/arrow-icon.svg"></a>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
export default {
	name: 'Boojers',
	data () {
		return {
			searchInputs: {
				name: null,
				department: null,
				hobbies:null,
				sort:null,
			},
			boojers:[
				{name: 'Toby Hendricks',title:'Front-End Developer',image:'https://d27eazuuq0l893.cloudfront.net/pics/realtor/16354032/1241132/'},
				{name: 'John Johnson',title:'Front-End Developer',image:'https://d27eazuuq0l893.cloudfront.net/pics/realtor/16353472/1240822/'},
				{name: 'Alison Brunk',title:'Front-End Developer',image:'https://d27eazuuq0l893.cloudfront.net/pics/realtor/16681462/1397362/'},
				{name: 'Human Human',title:'Front-End Human',image:'https://d27eazuuq0l893.cloudfront.net/pics/realtor/16353142/1240272/'},
				{name: 'Another Human',title:'Back-End Human',image:'https://d27eazuuq0l893.cloudfront.net/pics/realtor/16353612/1240952/'},
			]
		}
	},
}
</script>
<style lang="scss" scoped>
	@import "@/styles/boojer.scss";
</style>
