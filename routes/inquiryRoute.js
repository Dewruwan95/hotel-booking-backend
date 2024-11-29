import express from "express";
import {
  createInquiry,
  deleteInquiryById,
  getInquiries,
  updateInquiryById,
} from "../controllers/inquiryController.js";

const inquiryRouter = express.Router();

inquiryRouter.post("/", createInquiry);

inquiryRouter.post("/all", getInquiries);

inquiryRouter.put("/:inquiryId", updateInquiryById);

inquiryRouter.delete("/:inquiryId", deleteInquiryById);

export default inquiryRouter;
