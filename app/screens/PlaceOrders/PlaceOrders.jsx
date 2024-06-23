import React from 'react';
import { ScrollView } from 'react-native';
import { Block } from 'galio-framework';
import { styles } from './PlaceOrders.styles';
import { useSelector, useDispatch } from 'react-redux';
import { clearProducts } from '@core/module/store/cart/cart';
import DetailOrders from '@custom-sections/place-order/DetailsOrders';
import { JobsForm, DeliveryForm, StoreForm } from './components';
import { useNavigation } from '@react-navigation/native';
import { GeneralRequestService } from '@core/services/general-request.service';
import { endPoints } from '@shared/dictionaries/end-points';
import { clear } from '@core/module/store/placeOrders/placeOrders';
import { getSupplierId } from '@core/hooks/getSupplierId.service';
import Restricted from '../../custom-elements/Restricted';
import { getDataPlaceOrder, isFieldEmpty } from './utils';

const generalRequest = GeneralRequestService.getInstance();

const PlaceOrders = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const cartProducts = useSelector((state) => state.productsReducer.products);
  const userEmail = useSelector((state) => state.loginReducer.email);
  const dataOrder = useSelector((state) => state.placeOrderReducer);
  const restricted = useSelector((state) => state.productsReducer.restricted);

  const [dataFieldsValidations, setDataFieldsValidation] = React.useState([]);

  const serializeItems = () => {
    if (cartProducts.length === 0) {
      return [];
    }

    return cartProducts.map((item) => ({
      sku: item.sku,
      quantity: item.quantity,
      tax: [
        {
          name: 'GST',
          rate: 10,
        },
      ],
    }));
  };

  const verifyFields = React.useCallback(() => {
    const someWithOutValue = dataFieldsValidations.some((item) => !item.value || item.value === '');
    const { name, nameStore, delivery_instructions, idStore } = dataOrder;
    const { delivery, date, time } = delivery_instructions;

    const requiredFields = [
      { field: name, message: 'Name is required' },
      { field: nameStore, message: 'Name store is required' },
      { field: delivery, message: 'Delivery is required' },
      { field: date, message: 'Date is required' },
      { field: time, message: 'Time is required' },
    ];

    for (const { field, message } of requiredFields) {
      if (isFieldEmpty(field)) {
        alert(message);
        return true;
      }
    }

    if (someWithOutValue) {
      alert('Fill in the required data *');
      return true;
    }

    return false;

  }, [dataFieldsValidations, dataOrder]);

  const placeOrderHandler = React.useCallback(async () => {
    const supplierId = await getSupplierId();
    const items = serializeItems();
    const missingFields = verifyFields();

    if (missingFields) return
    const data = getDataPlaceOrder(dataOrder, supplierId, items)
    const placedOrder = await generalRequest.put(endPoints.generateOrder, data);

    if (placedOrder) {
      await handleOrderShare(placedOrder.order.id);
      resetFields();
      dispatch(clearProducts());
      navigation.navigate('OrderPlaced', { placedOrder: placedOrder.order });
    }
  }, [dataOrder]);

  const resetFields = () => {
    dispatch(clear());
  };

  const handleOrderShare = async (id) => {
    const data = {
      emails: [
        'steveb@trak.co',
        'owenm@trak.co',
        'markm@trak.co',
        'swan.orders@trak.co',
        userEmail,
        dataOrder.emailStore,
      ],
      message:
        'Thanks for placing an order with Swan Plumbing Supplies. Please contact the Swan team 1800 571 060 if you have any queries. Regards, Swan Plumbing Supplies',
    };

    const url = endPoints.shareOrder.replace(':id', id);
    const shareOrder = await generalRequest.post(url, data);
    console.log('shareOrder::', shareOrder, url, data);
  };

  // const changesValidationsField = (newDataFields) => {
  //   setDataFieldsValidation(newDataFields);
  // };

  if (dataOrder?.restricted || restricted) {
    return <Restricted />;
  }

  return (
    <ScrollView>
      <Block flex center style={styles.cart}>
        <Block center>
          <JobsForm />
          <DeliveryForm />
          <StoreForm />
          <DetailOrders cartProducts={cartProducts} orderHandler={placeOrderHandler} />
        </Block>
      </Block>
    </ScrollView>
  );
};

export default PlaceOrders;
