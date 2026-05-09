import NotificationsActiveIcon from "@mui/icons-material/NotificationsActive";

interface Props {
  visible: boolean;
}

export function AlertIndicator({ visible }: Props) {
  if (!visible) return null;

  return (
    <NotificationsActiveIcon
      sx={{
        fontSize: 14,
        color: "warning.main",
      }}
    />
  );
}