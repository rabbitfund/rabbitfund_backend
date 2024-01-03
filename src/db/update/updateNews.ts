import News from "../../model/newsModels";

type UpdateFields = {
  news_create_date: Date;
  news_end_date: Date;
  news_start_date?: Date;
  news_update_date?: Date;
}

const postponeNews = async (nYears: number = 1) => {
  // Fetch all documents
  const newsDocuments = await News.find();

  for (const newsDocument of newsDocuments) {
    const updateFields: UpdateFields = {
      news_create_date: new Date(newsDocument.news_create_date.setFullYear(newsDocument.news_create_date.getFullYear() + nYears)),
      news_end_date: new Date(newsDocument.news_end_date.setFullYear(newsDocument.news_end_date.getFullYear() + nYears)),
    };

    if (newsDocument.news_start_date) {
      updateFields.news_start_date = new Date(newsDocument.news_start_date.setFullYear(newsDocument.news_start_date.getFullYear() + nYears))
    }

    if (newsDocument.news_update_date) {
      updateFields.news_update_date = new Date(newsDocument.news_update_date.setFullYear(newsDocument.news_update_date.getFullYear() + nYears))
    }

    const newNews = await News.findByIdAndUpdate(newsDocument._id, updateFields, { new: true });

    if (!newNews) {
      console.log('更新 News 失敗');
    } else {
      console.log('更新 News 成功');
    }
  }
}

export {
  postponeNews
};