<template>
    <Page>
        <ActionBar title="GeoQuizz"/>
        <StackLayout>
			<Button text="Créer une série" @tap="create" />
			<Button text="Choisir une série" @tap="choose" />
			<Button text="Location" @tap="loc" />
			<Button text="Pos" @tap="pos" />
			<Button text="Form" @tap="form" />
        </StackLayout>
    </Page>
</template>

<script>
	import Serie from "./Serie";
	import Location from "./Location";
	import Form from "./Form";

	import * as geolocation from "nativescript-geolocation";
    import { Accuracy } from "tns-core-modules/ui/enums";

    export default {
        components: { Serie, Location, Form },
        methods: {
            create(args) {
              this.$navigateTo(Serie);
			},
			loc(args) {
              this.$navigateTo(Location);
			},
			form(args) {
              this.$navigateTo(Form);
			},
			pos: function() {
                geolocation.getCurrentLocation({
                    desiredAccuracy: Accuracy.high,
                    maximumAge: 5000,
                    timeout: 10000
                }).then(function (loc) {
                    if (loc) {
                        return alert({
                			title: "Localisation",
                			okButtonText: "OK",
							message: loc.latitude + ', ' + loc.longitude
            			});
                    }
                }, function (e) {
                    console.log("Error: " + (e.message || e));
                });
            }
            //create(args) {
              //this.$navigateTo(Serie);
            //}
        }
    };
</script>