import baseError from "../error/base.error.js";
import token from "../utils/token.js";

export default function (req, res, next) {
  try {
    const { mrx_token } = req.cookies;

    if (!mrx_token) {
      return baseError(res, 401, "User unauthorized");
    }

    const decode = token("verify", mrx_token);

    if (!decode) {
      return baseError(res, 401, "User unauthorized");
    }

    req.user = decode;

    next();
  } catch (error) {
    next(error);
  }
}
