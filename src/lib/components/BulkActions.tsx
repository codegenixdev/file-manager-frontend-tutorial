import CloseRoundedIcon from "@mui/icons-material/CloseRounded";

import LayersOutlinedIcon from "@mui/icons-material/LayersOutlined";
import {
  Paper,
  SpeedDial,
  SpeedDialAction,
  SpeedDialIcon,
  Stack,
  SxProps,
  Typography,
} from "@mui/material";

import { ReactNode, useRef } from "react";
import { Transition } from "react-transition-group";

type Action = {
  icon: ReactNode;
  label: string;
  actionFn: (ids: string[]) => void | Promise<void>;
};

type Props = {
  ids: string[];
  actions: Action[];
};
export function BulkActions({ actions, ids }: Props) {
  const nodeRef = useRef(null);

  const duration = 300;

  const transitionStyles: { [k: string]: SxProps } = {
    entering: { opacity: 1, bottom: 20 },
    entered: { opacity: 1, bottom: 20 },
    exiting: { opacity: 0, bottom: -10 },
    exited: { opacity: 0, bottom: -10 },
  };

  return (
    <Transition nodeRef={nodeRef} in={ids.length > 0} timeout={duration}>
      {(state) => (
        <Paper
          ref={nodeRef}
          sx={{
            position: "fixed",
            left: "50%",
            transform: "translateX(-50%)",
            bottom: 0,
            padding: 3,
            width: "100vw",
            maxWidth: 400,
            transition: `all ${duration}ms ease-in-out`,
            ...transitionStyles[state],
          }}
        >
          <Stack>
            <Typography>{ids.length} Selected items</Typography>
            <SpeedDial
              ariaLabel="Bulk actions"
              sx={(theme) => ({
                position: "absolute",
                bottom: theme.spacing(1),
                right: theme.spacing(2),
                ".MuiSpeedDialAction-staticTooltipLabel": {
                  width: "max-content",
                },
              })}
              icon={
                <SpeedDialIcon
                  icon={<LayersOutlinedIcon />}
                  openIcon={<CloseRoundedIcon />}
                />
              }
            >
              {actions.map((action) => (
                <SpeedDialAction
                  icon={action.icon}
                  tooltipTitle={action.label}
                  tooltipOpen
                  onClick={() => action.actionFn(ids)}
                  key={action.label}
                />
              ))}
            </SpeedDial>
          </Stack>
        </Paper>
      )}
    </Transition>
  );
}
