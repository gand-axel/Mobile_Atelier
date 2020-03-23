<template>
	<Page>
        <ActionBar title="Ajouter une nouvelle photo">
            <NavigationButton text="Retour" android.systemIcon="ic_menu_back" @tap="goBack" />
        </ActionBar>
        <FlexboxLayout class="page">
            <StackLayout class="form">
                <Label class="header" text="Photo" />

                <StackLayout class="input-field" marginBottom="25">
                    <TextField hint="Description de l'image" class="input" autocorrect="false" autocapitalizationType="none" v-model="description" returnKeyType="done" fontSize="18" />
                    <StackLayout class="hr-light" />
				</StackLayout>

                <Label text="Choisir une ville :" fontSize="18" />
                <ListPicker :items=tabSerieVille v-model="number"/>

                <Button v-if="!pos" text="Récupérer sa position" @tap="takePosition" fontSize="18" style="background-color: gold;" />
                <Label v-else :text="position.latitude + ', ' + position.longitude" fontSize="18" style="text-align: center;" />

                <Button text="Prendre une photo" @tap="takePicture" fontSize="18" style="background-color: gold;" />
                <Button text="Choisir une photo" @tap="selectPicture" fontSize="18" style="background-color: gold;" />

                <Button v-if="pos && picture" text="Valider" @tap="submit" class="btn btn-primary m-t-20" />
            </StackLayout>
        </FlexboxLayout>
	</Page>
</template>

<script>
import axios from "axios";
import * as geolocation from "nativescript-geolocation";
import { Accuracy } from "tns-core-modules/ui/enums";

import * as camera from "nativescript-camera";
import * as imagepicker from "nativescript-imagepicker";
import { Image } from "tns-core-modules/ui/image";

import { isAndroid, isIOS } from "tns-core-modules/platform";

export default {
    props: ['series', 'token'],
    data() {
        return {
            tabSerieVille: [],
            tabSerieId: [],
            number : 0,

            position: null,
            pos: false,

            description: "",

            img: null,
            file_path: "",
            fileSystemModule: require("tns-core-modules/file-system"),
            is_sending: false,
            file_name: null,
            exists: null,
            file: null,
            file_size: null,
            file_size_limit: 32000000,
            urlImgBB: "https://api.imgbb.com/1/upload",
            api_key: "c60f5bc20e88fc9343e7e9b8335fa93e",
            bghttp: require("nativescript-background-http"),
            session: null,
            task: null,
            picture: false,

            result: null,
            uploaded_image: null,
            urlImage: "",

            urlAPI: "https://b0a9ea35.ngrok.io/photos"
        };
    },
    methods: {
        goBack() {
            this.$navigateBack();
        },
        takePosition() {
            geolocation.getCurrentLocation({
                desiredAccuracy: Accuracy.high,
                maximumAge: 5000,
                timeout: 10000
            })
            .then(loc => {
                if (loc) {
                    this.position = {latitude: loc.latitude, longitude: loc.longitude};
                    this.pos = true;
                }
            })
            .catch(err => {
                console.log("Error: " + (err.message || err));
            });
        },
        pushToImgBB() {
            if (isAndroid) this.file_path = this.img.src._android;
            else if (isIOS) this.file_path = this.img.src._ios;

            if (this.file_path === "" || this.file_path === undefined) {
                this.is_sending = false;
                alert({
                    title: "Erreur",
                    okButtonText: "OK",
                    message: "Erreur : fichier introuvable"
                });
                return;
            }

            this.file_name = this.file_path.substr(this.file_path.lastIndexOf("/") + 1);
            this.exists = this.fileSystemModule.File.exists(this.file_path);

            if (!this.exists) {
                this.is_sending = false;
                alert({
                    title: "Erreur",
                    okButtonText: "OK",
                    message: "Erreur: le fichier n'existe pas"
                });
                return;
            }

            this.file = this.fileSystemModule.File.fromPath(this.file_path);
            this.file_size = this.file.size;

            if (this.file_size >= this.file_size_limit) {
                this.is_sending = false;
                alert({
                    title: "Erreur",
                    okButtonText: "OK",
                    message: "Erreur: le fichier est trop volumineux"
                });
                return;
            }

            this.is_sending = true;

            this.session = this.bghttp.session("image-upload");

            let request = {
                url: this.urlImgBB + "?key=" + this.api_key,
                method: "POST",
                headers: {
                    "Content-Type": "application/octet-stream"
                },
                description: "Uploading " + this.file_name
            };

            const params = [
                { name: "image", filename: this.file_path, mimeType: "image/jpeg" }
            ];

            this.task = this.session.multipartUpload(params, request);

            this.task.on("error", this.errorHandler);
            this.task.on("responded", this.respondedHandler);
        },
        errorHandler(e) {
            console.log("Error: " + e.responseCode);
        },
        respondedHandler(e) {
            this.is_sending = false;
            this.result = JSON.parse(e.data);
            this.urlImage = this.result.data.url;
            this.picture = true;

            console.log("La photo a bien été envoyé sur imgBB");
        },
        takePicture() {
            camera.requestPermissions()
			.then(() => {
				camera.takePicture({ width: 300, height: 300, keepAspectRatio: true, saveToGallery: false })
				.then(imageAsset => {
                    this.img = new Image();
                    this.img.src = imageAsset;

                    this.pushToImgBB();
				})
				.catch(err => {
					console.log('error:', err);
				});
			})
			.catch(err => {
				console.log('Error requesting permission');
			});
        },
        selectPicture() {

			let context = imagepicker.create({
				mode: 'single' 
			});

			context.authorize()
			.then(function() {
				return context.present();
			})
			.then(selection => {
				selection.forEach(selected => {
					this.img = new Image();
                    this.img.src = selected;
                    
                    this.pushToImgBB();
				});
			}).catch(function (e) {
				console.log('error in selectPicture', e);
			});
        },
        submit() {
            axios({
                method: "post",
                url: this.urlAPI,
                headers: { 
					"Content-Type": "application/json",
					"Authorization": "Bearer " + this.token
				},
                data: {
                    descr: this.description,
                    url: this.urlImage,
                    latitude: this.position.latitude,
                    longitude: this.position.longitude,
                    refSerie: this.tabSerieId[this.number]
                }
            })
            .then(result => {
                console.log(result.data);
                alert({
                	title: "Série",
                	okButtonText: "OK",
					message: "Votre photo a été ajouté avec succès"
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
    },
    created: function() {
        this.series.forEach(serie => {
            this.tabSerieId.push(serie.id);
            this.tabSerieVille.push(serie.ville);
            console.log(this.tabSerieId);
            console.log(this.tabSerieVille);
        });
    }
};
</script>