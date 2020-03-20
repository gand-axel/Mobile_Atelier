<template>
    <Page>
        <ActionBar title="GeoQuizz"/>
        <StackLayout>
			<Image class="logo" src="~/images/logo.png" />
			<Label class="header" text="Bienvenue sur GeoQuizz !" style="margin-top: 30;" />
			<Button text="Ajouter une série" @tap="serie" style="background-color: gold;" />
			<Button text="Ajouter une photo" @tap="photo" style="background-color: gold;" />
        </StackLayout>
    </Page>
</template>

<script>
	import Serie from "./Serie";
	import Photo from "./Photo";
	
	import axios from "axios";

    export default {
		components: { Serie, Photo},
		props: ['token'],
		data() {
			return {
				url: "https://9953a35f.ngrok.io/series",
				series: []
			};
		},
        methods: {
            serie(args) {
              	this.$navigateTo(Serie, {
                  	props: {
                      	token: this.token
					}
			  	});
			},
			photo(args) {
              	this.$navigateTo(Photo, {
                  	props: {
						series: this.series,
						token: this.token
                  	}
              	});
			}
        },
		created: function() {
			axios({
				method: "get",
				url: this.url,
				headers: {
					"Authorization": "Bearer " + this.token
                }
			})
			.then(result => {
				result.data.series.forEach(serie => {
					this.series.push({id: serie.serie.idSerie, ville: serie.serie.ville});
					console.log(this.series);
				});
			})
			.catch(err => {
				console.error(err.response.request._response);
			});
		}
    };
</script>