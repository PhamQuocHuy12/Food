import { useNavigation } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, TextInput, KeyboardAvoidingView} from 'react-native';
import firestore from '@react-native-firebase/firestore';


export default function AddFood({navigation}) {
    const [foodName, setFoodName] = useState('');
    const [foodImage, setFoodImage] =useState('');
    

    const handleOnChangeName = (text) => setFoodName(text);
    const handleOnChangeImage = (text) => setFoodImage(text);

    const addFood  = () => {
        // const food = {title: foodName, image: foodImage};
        firestore()
        .collection('Food')
        .add({title: foodName, image: foodImage})
        .then(() => {
            console.log('Added!');
        });

        setFoodName('');
        setFoodImage('');
        navigation.navigate('Menu', {screen:'FoodList'});
    };

    return(
        <KeyboardAvoidingView style={styles.container}>
            <Text style={styles.someWord}>Food's name</Text>
            <TextInput 
                style={styles.inputComponent} 
                placeholder="Enter food's name"
                value={foodName}
                onChangeText={handleOnChangeName}>
            </TextInput>
            <Text style={styles.someWord}>Food's image url</Text>
            <TextInput 
                style={styles.inputComponent} 
                placeholder="Enter food's image url"
                value={foodImage}
                onChangeText={handleOnChangeImage}>
            </TextInput>
            <TouchableOpacity style={styles.buttonComponent} onPress={addFood}>
                <Text>Add</Text>
            </TouchableOpacity>
        </KeyboardAvoidingView>    
    )
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#87CEFA',
      alignItems: 'center',
      
    },
    inputComponent: {
        width: '80%',
        height: 70,
        backgroundColor: 'white',
        borderRadius:30,
        borderColor:'#6495ED',
        borderWidth:3,
        padding: 10,
        marginTop: '3%'
    },
    buttonComponent: {
        width: '80%',
        height: '8%',
        backgroundColor:'#6495ED',
        borderRadius: 30,
        marginTop: '3%',
        alignItems: 'center',
        justifyContent: 'center',
    },
    someWord :{
        fontSize: 30,
        textAlign: 'left',
        marginTop: '3%',
    },
    
});