import { Box, keyframes, Paper, styled, Typography } from '@mui/material';
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';
import { theme } from '@/theme';

const pulse = keyframes`
  0%, 100% { opacity: 1; }
  50% { opacity: 0.4; }
`;

const StyledPage = styled(Box)(({ theme }) => ({
  height: '100vh',
  display: 'flex',
  flexDirection: 'column',
  overflow: 'hidden',
  backgroundColor: theme.palette.background.default,
  [theme.breakpoints.down('sm')]: {
    height: 'auto',
  },
}));

const StyledHeader = styled(Box)(({ theme }) => ({
  padding: theme.spacing(1.5, 3),
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  borderBottom: `1px solid ${theme.palette.divider}`,
  backgroundColor: theme.palette.background.paper,
  flexShrink: 0,
}));

const StyledHeaderContainer = styled(Box)({
  display: "flex",
  alignItems: "center",
  gap: theme.spacing(1.5),
});

const StyledLogoBox = styled(Box)(({ theme }) => ({
  width: theme.spacing(3.5),
  height: theme.spacing(3.5),
  borderRadius: theme.shape.borderRadius,
  backgroundColor: theme.palette.primary.main,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}));

const StyledLogoText = styled(Typography)({
  fontSize: "0.65rem",
  fontWeight: 900,
  color: theme.palette.common.white,
});

const StyledContent = styled(Box)({
  flex: 1,
  overflow: 'hidden',
  padding: theme.spacing(2),
});

const StyledPanelPaper = styled(Paper)({
  height: '100%',
  padding: theme.spacing(2),
  overflow: 'hidden',
  display: 'flex',
  flexDirection: 'column',
});
const StyledLiveDotIcon = styled(FiberManualRecordIcon, {
  shouldForwardProp: (prop) => prop !== 'active',
})<{ active?: boolean }>(({ active }) => ({
  fontSize: '0.6rem',
  animation: active ? `${pulse} 2s infinite` : 'none',
}));

export {
  StyledPage,
  StyledHeader,
  StyledHeaderContainer,
  StyledLogoBox,
  StyledLogoText,
  StyledContent,
  StyledPanelPaper,
  StyledLiveDotIcon
};