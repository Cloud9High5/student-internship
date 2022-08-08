import React, { useEffect, useState } from "react";
import moment from "moment";
import { useTheme } from "@mui/material/styles";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import StarIcon from "@mui/icons-material/Star";
import {
  InputLabel,
  Select,
  FormControl,
  MenuItem,
  List,
  ListItem,
  ListItemButton,
  Avatar,
  Box,
  Typography,
} from "@mui/material";
import classes from "./Recruiter.module.scss";
import { toTitleCase } from '../../helpers';

const process = ["Phone Interview", "Tech Interview", "Behavioural Interview"];

const Selector = ({ applications, setSelectedApp, selectedApp }) => {
  const [status, setStatus] = useState("all");
  const [filteredApplications, setFilteredApplications] =
    useState(applications);

  useEffect(() => {
    if (status === "all") {
      setFilteredApplications(applications);
    } else if (status === 'accepted' || status === 'rejected') {
      setFilteredApplications(applications.filter(app => app.status === null))
    } else {
      setFilteredApplications(
        applications.filter((app) => app.stage === status)
      );
    }
    setSelectedApp(0)
  }, [applications, status]);

  return (
    <Box>
      <Typography variant="h5">{applications.length} Total Applicants</Typography>
      <FormControl fullWidth sx={{ my: 2 }}>
        <InputLabel id="sort">Stage</InputLabel>
        <Select
          labelId="status"
          id="status"
          value={status}
          label="Stage"
          onChange={(e) => setStatus(e.target.value)}
        >
          <MenuItem value="all">All</MenuItem>
          <MenuItem value="accepted">Accepted</MenuItem>
          <MenuItem value="rejected">Rejected</MenuItem>
          {process.map((p) => (
            <MenuItem value={p}>{toTitleCase(p)}</MenuItem>
          ))}
        </Select>
      </FormControl>
      <List sx={{ mt: 2, maxHeight: "65vh", overflow: "auto" }}>
        {filteredApplications.map((app, i) => (
          <ApplicationCard
            app={app}
            setSelectedApp={setSelectedApp}
            i={i}
            selectedApp={selectedApp}
          />
        ))}
      </List>
    </Box>
  );
};

const ApplicationCard = ({ app, setSelectedApp, selectedApp, i }) => (
  <ListItem
    sx={{ p: 0, m: 0 }}
    className={
      selectedApp === i && classes.selected
    }
  >
    <ListItemButton sx={{ p: 5 }} onClick={() => setSelectedApp(i)}>
      <Box sx={{ display: "flex", alignItems: "center", gap: 5 }}>
        <Avatar src={app.avatar} sx={{ height: 100, width: 100 }} />
        <Box>
          <Typography variant="h5" mb={1}>
            {app.first_name} {app.last_name}
          </Typography>
          <Typography variant="subtitle1" mb={1}>
            {moment(app.applicationTime, "YYYY-MM-DD hh:mm:ss").fromNow()}
          </Typography>
          <Status status={app.status} stage={app.stage}/>
          {app.shortlist && <ShortList />}
        </Box>
      </Box>
    </ListItemButton>
  </ListItem>
);

export const Status = ({ status, stage }) => {
  const color = () => {
    switch (status) {
      case "accepted":
        return "green";
      case "rejected":
        return "red";
      default:
        return "#3d70b2";
    }
  };

  return (
    <Box sx={{ display: "flex", alignItems: "center", gap: 1, color: color() }}>
      {status === "accepted" ? (
        <CheckIcon />
      ) : status === "rejected" ? (
        <CloseIcon />
      ) : (
        <AccessTimeIcon />
      )}
      <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
        {toTitleCase(status === 'pending' ? stage : status)}
      </Typography>
    </Box>
  );
};

const ShortList = () => {
  const theme = useTheme();

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        gap: 1,
        color: theme.palette.warning.main,
      }}
      mt={1}
    >
      <StarIcon />
      <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
        Shortlisted
      </Typography>
    </Box>
  );
};

export default Selector;
