import React from 'react'
import { Dimensions, View, ViewStyle, StyleSheet, TouchableWithoutFeedback, TouchableOpacity } from 'react-native';
import nowTheme from '@constants/Theme';
import { MaterialIcons } from '@expo/vector-icons';

//@ts-ignore
import { Block, Text, theme } from 'galio-framework';
import ModalOptionPicker from '@components/ModalOptionPicker';

type MaterialIconNames = keyof typeof MaterialIcons.glyphMap;
const { width } = Dimensions.get('screen');

type Props = {
  placeholder: string;
  renderOptions: any[];
  text?: string;
  label?: string;
  pickDate?: boolean;
  sizeIcon?: number;
  deleteOption?:boolean;
  icon?: MaterialIconNames;
  style?: ViewStyle;
  onPress?: ()=> void;
  isRequired?: boolean;
  changeSearchText?: (newValueSearch: any) => void;
  onChangeOption?: (option: any)=> void;
  search?: boolean;
  handleSearch?: (numberPage: any) => void;
  page?: any;
};

const PickerButton: React.FC<Props> = ({label, search,  text, renderOptions= [], pickDate,  icon, deleteOption, handleSearch, placeholder,onPress, page,isRequired, changeSearchText, sizeIcon= 20})=> {
  const [optionSelected, setOptionSelected] = React.useState(null);
  const [picked, setPicked] = React.useState(false);
  const [showSheet, setShowSheet] = React.useState(false)

  const openAction = ()=> {
    setShowSheet(true)
    onPress?.()
  }

  return (
    <View style={{marginVertical: 5}}>
      <>
        {label &&
          <Block row>
            <Text style={[styles.text, { fontWeight: 'bold' }]}>{label}</Text>
            {isRequired && <Text style={styles.errorText}>*</Text>}
          </Block>
        }
        {text &&
          <Block row>
            <Text size={14} style={[styles.text, styles.grayText]}>
              {text}
            </Text>
            {isRequired && <Text style={styles.errorText}>*</Text>}
          </Block>
        }
        <TouchableOpacity   activeOpacity={1} onPress={() => openAction()} style={styles.container}>
            <Text style={[styles.placeholder, (picked || pickDate) && styles.pickedPlaceholder]}>
              {(!picked || !pickDate) ? placeholder : optionSelected?.label}
            </Text>
            <MaterialIcons
              name={icon ? icon : optionSelected !== null && deleteOption ? 'clear' : 'expand-more'}
              color={nowTheme.COLORS.ICONPICKER}
              size={sizeIcon ? sizeIcon : optionSelected !== null && deleteOption ? 20 : 30}
              onPress={openAction}
            />
        </TouchableOpacity >

      </>
      <ModalOptionPicker
        page={page}
        handleSearch={handleSearch}
        changeSearchText={changeSearchText}
        search={search}
        setVisible={setShowSheet}
        optionSelected={optionSelected}
        renderOptions={renderOptions}
        setOptionSelected={setOptionSelected}
        visible={showSheet}
      />
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
  container: {
    alignItems: 'center',
    borderWidth: 1,
    borderColor: nowTheme.COLORS.PICKERTEXT,
    padding: 5,
    borderRadius: 5,
    paddingLeft: 10,
    height: 45,
    flexDirection: 'row',
    justifyContent: 'space-between'
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
