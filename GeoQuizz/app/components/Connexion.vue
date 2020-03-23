<template>
	<Page>
        <ActionBar title="Geoquizz" />
		<FlexboxLayout class="page">
			<StackLayout class="form">
				<Label class="header" text="Connexion" />

				<StackLayout class="input-field" marginBottom="25">
					<TextField class="input" hint="Adresse mail" keyboardType="email" autocorrect="false" autocapitalizationType="none" v-model="mail"
					 returnKeyType="next" @returnPress="focusPass" fontSize="18" />
					<StackLayout class="hr-light" />
				</StackLayout>

				<StackLayout class="input-field" marginBottom="25">
					<TextField ref="pass" class="input" hint="Mot de passe" secure="true" v-model="pass" returnKeyType="done" fontSize="18" />
					<StackLayout class="hr-light" />
				</StackLayout>

                <Button text="Se connecter" @tap="submit" class="btn btn-primary m-t-20" />
			</StackLayout>
		</FlexboxLayout>
	</Page>
</template>

<script>
import Home from "./Home";

import axios from "axios";

export default {
    components: { Home },
    data() {
        return {
            mail: null,
            pass: null,
            url: "https://36aeab0a.ngrok.io/joueurs/auth",
            auth: null,
            token: null
        };
    },
    methods: {
        focusPass() {
            this.$refs.pass.nativeView.focus();
        },
        submit(){
            this.auth = Buffer.from(this.mail + ":" + this.pass,"utf8").toString("base64");
            axios({
                method: "post",
                url: this.url,
                headers: {
                    "Authorization": "Basic " + this.auth
                }
            })
            .then(result => {
                if (result.data.type === "error") {
                    alert({
                        title: "Connexion",
                        okButtonText: "OK",
                        message: "Mauvaise adresse mail ou mauvais mot de passe"
                    });
                }
                else {
                    this.token = result.data.token;

                    this.$navigateTo(Home, {
                        props: {
                            token: this.token
                        }
                    });
                }
            })
            .catch(err => {
                console.error(err.response.request._response);
                alert({
                	title: "Série",
                	okButtonText: "OK",
					message: "Mauvaise adresse mail ou mauvais mot de passe"
                });
            });
        }
    }
};
</script>