var environments = {
	staging: {
		FIREBASE_API_KEY: 'AIzaSyChRm4VOjN2pyy9ooy9leMl7NOx6OihhLU',
		FIREBASE_AUTH_DOMAIN: 'veggiehub-d68ef.firebaseapp.com',
		FIREBASE_DATABASE_URL: 'https://veggiehub-d68ef.firebaseio.com/',
		FIREBASE_PROJECT_ID: 'veggiehub-d68ef',
		FIREBASE_STORAGE_BUCKET: 'gs://veggiehub-d68ef.appspot.com',
		FIREBASE_MESSAGING_SENDER_ID: '471128235039',
		GOOGLE_CLOUD_VISION_API_KEY: 'AIzaSyAF05Oq2xO9i7tbTO66-mMakX9B7m5OJHA'
	},
	production: {
		// Warning: This file still gets included in your native binary and is not a secure way to store secrets if you build for the app stores. Details: https://github.com/expo/expo/issues/83
	}
};

//function getReleaseChannel() {
//	let releaseChannel = Expo.Constants.manifest.releaseChannel;
//	if (releaseChannel === undefined) {
//		return 'staging';
//	} else if (releaseChannel === 'staging') {
//		return 'staging';
//	} else {
//		return 'staging';
//	}
//}
//function getEnvironment(env) {
//	console.log('Release Channel: ', getReleaseChannel());
//	return environments[env];
//}
//var Environment = getEnvironment(getReleaseChannel());
//export default Environment;   