import Box from '@mui/material/Box';
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import Divider from "@mui/material/Divider";

export const PageHeader = ({title, description}) => {
  return(
    <Stack spacing={1}>
      <Box>
        <Typography variant="h6" component="p" fontWeight={700}>{title}</Typography>
        <Typography variant="body1" component="span">{description}</Typography>
      </Box>
      <Divider/>
    </Stack>
  )
}