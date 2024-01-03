import { User } from '../../model/userModels';

type UpdateFields = {
  user_create_date: Date;
  user_update_date?: Date;
}

const postponeUser = async (nYears: number = 1) => {
  const userDocuments = await User.find();

  for (const userDocument of userDocuments) {
    const updateFields: UpdateFields = {
      user_create_date: new Date(userDocument.user_create_date.setFullYear(userDocument.user_create_date.getFullYear() + nYears))
    };

    if (userDocument.user_update_date) {
      updateFields.user_update_date = new Date(userDocument.user_update_date.setFullYear(userDocument.user_update_date.getFullYear() + nYears));
    }

    const newUser = await User.findByIdAndUpdate(userDocument._id, updateFields, { new: true });

    if (!newUser) {
      console.log('更新 User 失敗');
    } else {
      console.log('更新 User 成功');
    }
  }
}

export {
  postponeUser
};