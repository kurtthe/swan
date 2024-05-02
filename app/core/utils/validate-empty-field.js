import moment from 'moment/moment';

export function validateEmptyField(data = '', isDate = false) {

  const value = data?.trim();

  if (isDate) {
    if (value !== 'N/A') {
      return moment(value).format('DD/MM/YYYY');
    }
  } else {
    if (!value || value === '' || value === null || value === undefined) {
      return 'N/A';
    }
  }

  return value;
}