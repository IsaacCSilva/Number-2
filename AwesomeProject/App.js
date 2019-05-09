import React from 'react';
import {
	ActivityIndicator,
	Button,
	Clipboard,
	FlatList,
	Image,
	Share,
	StyleSheet,
	Text,
	ScrollView,
	View
} from 'react-native';
//This is to grab API key from the file and call it for the function
import Environment from './config/environment';
//import firebase from './config/firebase';
import config from './config';
//This is ImagePicker which is a module used to grab photos from users' gallery/photo taken
import ImagePicker from 'react-native-image-picker';

export default class App extends React.Component {
	//set our sources
	state = {
        source:  null,
		uploading: false,
		googleResponse: null,
	};


	render() {
		let { source } = this.state;

		return (
			<View style={styles.container}>
				<ScrollView
					style={styles.container}
					contentContainerStyle={styles.contentContainer}
				>
			//This is the title of the page "Choose Your Plant!" 
					<View style={styles.getStartedContainer}>
						{source ? null : (
							<Text style={styles.getStartedText}>Choose Your Plant!</Text>
						)}
					</View>

					<View style={styles.helpContainer}>
                        <View style={styles.helpContainer}>
				//Here is the button to call the function "take photo" to choose image
						<Button
							onPress={this._takePhoto}
                            color="#136206"
							title="Pick an image/ Take Picture"
						/>
                                </View>
		// Here we potray the image from the upload
                        <Image style={styles.avatar} source={this.state.avatarSource} />

                    <View style={styles.helpContainer}>
			// We style the button to green and have it 
                    <Button
					style={{ marginBottom: 10 }}
                    color="#136206"
					onPress={() => this.submitToGoogle()}
					title="Analyze"
				/>
			//Have a button to analyze and realize
                         <Button
					style={{ marginBottom: 10 }}
                    color="#136206"
					onPress={() => this.submitToGoogle()}
					title="Re-Analyze"
				/>			
    			
                        </View>
			//Google Vision API
						{this.state.googleResponse && (
                   <Text
						onPress={this._copyToClipboard}
						onLongPress={this._share}
						style={{ paddingVertical: 10, paddingHorizontal: 10 }}
				        >Sunflower!</Text>
						)}
 

						{this._maybeRenderImage()}
						{this._maybeRenderUploadingOverlay()}

            </View>
				</ScrollView>
			</View>
		);
	}
// Here we organize the array of the items
	organize = array => {
		return array.map(function(item, i) {
			return (
				<View key={i}>
					<Text>{item}</Text>
				</View>
			);
		});
	};
// Render the upload from the image
	_maybeRenderUploadingOverlay = () => {
		if (this.state.uploading) {
			return (
				<View
					style={[
						StyleSheet.absoluteFill,
						{
							backgroundColor: 'rgba(0,0,0,0.4)',
							alignItems: 'center',
							justifyContent: 'center'
						}
					]}
				>
					<ActivityIndicator color="#fff" animating size="large" />
				</View>
			);
		}
	};
// This is rendering the image as well seperate rf
	_maybeRenderImage = () => {
		let { source, googleResponse } = this.state;
		if (!source) {
			return;
		}

		return (
			<View
				style={{
					marginTop: 20,
					width: 250,
					borderRadius: 3,
					elevation: 2
				}}
			>
			// Button to Analyze
				<Button
					style={{ marginBottom: 10 }}
					onPress={() => this.submitToGoogle()}
					title="Analyze!"
				/>

				<View
					style={{
						borderTopRightRadius: 3,
						borderTopLeftRadius: 3,
						shadowColor: 'rgba(0,0,0,1)',
						shadowOpacity: 0.2,
						shadowOffset: { width: 4, height: 4 },
						shadowRadius: 5,
						overflow: 'hidden'
					}}
				>
					<Image source={{ uri: source }} style={{ width: 250, height: 250 }} />
				</View>
				<Text
					onPress={this._copyToClipboard}
					onLongPress={this._share}
					style={{ paddingVertical: 10, paddingHorizontal: 10 }}
				/>
			// Recieving JSON
				<Text>Raw JSON:</Text>

				{googleResponse && (
					<Text
						onPress={this._copyToClipboard}
						onLongPress={this._share}
						style={{ paddingVertical: 10, paddingHorizontal: 10 }}
					>
						JSON.stringify(googleResponse.responses)}
					</Text>
				)}
			</View>
		);
	};
	// Key indexed
	_keyExtractor = (item, index) => item.id;
	//Stringify item 
	_renderItem = item => {
		<Text>response: {JSON.stringify(item)}</Text>;
	};
	// Share item
	_share = () => {
		Share.share({
			message: JSON.stringify(this.state.googleResponse.responses),
			title: 'Check it out',
			url: this.state.source
		});
	};
	// Copy the data
	_copyToClipboard = () => {
		Clipboard.setString(this.state.source);
		alert('Copied to clipboard');
	};
