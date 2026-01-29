export const filterOrgMembers = async (req, res) => {
  try {
    res.send("ok");
  } catch (error) {
    console.log("Error filtering org members: ", error);
    throw error;
  }
};
