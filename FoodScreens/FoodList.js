import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, FlatList,Animated,  SafeAreaView, Image } from 'react-native';
import { Swipeable } from 'react-native-gesture-handler';
import { useState, useEffect } from 'react';
import firestore from '@react-native-firebase/firestore';

const foods = firestore().collection('Food').get();

  export default function MainMenu ({navigation}){
    const [foods, setFoods] = useState([]); 
    const [foodName, setFoodName] = useState(null);
    const [selectedKey, setSelectedKey] = useState(null);

    useEffect(() => {
      const subscriber = firestore()
        .collection('Food')
        .onSnapshot(querySnapshot => {
          const foods = [];
    
          querySnapshot.forEach(documentSnapshot => {
            foods.push({
              ...documentSnapshot.data(),
              key: documentSnapshot.id,
            });
          });
    
          setFoods(foods);
          
        });
    
      return () => subscriber();
    }, []);

    const seeItemDetail = (dockey, ingredient, instruction) => {
      navigation.navigate('Detail',{
        key: dockey,
        ingredient: ingredient,
        instruction: instruction,
      });
    }

    const deleteItem = (dockey) => {
      firestore()
        .collection('Food')
        .doc(dockey)
        .delete()
        .then(() => {
          console.log('Food deleted!');
        });
    }

    const updateItemTitle = (dockey) => {
      setSelectedKey(null);
      firestore()
        .collection('Food')
        .doc(dockey)
        .update({
          title: foodName,
        })
        .then(() => {
          console.log('Food updated!');
        });
    }

    const editItemTitle = (title, key) => {
      setFoodName(title);
      setSelectedKey(key);
    }


    const handleOnChangeName = (text) => setFoodName(text);

    const Item = ({item}) => {

      const rightSwipe = (progress, dragX) => {
        const scale = dragX.interpolate({
          inputRange: [0, 100],
          outputRange: [0, 1],
          extrapolate: 'clamp',
        });

        return (
          <View style={{alignItems:'center'}}>
          <TouchableOpacity onPress={() => deleteItem(item.key)} activeOpacity={0.6}>
            <View style={styles.deleteBox}>
              <Animated.Text style={{transform: [{scale: scale}]}}>
                Delete
              </Animated.Text>
            </View>
          </TouchableOpacity>
          </View>
        );
      };
      return (
        <Swipeable renderLeftActions={rightSwipe}>
        <TouchableOpacity onLongPress={() => editItemTitle(item.title, item.key)} 
                          style={styles.item} 
                          onPress={() => seeItemDetail(item.key, item.ingredient, item.instruction)}>
                <Image style={styles.foodImage} source={{uri: item.image}}></Image>
                    {selectedKey!=item.key && 
                      <View>
                        <Text style={styles.title}>{item.title}</Text>
                      </View>
                    }
                    {selectedKey==item.key &&
                      <View>
                        <TextInput style={styles.title} value={foodName} autoFocus={true} onChangeText={handleOnChangeName}></TextInput>
                        <TouchableOpacity style={{alignSelf:'flex-start', backgroundColor: '#6495ED'}}
                                        onPress={() => updateItemTitle(item.key)}>
                            <Text>Save</Text>
                        </TouchableOpacity>
                      </View>
                    }
        </TouchableOpacity>
        </Swipeable>
      )
    }

    return (
      <SafeAreaView style={styles.container}>
        
        <FlatList
          data={foods}
          renderItem={({item}) => <Item item={item}></Item>
          }
          keyExtractor={item => item.key.toString()}
        />
        <TouchableOpacity style={styles.addButton} onPress={() => navigation.navigate('AddFood') }> 
          <Text style={{textAlign: 'center'}} >Add</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      marginTop: StatusBar.currentHeight || 0,
      backgroundColor: '#87CEFA'
    },
    item: {
      backgroundColor: '#fff',
      padding: 10,
      alignItems:'center',
      marginVertical: 8,
      marginHorizontal: 16,
      borderWidth: 3,
      borderRadius: 10,
      borderColor: '#6495ED',
      flexDirection: 'row',
    },
    title: {
      fontSize: 20,
      flex: 1
    },
    foodImage:{
      width: 80,
      height: 80,
      marginEnd: 10,
      borderRadius: 10,
    },
    addButton: {
       width: 60,
       height: 60,
       borderRadius: 30,
       backgroundColor: '#6495ED', 
       alignSelf:'flex-end',
       justifyContent:'center',
       margin: '5%',
    },
    deleteBox: {
      padding: 10,
      alignItems:'center',
      marginVertical: 8,
      marginHorizontal: 16,
      borderRadius: 10,
      backgroundColor: 'pink',
      justifyContent: 'center',
      height: 105,
    },
  });


