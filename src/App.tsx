import { FileManager } from "@/fileManager/components/FileManager";
import { Topbar } from "@/shared/ui/Topbar";
import { Container } from "@mui/material";

export function App() {
  return (
    <>
      <Topbar />
      <Container sx={{ paddingY: 5 }}>
        <FileManager />
      </Container>
    </>
  );
}
