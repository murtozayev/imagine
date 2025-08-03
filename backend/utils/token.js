import jwt from "jsonwebtoken";

export default function (type = "sign", payload) {
  if (type === "sign") {
    const mrx_token = jwt.sign(payload, process.env.JWT, { expiresIn: "10d" });

    return mrx_token;
  } else {
    const mrx_token_data = jwt.verify(payload, process.env.JWT);

    return mrx_token_data;
  }
}
