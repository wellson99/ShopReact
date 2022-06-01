import { createTheme } from '@mui/material/styles';

import { red } from '@mui/material/colors';

export const useCustomStyle = createTheme({
  palette: {
    red:{
      main: red[900]
    }
  }
})