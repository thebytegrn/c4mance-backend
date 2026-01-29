import multer from "multer";
import multerS3 from "multer-s3";
import { S3 } from "../lib/vendors/s3.js";

export const upload = multer({
  limits: { fileSize: 1024 * 1024 * 2 },
  fileFilter: (req, file, cb) => {
    const allowedMimes = ["image/jpeg", "image/png"];
    if (allowedMimes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(
        new Error("Invalid file type. Only JPEG, and PNG are allowed!"),
        false,
      );
    }
  },
  storage: multerS3({
    s3: S3,
    bucket: "c4mance",
    contentType: function (req, file, cb) {
      cb(null, file.mimetype);
    },
    metadata: function (req, file, cb) {
      cb(null, { fieldName: file.fieldname });
    },
    key: function (req, file, cb) {
      const uploadPath = req.path.split("/");
      const folderPrefix = uploadPath[uploadPath.length - 1];
      const fileId = req.authUser.organizationId || req.authUser._id;
      const extension = file.originalname.split(".").pop();
      const finalKey = `${folderPrefix}/${fileId}.${extension}`;
      cb(null, finalKey);
    },
  }),
});
