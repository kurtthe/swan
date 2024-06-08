import {AlertService} from './alert.service'

export class HttpCommonService {
  constructor() {
    this.alertService = new AlertService()
  }

  handleError(error){
    if(error.response.status === 404 || error.response.status === 200) return;

    if(error.response.status === 0) {
      this.showAlertOffline();
      return
    }
    this.showError(error.response);
  }

  showError(appError, title ="Alert!", message=false) {
    const description = (message)? message: appError.data.message;
    this.alertService.show(title, description);
  }

  showAlertOffline() {
    this.alertService.show('Alert!', 'No connection internet.');
  }
}
