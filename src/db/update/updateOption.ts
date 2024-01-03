import Option from "../../model/optionModels";

type UpdateFields = {
  option_start_date?: Date;
  option_end_date?: Date;
  option_create_date: Date;
  option_update_date?: Date;
}

const postponeOption = async (nYears: number = 1) => {
  const optionDocuments = await Option.find();

  for (const optionDocument of optionDocuments) {
    const updateFields: UpdateFields = {
      option_create_date: new Date(optionDocument.option_create_date.setFullYear(optionDocument.option_create_date.getFullYear() + nYears)),
    };

    if (optionDocument.option_start_date) {
      updateFields.option_start_date = new Date(optionDocument.option_start_date.setFullYear(optionDocument.option_start_date.getFullYear() + nYears));
    }

    if (optionDocument.option_end_date) {
      updateFields.option_end_date = new Date(optionDocument.option_end_date.setFullYear(optionDocument.option_end_date.getFullYear() + nYears));
    }

    if (optionDocument.option_update_date) {
      updateFields.option_update_date = new Date(optionDocument.option_update_date.setFullYear(optionDocument.option_update_date.getFullYear() + nYears));
    }

    const newOption = await Option.findByIdAndUpdate(optionDocument._id, updateFields, { new: true });

    if (!newOption) {
      console.log('更新 Option 失敗');
    } else {
      console.log('更新 Option 成功');
    }
  }
}

export {
  postponeOption
};