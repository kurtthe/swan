import React from 'react';
import {View, Image, Text, StyleSheet} from 'react-native'
import { imagePromotion } from '@assets/imgs/prom';
import { Colors } from 'react-native-paper';

const CardPromotion = ({}) => {

  return (
    <View style={styles.container}>
        <Image
          resizeMode="stretch"
          source={imagePromotion}
          style={styles.image}
        />

      <View style={{marginTop: 10}}>
        <Text style={styles.description}>
          Purchase any eligible model via the Swan Plumbing Portal during the purchase period and you will go into the draw to win a Garmin Forerunner® 55 Smart Watch (valued at RRP $349).
        </Text>
        <Text style={styles.disclaimer}>
          *Purchase period: 1 June to 31 August 2024
        </Text>

        <Text style={styles.link}>
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
