import { Stack, Typography } from "@mui/material";
import InputField from "./components/InputField";

function App() {
  return (
    <Stack>
      <Typography>Введите число</Typography>
      <InputField min={-100000} max={100000} placeholder="Введите число" />
    </Stack>
  );
}

export default App;
