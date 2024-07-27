import React, { useState, useEffect } from 'react';
import { FlatList, View, Text } from 'react-native';
import LoadingComponent from '@custom-elements/Loading'
import { useSelector, useDispatch } from 'react-redux';
import Product from '@custom-elements/Product';
import { makeStyles } from './Products.styles'
import { useGetProducts } from '@core/hooks/Products'
import ButtonLoadingMore from '@custom-elements/ButtonLoadingMore'
import {
  getProducts,
  nextPage,
  getAllPages,
  setProductCount,
} from '@core/module/store/filter/filter';
import Restricted from '@custom-elements/Restricted';

export const Products = () => {
  const dispatch = useDispatch();

  const clientFriendly = useSelector((state) => state.productsReducer.clientFriendly)
  const dataProducts = useSelector((state) => state.filterReducer.products)
  const categorySelected = useSelector((state) => state.filterReducer.categorySelected)
  const favoriteFilter = useSelector((state) => state.filterReducer.onlyFavourites)
  const restricted = useSelector((state) => state.filterReducer.restricted)
  const page = useSelector((state) => state.filterReducer.page)

  const [loadingMoreData, setLoadingMoreData] = useState(false);
  const [showLoadingMore, setShowLoadingMore] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [totalProducts, setTotalProducts] = useState(0);

  const {
    data: products,
    refetch,
    } = useGetProducts({
    page,
    category_id: categorySelected,
    only_favourite: favoriteFilter
  })
  const styles = makeStyles()

  useEffect(() => {
    setLoadingMoreData(true)
    setTimeout(()=> refetch(), 500)
  }, [page, categorySelected, favoriteFilter])

  useEffect(() => {
    if (products?.headers && products?.headers['x-pagination-page-count']) {
      const currentlyTotal = parseInt(page)
      const newTotalPages = parseInt(products?.headers['x-pagination-page-count']);
      setTotalProducts(parseInt(products?.headers['x-pagination-total-count']));

      setShowLoadingMore(currentlyTotal < newTotalPages);
      if (currentlyTotal !== newTotalPages) {
        dispatch(getAllPages(newTotalPages))
      }
    }
  }, [products?.headers, page])

  useEffect(() => {
    if(!products?.body){
      refetch()
    }

    if(products?.body?.length){
      setIsLoading(false)
      dispatch(getProducts(products?.body))
      dispatch(setProductCount(dataProducts.length));
      setLoadingMoreData(false)
    }

    return () => setIsLoading(true)
  }, [products])

  useEffect(() =>{
    dispatch(setProductCount(dataProducts.length));
  }, [dataProducts.length])

  const renderItem = ({ item }) => {
    return (<Product
      product={item}
      myPrice={clientFriendly}
      updateList={() => refetch()}
    />
    )
  }
  //const memoizedValue = useMemo(() => renderItem, [dataProducts, clientFriendly, categorySelected, favoriteFilter, loadingProducts])
  const handleLoadingMore = () => {
    dispatch(nextPage())
  }

  const getButtonLoadingMore = () => {
    if (showLoadingMore) {
      return <ButtonLoadingMore
        loading={loadingMoreData}
        handleLoadMore={handleLoadingMore}
      />
    }
    return null
  }

  const onRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };

  return (
    <>
      {restricted && <Restricted />}
      {
        isLoading ? (
          <View style={styles.contentLoading}>
            <LoadingComponent size='large' />
          </View>
        ): (
          <>
            <View style={{ padding: 10 }}>
              <Text style={{ fontSize: 15 }}>{totalProducts + ' products'}</Text>
            </View>
            <FlatList
              onRefresh={onRefresh}
              refreshing={refreshing || isLoading}
              data={dataProducts}
              renderItem={renderItem}
              keyExtractor={(item, index) => `${item.sku}-${index}`}
              numColumns={2}
              contentContainerStyle={styles.container}
              ListFooterComponent={getButtonLoadingMore}
              />
          </>
        )
      }

    </>
  );
};
