import { StyleSheet } from 'react-native';
import { theme } from 'galio-framework';

export const makeStyles = () =>
  StyleSheet.create({
    card: {
      backgroundColor: theme.COLORS.WHITE,
      marginVertical: 8,
      marginHorizontal: 5,
      borderWidth: 0,
      marginBottom: 4,
      flex: 1,
      height: 152
    },
    cardContainer: {
      width: 'auto',
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 2,
      bottom: 70,
      opacity: 0.6,
    },
    cardTitle: {
      fontFamily: 'montserrat-bold',
      textAlign: 'center',
      fontSize: 14,
      opacity: 1,
      color: '#FFFFFF',
      alignItems: 'center',
      backgroundColor: '#000000',
      borderColor: '#FFFFFF',
      width: '70%',
      borderWidth: 1,
      paddingVertical: 10,
      bottom: 20
    },
    horizontalImage: {
      height: 152,
      width: 'auto',
      resizeMode: "cover"
    },
    horizontalStyles: {
      borderTopRightRadius: 0,
      borderBottomRightRadius: 0
    },
    shadow: {
      shadowColor: '#8898AA',
      shadowOffset: { width: 2, height: 3 },
      shadowRadius: 3,
      shadowOpacity: 0.2,
      elevation: 2
    },
    imageBlock: {
      fontFamily: 'montserrat',
      textAlign: 'center',
      paddingHorizontal: 9,
      paddingVertical: 7,
      height: 60
    }
  });