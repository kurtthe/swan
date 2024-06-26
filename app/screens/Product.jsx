import React from 'react';
import {
  Dimensions,
  Image,
  KeyboardAvoidingView,
  Platform,
  RefreshControl,
  ScrollView,
  StyleSheet,
  TouchableWithoutFeedback,
  View,
} from 'react-native';

import { Block, Button, Text, theme } from 'galio-framework';
import QuantityCounterWithInput from '@components/QuantityCounterWithInput';
import nowTheme from '@constants/Theme';
import { connect } from 'react-redux';
import { updateProducts } from '@core/module/store/cart/cart';
import { ProductCart } from '@core/services/product-cart.service';
import { FormatMoneyService } from '@core/services/format-money.service';
import LoadingComponent from '@custom-elements/Loading';
import FavoriteIcon from '@custom-elements/FavoriteIcon';
import { updatePreOrder } from '@core/module/store/cart/preCart';
import { GeneralRequestService } from '../core/services/general-request.service';
import { endPoints } from '../shared/dictionaries/end-points';

const generalRequestService = GeneralRequestService.getInstance();

const { width } = Dimensions.get('window');
const sizeConstantSmall =
  Platform.OS === 'ios'
    ? Dimensions.get('window').height < 670
      ? 14
      : 16
    : Dimensions.get('window').height < 870
      ? 14
      : 16;
const sizeConstantBig =
  Platform.OS === 'ios'
    ? Dimensions.get('window').height < 670
      ? 20
      : 24
    : Dimensions.get('window').height < 870
      ? 20
      : 24;

