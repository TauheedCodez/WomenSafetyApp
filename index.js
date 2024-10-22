import { AppRegistry } from 'react-native';
import App from './App';
import { name as appName } from './app.json';  // Ensure app.json exists

AppRegistry.registerComponent(appName, () => App);