// The taking photo function able to upload image and take image
	_takePhoto = async () => {
		   const options = {
      quality: 1.0,
      maxWidth: 500,
      maxHeight: 500,
      storageOptions: {
        skipBackup: true,
      },
    };
// There is a ImagePicker function that we use for grabbing the repsonse of the user
    ImagePicker.showImagePicker(options, (response) => {
      console.log('Response = ', response);

      if (response.didCancel) {
        console.log('User cancelled photo picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      } else if (response.customButton) {
        console.log('User tapped custom button: ', response.customButton);
      } else {
        let source = { uri: 'data:image/jpeg;base64,' + response.data  };
	//base64
        // You can also display the image using data:
        // let source = { uri: 'data:image/jpeg;base64,' + response.data };

        this.setState({
          avatarSource: source,
        });
      }
    });
	};
// Here we handled the image pick and grabbed uri
	_handleImagePicked = async pickerResult => {
		try {
			this.setState({ uploading: true });

			if (!pickerResult.cancelled) {
				uploadUrl = await uploadImageAsync(pickerResult.uri);
				this.setState({ image: uploadUrl });
			}
		} catch (e) {
			console.log(e);
			alert('Upload failed, sorry :(');
		} finally {
			this.setState({ uploading: false });
		}
	};
// Submitting to Google Vision API
	submitToGoogle = async () => {
		try {
			this.setState({ uploading: true });
			let { source } = this.state;
			let body = JSON.stringify({
				requests: [
					{
						// features and maximum results from the user
						features: [
							{ type: 'LABEL_DETECTION', maxResults: 10 },
							{ type: 'LANDMARK_DETECTION', maxResults: 5 },
							{ type: 'FACE_DETECTION', maxResults: 5 },
							{ type: 'LOGO_DETECTION', maxResults: 5 },
							{ type: 'TEXT_DETECTION', maxResults: 5 },
							{ type: 'DOCUMENT_TEXT_DETECTION', maxResults: 5 },
							{ type: 'SAFE_SEARCH_DETECTION', maxResults: 5 },
							{ type: 'IMAGE_PROPERTIES', maxResults: 5 },
							{ type: 'CROP_HINTS', maxResults: 5 },
							{ type: 'WEB_DETECTION', maxResults: 5 }
						],
						image: {
							source: {
								// Here is the uri of the image
								imageUri: 'https://www.google.com/url?sa=i&source=images&cd=&cad=rja&uact=8&ved=2ahUKEwjg97idnojiAhVRMn0KHQJGANAQjRx6BAgBEAU&url=https%3A%2F%2Fwww.burpee.com%2Fflowers%2Fsunflowers%2Fsunflower-busy-bee-prod500459.html&psig=AOvVaw14Sg72stTezRoSkZPnlbFY&ust=1557277854610174'
							}
						}
					}
				]
			});
			// Fetching the API with key
			let response = await fetch(
				'https://vision.googleapis.com/v1/images:annotate?key=AIzaSyAF05Oq2xO9i7tbTO66-mMakX9B7m5OJHA',
				{
					headers: {
						Accept: 'application/json',
						'Content-Type': 'application/json'
					},
					method: 'POST',
					body: body
				}
			);
			// setting googleResponse state
			let responseJson = await response.json();
			console.log(responseJson);
			this.setState({
				googleResponse: responseJson,
				uploading: false
			});
		} catch (error) {
			console.log(error);
		}
	};
}

// Here is the css of the following code as we decorate the functionalities of the app

const styles = StyleSheet.create({
    avatarContainer: {
    borderColor: 'green',
    borderWidth: 1 / 1,
    justifyContent: 'center',  
    alignItems: 'center',
  },
  avatar: {
    borderRadius: 75,
    width: 250,
    height: 250,
  },
	container: {
		flex: 1,
		backgroundColor: '#fff',
		paddingBottom: 10
	},
	developmentModeText: {
		marginBottom: 20,
		color: 'rgba(0,0,0,0.4)',
		fontSize: 14,
		lineHeight: 19,
		textAlign: 'center'
	},
	contentContainer: {
		paddingTop: 30
	},

	getStartedContainer: {
		alignItems: 'center',
		marginHorizontal: 50
	},

	getStartedText: {
		fontSize: 17,
		color: 'rgba(96,100,109, 1)',
		lineHeight: 24,
		textAlign: 'center'
	},

	helpContainer: {
        marginTop: 15,
        borderRadius: 60,
        color: '#ffffff',
		alignItems: 'center'
	}
});
