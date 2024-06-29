import React from 'react';
import {View, Image, Text, StyleSheet} from 'react-native'
import { imagePromotion } from '@assets/imgs/prom';

const CardPromotion = ({}) => {

  return (
    <View>
      <View>
        <Image resizeMode="cover" source={imagePromotion} />
      </View>
      <View>
        <Text>
          Purchase any eligible model via the Swan Plumbing Portal during the purchase period and you will go into the draw to win a Garmin Forerunner® 55 Smart Watch (valued at RRP $349).
        </Text>
        <Text>
          *Purchase period: 1 June to 31 August 2024
        </Text>

        <Text>
          Learn more
        </Text>
      </View>
    </View>
  )

}

const styles = StyleSheet.create({})

export default CardPromotion
