import { StatusBar } from 'expo-status-bar';
import { Button, StyleSheet, Text, View } from 'react-native';
import CameraScreen from './src/camera/CameraScreen';

export default function App() {
  return (
    <View style={styles.container}>
      <Text>Hello Sc</Text>
      <StatusBar style="auto" />

      <View>
        <Text>.......  Image  ....... </Text>
        <CameraScreen />
      </View>
      
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffa',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
});
