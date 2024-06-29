import React from 'react';
import {View, Image, Text, StyleSheet} from 'react-native'
import { imagePromotion } from '@assets/imgs/prom';


type Props = {};

const CardPromotion:React.FC<Props> = ({}) => {

  return (
    <View>
      <View>
        <Image resizeMode="cover" source={imagePromotion} />
      </View>
      <View>
        <Text>
          Purchase any eligible model via the Swan Plumbing Portal during the purchase period and you will go into the draw to win a Garmin Forerunner® 55 Smart Watch (valued at RRP $349).
        </Text>

      </View>
    </View>
  )

}

export default CardPromotion
