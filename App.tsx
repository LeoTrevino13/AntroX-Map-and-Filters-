// App.tsx
import 'react-native-gesture-handler';
import React, { createContext, useState, useEffect } from 'react';
import { ActivityIndicator, View } from 'react-native';
import AppNavigator from './src/navigation/AppNavigator';
import auth, { FirebaseAuthTypes } from '@react-native-firebase/auth';

// Define the shape of our AuthContext
interface AuthContextProps {
  user: FirebaseAuthTypes.User | null;
  setUser: React.Dispatch<React.SetStateAction<FirebaseAuthTypes.User | null>>;
}

// Create the AuthContext with a default value.
export const AuthContext = createContext<AuthContextProps>({
  user: null,
  setUser: () => {},
});

const App = () => {
  const [user, setUser] = useState<FirebaseAuthTypes.User | null>(null);
  const [initializing, setInitializing] = useState(true);

  // Listen for authentication state changes
  function onAuthStateChanged(user: FirebaseAuthTypes.User | null) {
    setUser(user);
    if (initializing) setInitializing(false);
  }

  useEffect(() => {
    const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
    return subscriber; // Unsubscribe on unmount
  }, []);

  // Show a loading indicator while Firebase initializes
  if (initializing) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  // Provide the authentication state to your navigator and screens
  return (
    <AuthContext.Provider value={{ user, setUser }}>
      <AppNavigator />
    </AuthContext.Provider>
  );
};

export default App;