class Product extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedSize: null,
      hideMyPrice: false,
      productDetail: null,
      cantProduct: 1,
      refreshing: false,
    };

    this.productCart = ProductCart.getInstance(props?.cartProducts);
    this.formatMoney = FormatMoneyService.getInstance();
  }

  componentDidMount() {
    this.setState({
      hideMyPrice: this.props.route?.params?.hideMyPrice,
      productDetail: this.props.route?.params?.product,
    });

    this.focusListener = this.props.navigation.addListener("focus", () => {
      this.updateCuantity()
    });
  }

  componentWillUnmount() {
    this.focusListener;
  }

  updateCuantity () {
    if (this.props?.cartProducts.some((element) => element.id === this.props.route?.params?.product.id)) {
      let index = this.props?.cartProducts.findIndex((element) => element.id === this.props.route?.params?.product.id)
      this.setState({
        cantProduct: this.props.cartProducts[index].quantity,
      });
    }
  }

  fetchProductDetails = async (productId) => {
    try {
      const urlPetition = endPoints.product.replace(":id", productId)
      const productDetail = await generalRequestService.get(urlPetition);
      this.setState({ productDetail });
    } catch (error) {
      console.error('Error fetching product:', error);
    }
  };

  handleRefresh = async () => {
    const { productDetail } = this.state;
    this.setState({ refreshing: true });
    await this.fetchProductDetails(productDetail.id);
    this.setState({ refreshing: false });
  };

  onAddCartPressed = (productItem) => {
    const priceProduct = this.state.hideMyPrice ? productItem?.rrp : productItem?.cost_price;

    if (this.props?.cartProducts.some((element) => element.id === productItem.id)) {
      let sum = this.productCart.quantity ? this.productCart.quantity + this.state.cantProduct : this.state.cantProduct;
      const newArrayCant = this.productCart.updateCant(productItem.sku, sum);
      this.props.updateProducts(newArrayCant);
      return;
    }
    const addProduct = {
      ...productItem,
      quantity: this.state.cantProduct,
      price: parseFloat(priceProduct).toFixed(2),
    };
    this.productCart.addCart(addProduct, this.props.updateProducts);
  };

  handleUpdateDataProduct = (newDataProduct) => {
    this.setState({ productDetail: newDataProduct })
    this.props.route?.params?.updateProducts()
  }

  render() {
    const { productDetail } = this.state;

    if (!productDetail) {
      return <LoadingComponent />;
    }

    return (
      <KeyboardAvoidingView behavior="position" keyboardVerticalOffset={120} style={styles.product}>
        <ScrollView
          refreshControl={<RefreshControl refreshing={this.state.refreshing} onRefresh={this.handleRefresh} />}
        >
          <Block
            row
            flex
            style={{
              backgroundColor: nowTheme.COLORS.BACKGROUND,
              height: 25,
              alignItems: 'center',
              justifyContent: Platform.OS == 'android' ? 'space-between' : 'space-evenly',
            }}
          ></Block>

          <Block flex>
            <TouchableWithoutFeedback>
              <Image
                resizeMode="contain"
                source={{ uri: productDetail.cover_image }}
                style={{ width: width * 0.95, height: width * 0.8 }}
              />
            </TouchableWithoutFeedback>
          </Block>
          <Block flex style={styles.options}>
            <Block
              style={{
                paddingHorizontal: theme.SIZES.BASE,
                paddingTop: theme.SIZES.BASE,
              }}
            >
              <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 24 }} >
                <FavoriteIcon
                  product={productDetail}
                  updateProduct={(newDataProduct) => this.handleUpdateDataProduct(newDataProduct)}
                />
                <Text
                  size={
                    Platform.OS === 'ios'
                      ? Dimensions.get('window').height < 670
                        ? 20
                        : 23
                      : Dimensions.get('window').height < 870
                        ? 20
                        : 23
                  }
                  style={{  fontWeight: '500', textAlign: 'left' }}
                >

                  {productDetail?.name}
                </Text>

              </View>
              <Block row style={{ width: '100%' }}>
                <Block flex>
                  <Text color={nowTheme.COLORS.LIGHTGRAY} style={styles.priceGrayText}>
                    Price
                  </Text>
                  <Text
                    style={{ fontFamily: 'montserrat-bold' }}
                    color={nowTheme.COLORS.ORANGE}
                    size={sizeConstantBig}
                  >
                    {this.formatMoney.format(productDetail.rrp)}
                  </Text>
                </Block>
                {!this.state.hideMyPrice && (
                  <>
                    <View
                      style={{
                        borderWidth: 0.5,
                        marginHorizontal: 10,
                        height: '100%',
                        borderColor: nowTheme.COLORS.LIGHTGRAY,
                      }}
                    ></View>
                    <Block flex right>
                      <Text
                        color={nowTheme.COLORS.LIGHTGRAY}
                        style={(styles.priceGrayText, { right: 5 })}
                      >
                        My Price
                      </Text>
                      <Text
                        style={{ fontFamily: 'montserrat-bold' }}
                        color={nowTheme.COLORS.ORANGE}
                        size={sizeConstantBig}
                      >
                        {this.formatMoney.format(productDetail?.cost_price)}
                      </Text>
                    </Block>
                  </>
                )}
              </Block>
            </Block>
            <View style={styles.grayLine} />
            <Block style={{ padding: theme.SIZES.BASE }}>
              <Text style={{ paddingBottom: 15 }} size={16}>
                Details Product
              </Text>
              <Block row style={{ paddingBottom: 15 }}>
                <Block flex>
                  <Text color={nowTheme.COLORS.LIGHTGRAY} style={styles.priceGrayText}>
                    SKU
                  </Text>
                  <Text color={nowTheme.COLORS.INFO} size={sizeConstantSmall}>
                    {productDetail?.sku}
                  </Text>
                </Block>
              </Block>
            </Block>
          </Block>
        </ScrollView>
        <View style={styles.quantityBar}>
          <QuantityCounterWithInput
            product
            quantity={this.state.cantProduct}
            quantityHandler={(cant) => this.setState({ cantProduct: cant })}
          />
          <Button
            shadowless
            style={styles.addToCart}
            color={nowTheme.COLORS.INFO}
            onPress={() => this.onAddCartPressed(productDetail)}
          >
            <Text size={18} color={nowTheme.COLORS.WHITE}>
              Add to Cart
            </Text>
          </Button>
        </View>
      </KeyboardAvoidingView>
    );
  }
}

const styles = StyleSheet.create({
  product: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 0,
  },
  grayLine: {
    marginTop: '5%',
    height: 4,
    width: width,
    backgroundColor: nowTheme.COLORS.BACKGROUND,
    marginHorizontal: -theme.SIZES.BASE,
  },
  priceGrayText: {
    fontSize: 14
  },
  options: {
    position: 'relative',
    marginHorizontal: theme.SIZES.BASE * 0.6,
    marginTop: -theme.SIZES.BASE,
    backgroundColor: theme.COLORS.WHITE,
  },
  dots: {
    borderRadius: 20,
    height: 7,
    width: 7,
    margin: 5,
    backgroundColor: 'black',
  },
  addToCart: {
    width: width * 0.5,
  },
  quantityBar: {
    paddingTop: Platform.OS == 'ios' ? 0 : 3,
    backgroundColor: "white",
    flexDirection: 'row',
    width: width,
    alignItems: 'center',
    justifyContent: 'space-evenly',
    shadowColor: 'black',
    shadowOffset: { width: 0, height: 7 },
    elevation: 2,
    shadowRadius: 10,
    shadowOpacity: 0.3,
    borderTopColor: 'black',
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
  },
});

const mapStateToProps = (state) => ({
  cartProducts: state.productsReducer.products,
});

const mapDispatchToProps = { updateProducts, updatePreOrder };

export default connect(mapStateToProps, mapDispatchToProps)(Product);
