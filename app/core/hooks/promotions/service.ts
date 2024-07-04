import { GeneralRequestService } from '@core/services/general-request.service';
import { endPoints } from '@shared/dictionaries/end-points';

const generalRequestService = GeneralRequestService.getInstance()

export const getPromotionsService = async ()=> {
  const response = await generalRequestService.get(endPoints.promotions)
  return Promise.resolve(response)
}

export const queryKey = {
  get_promotions: 'get_promotions'
}
