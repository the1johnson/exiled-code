<template>
	<div>
		<HeroComponent />

		<div class="container-fluid mt-5 mb-5">
			<div class="row">
				<div class="col-sm-8 offset-sm-2">
					<h2 class="mb-3">meet the boojers</h2>
					<p>
						There's more to us than streamlined innovation and top-level productivity. We're unique, and we're always looking for ways to blend our professional side with our creative spirits. This is why we're dedicated to staying on top of the latest trends, the newest technologies and coming up with the next big idea that will push the boundaries in our industry. Meet the people that make it all possible.
					</p>
				</div>
			</div>
		</div>

		<BoojersComponent />
		<SocialComponent />

	</div>
</template>

<script>
import HeroComponent from '@/components/hero.vue'
import BoojersComponent from '@/components/boojer.vue'
import SocialComponent from '@/components/social.vue'
export default {
	name: 'Homepage',
	components: {
		HeroComponent,
		BoojersComponent,
		SocialComponent,
	}
}
</script>
