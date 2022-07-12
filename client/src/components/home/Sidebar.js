import React from "react";
import moment from "moment";
import {
  Card,
  CardContent,
  Link,
  Grid,
  Box,
  Typography,
  Button,
} from "@mui/material";
import { Link as RouteLink } from "react-router-dom";
import DeleteIcon from "@mui/icons-material/Delete";
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";
import VideoCameraFrontIcon from "@mui/icons-material/VideoCameraFront";

const Sidebar = () => {
  const events = [
    {
      start: moment().add(1, "d").toDate(),
      end: moment().add(1, "d").toDate(),
      title: "Google Software Engineering Internship",
      type: "internship",
    },
    {
      start: moment().add(4, "days").toDate(),
      end: moment().add(4, "days").add(10, "minutes").toDate(),
      title: "INTERCHANGE interview",
      type: "meeting",
    },
    {
      start: moment().add(1, "d").toDate(),
      end: moment().add(1, "d").toDate(),
      title: "Google Software Engineering Internship",
      type: "internship",
    },
    {
      start: moment().add(4, "days").toDate(),
      end: moment().add(4, "days").add(10, "minutes").toDate(),
      title: "INTERCHANGE interview",
      type: "meeting",
    },
  ];

  // events in the next week
  const upcomingEvents = events
    .filter((e) => moment(e.start).isBetween(moment(), moment().add(7, "d")))
    .sort((a, b) => a.start - b.start);

  return (
    <Grid item xs={12} md={3} order={{ xs: 1, md: 2 }}>
      <Typography variant="h5" component="div" gutterBottom fontWeight={700}>
        My Upcoming Events
      </Typography>
      <Link component={RouteLink} to="/calendar" color="primary">
        View Full Calendar
      </Link>
      <Meetings events={upcomingEvents.filter((e) => e.type === "meeting")} />
      <Internships
        events={upcomingEvents.filter((e) => e.type === "internship")}
      />
    </Grid>
  );
};

const Internships = ({ events }) => {
  return (
    <Box sx={{ mt: 4 }}>
      <Typography variant="h6" component="div" gutterBottom fontWeight={700}>
        Application Deadlines
      </Typography>
      {events.length === 0 ? (
        <Typography variant="subtitle2" sx={{ mt: 1 }}>
          <i>No application deadlines in the next week</i>
        </Typography>
      ) : (
        events.map((e) => (
          <Card sx={{ mt: 1 }}>
            <CardContent>
              <Typography gutterBottom variant="h6" component="div">
                {e.title}
              </Typography>
              <Typography gutterBottom variant="subtitle1" component="div">
                {moment(e.start).calendar()} ({moment(e.start).fromNow()})
              </Typography>
              <Box sx={{ mt: 4 }}>
                <Button
                  variant="contained"
                  sx={{ mr: 2 }}
                  size="small"
                  startIcon={<RemoveRedEyeIcon />}
                >
                  view
                </Button>
                <Button
                  variant="outlined"
                  color="greyColor"
                  startIcon={<DeleteIcon />}
                  size="small"
                >
                  Remove
                </Button>
              </Box>
            </CardContent>
          </Card>
        ))
      )}
    </Box>
  );
};

const Meetings = ({ events }) => {
  return (
    <Box sx={{ mt: 4 }}>
      <Typography variant="h6" component="div" fontWeight={700}>
        Meetings
      </Typography>
      {events.length === 0 ? (
        <Typography variant="subtitle2" sx={{ mt: 1 }}>
          <i>No meetings in the next week</i>
        </Typography>
      ) : (
        events.map((e) => (
          <Card sx={{ mt: 1 }}>
            <CardContent>
              <Typography gutterBottom variant="h6" component="div">
                {e.title}
              </Typography>
              <Typography gutterBottom variant="subtitle1" component="div">
                {moment(e.start).calendar()} ({moment(e.start).fromNow()})
              </Typography>
              <Box sx={{ mt: 4 }}>
                <Button
                  variant="contained"
                  sx={{ mr: 2 }}
                  size="small"
                  startIcon={<VideoCameraFrontIcon />}
                >
                  Join
                </Button>
                <Button
                  variant="outlined"
                  color="greyColor"
                  startIcon={<DeleteIcon />}
                  size="small"
                >
                  Remove
                </Button>
              </Box>
            </CardContent>
          </Card>
        ))
      )}
    </Box>
  );
};

export default Sidebar;