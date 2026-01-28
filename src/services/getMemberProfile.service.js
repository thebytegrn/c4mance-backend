export const getMemberProfile = async (req, res) => {
  try {
    res.send("ok");
  } catch (error) {
    console.log("Error getting member profile", error);
    throw error;
  }
};
