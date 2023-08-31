/**
    - Es wird eine Komponente namens "CameraScreen" erstellt, die die Kamerafunktion implementiert.
    - Die Zustände "hasPermission", "cameraRef", "type" und "capturedImage" werden mit Hilfe von Hooks erstellt.
    - Die useEffect-Funktion wird verwendet, um die Kameraberechtigung zu beantragen.
    - Die "takePicture" -Funktion wird verwendet, um ein Bild aufzunehmen und es mithilfe von ImageManipulator zu bearbeiten.
    - Wenn das Bild aufgenommen wurde, wird es in einem Vorschaubereich angezeigt, der auch eine Schaltfläche zum Speichern des Bildes enthält.
    - Die "saveImage" -Funktion wird verwendet, um das Bild in der Medienbibliothek des Benutzers zu speichern.
*/

import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { Camera } from 'expo-camera';
import * as FileSystem from 'expo-file-system';
import { ImageManipulator } from 'expo-image-manipulator';

export default function CameraScreen() {
    const [hasPermission, setHasPermission] = useState(null);
    const [cameraRef, setCameraRef] = useState(null);
    const [type, setType] = useState(Camera.Constants.Type.back);
    const [capturedImage, setCapturedImage] = useState(null);

    useEffect(() => {
        (async () => {
            const { status } = await Camera.requestPermissionsAsync();
            setHasPermission(status === 'granted');
        })();
    }, []);

    const takePicture = async () => {
        if (cameraRef) {
            const options = { quality: 0.5, base64: true };
            const photo = await cameraRef.takePictureAsync(options);
            const manipResult = await ImageManipulator.manipulateAsync(
                photo.uri,
                [{ resize: { width: 500 } }],
                { compress: 0.5, format: 'jpeg', base64: true }
            );
            setCapturedImage(manipResult);
        }
    };

    if (hasPermission === null) {
        return <View />;
    }
    if (hasPermission === false) {
        return <Text>No access to camera</Text>;
    }

    return (
        <View style={styles.container}>
            <Camera style={styles.camera} type={type} ref={ref => setCameraRef(ref)}>
                <View style={styles.buttonContainer}>
                    <TouchableOpacity style={styles.button} onPress={() => setType(
                        type === Camera.Constants.Type.back
                            ? Camera.Constants.Type.front
                            : Camera.Constants.Type.back
                    )}>
                        <Text style={styles.text}>Flip</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.button} onPress={takePicture}>
                        <Text style={styles.text}>Take Picture</Text>
                    </TouchableOpacity>
                </View>
            </Camera>
            {capturedImage && (
                <View style={styles.previewContainer}>
                    <Text style={styles.previewText}>Preview:</Text>
                    <Image source={{ uri: `data:image/jpeg;base64,${capturedImage.base64}` }} style={styles.previewImage} />
                    <TouchableOpacity style={styles.saveButton} onPress={() => saveImage(capturedImage)}>
                        <Text style={styles.saveButtonText}>Save Image</Text>
                    </TouchableOpacity>
                </View>
            )}
        </View>
    );
}

const saveImageToPhoneFileSystem = async (image) => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
        alert('Sorry, we need media library permissions to save the image!');
        return;
    }

    const asset = await MediaLibrary.createAssetAsync(`data: image / jpeg; base64, ${ image.base64 }`);
    await MediaLibrary.createAlbumAsync('MyApp', asset, false);
    alert('Image saved to album!');
};

const saveImage = async (photoUri) => {
    const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
    if (status === 'granted') {
      const fileUri = FileSystem.documentDirectory + 'photo.jpg';
      await FileSystem.copyAsync({ from: photoUri, to: fileUri });
      alert('Photo saved to device!');
    } else {
      alert('Permission to save photo was denied.');
    }
  }

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        backgroundColor: 'black',
    },
    camera: {
        flex: 1,
        justifyContent: 'flex-end',
        alignItems: 'center',
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },
    button: {
        flex: 0.3,
        alignSelf: 'flex-end',
        alignItems: 'center',
    },
    text: {
        fontSize: 18,
        marginBottom: 10,
        color: 'white',
    },
    previewContainer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: 'white',
        padding: 20,
        alignItems: 'center',
    },
    previewText: {
        fontSize: 20,
        marginBottom: 10,
    },
    previewImage: {
        width: 300,
        height: 300,
        marginBottom: 10,
    },
    saveButton: {
        backgroundColor: '#2196F3',
        borderRadius: 20,
        padding: 10,
        alignItems: 'center',
    },
    saveButtonText: {
        color: 'white',
        fontSize: 18,
    },
});