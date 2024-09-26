import AudioFileRoundedIcon from "@mui/icons-material/AudioFileRounded";
import DescriptionRoundedIcon from "@mui/icons-material/DescriptionRounded";
import InsertDriveFileRoundedIcon from "@mui/icons-material/InsertDriveFileRounded";

import InsertPhotoRoundedIcon from "@mui/icons-material/InsertPhotoRounded";
import SmartDisplayRoundedIcon from "@mui/icons-material/SmartDisplayRounded";

function getFileType(extension: string) {
  switch (extension) {
    case "jpg":
    case "jpeg":
    case "png":
    case "gif":
      return "image";
    case "mp4":
    case "mov":
    case "avi":
    case "mkv":
      return "video";
    case "mp3":
    case "wav":
      return "audio";
    case "pdf":
    case "doc":
    case "docx":
    case "txt":
      return "document";
    default:
      return "file";
  }
}

type FileThumbnailProps = Pick<File, "name">;

export function FileThumbnail({ name }: FileThumbnailProps) {
  const extension = name.split(".").pop()?.toLowerCase();
  const fileType = extension ? getFileType(extension) : "file";

  switch (fileType) {
    case "image":
      return <InsertPhotoRoundedIcon fontSize="large" color="primary" />;
    case "video":
      return <SmartDisplayRoundedIcon fontSize="large" color="primary" />;
    case "audio":
      return <AudioFileRoundedIcon fontSize="large" color="primary" />;
    case "document":
      return <DescriptionRoundedIcon fontSize="large" color="primary" />;
    default:
      return <InsertDriveFileRoundedIcon fontSize="large" color="primary" />;
  }
}
