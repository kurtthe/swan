import React, { useState, useEffect } from 'react';
import { ScrollView, View, Text } from 'react-native';

import { Block } from 'galio-framework';

import { nowTheme } from '@constants';
import Switch from '@custom-elements/Switch';
import { ProductCart } from '@core/services/product-cart.service';
import { connect } from 'react-redux';
import { updateProducts, changeClientFriendly } from '@core/module/store/cart/cart';
import { CategoriesProducts } from '@custom-sections/CategoriesProducts'
import { makeStyles } from './TProducts.styles'

const TProducts = ({ cartProducts, changeClientFriendly, updateProducts }) => {
  const [productCart, setProductCart] = useState();
  const styles = makeStyles()

  useEffect(() => {
    const initServices = () => {
      const cartService = ProductCart.getInstance(cartProducts);
      setProductCart(cartService)
    }

    initServices()
  }, [cartProducts])

  const handleChangeSwitch = (value) => {
    changeClientFriendly(!value)
    productCart.changePrice(!value, updateProducts);
  };

  return (
    <Block flex center backgroundColor={nowTheme.COLORS.BACKGROUND}>
      <View style={{flex: 1}}>
        <View style={{flex: 7}}>
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.container}

          >
            <Block style={styles.content}>
              <CategoriesProducts />
            </Block>
          </ScrollView>
        </View>

        <View style={{flex: 1}}>
          <Switch
            card={true}
            title="Client Friendly Mode"
            description={'Enable this to hide "My price"'}
            onChange={(value) => handleChangeSwitch(value)}
          />
        </View>

      </View>
    </Block>
  );
}



const mapStateToProps = (state) => ({
  cartProducts: state.productsReducer.products,
});

const mapDispatchToProps = { updateProducts, changeClientFriendly };

export default connect(mapStateToProps, mapDispatchToProps)(TProducts);
