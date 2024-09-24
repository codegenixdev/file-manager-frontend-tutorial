import AudioFileTwoToneIcon from "@mui/icons-material/AudioFileTwoTone";
import BrokenImageTwoToneIcon from "@mui/icons-material/BrokenImageTwoTone";
import DescriptionTwoToneIcon from "@mui/icons-material/DescriptionTwoTone";
import InsertDriveFileTwoToneIcon from "@mui/icons-material/InsertDriveFileTwoTone";
import SlideshowTwoToneIcon from "@mui/icons-material/SlideshowTwoTone";

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

function FileThumbnail({ name }: FileThumbnailProps) {
  const extension = name.split(".").pop()?.toLowerCase();
  const fileType = extension ? getFileType(extension) : "file";

  switch (fileType) {
    case "image":
      return <BrokenImageTwoToneIcon fontSize="large" />;
    case "video":
      return <SlideshowTwoToneIcon fontSize="large" />;
    case "audio":
      return <AudioFileTwoToneIcon fontSize="large" />;
    case "document":
      return <DescriptionTwoToneIcon fontSize="large" />;
    default:
      return <InsertDriveFileTwoToneIcon fontSize="large" />;
  }
}

export { FileThumbnail };
