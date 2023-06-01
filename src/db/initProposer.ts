import UserProposer from "../model/userProposerModels";
// import { proposers } from "./data/proposer"
import * as fs from 'fs';

const initProposers = async () => {
  const data = fs.readFileSync("./src/db/data/proposer.json", "utf-8");
  const proposers = JSON.parse(data);
  try {
    await UserProposer.deleteMany();
    await UserProposer.insertMany(proposers);
    console.log('Proposer資料初始化成功');
  } catch (err) {
    console.error('Proposer資料初始化失敗', err);
  }
};

export {
  initProposers
};