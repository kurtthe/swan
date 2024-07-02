import React from 'react';
import { ScrollView } from 'react-native';
import { makeStyles } from './ListRadioButton.styles'
import { nowTheme } from '@constants';
import RadioGroup from 'react-native-radio-buttons-group';
// @ts-ignore
import { Block, Text } from 'galio-framework';

type Props = {
  onChange: (newValue:any)=> void;
  options: any[]
}

export const ListRadioButton: React.FC<Props> = ({
  onChange,
  options
}) => {
  const styles = makeStyles()

  if (!options || options.length === 0) {
    return (
      <Block style={styles.actionSheet}>
        <Text> No categories found </Text>
      </Block>
    )
  }

  const handleOnChange = (newValue: any)=> {
    console.log("change radio button list", newValue)
    onChange(newValue)
  }

  return (
    <ScrollView style={styles.actionSheet}>
      <RadioGroup
        containerStyle={styles.listRadios}
        radioButtons={options}
        color={nowTheme.COLORS.INFO}
        onPress={handleOnChange}
      />
    </ScrollView>
  )
}
