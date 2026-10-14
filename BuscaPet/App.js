import { StyleSheet, Text, View } from 'react-native';
import Pessoa from './components/Pessoa'


export default function App() {
  return (
    <View style={styles.container}>
        <Text>a</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#ecf0f1',
    padding: 8,
  },
});
