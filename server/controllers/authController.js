import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto";

import User from "../models/User.js";
import sendEmail from "../utils/sendEmail.js";

const generateToken = (id) => {
  return jwt.sign(
    { id },
    process.env.JWT_SECRET,
    {
      expiresIn: "7d",
    }
  );
};

export const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message:
          "Please provide name, email and password.",
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message:
          "Password must be at least 6 characters.",
      });
    }

    const normalizedEmail =
      email.trim().toLowerCase();

    const existingUser = await User.findOne({
      email: normalizedEmail,
    });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message:
          "An account with this email already exists.",
      });
    }

    const hashedPassword =
      await bcrypt.hash(password, 10);

    const user = await User.create({
      name: name.trim(),
      email: normalizedEmail,
      password: hashedPassword,
    });

    const token = generateToken(user._id);

    return res.status(201).json({
      success: true,
      message: "Account created successfully.",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
      },
    });
  } catch (error) {
    console.error("Register Error:", error);

    return res.status(500).json({
      success: false,
      message:
        "Unable to create account. Please try again.",
    });
  }
};

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message:
          "Please enter email and password.",
      });
    }

    const normalizedEmail =
      email.trim().toLowerCase();

    const user = await User.findOne({
      email: normalizedEmail,
    });

    if (!user) {
      return res.status(401).json({
        success: false,
        message:
          "Invalid email or password.",
      });
    }

    const isPasswordCorrect =
      await bcrypt.compare(
        password,
        user.password
      );

    if (!isPasswordCorrect) {
      return res.status(401).json({
        success: false,
        message:
          "Invalid email or password.",
      });
    }

    const token = generateToken(user._id);

    return res.status(200).json({
      success: true,
      message: "Login successful.",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
      },
    });
  } catch (error) {
    console.error("Login Error:", error);

    return res.status(500).json({
      success: false,
      message:
        "Unable to log in. Please try again.",
    });
  }
};

export const getCurrentUser = async (
  req,
  res
) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message:
          "User not authorized.",
      });
    }

    return res.status(200).json({
      success: true,
      user: req.user,
    });
  } catch (error) {
    console.error(
      "Get Current User Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Unable to fetch user information.",
    });
  }
};

export const forgotPassword = async (
  req,
  res
) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message:
          "Please enter your email address.",
      });
    }

    const normalizedEmail =
      email.trim().toLowerCase();

    const user = await User.findOne({
      email: normalizedEmail,
    });

    /*
     * Do not reveal whether an email
     * is registered or not.
     */
    if (!user) {
      return res.status(200).json({
        success: true,
        message:
          "If an account exists with this email, password reset instructions have been sent.",
      });
    }

    const resetToken =
      crypto.randomBytes(32).toString("hex");

    const hashedResetToken =
      crypto
        .createHash("sha256")
        .update(resetToken)
        .digest("hex");

    user.resetPasswordToken =
      hashedResetToken;

    user.resetPasswordExpires =
      Date.now() + 15 * 60 * 1000;

    await user.save();

    /*
     * IMPORTANT:
     * Render must contain:
     *
     * CLIENT_URL=https://your-vercel-url.vercel.app
     *
     * Do not put localhost in Render.
     */
    const clientUrl =
      process.env.CLIENT_URL?.replace(/\/$/, "");

    if (!clientUrl) {
      console.error(
        "CLIENT_URL is missing."
      );

      return res.status(500).json({
        success: false,
        message:
          "Password reset service is not configured.",
      });
    }

    const resetUrl =
      `${clientUrl}/reset-password/${resetToken}`;

    console.log(
      "Password reset URL:",
      resetUrl
    );

    const subject =
      "Reset your MockMate password";

    const text = `
Hello ${user.name || "there"},

We received a request to reset your MockMate password.

Click the link below to create a new password:

${resetUrl}

This link will expire in 15 minutes.

If you did not request a password reset, you can safely ignore this email.

Best regards,
MockMate Team
`;

    const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8" />
  <meta
    name="viewport"
    content="width=device-width, initial-scale=1.0"
  />
  <title>Reset your MockMate password</title>
