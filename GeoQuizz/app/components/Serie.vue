<template>
	<Page>
        <ActionBar title="Ajouter une nouvelle série">
            <NavigationButton text="Retour" android.systemIcon="ic_menu_back" @tap="goBack" />
        </ActionBar>
		<FlexboxLayout class="page">
			<StackLayout class="form">
				<Label class="header" text="Serie" />

				<StackLayout class="input-field" marginBottom="25">
					<TextField class="input" hint="Ville" autocorrect="false" autocapitalizationType="none" v-model="ville"
					 returnKeyType="next" @returnPress="focusMapRef" fontSize="18" />
					<StackLayout class="hr-light" />
				</StackLayout>

				<StackLayout class="input-field" marginBottom="25">
					<TextField ref="mapRef" class="input" hint="Référence de la carte" autocorrect="false" autocapitalizationType="none" v-model="mapRef"
					 returnKeyType="next" @returnPress="focusDist" fontSize="18" />
					<StackLayout class="hr-light" />
				</StackLayout>

                <StackLayout class="input-field" marginBottom="25">
					<TextField ref="dist" class="input" hint="Distance" keyboardType="number" autocorrect="false" autocapitalizationType="none" v-model="dist"
					 returnKeyType="done" fontSize="18" />
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
            mapRef: null,
            dist: null,
            url: "https://9953a35f.ngrok.io/series",
        };
    },
    methods: {
        goBack() {
            this.$navigateTo(Home);
        },
        focusMapRef() {
            this.$refs.mapRef.nativeView.focus();
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
                    mapRef: this.mapRef,
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