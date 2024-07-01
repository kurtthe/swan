import {StyleSheet} from 'react-native'
import { widthPercentageToDP as wp } from 'react-native-responsive-screen';
import { nowTheme } from '@constants';
import { theme } from 'galio-framework';

export const makeStyles = () => StyleSheet.create({
  container: {
    backgroundColor: "transparent",
    flex: 1,
    paddingVertical: 5,
    height: 'auto',
    borderRadius: 3
  },
  button: {
    alignItems: 'center',
    marginBottom: 3,
    fontSize: 5,
    width: 80,
    height: 30,
    padding: 2
  },
  line: {
    borderBottomWidth: 2,
    borderBottomColor: 'lightgrey',
    alignSelf: 'center',
    width: '95%',
    marginTop: 4,
  },
  bg_green: {
    width: wp('20%'),
    height: 25,
    backgroundColor: '#ecf8ee',
    borderRadius: 30,
    marginTop: 20,
    justifyContent: 'center',
    alignContent: 'center',
    left: -1,
  },
  bg_purple: {
    width: wp('20%'),
    height: 25,
    backgroundColor: '#eff1f7',
    borderRadius: 30,
    marginTop: 20,
    justifyContent: 'center',
    alignContent: 'center',
    left: -1,
  },
});
