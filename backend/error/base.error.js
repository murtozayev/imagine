export default function (res, sts, msg) {
  return res.status(sts).json({ message: msg });
}
