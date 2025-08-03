export default function (type = "save", res, token) {
  if (type === "save") {
    res.cookie("mrx_token", token, {
      httpOnly: false,
      sameSite: "lax",
      maxAge: 10 * 24 * 60 * 60 * 1000,
    });
  } else {
    res.clearCookie("mrx_token");
  }
}