import { StyleSheet, Dimensions } from 'react-native'
import { theme } from 'galio-framework';
import { nowTheme } from '@constants';

const { width } = Dimensions.get('screen');

export const makeStyles = () =>
  StyleSheet.create({
    searchInput: {
      color: 'black',
      fontSize: 16,
    },
    search: {
      width: width - 32,
      marginHorizontal: theme.SIZES.BASE,
      marginBottom: theme.SIZES.BASE * 4,
      borderRadius: 30,
    },
    container: {
      backgroundColor: nowTheme.COLORS.BACKGROUND,
      padding: 5
    },
    notfound:{
      padding: 15,
      marginVertical: theme.SIZES.BASE * 2,
    },
    textNotFount:{
      fontFamily: 'montserrat-regular',
      fontSize: 18,
      color: nowTheme.COLORS.TEXT
    },
    containerFilter: {
      padding: 5,
      width: Dimensions.get('window').width,
      flexDirection: 'row',
      alignItems: 'center',
    },
    contentFilters: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      flexWrap: 'nowrap',
    },
    styleRadio: {
      paddingVertical: 3,
      paddingHorizontal: 10,
      width: '100%',
      flexDirection: 'row',
      alignItems: 'center',
    },
  });