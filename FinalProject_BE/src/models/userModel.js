const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
 
const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
 
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      validate: {
        validator: function (v) {
          return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
        },
        message: (props) => `${props.value} is not a valid email address!`,
      },
    },
    password: {
      type: String,
      required: true,
      select: false, // Ensures password isnt leaked in random queries
    },
    role: {
      type: String,
      enum: ["user", "admin", "hotel manager"],
      default: "user",
    },
    phone: {
      type: Number,
      validate: {
        validator: function (v) {
          // Checks if the number is exactly 10 digits
          return /^\d{10}$/.test(v.toString());
        },
        message: (props) =>
          `${props.value} is not a valid 10-digit phone number!`,
      },
    },
    isActive: { type: Boolean, default: true },
    location: { type: String },
    points: { type: Number, default: 500 },
  },
  { timestamps: true },
);
 
// Pre-save hook for password hashing
userSchema.pre("save", async function () {
  if (!this.isModified("password")) return;
  this.password = await bcrypt.hash(this.password, 10);
});
 
// Compare password method
userSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};
 
module.exports = mongoose.model("User", userSchema);