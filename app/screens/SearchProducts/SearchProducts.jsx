import React, { useEffect, useState, useMemo } from 'react';
import { View, FlatList, Text, Pressable } from 'react-native';
import { useSelector } from 'react-redux';
import debounce from 'lodash.debounce';

import Search from '@custom-elements/Search';
import { useGetProducts } from '@core/hooks/Products';
import { makeStyles } from './SearchProducts.styles';
import Product from '@custom-elements/Product';
import ButtonLoadingMore from '@custom-elements/ButtonLoadingMore';
import LoadingComponent from '@custom-elements/Loading';
import { nowTheme } from '@constants';
import { Icon } from '../../components';

export const SearchProducts = ({ route }) => {
  const { text: textSearchHome } = route.params;
  const categorySelected = useSelector((state) => state.filterReducer.categorySelected);
  const clientFriendly = useSelector((state) => state.productsReducer.clientFriendly);
  
  const [dataProducts, setDataProducts] = useState([]);
  const [textSearch, setTextSearch] = useState('');
  const [empty, setEmpty] = useState(true);
  const [keeData, setKeepData] = useState(false);
  const [showLoadingMore, setShowLoadingMore] = useState(false);
  const [loadingData, setLoadingData] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [totalProducts, setTotalProducts] = useState(0);
  const [optionsProducts, setOptionsProducts] = useState({
    page: 1,
    search: textSearchHome || '',
    category_id: categorySelected,
  });

  const { data: products, refetch } = useGetProducts(optionsProducts);
  const styles = makeStyles();

  useEffect(() => {
    if (optionsProducts.page === 1) {
      setLoadingData(true);
    } else {
      setLoadingMore(true);
    }
    refetch();
  }, [optionsProducts.page, optionsProducts.search, optionsProducts.category_id]);

  useEffect(() => {
    setLoadingData(true);
    setTextSearch(textSearchHome);
    handleSearch(textSearchHome);
  }, [textSearchHome]);

  useEffect(() => {
    const updateListProducts = (newProducts) => {
      setLoadingData(false);
      setLoadingMore(false);

      if (keeData) {
        setDataProducts((prevData) => [...prevData, ...newProducts]);
        return;
      }
      setDataProducts(newProducts);
    };

    if (products) {
      updateListProducts(products?.body);
    }
  }, [products]);

  useEffect(() => {
    if (products?.headers) {
      setShowLoadingMore(optionsProducts.page < products.headers['x-pagination-page-count']);
    }

    const totalProductsData = parseInt(products?.headers['x-pagination-total-count'], 10);
    const formattedTotalProducts = totalProductsData.toLocaleString('en-US');
    setTotalProducts(formattedTotalProducts);

  }, [products?.headers, optionsProducts.page]);

  useEffect(() => {
    if (textSearchHome) {
      handleSearch(textSearchHome);
    }
  }, [textSearchHome]);

  const changeText = (text) => {
    setKeepData(false);
    setOptionsProducts({
      ...optionsProducts,
      page: 1,
      search: text,
    });
    setEmpty(text === '');
  };

  const handleLoadingMore = () => {
    setOptionsProducts((prevOptions) => ({
      ...prevOptions,
      page: prevOptions.page + 1,
    }));
    setKeepData(true);
  };

  const getButtonLoadingMore = () => {
    if (showLoadingMore && dataProducts.length > 10) {
      return <ButtonLoadingMore loading={loadingMore} handleLoadMore={handleLoadingMore} />;
    }
    return null;
  };

  const getProductCounter = () => {
    if (totalProducts > 0) {
      return (
        <View style={{ padding: 10, flexDirection: 'row' }}>
          <Text style={{ fontSize: 20, color: nowTheme.COLORS.INFO }}>{totalProducts + ' '}</Text><Text style={{ fontSize: 20 }}>Products</Text>
        </View>
      )
    }
    
  }

  const handleSearch = (text) => {
    if (text) {
      changeText(text);
    }
    
  };

  const renderItem = ({ item }) => (
    <Product product={item} myPrice={clientFriendly} />
  );

  const memoizedValue = useMemo(() => renderItem, [dataProducts, clientFriendly]);

  const renderNotFound = () => (
    <View style={styles.notfound}>
      <Text style={styles.textNotFount}>No results found for search.</Text>
    </View>
  );

  const putContent = () => {
    if (loadingData) {
      return (
        <View style={{ flex: 1 }}>
          <LoadingComponent size='large' />
        </View>
      );
    }
    return (
      <FlatList
        data={dataProducts}
        renderItem={memoizedValue}
        keyExtractor={(item, index) => `${item.sku}-${index}`}
        numColumns={2}
        contentContainerStyle={styles.container}
        ListHeaderComponent={getProductCounter}
        ListFooterComponent={getButtonLoadingMore}
        ListEmptyComponent={renderNotFound}
      />
    );
  };

  return (
    <View style={{ flex: 1, backgroundColor: nowTheme.COLORS.BACKGROUND }}>
      <Search
        placeholder="What are you looking for?"
        onChangeText={(text) => setTextSearch(text)}
        onSubmitEditing={({ nativeEvent: { text } }) => changeText(text)}
        value={textSearch}
        style={styles.search}
        inputStyle={{
          color: '#000000',
          borderRadius: 5,
          borderColor: '#D9D9D9',
          borderWidth: 2,
        }}
      />
      <Pressable
        style={{
          height: 48,
          width: 90,
          position: 'absolute',
          backgroundColor: nowTheme.COLORS.INFO,
          right: 15,
          top: 8,
          flex: 1,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          borderBottomRightRadius: 5,
          borderTopRightRadius: 5,
          paddingHorizontal: 10,
        }}
        onPress={() => handleSearch(textSearch)}
      >
        <Icon
          family="NowExtra"
          size={15}
          name="zoom-bold2x"
          color={'#FFF'}
          style={{ marginHorizontal: 2 }}
        />
        <Text style={{ color: '#fff' }}>Search</Text>
      </Pressable>
      {!empty && putContent()}
    </View>
  );
};