</head>

<body
  style="
    margin: 0;
    padding: 0;
    background: #0f172a;
    font-family: Arial, Helvetica, sans-serif;
  "
>
  <div
    style="
      max-width: 600px;
      margin: 40px auto;
      padding: 40px 30px;
      background: #172033;
      border-radius: 20px;
      color: #f8fafc;
    "
  >

    <h1
      style="
        margin: 0 0 25px;
        font-size: 30px;
      "
    >
      Mock<span style="color: #8b5cf6;">
        Mate
      </span>
    </h1>

    <p
      style="
        color: #a78bfa;
        font-size: 12px;
        font-weight: bold;
        letter-spacing: 1.5px;
      "
    >
      PASSWORD RECOVERY
    </p>

    <h2
      style="
        margin: 10px 0 15px;
        font-size: 25px;
      "
    >
      Reset your password
    </h2>

    <p
      style="
        color: #cbd5e1;
        font-size: 15px;
        line-height: 1.7;
      "
    >
      Hi ${user.name || "there"},
    </p>

    <p
      style="
        color: #cbd5e1;
        font-size: 15px;
        line-height: 1.7;
      "
    >
      We received a request to reset your
      MockMate account password.
    </p>

    <div style="margin: 30px 0;">
      <a
        href="${resetUrl}"
        style="
          display: inline-block;
          padding: 14px 24px;
          background: #7c3aed;
          color: #ffffff;
          text-decoration: none;
          border-radius: 10px;
          font-weight: bold;
          font-size: 14px;
        "
      >
        Reset Password
      </a>
    </div>

    <p
      style="
        color: #94a3b8;
        font-size: 13px;
        line-height: 1.6;
      "
    >
      This link will expire in
      <strong>15 minutes</strong>.
    </p>

    <p
      style="
        color: #94a3b8;
        font-size: 13px;
        line-height: 1.6;
      "
    >
      If you did not request a password reset,
      you can safely ignore this email.
    </p>

    <hr
      style="
        margin: 30px 0;
        border: none;
        border-top: 1px solid
        rgba(148, 163, 184, 0.15);
      "
    />

    <p
      style="
        margin: 0;
        color: #64748b;
        font-size: 12px;
      "
    >
      Practice. Get feedback. Improve with
      every interview.
    </p>

    <p
      style="
        margin-top: 8px;
        color: #64748b;
        font-size: 12px;
      "
    >
      — MockMate
    </p>

  </div>
</body>
</html>
`;

    await sendEmail({
      to: user.email,
      subject,
      text,
      html,
    });

    return res.status(200).json({
      success: true,
      message:
        "If an account exists with this email, password reset instructions have been sent.",
    });
  } catch (error) {
    console.error(
      "Forgot Password Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Unable to process password reset request. Please try again.",
    });
  }
};

export const resetPassword = async (
  req,
  res
) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    if (!token) {
      return res.status(400).json({
        success: false,
        message:
          "Password reset token is required.",
      });
    }

    if (!password) {
      return res.status(400).json({
        success: false,
        message:
          "Please provide a new password.",
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message:
          "Password must be at least 6 characters.",
      });
    }

    const hashedToken =
      crypto
        .createHash("sha256")
        .update(token)
        .digest("hex");

    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpires: {
        $gt: Date.now(),
      },
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message:
          "Password reset link is invalid or has expired.",
      });
    }

    user.password =
      await bcrypt.hash(password, 10);

    user.resetPasswordToken = null;
    user.resetPasswordExpires = null;

    await user.save();

    return res.status(200).json({
      success: true,
      message:
        "Password reset successfully. You can now log in with your new password.",
    });
  } catch (error) {
    console.error(
      "Reset Password Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Unable to reset password. Please try again.",
    });
  }
};