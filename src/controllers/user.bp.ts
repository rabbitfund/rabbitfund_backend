import validator from "validator";
import { User, UserRole } from "../model/userModels";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
// todo: mix http status code and busincess logic error code is not a good practice.
import createError from "http-errors";

type UserSignUpInput = {
  email: string; //must
  pass: string; //must
  name: string; //must
  method: number; //must
  oauth_google_id: string;
  cover?: string;
  phone?: string;
  intro?: string;
  website?: string;
  interests?: string[];
};

const verifyUserSignUpData = (data: UserSignUpInput): boolean => {
  return (
    !isEmpty(data.email) &&
    validator.isEmail(data.email) &&
    !isEmpty(data.name) &&
    validator.isLength(data.name, { min: 2, max: 10 }) &&
    ((data.method === 0 &&
      !isEmpty(data.pass) &&
      validator.isLength(data.pass, { min: 8 })) ||
      (data.method === 1 &&
        !isEmpty(data.oauth_google_id) &&
        !validator.isEmpty(data.oauth_google_id))) &&
    (data.cover ? validator.isURL(data.cover) : true) &&
    (data.phone ? validator.isMobilePhone(data.phone, "zh-TW") : true) &&
    (data.intro
      ? validator.isLength(data.intro, { min: 10, max: 100 })
      : true) &&
    (data.website ? validator.isURL(data.website) : true)
  );
};

async function doSignUp(data: UserSignUpInput) {
  const newUser = await User.create({
    user_email: data.email,
    user_hash_pwd: bcrypt.hashSync(data.pass || "", 12),
    user_name: data.name,
    user_roles: [UserRole.SUPPORTER],
    login_method: [data.method],
    oauth_google_id: data.oauth_google_id || "",
    user_cover: data.cover || "",
    user_phone: data.phone || "",
    user_intro: data.intro || "",
    user_website: data.website || "",
    user_interests: data.interests || [],
  });
  const {
    user_hash_pwd: _,
    user_roles: __,
    user_create_date: ___,
    ...user
  } = newUser.toObject();

  return user;
}

type UserLogInInput = {
  method: number;
  email: string;
  pass: string;
  oauth_google_id: string;
  forget: boolean;
  name?: string;
};
function verifyUserLogInData(data: UserLogInInput): boolean {
  return (
    (data.method === 0 &&
      !isEmpty(data.email) &&
      validator.isEmail(data.email) &&
      !isEmpty(data.pass) &&
      validator.isLength(data.pass, { min: 8 })) ||
    (data.method === 1 &&
      !isEmpty(data.email) &&
      validator.isEmail(data.email) &&
      !isEmpty(data.oauth_google_id) &&
      !validator.isEmpty(data.oauth_google_id))
  );
}
async function doLogIn(data: UserLogInInput) {
  // find user by email
  // validate password
  // generate JWT token

  let user = await User.findOne({ user_email: data.email }).select({
    _id: 1,
    user_name: 1,
    user_hash_pwd: 1,
    user_roles: 1,
    oauth_google_id: 1,
  });
  if (!user && data.method === 1) {
    user = await doSignUp(data as UserSignUpInput) as any
    if (!user) {
      throw createError(401, "Google帳號註冊失敗");
    }
  } else if (!user) {
    // throw new Error("帳號或密碼錯誤");
    throw createError(401, "帳號或密碼錯誤");
  }
  if (data.method === 0) {
    const match = bcrypt.compareSync(data.pass, user.user_hash_pwd);
    if (!match) {
      throw createError(401, "帳號或密碼錯誤");
    }
  }
  if (data.method === 1) {
    if (user.oauth_google_id !== data.oauth_google_id) {
      throw createError(401, "帳號或密碼錯誤");
    }
  }
  
  const jwtToken = jwt.sign(
    {
      id: user._id,
      email: data.email,
      roles: user.user_roles,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: "1h",
    }
  );

  return {
    uid: user._id,
    name: user.user_name,
    email: data.email,
    token: jwtToken,
    expired: 3600, // 1 hour
  };
}
async function doGetMeUser(userId: string) {
  const user = await User.findById(userId).select({
    user_hash_pwd: 0,
  });
  if (!!user) {
    return user;
  }
  // throw new Error("找不到會員");
  throw createError(400, "找不到會員");
}

type UserUpdateInput = {
  name: string; //must
  cover: string;
  phone: string;
  intro: string;
  website: string;
  interests: string[];
};
function verifyUserUpdateData(data: UserUpdateInput): boolean {
  return (
    !isEmpty(data.name) &&
    validator.isLength(data.name, { min: 2, max: 10 }) &&
    (data.cover ? validator.isURL(data.cover) : true) &&
    (data.phone ? validator.isMobilePhone(data.phone, "zh-TW") : true) &&
    (data.intro
      ? validator.isLength(data.intro, { min: 10, max: 100 })
      : true) &&
    (data.website ? validator.isURL(data.website) : true)
  );
}

async function doUpdateMeUser(userId: string, data: UserUpdateInput) {
  const newestUser = await User.findByIdAndUpdate(
    userId,
    {
      user_name: data.name,
      user_cover: data.cover || "",
      user_phone: data.phone || "",
      user_intro: data.intro || "",
      user_website: data.website || "",
      user_interests: data.interests || [],
    },
    { new: true }
  );
  if (!newestUser) {
    // throw new Error("找不到會員");
    throw createError(400, "找不到會員");
  }

  const { user_hash_pwd: _, ...user } = newestUser.toObject();

  return user;
}

const isEmpty = (text: string): boolean => {
  return text ? false : true;
};

export {
  UserSignUpInput,
  UserLogInInput,
  UserUpdateInput,
  doSignUp,
  doLogIn,
  doGetMeUser,
  doUpdateMeUser,
  verifyUserSignUpData,
  verifyUserLogInData,
  verifyUserUpdateData,
};
