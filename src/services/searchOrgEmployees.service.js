import { User } from "../models/user.model.js";
import mongoose from "mongoose";

export const searchOrgEmployees = async (req, res) => {
  try {
    const searchQuery = req.query?.q;

    if (!searchQuery || searchQuery.trim() === "") {
      return res
        .status(400)
        .json({ success: false, mssage: "Missing query string" });
    }

    const orgId = new mongoose.Types.ObjectId(req.authUser.organizationId);

    const regex = new RegExp(searchQuery.trim(), "i");

    const members = await User.aggregate([
      {
        $lookup: {
          from: "departments",
          localField: "departmentId",
          foreignField: "_id",
          as: "department",
        },
      },
      {
        $unwind: "$department",
      },
      {
        $match: {
          "department.organizationId": orgId,
          $or: [{ firstName: regex }, { lastName: regex }],
        },
      },
      {
        $project: {
          password: 0,
        },
      },
      {
        $sort: { lastName: 1, firstName: 1 },
      },
    ]);

    return res.status(200).json({
      success: true,
      message: "Queried organization employees",
      data: { members },
    });
  } catch (error) {
    console.log("Error fetching employees: ", error);
    return res.status(500).json({
      success: false,
      message: "An error occurred while fetching employees.",
    });
  }
};
