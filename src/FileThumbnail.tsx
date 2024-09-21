import AudioIcon from "@mui/icons-material/Audiotrack";
import DescriptionIcon from "@mui/icons-material/Description";
import ImageIcon from "@mui/icons-material/Image";
import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";
import VideoIcon from "@mui/icons-material/VideoLibrary";

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
      return <ImageIcon fontSize="large" />;
    case "video":
      return <VideoIcon fontSize="large" />;
    case "audio":
      return <AudioIcon fontSize="large" />;
    case "document":
      return <DescriptionIcon fontSize="large" />;
    default:
      return <InsertDriveFileIcon fontSize="large" />;
  }
}

export { FileThumbnail };
