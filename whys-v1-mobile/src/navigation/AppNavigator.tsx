
// AppNavigator.tsx
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import HomeScreen from "../screens/HomeScreen";
import Journals from "../screens/Journals";
import  ChatScreen from "../screens/ChatBot";
import ActionItemsScreen from "../screens/ActionItem";
import RecordingDetailScreen from "../screens/RecordingDetail";
import { RootStackParamList } from "./types"; // <-- import the shared type
import VoicePrintsScreen from "../screens/VoicePrints";
import RecordingScreen from "../screens/RecordingScreen";
import JournalDetailScreen from "../screens/journalDetail";
import SignInScreen from "../screens/SignInScreen";
import SignUpScreen from "../screens/SignUpScreen";


const Stack = createNativeStackNavigator<RootStackParamList>();

export default function AppNavigator() {
  return (
    
      <Stack.Navigator  initialRouteName="Home"    screenOptions={{ headerShown: false,animation: "none" }}>
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Journal" component={Journals} /> 
        <Stack.Screen name= "chat" component={ChatScreen} />
        <Stack.Screen name= "Notes" component={ActionItemsScreen} />
        <Stack.Screen name="RecordingDetail" component={RecordingDetailScreen} />
        <Stack.Screen name="VoicePrints" component={VoicePrintsScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Recording" component={RecordingScreen} />
        <Stack.Screen name="JournalDetail" component={JournalDetailScreen} />
        <Stack.Screen name="SignIn" component={SignInScreen} />
        <Stack.Screen name="SignUp" component={SignUpScreen} />
      </Stack.Navigator>
    
  );
}
