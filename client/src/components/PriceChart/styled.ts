import { styled } from "@mui/material/styles";
import { Box, Paper } from "@mui/material";

const StyledContainer = styled(Box)({
  height: "100%",
  display: "flex",
  flexDirection: "column",
});

const StyledHeader = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "flex-start",
  justifyContent: "space-between",
  marginBottom: theme.spacing(3),
  flexWrap: "wrap",
  gap: theme.spacing(1),
}));

const StyledPriceRow = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "baseline",
  gap: theme.spacing(1),
  marginTop: theme.spacing(0.5),
}));

const StyledControls = styled(Box)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  alignItems: "flex-end",
  gap: theme.spacing(1),
  [theme.breakpoints.down('sm')]: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    justifyContent: "flex-start",
  },
}));

const StyledChartPaper = styled(Paper)(({ theme }) => ({
  flex: 1,
  padding: theme.spacing(2),
  minHeight: 280,
  backgroundColor: theme.palette.background.default,
  border: `1px solid ${theme.palette.divider}`,
  [theme.breakpoints.down('md')]: {
    flex: 'unset',
    minHeight: 'unset',
  },
}));

const StyledChartBox = styled(Box)(({ theme }) => ({
  position: "relative",
  width: "100%",
  height: "100%",
  [theme.breakpoints.down('md')]: {
    height: 300,
  },
}));

const StyledEmptyState = styled(Box)({
  height: "100%",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  textAlign: "center",
});

const StyledLoadingBox = styled(Box)(({ theme }) => ({
  display: "flex",
  justifyContent: "center",
  paddingTop: theme.spacing(8),
}));

export {
  StyledContainer,
  StyledHeader,
  StyledPriceRow,
  StyledControls,
  StyledChartPaper,
  StyledChartBox,
  StyledEmptyState,
  StyledLoadingBox,
};
