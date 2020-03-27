<template>
	<Page>
        <ActionBar title="Ajouter une nouvelle série">
            <NavigationButton text="Retour" android.systemIcon="ic_menu_back" @tap="goBack" />
        </ActionBar>
		<FlexboxLayout class="page">
			<StackLayout class="form">
				<Label class="header" text="Serie" />

				<StackLayout class="input-field" marginBottom="25">
					<TextField class="input" hint="Ville" autocorrect="false" autocapitalizationType="none" v-model="ville" returnKeyType="next" @returnPress="focusLat" fontSize="18" />
					<StackLayout class="hr-light" />
				</StackLayout>

				<StackLayout class="input-field" marginBottom="25">
					<TextField ref="latitude" class="input" hint="Latitude ville (ex: 48.45236)" autocorrect="false" autocapitalizationType="none" v-model="latitude" returnKeyType="next" @returnPress="focusLng" fontSize="18" />
					<StackLayout class="hr-light" />
				</StackLayout>

                <StackLayout class="input-field" marginBottom="25">
					<TextField ref="longitude" class="input" hint="Longitude ville (ex: 9.78536)" autocorrect="false" autocapitalizationType="none" v-model="longitude" returnKeyType="next" @returnPress="focusDist" fontSize="18" />
					<StackLayout class="hr-light" />
				</StackLayout>

                <StackLayout class="input-field" marginBottom="25">
					<TextField ref="dist" class="input" hint="Distance" keyboardType="number" autocorrect="false" autocapitalizationType="none" v-model="dist" returnKeyType="done" fontSize="18" />
					<StackLayout class="hr-light" />
				</StackLayout>

                <Button text="Valider" @tap="submit" class="btn btn-primary m-t-20" />
			</StackLayout>
		</FlexboxLayout>
	</Page>
</template>

<script>
import Home from "./Home";

import axios from "axios";

export default {
	components: { Home },
	props: ['token'],
    data() {
        return {
            ville: null,
            latitude: null,
            longitude: null,
            dist: null,
            url: "http://localhost:19180/series",
        };
    },
    methods: {
        goBack() {
            this.$navigateTo(Home, {
                props: {
                    token: this.token
                }
            });
        },
        focusLat() {
            this.$refs.latitude.nativeView.focus();
        },
        focusLng() {
            this.$refs.longitude.nativeView.focus();
        },
        focusDist() {
            this.$refs.dist.nativeView.focus();
        },
        submit(){
            axios({
                method: "post",
                url: this.url,
                headers: { 
                    "Content-Type": "application/json",
                    "Authorization": "Bearer " + this.token
                },
                data: {
                    ville: this.ville,
                    latitude: this.latitude,
                    longitude: this.longitude,
                    zoom: 12,
                    dist: this.dist
                }
            })
            .then(result => {
                console.log(result.data);
                alert({
                    title: "Série",
                    okButtonText: "OK",
                    message: "Votre série a été ajouté avec succès"
                });
                this.goBack();
            })
            .catch(err => {
                console.error(err.response.request._response);
                alert({
                    title: "Série",
                    okButtonText: "OK",
                    message: "Une erreur s'est produite"
                });
            });
        }
    }
};
</script>