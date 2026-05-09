import { styled } from "@mui/material/styles";
import { Box } from "@mui/material";
import { theme } from "@/theme";

const StyledCard = styled(Box, {
  shouldForwardProp: (prop) => prop !== "selected" && prop !== "loading",
})<{ selected?: boolean; loading?: boolean }>(({ theme, selected, loading }) => ({
  padding: theme.spacing(2),
  marginBottom: theme.spacing(1),
  borderRadius: theme.spacing(1),
  cursor: loading ? "default" : "pointer",
  pointerEvents: loading ? "none" : "auto",
  border: `1px solid ${selected ? theme.palette.primary.main : theme.palette.divider}`,
  backgroundColor: selected ? theme.palette.action.selected : "transparent",
  transition: "border-color 0.15s, background-color 0.15s",
  ...(!loading && {
    "&:hover": {
      borderColor: theme.palette.primary.light,
      backgroundColor: theme.palette.action.hover,
    },
  }),
}));

const StyledCardTop = styled(Box)({
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: theme.spacing(1),
});

const StyledSymbolRow = styled(Box)({
  display: "flex",
  alignItems: "center",
  gap: theme.spacing(1),
});

export { StyledCard, StyledCardTop, StyledSymbolRow };
