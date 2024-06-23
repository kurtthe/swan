export * from './setOptionsPicker'

export const isFieldEmpty = (field) => !field || field === '';

export const getDataPlaceOrder = (dataOrder, supplierId, items)=> {
  const date = new Date();
  return {
    data: {
      name: dataOrder.name,
        supplier: supplierId,
        job: dataOrder.job,
        issued_on: date.toISOString('2015-05-14').slice(0, 10),
        swan_store_location_id: dataOrder.idStore,
        description: dataOrder.notes,
        notes: dataOrder.notes,
        tax_exclusive: true,
        sections: [
        {
          items,
          hide_section: false,
          hide_section_price: false,
          hide_section_items: false,
          hide_item_qty: false,
          hide_item_price: false,
          hide_item_subtotal: false,
          hide_item_total: false,
        },
      ],
        delivery_instructions: {
        delivery: dataOrder.delivery_instructions?.delivery,
          location: dataOrder.delivery_instructions.location,
          date: dataOrder.delivery_instructions.date?.value,
          time: dataOrder?.delivery_instructions.value || '12.00 PM',
          contact_number: dataOrder?.delivery_instructions.contact_number,
          contact_name: dataOrder?.delivery_instructions.contact_name,
      },
      // burdens_data: dataFieldsValidations,
    },
  };
}
