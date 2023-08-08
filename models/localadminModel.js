const mongoose = require("mongoose");

const localadminSchema =  mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    username:{
      type : String,
      required : true,
    },
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    mobile : {
      type : String,
      required: true,
    },
    profile:{
      type: String,
      default: "https://bootdey.com/img/Content/avatar/avatar7.png"
    }, 
    isBlocked: {
      type: Boolean,
      default: true,
    },
    otp:{
      type:String,
      default:"0"
    },
    isVerified:{
      type:String,
      default: false
    }
  },
  {
    timestamps: true,
  }
);

const localadmin = mongoose.model("localadmin", localadminSchema);

module.exports = localadmin;
