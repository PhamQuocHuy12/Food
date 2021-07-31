import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, TextInput } from 'react-native';
import { useState  } from 'react';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import firestore from '@react-native-firebase/firestore';
import DraggableFlatList from 'react-native-draggable-flatlist';


const Tab = createMaterialTopTabNavigator();

export default function Detail({route, navigation}){
  const ingredient = route.params.ingredient;
  const key = route.params.key;
  const instruction = route.params.instruction;

    return (
        <Tab.Navigator>
          <Tab.Screen name="Ingredients" 
                      component={Ingredients}
                      initialParams={{ingredient: ingredient, key: key}}
                      />
          <Tab.Screen name="Instruction" 
                      component={Instruction} 
                      initialParams={{instruction: instruction, key: key}}
                      />
        </Tab.Navigator>
      );
}

const ingredientsList ='1 chén cơm chín,1 củ hành tây, 4 quả trứng,Hành lá, Nước mắm';
const instructionSteps = "Đập trứng cho vào chén và đánh tan. Hành tây bóc vỏ, thái nhỏ. Hành lá rửa sạch, cắt nhỏ. Bạn cho dầu ăn vào chảo, rồi cho hành tây vào phi thơm. Tiếp theo, cho cơm vào đảo đều và gạt cơm qua một bên. Tiếp đến, bạn cho trứng vào rồi đảo đều trứng với cho trứng bám đều cơm. Cho vào 1 muỗng nước mắm và chiên đến khi hạt cơm săn lại thì tắt bếp rồi cho hành lá vào là được."

function Ingredients({route, navigation}) {
    const params = route.params;
    const [ingredient, setIngredient] =useState(params.ingredient);
    const [isAdding, setIsAdding] =useState(false);

    const renderItem = ({ item, drag }) => (
      <View style={styles.item}>
        <TouchableOpacity onLongPress={drag}>
          <Text>{item}</Text>
        </TouchableOpacity>
      </View>
    );

    const bottomButtonHandling = () => {
        if(isAdding == false){
          setIsAdding(true);
        } else {
          setIsAdding(false);
        }
    }

    const updateItem = (data) => {
      setIngredient(data);
      firestore()
        .collection('Food')
        .doc(params.key)
        .update({
          ingredient: data,
        })
        .then(() => {
          console.log('Data updated!');
        });
    }

    return (
      <View style={styles.container}>

        <DraggableFlatList
          data={ingredient}
          keyExtractor={(item, index) => index.toString()}
          onDragEnd={({data }) => updateItem(data)}
          renderItem={renderItem}/>

          <TouchableOpacity style={styles.buttonComponent}
                            onPress={bottomButtonHandling}>
            <Text>{isAdding? 'Save': 'Add'}</Text>
          </TouchableOpacity>
      </View>
      );
  }

//=============================================================================================


  function Instruction({route}) {
    const params = route.params;
    const [instruction, setInstruction] = useState(params.instruction);
    const [isAdding, setIsAdding] =useState(false);

    const bottomButtonHandling = () => {
      if(isAdding == false){
        setIsAdding(true);
      } else {
        setIsAdding(false);
      }
    }

    const renderItem = ({ item, drag }) => (
      <View style={styles.item}>
        <TouchableOpacity onLongPress={drag}>
          <Text>{item}</Text>
        </TouchableOpacity>
      </View>
    );

    const updateItem = (data) => {
      setInstruction(data);
      firestore()
        .collection('Food')
        .doc(params.key)
        .update({
          instruction: data,
        })
        .then(() => {
          console.log('Data updated!');
        });
    }

    return (
      <View style={styles.container}>

        <DraggableFlatList
          data={instruction}
          keyExtractor={(item, index) => index.toString()}
          onDragEnd={({ data }) => updateItem(data)}
          renderItem={renderItem}/>

          <TouchableOpacity style={styles.buttonComponent}
                            onPress={bottomButtonHandling}>
            <Text>{isAdding? 'Save': 'Add'}</Text>
          </TouchableOpacity>

      </View>
    );
  }

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      paddingTop: StatusBar.currentHeight,
      backgroundColor: '#87CEFA',
    },
    item: {
      backgroundColor: '#fff',
      padding: 10,
      marginVertical: 8,
      marginHorizontal: 16,
      borderWidth: 3,
      borderRadius: 10,
      borderColor: '#6495ED',
    },
    header: {
      fontSize: 32,
      backgroundColor: "#fff"
    },
    title: {
      fontSize: 24
    },
    buttonComponent: {
      width: '80%',
      height: '8%',
      backgroundColor:'#6495ED',
      borderRadius: 30,
      marginTop: '3%',
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: 12,
      alignSelf:'center'
  },
  });
    