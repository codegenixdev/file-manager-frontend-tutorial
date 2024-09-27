if you want to follow along and to save your time, i decided to create a starting template project where i have setup a simple react vite project with material ui and a few other libraries to help us get started with the project

```bash
git clone -b starting-template https://github.com/codegenixdev/file-manager-frontend-tutorial.git .
```

make sure at least using node 18 for best compatibility

```bash
npm i
```

open localhost on port 5173

show what things are installed (insist on dropzone)
review tsconfig.app.json (paths)
review vite.config.ts (paths)
review .env
vite-end.d.ts
inside src, we have app.tsx, main.tsx and shared folder where we put our shared and common components or utilieis here

main.tsx (show why things are wrapped inside what)
view confirm provider and insist on that this is the best to handle confirms in react and by wrapping your project inside it, you can use it every where in your application with ease where we get to it soon

App.tsx (our application will go inside this container)
utils, theme and a simple axios httpclient to use it app wide
topbar and theme toggle that we talked before.
BulkActions.tsx where when user select multiple uploaded files, this component will show up and use can do group opertions like delete multiple files which i have implmented this component and you can use it everywhere that you want

---

fileManager/components/FileManager.tsx

```tsx FileManager.tsx
export function FileManager() {
  return <>file manager</>;
}
```

import it in app.tsx

```tsx filemanager.tsx
export function FileManager() {
  return (
    <>
      <Typography variant="h4">Files</Typography>
      <Typography sx={{ marginBottom: 3 }}>
        Files and assets that have been uploaded as part of this project.
      </Typography>
      <ButtonBase
        sx={(theme) => ({
          backgroundColor: alpha(colors.grey[500], 0.1),
          padding: 2,
          width: 1,
          borderRadius: `${theme.shape.borderRadius}px`,
          display: "flex",
          flexDirection: "column",
          gap: 2,
          marginBottom: 3,
        })}
      >
        <FileUploadRoundedIcon fontSize="large" />

        <Stack sx={{ alignItems: "center", gap: 1 }}>
          <Typography>Click to upload or drag and drop</Typography>
          <Typography>Max 10GB.</Typography>
        </Stack>
      </ButtonBase>
    </>
  );
}
```

show it
