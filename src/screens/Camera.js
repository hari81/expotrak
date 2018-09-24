import React from 'react';
import { Text, View, StyleSheet } from 'react-native';
import { FileSystem, Camera, Permissions } from 'expo';
import { connect } from 'react-redux';
import { takePhoto } from '../redux/actions/TakePhoto';
import CommonStyles from '../styles/Common'

// My components
import { Back, Flip, TakePhoto } from "../components/camera"

// My classes
import Util from "../config/Util";
import PhotoManager from "../business/PhotoManager";

class CameraScreen extends React.Component {

    state = {
        hasCameraPermission: null,
        type: Camera.Constants.Type.back,
        photoPath: '',
    };

    async componentDidMount() {
        await FileSystem.makeDirectoryAsync(FileSystem.documentDirectory 
            + Util.ConstantHelper.photo_save_folder)
            .then()
            .catch(
            (error)=>{}
        )

        await FileSystem.makeDirectoryAsync(FileSystem.documentDirectory 
            + Util.ConstantHelper.photo_save_folder
            + '/'
            + this.props.currentInspection.id)
            .then()
            .catch(
                (error)=>{}
            )
    }

    async componentWillMount() {
        const { status } = await Permissions.askAsync(Permissions.CAMERA);
        this.setState({ hasCameraPermission: status === 'granted' });
    }

    _onFlip = () => {
        console.log('Flip camera...');
        this.setState({
            type: this.state.type === Camera.Constants.Type.back
                ? Camera.Constants.Type.front
                : Camera.Constants.Type.back,
            });
    }

    _takePicture = () => {
        console.log('Take picture');
        if (this.camera) {
            this.camera.takePictureAsync({ onPictureSaved: this._onSavePicture });
        }
    }

    _onSavePicture = (photo) => {
        console.log('Saving picture...' + photo.uri);
        PhotoManager.savePhoto(this.props.currentInspection.id, photo)
        .then((response) => {
            
            console.log(response);
            this.setState({
                photoPath:response
            });

            // Save redux
            this.props.takePhoto(response)
    
            this._navigateBack();
        });
    }

    _navigateBack = () => {
        console.log('Navigating back...' + this.props.navigation.state.params.previousRoute);
        let previousRoute = this.props.navigation.state.params.previousRoute;
        let params = { 
            photoPath: this.state.photoPath,
        }
        this.props.navigation.navigate(previousRoute, params)
    }

    _cancel = () => {
        let previousRoute = this.props.navigation.state.params.previousRoute;
        let params = { 
            photoPath: '',
        }
        this.props.navigation.navigate(previousRoute, params)
    }

    render() {

        const { hasCameraPermission } = this.state;

        if (hasCameraPermission === null) {
            console.log('No permission');
            return <View />;
        } else if (hasCameraPermission === false) {
            console.log('No permission');
            return <Text>No access to camera</Text>;
        } else {
            return (
                <View style={{ flex: 1 }}>
                    <Camera 
                        ref={ref => {
                            this.camera = ref;
                        }}
                        style={{ flex: 1 }} type={this.state.type}>
                    </Camera>
                    <View style={styles.bottomBar}>
                        <View style={styles.left}>
                            <Back onPress={this._cancel} />
                        </View>
                        <View style={styles.middle}>
                            <TakePhoto onPress={this._takePicture} />
                        </View>
                        <View style={styles.right}>
                            {/* <Flip onPress={this._onFlip} /> */}
                        </View>
                    </View>
                </View>
            );
        }
    }
}

const styles = StyleSheet.create({
    bottomBar: {
        width: '100%',
        height: 60,
        backgroundColor: CommonStyles.COLOR_WHITE,
        flexDirection: 'row',
    },
        left: {
            flex: 1/3,
        },
        middle: {
            flex: 1/3,
            alignItems: 'center',
            justifyContent: 'center',
        },
        right: {
            flex: 1/3,
        },
})

const mapStateToProps = (state, ownProps) => {
    return {
        currentInspection: state.InspectionList.currentInspection,
    }
}
 
const mapDispatchToProps = (dispatch) => {
    return {
        takePhoto: (filePath) => { dispatch(takePhoto(filePath)); },
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(CameraScreen);