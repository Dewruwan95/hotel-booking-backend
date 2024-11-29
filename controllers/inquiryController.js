import e from "express";
import Inquiry from "../models/inquiry.js";
import { verifyAdmin, verifyCustomer } from "../utils/userVerification.js";

//------------------------------------------------------------------
///------------------------- create inquiry ------------------------
//------------------------------------------------------------------
export async function createInquiry(req, res) {
  try {
    if (verifyCustomer(req)) {
      const inquiry = {
        name: req.body.user.firstName + " " + req.body.user.lastName,
        email: req.body.user.email,
        inquiryType: req.body.type,
        message: req.body.message,
      };
      const newInquiry = new Inquiry(inquiry);
      await newInquiry.save();

      return res.status(200).json({
        message: "Inquiry created successfully",
      });
    } else {
      return res.status(400).json({
        message: "Unauthorized",
      });
    }
  } catch (error) {
    return res.status(400).json({
      message: "Inquiry creation failed",
      error: error,
    });
  }
}

//------------------------------------------------------------------
///--------------------------- get inquiry -------------------------
//------------------------------------------------------------------
export async function getInquiries(req, res) {
  let inquiries;
  try {
    if (verifyAdmin(req)) {
      const page = parseInt(req.body.page) || 1; // Current page, default to 1
      const pageSize = parseInt(req.body.pageSize) || 5; // Items per page, default to 5
      const skip = (page - 1) * pageSize; // Number of items to skip
      const totalInquiries = await Inquiry.countDocuments(); // Total number of bookings
      inquiries = await Inquiry.find()
        .sort({
          timestamp: -1,
        })
        .skip(skip)
        .limit(pageSize);

      return res.status(200).json({
        inquiries: inquiries,
        pagination: {
          currentPage: page,
          totalInquiries: totalInquiries,
          totalPages: Math.ceil(totalInquiries / pageSize),
        },
      });
    }

    if (verifyCustomer(req)) {
      inquiries = await Inquiry.find({ email: req.body.user.email }).sort({
        timestamp: -1,
      });
      return res.status(200).json({
        inquiries: inquiries,
      });
    }
  } catch (error) {
    return res.status(400).json({
      message: "Failed to retrieve inquiries",
      error: error,
    });
  }
}

//------------------------------------------------------------------
///------------------------- update inquiry ------------------------
//------------------------------------------------------------------
export async function updateInquiryById(req, res) {
  console.log(req.body);

  if (verifyAdmin(req)) {
    const inquiryId = req.params.inquiryId;
    const updatedInquiry = req.body;

    try {
      await Inquiry.findOneAndUpdate({ _id: inquiryId }, updatedInquiry);
      res.status(200).json({
        message: "Inquiry updated successfully",
      });
    } catch (error) {
      res.status(400).json({
        message: "Inquiry update failed",
        error: error,
      });
    }
  } else {
    res.status(400).json({
      message: "Unauthorized",
    });
  }
}

//------------------------------------------------------------------
///------------------------- delete inquiry ------------------------
//------------------------------------------------------------------
export async function deleteInquiryById(req, res) {
  if (verifyAdmin(req)) {
    const inquiryId = req.params.inquiryId;
    try {
      await Inquiry.findOneAndDelete({ _id: inquiryId });
      res.status(200).json({
        message: "Inquiry deleted successfully",
      });
    } catch (error) {
      res.status(400).json({
        message: "Inquiry deletion failed",
        error: error,
      });
    }
  } else {
    res.status(400).json({
      message: "Unauthorized",
    });
  }
}
