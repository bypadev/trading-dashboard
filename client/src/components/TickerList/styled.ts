import { styled } from "@mui/material/styles";
import { Box, Button, Typography } from "@mui/material";

const StyledContainer = styled(Box)({
  height: "100%",
  display: "flex",
  flexDirection: "column",
});

const StyledSectionLabel = styled(Typography)(({ theme }) => ({
  textTransform: "uppercase" as const,
  fontSize: "0.7rem",
  letterSpacing: 1,
  fontWeight: 700,
  marginBottom: theme.spacing(1),
}));

const StyledListContainer = styled(Box)({
  flex: 1,
  overflow: "auto",
});

const StyledAlertPanel = styled(Box)(({ theme }) => ({
  marginTop: theme.spacing(2),
  paddingTop: theme.spacing(2),
  borderTop: `1px solid ${theme.palette.divider}`,
}));

const StyledAlertActions = styled(Box)(({ theme }) => ({
  display: "flex",
  gap: theme.spacing(1),
  marginTop: theme.spacing(1),
}));

const StyledAlertStatus = styled(Box)(({ theme }) => ({
  marginTop: theme.spacing(1),
}));

const StyledRemoveButton = styled(Button)(({ theme }) => ({
  marginTop: theme.spacing(0.5),
  padding: 0,
  minWidth: 0,
}));

const StyledLoadingContainer = styled(Box)(({ theme }) => ({
  display: "flex",
  justifyContent: "center",
  paddingTop: theme.spacing(4),
}));

export {
  StyledContainer,
  StyledSectionLabel,
  StyledListContainer,
  StyledAlertPanel,
  StyledAlertActions,
  StyledAlertStatus,
  StyledRemoveButton,
  StyledLoadingContainer,
};
