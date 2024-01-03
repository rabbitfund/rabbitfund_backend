import UserProposer from "../../model/userProposerModels";

type UpdateFields = {
  proposer_create_date: Date;
  proposer_update_date?: Date;
}

const postponeUserProposer = async (nYears: number = 1) => {
  const proposerDocuments = await UserProposer.find();

  for (const proposerDocument of proposerDocuments) {
    const updateFields: UpdateFields = {
      proposer_create_date: new Date(proposerDocument.proposer_create_date.setFullYear(proposerDocument.proposer_create_date.getFullYear() + nYears))
    };

    if (proposerDocument.proposer_update_date) {
      updateFields.proposer_update_date = new Date(proposerDocument.proposer_update_date.setFullYear(proposerDocument.proposer_update_date.getFullYear() + nYears));
    }

    const newUserProposer = await UserProposer.findByIdAndUpdate(proposerDocument._id, updateFields, { new: true });

    if (!newUserProposer) {
      console.log('更新 UserProposer 失敗');
    } else {
      console.log('更新 UserProposer 成功');
    }
  }
}

export {
  postponeUserProposer
};