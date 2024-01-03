import Order from "../../model/orderModels";

type UpdateFields = {
  order_create_date: Date;
  order_shipping_date?: Date;
  order_final_date?: Date;
}

const postponeOrder = async (nYears: number = 1) => {
  const orderDocuments = await Order.find();

  for (const orderDocument of orderDocuments) {
    const updateFields: UpdateFields = {
      order_create_date: new Date(orderDocument.order_create_date.setFullYear(orderDocument.order_create_date.getFullYear() + nYears))
      
    };

    if (orderDocument.order_shipping_date) {
      updateFields.order_shipping_date = new Date(orderDocument.order_shipping_date.setFullYear(orderDocument.order_shipping_date.getFullYear() + nYears));
    }

    if (orderDocument.order_final_date) {
      updateFields.order_final_date = new Date(orderDocument.order_final_date.setFullYear(orderDocument.order_final_date.getFullYear() + nYears));
    }

    const newOrder = await Order.findByIdAndUpdate(orderDocument._id, updateFields, { new: true });

    if (!newOrder) {
      console.log('更新 Order 失敗');
    } else {
      console.log('更新 Order 成功');
    }
  }
}

export {
  postponeOrder
};