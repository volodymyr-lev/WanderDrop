import { StyleSheet,View,Text } from "react-native";

export default function WIP() {
    return (
        <View style={styles.container}>
            <Text style = {styles.text}>WIP</Text>
        </View>
    )
}

const styles = StyleSheet.create({
    container:{
        position: 'absolute',
        top: 100,
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    text:{
        fontSize: 20,
        fontWeight: 'bold',
        color: 'red'
    }
});