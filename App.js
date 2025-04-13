import { GestureHandlerRootView } from 'react-native-gesture-handler';
import 'react-native-reanimated';
import React from 'react';
import Tabs from './navigation/Tabs';
import { AuthProvider } from './context/AuthContext';

export default function App() {
    return (
        <AuthProvider>
            <GestureHandlerRootView style={{ flex: 1 }}>
                <Tabs />
            </GestureHandlerRootView>
        </AuthProvider> 
    );
}
