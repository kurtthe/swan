import React from 'react';
import { StyleSheet, TouchableWithoutFeedback, View, ViewStyle } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import nowTheme from '@constants/Theme';
//@ts-ignore
import { Block, Text, theme } from 'galio-framework';

type MaterialIconNames = keyof typeof MaterialIcons.glyphMap;

type Props = {
  onPress: () => void;
  icon: MaterialIconNames;
  label?: string;
  text?: string;
  placeholder?: string;
  sizeIcon?: number;
  isRequired?: boolean;
  style?:ViewStyle;
  pickDate?: boolean;
}

const InputDate: React.FC<Props> = ({
                                      icon,
                                      onPress,
                                      pickDate,
                                      isRequired,
                                      placeholder,
                                      label,
                                      style,
                                      text,
                                      sizeIcon=25
}) => {

  return(
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
            <Text size={14} style={[styles.text, {
              color: nowTheme.COLORS.PRETEXT,
            }]}>
              {text}
            </Text>
            {isRequired && <Text style={styles.errorText}>*</Text>}
          </Block>
        }

        <Block row space='between' style={styles.container}>
          <TouchableWithoutFeedback style={StyleSheet.flatten([{
            width: 'auto',
          }, style])} onPress={() => onPress()}>
            <Text style={StyleSheet.flatten([styles.placeholder,  pickDate && {
              color: 'black',
              fontWeight: 'bold',
            }])}>
              {placeholder}
            </Text>
          </TouchableWithoutFeedback>
          <MaterialIcons
            name={icon}
            color={nowTheme.COLORS.ICONPICKER}
            size={sizeIcon}
            onPress={onPress}
          />
        </Block>
      </>
    </View>
  )

}


const styles = StyleSheet.create({
  text: {
    fontSize: 14,
    paddingVertical: 10,
  },
  placeholder: {
    width: '90%',
    color: nowTheme.COLORS.PICKERTEXT,
  },
  errorText: {
    fontSize: 14,
    paddingVertical: 10,
    color: nowTheme.COLORS.ERROR,
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
  },

});

export default  InputDate;
