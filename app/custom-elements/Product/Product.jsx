import React, { memo, useState, useEffect } from 'react';
import { Image, TouchableWithoutFeedback, View, TouchableOpacity, FlatList } from 'react-native';

import { Button } from '@components';
import { Block, Text } from 'galio-framework';
import { useNavigation } from '@react-navigation/native';

import { nowTheme } from '@constants';
import { FormatMoneyService } from '@core/services/format-money.service';
import { updateProducts } from '@core/module/store/cart/cart';
import LoadingComponent from '@custom-elements/Loading'
import { ProductCart } from '@core/services/product-cart.service';
import { MaterialIcons } from '@expo/vector-icons';
import { useSelector, useDispatch } from 'react-redux';
import { makeStyles, sizeConstant } from './Product.styles';
import FavoriteIcon from '../FavoriteIcon';
import IconTopSell from '../IconTopSell';
import { endPoints } from '../../shared/dictionaries/end-points';
import { GeneralRequestService } from '../../core/services/general-request.service';

const generalRequestService = GeneralRequestService.getInstance()

const Product = (props) => {
  const cartProducts = useSelector((state) => state.productsReducer.products);
  const dispatch = useDispatch();
  const productCart = ProductCart.getInstance(cartProducts);
  const formatMoney = FormatMoneyService.getInstance();
  const [added, setProductAdded] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingPrice, setIsLoadingPrice] = useState(false);
  const styles = makeStyles();
  const navigation = useNavigation();

  useEffect(() => {
    const addedProduct = cartProducts.some((element) => element.id === props.product.id);
    setProductAdded(addedProduct);
  }, [cartProducts]);

  const onAddPressed = async (productItem) => {

    const urlPetition = endPoints.newPrice.replace(":id", productItem.id);
    setIsLoading(true);
    const data = await generalRequestService.get(`${urlPetition}`);
    console.log(data);

    if (data[0] && data[0].retail_price && data[0].cost_price) {

      productItem.rrp = data[0].retail_price;
      productItem.cost_price = data[0].cost_price;

      const priceProduct = props.myPrice ? data[0].retail_price : data[0].cost_price;

      const addProduct = {
        ...productItem,
        price: parseFloat(priceProduct).toFixed(2),
        myPrice: props.myPrice,
      };
      const productAdd = productCart.addCart(addProduct);
      dispatch(updateProducts(productAdd));

    } else {
      console.error("We coudn't get the new prices");
    }

    setIsLoading(false);

  };

  const onProductPressed = async (productItem) => {

    setIsLoadingPrice(true);
    const urlPetition = endPoints.newPrice.replace(":id", productItem.id);
    const data = await generalRequestService.get(`${urlPetition}`);
    console.log(data);

    if (data[0] && data[0].retail_price && data[0].cost_price) {

      productItem.rrp = data[0].retail_price;
      productItem.cost_price = data[0].cost_price;

      navigation?.navigate('Product', {
        hideMyPrice: props.myPrice,
        product: productItem,
        headerTitle: 'Product',
        updateProducts: props.updateList,
      });
    } else {
      console.error("We coudn't get the new prices");
    }
    setIsLoadingPrice(false);

  };

  const showPriceProduct = () => {
    if (props.product.cost_price > 0) {
      return <Text style={styles.price}>{formatMoney.format(props.product.price.cost_price)}</Text>;
    }
    return (
      <TouchableOpacity
        style={{ width: '100%', alignItems: 'center' }}
        onPress={() => props.handleNewPrice(props.product.id)}
      >
        <MaterialIcons name="autorenew" size={20} color={nowTheme.COLORS.LIGHTGRAY} />
      </TouchableOpacity>
    );
  };

  return (
    <Block key={`Card-${props.product.name}`} style={styles.Card}>
      <TouchableWithoutFeedback onPress={() => onProductPressed(props.product)}>
        <Image style={styles.image} source={{ uri: props.product.cover_image }} />
      </TouchableWithoutFeedback>

      <TouchableWithoutFeedback onPress={() => onProductPressed(props.product)}>
        <Block flex space="between" style={{ paddingBottom: 7 }}>
          <View style={styles.contentSku}>
            <Text color={nowTheme.COLORS.LIGHTGRAY} size={sizeConstant}>
              SKU
            </Text>
            <Text color={nowTheme.COLORS.INFO} size={sizeConstant}>
              {` ${props.product.sku}`}
            </Text>
            <IconTopSell product={props.product} />
          </View>
          <View style={styles.contentNameProduct}>
            <Text
              style={{ fontFamily: 'montserrat-regular', marginRight: 0, paddingVertical: 0 }}
              size={15}
            >
              <FavoriteIcon product={props.product} size={15} hideNoFavorite={true} />
              {props.product.name}
            </Text>
          </View>
          <Block row style={{ width: '100%' }}>
            <Block flex>
              <Text color={nowTheme.COLORS.LIGHTGRAY} style={styles.priceGrayText}>
                RRP: {formatMoney.format(props.product.rrp)}
              </Text>
              {/*<Text style={styles.price}>*/}
              {/*  {props.myPrice ? null : (showPriceProduct())}*/}
              {/*</Text>*/}
            </Block>
          </Block>
        </Block>
      </TouchableWithoutFeedback>
      <Block>
        {
          isLoadingPrice && (
            <View style={styles.contentLoading}>
              <LoadingComponent size='large' />
            </View>
          )
        }
        {
          isLoading ? (
            <View style={styles.contentLoading}>
              <LoadingComponent size='large' />
            </View>
          ): (
            <Button
              color="info"
              textStyle={{ fontFamily: 'montserrat-bold', fontSize: 16, color: 'white' }}
              onPress={() => onAddPressed(props.product)}
              disabled={added ? true : false}
            >
              {isLoadingPrice ? 'Loading' : added ? 'Added' : 'Add'}
            </Button>
          )
        }

      </Block>
    </Block>
  );
};

export default memo(Product);
