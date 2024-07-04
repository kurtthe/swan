import { useQuery } from 'react-query';
import { getPromotionsService, queryKey } from '@core/hooks/promotions/service';

export const useGetPromotion = () => useQuery({
  queryKey: queryKey.get_promotions,
  queryFn: () => getPromotionsService(),
})
