import React from 'react';
import { ImageBackground, TouchableOpacity, StyleSheet, Dimensions, Platform } from 'react-native';
import { Block, theme, Text } from 'galio-framework';

import { nowTheme } from '@constants';
import { FormatMoneyService } from '@core/services/format-money.service';
import { withNavigation } from '@react-navigation/compat';
import { useSelector } from 'react-redux'

const formatMoney = FormatMoneyService.getInstance();
const { width } = Dimensions.get('screen');

const LiveBalance = (props) => {
  const balanceFromRedux = useSelector((state) => state.liveBalanceReducer);
  const balance = props || balanceFromRedux;
  console.log('company', balance.company)
  console.log('company', balance)

  return (
    <Block flex card center shadow style={styles.category}>
      <ImageBackground
        source={require('../../assets/imgs/swan-banner.png')}
        style={[styles.imageBlock, { width: width - theme.SIZES.BASE * 0.1, height: Platform.OS === 'ios' ? 132 : props.company ? 130 : 110 }]}
        imageStyle={{
          width: width - theme.SIZES.BASE * 0.1,
          height: 132,
        }}
      >
        
          {props.company || balance.restricted ? (
            <Block style={styles.categoryTitle}>
              <Text size={32} bold color={theme.COLORS.BLACK}>
                {balance.company}
              </Text>
            </Block>
          ) : (
            <Block style={styles.categoryTitle2}>
                <Block
                  row
                  middle
                  space="between"
                  style={{ marginBottom: theme.SIZES.BASE, paddingLeft: 0, paddingRight: 6 }}
                >
                  <Text size={28} bold color={theme.COLORS.BLACK}>
                    {formatMoney.format(balance.total)}
                  </Text>
                </Block>
                <Block row middle space="between" style={styles.bottomView}>
                  <Text size={14} bold color={theme.COLORS.WHITE} style={{ left: 0 }}>
                    {' '}
                    Overdue Balance{' '}
                  </Text>
                  <Text size={14} bold color={theme.COLORS.WHITE} style={{ left: 0 }}>
                    {' '}
                    {formatMoney.format(balance.overdue)}{' '}
                  </Text>
                </Block>
            </Block>
          )}
      </ImageBackground>
    </Block>
  );
};

const styles = StyleSheet.create({
  bottomView: {
    padding: 10.5,
    position: 'absolute',
    bottom: 0,
    width: width,
    backgroundColor: '#F35757',

  },
  category: {
    backgroundColor: theme.COLORS.WHITE,
    marginVertical: 0,
    borderWidth: 0,
  },
  categoryTitle: {
    height: '100%',
    paddingHorizontal: 13,
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'center'
  },
  categoryTitle2: {
    height: '100%',
    paddingHorizontal: 13,
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    justifyContent: 'center',
  },
});

export default withNavigation(LiveBalance);