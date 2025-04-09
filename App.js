import { GestureHandlerRootView } from 'react-native-gesture-handler';
import 'react-native-reanimated';
import React from 'react';
import Tabs from './navigation/Tabs';

export default function App() {
    return (
        <GestureHandlerRootView style={{ flex: 1 }}>
            <Tabs />
        </GestureHandlerRootView>
    );
}
