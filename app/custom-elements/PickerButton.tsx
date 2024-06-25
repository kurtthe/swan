import React from 'react'
import { Dimensions, View, ViewStyle, StyleSheet, TouchableWithoutFeedback } from 'react-native';
import nowTheme from '@constants/Theme';
import { MaterialIcons } from '@expo/vector-icons';

//@ts-ignore
import { Block, Text, theme } from 'galio-framework';
import ModalOptionPicker from '@components/ModalOptionPicker';

type MaterialIconNames = keyof typeof MaterialIcons.glyphMap;
const { width } = Dimensions.get('screen');

type Props = {
  placeholder: string;
  text: string;
  label: string;
  renderOptions: any[];
  pickDate: boolean;
  sizeIcon?: number;
  deleteOption?:boolean;
  icon?: MaterialIconNames;
  style?: ViewStyle;
  onPress?: ()=> void;
  isRequired?: boolean;
  changeSearchText?: () => void;
};

const PickerButton: React.FC<Props> = ({label,  style, renderOptions= [], pickDate,  icon, deleteOption, placeholder,onPress,isRequired, sizeIcon= 20})=> {
  const [optionSelected, setOptionSelected] = React.useState(null);
  const [picked, setPicked] = React.useState(false);
  const [showSheet, setShowSheet] = React.useState(false)


  const onDeleteSelected = ()=> {
  }

  const openAction = ()=> {
    setShowSheet(true)
    onPress?.()
  }


  return (
    <View style={{marginVertical: 5}}>
      <View>
        {label &&
          <Block row>
            <Text style={[styles.text, { fontWeight: 'bold' }]}>{label}</Text>
            {isRequired && <Text style={styles.errorText}>*</Text>}
          </Block>
        }
        <Block row space={'between'} style={styles.container}>
          <TouchableWithoutFeedback style={StyleSheet.flatten([styles.button, style])} onPress={() => openAction()}>
            <Text style={[styles.placeholder, (picked || pickDate) && styles.pickedPlaceholder]}>
              {(!picked || !pickDate) ? placeholder : optionSelected?.label}
            </Text>
          </TouchableWithoutFeedback>
          <MaterialIcons
            name={icon ? icon : optionSelected !== null && deleteOption ? 'clear' : 'expand-more'}
            color={nowTheme.COLORS.ICONPICKER}
            size={sizeIcon ? sizeIcon : optionSelected !== null && deleteOption ? 20 : 30}
            onPress={optionSelected !== null && deleteOption ? () => onDeleteSelected() : () => openAction()}
          />
        </Block>
      </View>

      <ModalOptionPicker optionSelected={optionSelected}   renderOptions={renderOptions} visible={showSheet}/>
    </View>

  )
}

const styles = StyleSheet.create({
  text: {
    fontSize: 14,
    paddingVertical: 10,
  },
  grayText: {
    color: nowTheme.COLORS.PRETEXT,
  },
  errorText: {
    fontSize: 14,
    paddingVertical: 10,
    color: nowTheme.COLORS.ERROR,
    fontWeight: 'bold',
  },
  placeholder: {
    width: '90%',
    color: nowTheme.COLORS.PICKERTEXT,
  },
  pickedPlaceholder: {
    color: 'black',
    fontWeight: 'bold',
  },
  button: {
    width: 'auto',
  },
  container: {
    alignItems: 'center',
    borderWidth: 1,
    borderColor: nowTheme.COLORS.PICKERTEXT,
    padding: 5,
    borderRadius: 5,
    paddingLeft: 10,
    height: 45,
  },
  shadow: {
    shadowColor: 'black',
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 5,
    shadowOpacity: 0.2,
  },
  searchInput: {
    color: 'black',
    fontSize: 16,
  },
  search: {
    height: 40,
    width: width - 32,
    marginBottom: theme.SIZES.BASE * 4,
    borderRadius: 30,
  },
  radioStyle: {
    width: '100%',
    alignItems: 'flex-start',
  },
});

export default  PickerButton
