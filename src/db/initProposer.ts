import UserProposer from "../model/userProposerModels";
import { proposers } from "./data/proposer"

const initProposers = async () => {
  try {
    await UserProposer.deleteMany();
    await UserProposer.insertMany(proposers);
    console.log('User資料初始化成功');
  } catch (err) {
    console.error('User資料初始化失敗', err);
  }
};

export {
  initProposers
};