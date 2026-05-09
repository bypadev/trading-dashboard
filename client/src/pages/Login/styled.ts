import { styled } from '@mui/material/styles';
import { Box, Paper } from '@mui/material';

const StyledPage = styled(Box)(({ theme }) => ({
  height: '100vh',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: theme.palette.background.default,
}));

const StyledCard = styled(Paper)(({ theme }) => ({
  width: '100%',
  maxWidth: 380,
  padding: theme.spacing(4),
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(2),
}));

const StyledLogoRow = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1.5),
  marginBottom: theme.spacing(1),
}));

const StyledLogoBox = styled(Box)(({ theme }) => ({
  width: theme.spacing(4),
  height: theme.spacing(4),
  borderRadius: theme.shape.borderRadius,
  backgroundColor: theme.palette.primary.main,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  flexShrink: 0,
}));

export { StyledPage, StyledCard, StyledLogoRow, StyledLogoBox };
