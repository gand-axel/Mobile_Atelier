<template>
	<Page>
        <ActionBar title="Ajouter une nouvelle série">
            <NavigationButton text="Go back" android.systemIcon="ic_menu_back" @tap="goBack" />
        </ActionBar>
		<FlexboxLayout class="page">
			<StackLayout class="form">
				<!-- <Image class="logo" src="~/images/logo.png" /> -->
				<Label class="header" text="Geoquizz" />

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
import axios from "axios";

export default {
    data() {
        return {
            ville: null,
            mapRef: null,
            dist: null,
            bghttp: require("nativescript-background-http"),
            url: "",
            session: null
        };
    },
    methods: {
        submit(){
            axios({
                method: "get",
                url: "http://f536c7ec.ngrok.io/series",
                /* headers: { "Content-Type": "application/json" },
                body: {
                    ville: this.ville,
                    mapRef: this.mapRef,
                    dist: this.dist
                } */
            })
            .then(result => {
                console.log(result.data);
            })
            .catch(err => {
                console.error(err.response.request._response);
            });

            /* this.url = "http://f536c7ec.ngrok.io/series";
            this.session = bghttp.session("post-series");

            let request = {
                url: this.url,
                method: "GET"
            };

            let params = [
                { name: "ville", value: this.ville },
                { name: "mapRef", value: this.mapRef },
                { name: "dist", value: this.dist }
            ];

            let task = session.multipartUpload(params, request); */
        },
        focusMapRef() {
            this.$refs.mapRef.nativeView.focus();
        },
        focusDist() {
            this.$refs.dist.nativeView.focus();
        },
        goBack() {
            this.$navigateBack();
        }
    }
};
</script>

<style scoped>
	.page {
		align-items: center;
		flex-direction: column;
	}

	.form {
		margin-left: 30;
		margin-right: 30;
		flex-grow: 2;
		vertical-align: middle;
	}

	.header {
		horizontal-align: center;
		font-size: 25;
		font-weight: 600;
		margin-bottom: 70;
		text-align: center;
        /* color: #D51A1A; */
        color: gold;
	}

	.input-field {
		margin-bottom: 25;
	}

	.input {
		font-size: 18;
		placeholder-color: #A8A8A8;
	}

	.input-field .input {
		font-size: 54;
	}

	.btn-primary {
		height: 50;
		margin: 30 5 15 5;
        /* background-color: #D51A1A; */
        background-color: gold;
		border-radius: 5;
		font-size: 20;
		font-weight: 600;
	}

	.login-label {
		horizontal-align: center;
		color: #A8A8A8;
		font-size: 16;
	}

	.sign-up-label {
		margin-bottom: 20;
	}

	.bold {
		color: #000000;
	}
</style>