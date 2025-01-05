import React from 'react';
import { ScrollView } from 'react-native';
import { makeStyles } from './ListRadioButton.styles'
import { nowTheme } from '@constants';
import RadioGroup from 'react-native-radio-buttons-group';
// @ts-ignore
import { Block, Text } from 'galio-framework';

type Props = {
  onChange: (newValue:any)=> void;
  options: any[];
  idSelected?: any;
}

const ListRadioButton: React.FC<Props> = ({
  onChange,
  options,
  idSelected
}) => {
  const styles = makeStyles()

  if (!options || options.length === 0) {
    return (
      <Block style={styles.actionSheet}>
        <Text> No categories found </Text>
      </Block>
    )
  }

  // const handleOnChange = (newValue: any)=> {
  //   if(!options) return;
  //   const optionSelected = options.find(optionData => optionData.id === newValue)
  //   if(!optionSelected) return;
  //   onChange(optionSelected)
  // }


  return (
    <ScrollView style={styles.actionSheet} nestedScrollEnabled>
      <RadioGroup
        containerStyle={styles.listRadios}
        radioButtons={options}
        color={nowTheme.COLORS.INFO}
        selectedId={idSelected}
        onPress={pick => onChange(pick)}
      />
    </ScrollView>
  )
}

export default  React.memo(ListRadioButton)
