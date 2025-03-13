import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Container, CssBaseline, ThemeProvider, createTheme } from '@mui/material';
import { EntriesTable } from './components/EntriesTable';

const queryClient = new QueryClient();
const theme = createTheme();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Container maxWidth="xl" sx={{ py: 4 }}>
          <EntriesTable />
        </Container>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
