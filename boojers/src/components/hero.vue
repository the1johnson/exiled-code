<template>
	<div class="bg-image w-100 position-relative" :style="{ backgroundImage: `url(${image})` }">
		<div class="w-100 fade top"></div><div class="w-100 fade bottom"></div>
		<div class="caption-section position-absolute w-100">
			<div class="container-fluid white">
				<div class="row">
					<div class="col-sm-10 offset-sm-1">
						<div class="d-flex justify-content-between">
							<div>
								<span class="d-block text-uppercase">{{imageSubTitle}}</span>
								<p>{{imageTitle}}</p>
							</div>
							<a href="" class="btn align-self-center">View Gallery<img class="align-bottom icon" src="@/assets/arrow-icon.svg"></a>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
export default {
	name: 'Hero',
	data () {
		return {
			imageSubTitle: 'Latest Event',
			imageTitle: 'Something Cool',
			image: 'http://www.boojers.com/uploads/albums/album-45-5d14ebec64da6.jpg'
		}
	},
}
</script>
<style lang="scss" scoped>
	@import "@/styles/hero.scss";
</style>
