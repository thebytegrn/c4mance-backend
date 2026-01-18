export const isRootUser = async (req, res, next) => {
  const isRootUser = req.authUser.isRoot;

  if (!isRootUser)
    return res
      .status(422)
      .json({ success: false, message: "Failed, not root account" });

  next();
};
