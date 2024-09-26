import { FileManagerPage } from "@/fileManager/components/FileManagerPage";
import { Container } from "@mui/material";

export function App() {
  return (
    <Container sx={{ paddingY: 5 }}>
      <FileManagerPage />
    </Container>
  );
}
