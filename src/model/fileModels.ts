import mongoose from "mongoose";

const fileSchema = new mongoose.Schema(
  {
    file_url: { //檔案連結
      type: String,
      required: [true, "缺少檔案連結"],
    },
    file_path: { //檔案路徑
      type: String,
      required: [true, "缺少檔案路徑"],
    },
  }
);

const File = mongoose.model("File", fileSchema);
export default File;