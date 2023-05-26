import UserProposer from "../model/userProposerModels";
import createError from "http-errors";

//欄位
type ProposerCreateInput = {
  proposer_name: string;
  // proposer_update_date: Date;
  proposer_cover: string;
  proposer_email: string;
  proposer_phone: string;
  proposer_tax_id: string;
  proposer_intro: string;
  proposer_website: string;
};

type ProposerUpdateInput = {
  proposer_name: string;
  // proposer_update_date: Date;
  proposer_cover: string;
  proposer_email: string;
  proposer_phone: string;
  proposer_tax_id: string;
  proposer_intro: string;
  proposer_website: string;
};

//取得提案人資訊
async function doGetProposer(userId: string) {
  const proposers = await UserProposer.find({ proposer_create: userId })
  .exec();

  const totalProposers = [];
  for (let proposer of proposers) {
    const relatedProposers = await UserProposer.find({ ownerInfo: proposer })
    .exec();

    totalProposers.push(proposer, ...relatedProposers);
  }

  return totalProposers;
}

//新增提案人
async function doPostProposer(userId: string, data: ProposerCreateInput) {
  const result = await UserProposer.find(
    { proposer_tax_id: data.proposer_tax_id }).exec();
  if (result.length !== 0) {
    throw createError(400, "已註冊過此統一編號")
  }
  
  const proposer = await UserProposer.create({
    proposer_create: userId,
    proposer_name: data.proposer_name,
    proposer_update_date: Date.now(),
    proposer_cover: data.proposer_cover,
    proposer_email: data.proposer_email,
    proposer_phone: data.proposer_phone,
    proposer_tax_id: data.proposer_tax_id,
    proposer_intro: data.proposer_intro,
    proposer_website: data.proposer_website
  });
  return proposer;
}

//修改提案人資訊
async function doPutProposer(
  userId: string,
  proposerId: string,
  data: ProposerUpdateInput
) {
  const proposer = await UserProposer.findByIdAndUpdate(
    
    { _id: proposerId, proposer_create: userId},
    { proposer_name: data.proposer_name,
      proposer_update_date: Date.now(),
      proposer_cover: data.proposer_cover,
      proposer_email: data.proposer_email,
      proposer_phone: data.proposer_phone,
      proposer_tax_id: data.proposer_tax_id,
      proposer_intro: data.proposer_intro,
      proposer_website: data.proposer_website
    },
    { new: true, runValidators:true  }
  );

  if (!proposer) {
    throw createError(404, "找不到提案人");
  }

  return proposer;
}

//刪除提案人
async function doDeleteProposer(userId: string, proposerId: string) {
  const proposer = await UserProposer.findOneAndDelete({
    _id: proposerId,
    proposer_create: userId
  });

  if (!proposer) {
    throw createError(404, "找不到提案人");
  }

  return proposer;
}


export {
  ProposerCreateInput,
  ProposerUpdateInput,
  doGetProposer,
  doPostProposer,
  doPutProposer,
  doDeleteProposer
};
