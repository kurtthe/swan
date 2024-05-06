import React from 'react';
import { Image, TouchableOpacity, ImageBackground, View } from 'react-native';
import { Text } from 'galio-framework';

import { makeStyles } from './CategoryItem.styles'
const CategoryItem = ({ title,
  image,
  onPress }) => {

  const styles = makeStyles()

  const imageStyles = [styles.horizontalImage];
  const titleContainerStyles = [styles.cardContainer];
  const titleStyles = [styles.cardTitle];
  const cardContainer = [styles.card, styles.shadow];

  const handlePress = () => onPress && onPress()

  return (
    <TouchableOpacity onPress={() => handlePress()} style={cardContainer}>
      <Image source={image} style={imageStyles} />
      {/*<ImageBackground*/}
      {/*  source={require('../../../../../assets/imgs/product_background.png')}*/}
      {/*  style={styles.imageBlock}*/}
      {/*>*/}
      <View
        style={titleContainerStyles}
      >
        <Text
          style={titleStyles}
          size={14}
          color={'black'}
        >
          {title}
        </Text>
      </View>

      {/*</ImageBackground>*/}

    </TouchableOpacity>
  );
}

export default CategoryItem;
