import React from 'react'
import { useGetPromotion } from '@core/hooks/promotions';
import LoadingComponent from '@custom-elements/Loading';
import { FlatList } from 'react-native';
import CardPromotion from '@components/CardPromotion';


const Promotions = () => {
  const {data: promotionsList, isFetching} = useGetPromotion();

  if(isFetching){
    return (
      <LoadingComponent />
    )
  }

  const renderItem = ({item}: {item: any})=> {
    return (
      <CardPromotion
        link={item.link}
        title={item.title}
        image={item.preview.image}
        addedDate={item.added_date}
        description={item.description}/>
    )
  }

  return (
    <FlatList
      keyExtractor={(item, index)=> `card-promotion${item.id}-${index}`}
      data={promotionsList}
      renderItem={renderItem}
      scrollEnabled={false}
    />
  )
}

export default Promotions;
