import { useQuery } from 'react-query';
import { queryKey, getCategoriesService } from './categories.service'

export const useGetCategories = () => useQuery({
  queryKey: queryKey.get_categories,
  queryFn: () => getCategoriesService(),
})
