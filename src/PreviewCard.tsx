import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import { Card, CardHeader, IconButton, Typography } from "@mui/material";
import { convertByteToMegabyte } from "./lib/utils";
import { LinearProgressWithLabel } from "./LinearProgressWithLabel";
import { useFileStore } from "./store/file-slice";
import { FileThumbnail } from "./FileThumbnail";
import { ExtendedFile } from "./lib/types";

type Props = ExtendedFile;
function PreviewCard(props: Props) {
  const removeFile = useFileStore((state) => state.removeFile);
  const uploadProgress = useFileStore((state) =>
    state.files.find((file) => file.id === props.id)
  )?.uploadProgress;

  function handleRemove() {
    removeFile(props.id);
  }

  return (
    <Card>
      <CardHeader
        action={
          <IconButton onClick={handleRemove}>
            <CloseRoundedIcon />
          </IconButton>
        }
        avatar={<FileThumbnail name={props.file.name} />}
        title={props.file.name}
        subheader={
          <>
            <Typography sx={{ marginBottom: 1 }} variant="body2">
              {convertByteToMegabyte(props.file.size)}
            </Typography>
            <LinearProgressWithLabel value={uploadProgress} />
          </>
        }
        disableTypography
      />
    </Card>
  );
}

export { PreviewCard };
