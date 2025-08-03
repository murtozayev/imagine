import { hash, compare } from "bcrypt";
import baseError from "../error/base.error.js";
import AUTH from "../models/auth.model.js";
import UserDto from "../utils/dto.js";
import token from "../utils/token.js";
import cookie from "../utils/cookie.js";

export async function signUp(req, res) {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return baseError(res, 400, "Data doesn't full");
    }

    const existUser = await AUTH.findOne({ email });

    if (existUser) {
      return baseError(res, 400, "User already exist");
    }

    const hashPass = await hash(password, 10);

    const newUser = await AUTH.create({ name, email, password: hashPass });

    const userDto = new UserDto(newUser);

    console.log(userDto);

    const token_mrx = token("sign", { ...userDto });

    cookie("save", res, token_mrx);

    return res.status(201).json({ result: newUser });
  } catch (error) {
    return baseError(res, 500, error.message);
  }
}

export async function signIn(req, res) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return baseError(res, 400, "Data doesn't full");
    }

    const user = await AUTH.findOne({ email });

    if (!user) {
      return baseError(res, 404, "User doesn't find");
    }

    const decode_pass = await compare(password, user.password);

    if (!decode_pass) {
      return baseError(res, 400, "Password incorrect");
    }

    const userDto = new UserDto(user);

    const token_mrx = token("sign", { ...userDto });

    cookie("save", res, token_mrx);

    return res.status(200).json({ result: user });
  } catch (error) {
    return baseError(res, 500, error.message);
  }
}

export async function signOut(req, res) {
  try {
    const { mrx_token } = req.cookies;

    if (!mrx_token) {
      return baseError(res, 400, "User already signed out");
    }
    cookie("clear", res);

    return res.status(200).json({ result: "See you next time" });
  } catch (error) {
    return baseError(res, 500, error.message);
  }
}

export default async function check(req, res) {
  try {
    const { mrx_token } = req.cookies;

    if (!mrx_token) {
      return baseError(res, 401, "User unauthorized");
    }

    const decode = token("verify", mrx_token);

    if (!decode) {
      return baseError(res, 401, "User unauthorized");
    }

    const user = await AUTH.findOne({ email: decode.email });

    if (!user) {
      return baseError(res, 401, "User unauthorized");
    }

    const userDto = new UserDto(user);

    const token_mrx = token("sign", { ...userDto });

    cookie("save", res, token_mrx);

    return res.status(200).json({ result: user });
  } catch (error) {
    return baseError(res, 500, error.message);
  }
}
