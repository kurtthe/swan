import React from 'react';
import { View, Image, Text, StyleSheet, Linking } from 'react-native';
import { imagePromotion } from '@assets/imgs/prom';

type Props = {
  title: string;
  link: string;
  description: string;
  image: string;
  addedDate: string;
}

const CardPromotion: React.FC<Props> = ({title, link, description, image, addedDate}) => {

  const openUrl = ()=> {
    Linking.openURL(link).catch(()=> console.log("Failed to open"));
  }

  return (
    <View style={styles.container}>
        <Image
          resizeMode="stretch"
          source={imagePromotion}
          style={styles.image}
        />

      <View style={{marginTop: 10}}>
        <Text style={styles.description}>{title}
        </Text>
        <Text style={styles.disclaimer}>
          *Purchase period: {addedDate}
        </Text>

        <Text style={styles.link} onPress={openUrl}>
          Learn more
        </Text>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20
  },
  image: {
    width: '100%',
    height: 250
  },
  description: {
    fontSize: 22,
    textAlign: 'center',
    marginBottom: 20
  },
  disclaimer: {
    textAlign: 'center',
    marginBottom: 20
  },
  link: {
    textAlign: 'center',
    marginBottom: 20,
    textDecorationLine: "underline",
    color: "#F22020"
  }
})

export default CardPromotion
