import Qas from "../../model/qasModels";

const postponeQas = async (nYears: number = 1) => {
  // Fetch all documents
  const qasDocuments = await Qas.find();

  for (const qasDocument of qasDocuments) {
    let newQas;
    if (qasDocument.qas_update_date) {
      newQas = await Qas.findByIdAndUpdate(
        qasDocument._id,
        {
          qas_create_date: new Date(qasDocument.qas_create_date.setFullYear(qasDocument.qas_create_date.getFullYear() + nYears)),
          qas_update_date: new Date(qasDocument.qas_update_date.setFullYear(qasDocument.qas_update_date.getFullYear() + nYears))
        },
        { new: true }
      );
    } else {
      newQas = await Qas.findByIdAndUpdate(
        qasDocument._id,
        {
          qas_create_date: new Date(qasDocument.qas_create_date.setFullYear(qasDocument.qas_create_date.getFullYear() + nYears))
        },
        { new: true }
      );
    }

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