import React, {useState} from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { TextInput } from 'react-native-gesture-handler';


export default function LoginRegister({onLogin, onRegister}) {
    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [name, setName] = useState('');

    const handleSubmit = () => {
        if (isLogin) {
            onLogin(email, password);
        } else {
            if (password !== confirmPassword) {
                alert("Passwords do not match");
                return;
            }
    
            if (!name.trim()) {
                alert("Please enter a name");
                return;
            }
            onRegister(email, password, name);
        }
    };
      

    return (
        <View style={styles.container}>
            <Text style={styles.title}>{isLogin?'Login Here':'Create Account'}</Text>

            <TextInput
                placeholder="Email"
                placeholderTextColor={'#F1F1F1'}
                value={email}
                onChangeText={setEmail}
                style={styles.input}
                autoCapitalize='none'
                />

            {!isLogin && (
                <TextInput
                    style={styles.input}
                    placeholder="Name"
                    placeholderTextColor="#F1F1F1"
                    value={name}
                    onChangeText={setName}
                    marginBottom={20}
                />
            )}


            <TextInput
                style={styles.input}
                placeholder="Password"
                placeholderTextColor="#F1F1F1"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                />

            {!isLogin && (
                <TextInput
                    style={styles.input}
                    placeholder="Confirm Password"
                    placeholderTextColor="#F1F1F1"
                    secureTextEntry
                    value={confirmPassword}
                    onChangeText={setConfirmPassword}
                />
            )}

            <TouchableOpacity style={styles.button} onPress={handleSubmit}>
                <Text style={styles.buttonText}>{isLogin ? 'Login' : 'Register'}</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => setIsLogin(!isLogin)}>
                <Text style={styles.toggleText}>
                    {isLogin ? "Don't have an account? Register" : "Already have an account? Login"}
                </Text>
            </TouchableOpacity>


            <View style={styles.square_1}>
            </View>
            
            <View style={styles.square_2}>
            </View>

        </View>
    )

}

const styles = StyleSheet.create({
    container:{
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#161414',
    },
    title:{
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        color: '#24C690',
    },
    input:{
        color: '#F1F1F1',
        backgroundColor: '#393939',
        padding: 10,
        width: '80%',
        height: 60,
        borderRadius: 10,
        marginBottom: 10,
    },
    button:{
        backgroundColor: '#24C690',
        padding: 15,
        borderRadius: 10,
        width: '80%',
        alignItems : 'center',
        marginTop: 81,
        zIndex: 100,
    },
    buttonText:{
        color: '#F1F1F1',
    },
    toggleText: {
        color: '#BEBEBE',
        textAlign: 'center',
        marginTop: 20,
    },
    square_1:{
        backgroundColor: '#161414',
        width: 100,
        height: 250,
        borderWidth: 3,
        borderColor: '#24C690',
        position: 'absolute',
        bottom: -5,
        left: -40,
        zIndex: 5,
    },
    square_2:{
        backgroundColor: '#161414',
        width: 250,
        height: 250,
        borderWidth: 3,
        borderColor: '#24C690',
        position: 'absolute',
        bottom: -60,
        left: -100,
        zIndex: 4,
        transform: [
            { rotate: '45deg' },
        ],
    }
});