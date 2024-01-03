import Qas from "../../model/qasModels";

type UpdateFields = {
  qas_create_date: Date;
  qas_update_date?: Date;
}

const postponeQas = async (nYears: number = 1) => {
  const qasDocuments = await Qas.find();

  for (const qasDocument of qasDocuments) {
    const updateFields: UpdateFields = {
      qas_create_date: new Date(qasDocument.qas_create_date.setFullYear(qasDocument.qas_create_date.getFullYear() + nYears))
    };

    if (qasDocument.qas_update_date) {
      updateFields.qas_update_date = new Date(qasDocument.qas_update_date.setFullYear(qasDocument.qas_update_date.getFullYear() + nYears));
    }

    const newQas = await Qas.findByIdAndUpdate(qasDocument._id, updateFields, { new: true });

    if (!newQas) {
      console.log('更新 Qas 失敗');
    } else {
      console.log('更新 Qas 成功');
    }
  }
}

export {
  postponeQas
};