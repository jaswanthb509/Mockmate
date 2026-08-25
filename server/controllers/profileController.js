import User from "../models/User.js";

export const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select(
      "-password"
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    return res.status(200).json({
      success: true,
      data: {
        fullName: user.fullName || "",
        targetRole: user.targetRole || "",
        targetCompany: user.targetCompany || "",
        experience: user.experience || "",
        skills: user.skills || "",
        careerGoal: user.careerGoal || "",
      },
    });
  } catch (error) {
    console.error("Get Profile Error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to fetch career profile.",
    });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const {
      fullName,
      targetRole,
      targetCompany,
      experience,
      skills,
      careerGoal,
    } = req.body;

    const user = await User.findByIdAndUpdate(
      req.user.id,
      {
        fullName: fullName?.trim() || "",
        targetRole: targetRole?.trim() || "",
        targetCompany:
          targetCompany?.trim() || "",
        experience: experience?.trim() || "",
        skills: skills?.trim() || "",
        careerGoal: careerGoal?.trim() || "",
      },
      {
        new: true,
        runValidators: true,
      }
    ).select("-password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Career profile updated successfully.",
      data: {
        fullName: user.fullName || "",
        targetRole: user.targetRole || "",
        targetCompany: user.targetCompany || "",
        experience: user.experience || "",
        skills: user.skills || "",
        careerGoal: user.careerGoal || "",
      },
    });
  } catch (error) {
    console.error("Update Profile Error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to update career profile.",
    });
  }
};