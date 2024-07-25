import React, { useEffect, useState } from 'react';
import {View} from 'react-native';
import { BottomSheet, BottomSheetRef } from 'react-native-sheet';
import FilterButton from '@components/FilterButton';
import {AlertService} from '@core/services/alert.service';

import {makeStyles} from './Filters.styles'
import {useGetCategories} from '@core/hooks/Categories'
import {nowTheme} from '@constants';

import {
  selectedCategory,
  toggleFavorites,
  reset,
  toggleLoading
} from '@core/module/store/filter/filter';

import {useSelector, useDispatch} from 'react-redux';
import ListRadioButton from '@custom-sections/ListProducts/components/ListRadioButton';
import { sortNameCategories } from '@shared/dictionaries/sort';

export const FilterProducts = () => {
  const dispatch = useDispatch();
  const categoryParentSelected = useSelector((state: any) => state.filterReducer.categorySelected)
  const favoriteFilter = useSelector((state: any) => state.filterReducer.onlyFavourites)
  const dataProducts = useSelector((state: any)=> state.filterReducer.products)
  const isLoadingFilter = useSelector((state: any) => state.filterReducer.isLoading)
  const restricted = useSelector((state: any) => state.filterReducer.restricted)
  const productCount = useSelector((state) => state.filterReducer.productCount)


  const alertService = new AlertService()
  const [categories, setCategories] = useState<any[]>([])
  const [subCategories, setSubCategories] = useState<any[]>([])
  const [categoryActive, setCategoryActive] = useState(categoryParentSelected !== '')
  const [subCategoryActive, setSubCategoryActive] = useState(false)
  const [noSubCategoriesFound, setNoSubCategoriesFound] = useState(false)
  const [subCategorySelected, setSubCategorySelected] = useState<undefined | any>(undefined)

  const bottomSheetCategoriesRef = React.createRef<BottomSheetRef>()
  const bottomSheetSubCategoriesRef = React.createRef<BottomSheetRef>()

  const styles = makeStyles()

  const {
    data: listCategories,
    isLoading
  } = useGetCategories();

  const validateIfSelected = (category) => {
    if (categoryParentSelected === category.id) {
      setCategoryActive(true)
      setNoSubCategoriesFound(category?.sub_categories?.length === 0)
      const subCategoriesSerialized = categoriesToRadioButton(category?.sub_categories)
      if(!subCategoriesSerialized) return
      setSubCategories(subCategoriesSerialized)
      return true;
    }
    return false;
  }



  const categoriesToRadioButton = (categoriesList = []) => {
    if(!categoriesList || !categoriesList.length) return [];

    return categoriesList
      .sort(sortNameCategories)
      .map((category) => ({
        ...category,
        color: nowTheme.COLORS.INFO,
        labelStyle: {fontWeight: 'bold'},
        label: category.name,
        value: category.name,
        containerStyle: styles.styleRadio,
        selected: (categoryParentSelected) ? validateIfSelected(category) : false,
      }));
  }

  const initialCategories = (categoriesGet) => {
    const categoriesSerialized = categoriesToRadioButton(categoriesGet)
    if(!categoriesSerialized) return;
    setCategories(categoriesSerialized)
  }

  useEffect(() => {
    if(!listCategories || listCategories.length === 0) return;
      initialCategories(listCategories)
  }, [listCategories])

  const handleShowSubCategories = () => {
    if (noSubCategoriesFound) {
      alertService.show('Alert!', 'No sub categories found');
      return;
    }
    bottomSheetSubCategoriesRef.current?.show();
  }


  const onPressRadioButtonCategory = (optionSelected: any) => {
    dispatch(selectedCategory(optionSelected.id))

    if (optionSelected.sub_categories?.length === 0) {
      setNoSubCategoriesFound(true)
      alertService.show(
        'Alert!',
        `Category ${optionSelected.name?.toLowerCase()} haven't subCategories`,
      );
      return
    }

    const subCategoriesSerialized = categoriesToRadioButton(optionSelected?.sub_categories)
    if(!subCategoriesSerialized) return;
    setSubCategories(subCategoriesSerialized)

    dispatch(toggleLoading(true))
    setCategoryActive(true)
    setNoSubCategoriesFound(false)
    bottomSheetCategoriesRef.current?.hide()
  };

  const onPressRadioButtonSubCategory = (optionSelected: any) => {
    setSubCategorySelected(optionSelected)
    setSubCategoryActive(true)
    bottomSheetSubCategoriesRef.current?.hide();
  }

  const clearFilterSelected = (listData = []) => {
    return listData.map((item) => ({
      ...item,
      selected: false,
    }));
  };

  const handleResetFilter = () => {
    setCategories(clearFilterSelected(categories))
    setSubCategories(clearFilterSelected(subCategories))
    setSubCategorySelected(undefined)
    setCategoryActive(false)
    setSubCategoryActive(false)
    dispatch(reset())
    dispatch(toggleLoading(true))
  };

  const handleToggleFavorite = () => {
    dispatch(toggleFavorites())
    dispatch(toggleLoading(true))
  }

  if(favoriteFilter && dataProducts.length === 0 && !isLoadingFilter && categoryParentSelected !== ''){
    alertService.show(
      'Alert!',
      `There are not favorite products for this category`,
    );
  }

  if(restricted) {
    return <View style={styles.container} />
  }

  return (
    <>
      <View style={styles.container}>
        <View style={styles.contentFilters}>
          <FilterButton
            text={'Category'}
            onPress={() => bottomSheetCategoriesRef.current?.show()}
            isActive={categoryActive}
            isLoading={isLoading}
            disabled={isLoadingFilter}
          />

          {categoryActive && (
            <FilterButton
              text='Sub Category'
              onPress={() => handleShowSubCategories()}
              isActive={subCategoryActive}
              disabled={isLoadingFilter}
            />
          )}

          <FilterButton
            text={'Favourite'}
            onPress={() => handleToggleFavorite()}
            nameIcon={!favoriteFilter ? 'staro' : 'star'}
            sizeIcon={15}
            disabled={isLoadingFilter}
          />

          {/* <FilterButton
            text={`${productCount}`}
            disabled={true}
          /> */}

          {categoryActive && (
            <FilterButton
              text=''
              onPress={() => handleResetFilter()}
              icon={require('@assets/nuk-icons/png/2x/clear.png')}
              disabled={isLoadingFilter}
            />
          )}
        </View>
      </View>

      <BottomSheet height={500} ref={bottomSheetCategoriesRef}>
        <ListRadioButton
          onChange={(option) => onPressRadioButtonCategory(option)}
          options={categories}
          idSelected={categoryParentSelected}
        />
      </BottomSheet>

      <BottomSheet height={500} ref={bottomSheetSubCategoriesRef}>
        <ListRadioButton
          onChange={(option) => onPressRadioButtonSubCategory(option)}
          options={subCategories}
          idSelected={subCategorySelected?.id}
        />
      </BottomSheet>
    </>
  );
};

