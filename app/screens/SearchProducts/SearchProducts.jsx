import React, { useEffect, useState, useMemo, useCallback, useRef } from 'react';
import { View, FlatList, Text, Pressable } from 'react-native';
import debounce from 'lodash.debounce';

import Search from '@custom-elements/Search';
import { useGetProducts } from '@core/hooks/Products';

import { makeStyles } from './SearchProducts.styles';
import Product from '@custom-elements/Product';
import { useSelector, useDispatch } from 'react-redux';
import ButtonLoadingMore from '@custom-elements/ButtonLoadingMore';
import FilterButton from '@components/FilterButton';
import ListRadioButton from '../../custom-sections/ListProducts/components/ListRadioButton';
import { nowTheme } from '@constants';
import { Icon } from '../../components';

import LoadingComponent from '@custom-elements/Loading';

import { selectedCategory, reset } from '@core/module/store/filter/filter';
import { BottomSheet } from 'react-native-sheet';

import { GeneralRequestService } from '@core/services/general-request.service';
import { endPoints } from '@shared/dictionaries/end-points';
const generalRequestService = GeneralRequestService.getInstance();

export const SearchProducts = ({ route }) => {
  const { text: textSearchHome } = route.params;

  const dispatch = useDispatch();
  const categorySelected = useSelector((state) => textSearchHome ? '' : state.filterReducer.categorySelected);
  const clientFriendly = useSelector((state) => state.productsReducer.clientFriendly);

  const [dataProducts, setDataProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [textSearch, setTextSearch] = useState('');
  const [empty, setEmpty] = useState(true);
  const [keeData, setKeepData] = useState(false);
  const [showLoadingMore, setShowLoadingMore] = useState(false);
  const [loadingData, setLoadingData] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [loadingCategories, setLoadingCategories] = useState(false);
  const [totalProducts, setTotalProducts] = useState(0);
  const [optionsProducts, setOptionsProducts] = useState({
    page: 1,
    search: textSearchHome || '',
    category_id: categorySelected,
  });

  const { data: products, refetch, isFetching, isLoading } = useGetProducts(optionsProducts);
  const bottomSheet = useRef(null);

  const styles = makeStyles();

  useEffect(() => {
    if (categories.length > 0 && categorySelected) {
      const selectedCategory = categories.find((cat) => cat.value === categorySelected);
      if (selectedCategory) {
        handleSelectCategory([selectedCategory]);
      }
    }
  }, [categories, categorySelected]);

  useEffect(() => {
    setLoadingData(true);
    setTextSearch(textSearchHome);
    handleSearch(textSearchHome);
  }, [textSearchHome]);

  const fetchCategories = async () => {
    try {
      setLoadingCategories(true);
      const response = await generalRequestService.getWithHeaders(endPoints.categories, {});
      const categoriesData = response.body;
      initialCategories(categoriesData);
    } catch (error) {
      console.error('Error fetching categories:', error);
    } finally {
      setLoadingCategories(false);
    }
  };

  const validateIfSelected = (category) => {
    if (categoryParentSelected === category.id) {
      setCategoryActive(true);
      setNoSubCategoriesFound(category?.sub_categories?.length === 0);
      const subCategoriesSerialized = categoriesToRadioButton(category?.sub_categories);
      setSubCategories(subCategoriesSerialized);
      return true;
    }
    return false;
  };

  
  const sortNameCategories = (x, y) => {
    const first = x.name?.toLowerCase();
    const second = y.name?.toLowerCase();

    if (first < second) {
      return -1;
    }
    if (first > second) {
      return 1;
    }
    return 0;
  };

  const categoriesToRadioButton = (categoriesList = []) => {
    return categoriesList
      ?.sort(sortNameCategories)
      ?.map((category) => ({
        ...category,
        color: nowTheme.COLORS.INFO,
        labelStyle: { fontWeight: 'bold' },
        label: category.name,
        value: category.id,
        containerStyle: styles.styleRadio,
        selected: categorySelected === category.id,
      }));
  };

  
  const initialCategories = (categoriesGet) => {
    const categoriesSerialized = categoriesToRadioButton(categoriesGet);
    setCategories(categoriesSerialized);
  
    if (categorySelected) {
      const selectedCategory = categoriesSerialized.find((cat) => cat.value === categorySelected);
      if (selectedCategory) {
        handleSelectCategory([selectedCategory]);
      } else {
        console.warn('Selected category not found in categoriesSerialized:', categorySelected);
      }
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  
  useEffect(() => {
    const delay = setTimeout(() => {
      optionsProducts.page === 1 && setLoadingData(true);
      optionsProducts.page > 1 && setLoadingMore(true);
      refetch();
    }, 500);

    return () => {
      clearTimeout(delay);
    };
  }, [optionsProducts.page, optionsProducts.search, optionsProducts.category_id]);

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

  const changeText = (text) => {
    setKeepData(false);
    setOptionsProducts({
      ...optionsProducts,
      page: 1,
      search: text,
    });
    setEmpty(text === '');
  };

  useEffect(() => {
    if (optionsProducts.page === 1) {
      setLoadingData(true);
    } else {
      setLoadingMore(true);
    }
    refetch();
  }, [optionsProducts.page, optionsProducts.search, optionsProducts.category_id]);

  useEffect(() => {
    if (textSearchHome) {
      handleSearch(textSearchHome);
    }
  }, [textSearchHome]);



  const handleLoadingMore = () => {
    setOptionsProducts((prevOptions) => ({
      ...prevOptions,
      page: prevOptions.page + 1,
    }));
    setKeepData(true);
  };

  const handleShowCategories = () => {
    bottomSheet.current?.show();
  };

const handleSelectCategory = (options) => {
  console.log(options)
  if (!options || !Array.isArray(options)) {
    console.warn('Invalid options passed to handleSelectCategory:', options);
    return;
  }

  const selectedOption = options.find((option) => option.selected);
  if (selectedOption) {
    dispatch(reset());
    dispatch(selectedCategory(selectedOption.value));
    setOptionsProducts({
      ...optionsProducts,
      page: 1,
      category_id: selectedOption.value,
    });
  }
  bottomSheet.current?.hide();
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
      <>
        <View style={styles.container}>
          <View style={styles.contentFilters}>
            <FilterButton
              text="Category"
              onPress={handleShowCategories}
              isLoading={loadingCategories}
              isActive={!!categorySelected}
            />
          </View>
        </View>
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
        <BottomSheet height={500} ref={bottomSheet}>
        <ListRadioButton
  onChange={(option) => {
    console.log('Options received in onChange:', option);
    handleSelectCategory(option);
  }}
  options={categories}
/>
        </BottomSheet>
      </>
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