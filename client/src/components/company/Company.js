import {
  Avatar,
  Box,
  Button,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import React, { useEffect, useState, useContext } from "react";
import classes from "./company.module.scss";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import WorkIcon from "@mui/icons-material/Work";
import JobBlock from "../jobs/JobBlock";
import MailOutlineIcon from "@mui/icons-material/MailOutline";
import { getCompanyInfo } from "../../api/company-api";
import { useHistory } from "react-router-dom";
import { UserContext } from "../../store/UserContext";
import { companyGetJobInfo } from "../../api/company-api";

// const data = {
//   company_avatar: "https://img.icons8.com/officel/344/google-logo.png",
//   description:
//     "Lorem ipsum dolorf sit amet, consectetur adipiscing elit. Etiam sit amet erat id est consequat fermentum. Sed efficitur ligula et ante lacinia, quis pulvinar massa eleifend. Duis interdum ornare nunc, ac tincidunt diam rhoncus non. Vestibulum tincidunt tellus rutrum quam gravida lobortis. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Mauris viverra erat et enim efficitur porta. In hac habitasse platea dictumst. In at erat quis mi accumsan fringilla sit amet eu mi. Phasellus dignissim leo eros, sed rhoncus est vestibulum nec. \n Ut congue, purus sit amet porttitor pellentesque, ex diam pellentesque mi, ac scelerisque nibh dui eu neque. In finibus, eros sit amet consectetur sagittis, arcu orci semper tortor, sit amet blandit est purus ut turpis. Aliquam quis diam ornare, pharetra metus eget, finibus neque. Sed nec mauris id tortor tempus efficitur a cursus nibh. Donec a sollicitudin augue. Mauris auctor nibh ut molestie semper. Praesent felis orci, rhoncus quis pulvinar a, bibendum non lectus. \n Nunc vehicula pulvinar lorem suscipit malesuada. Donec malesuada velit massa, eget ullamcorper ligula convallis nec. Aenean ac mollis elit. Pellentesque ut ultricies velit. Nam quis posuere orci. Etiam nibh sem, venenatis a rutrum id, condimentum non velit. Mauris at tincidunt mauris. Phasellus viverra est a arcu facilisis, ac auctor elit egestas. Quisque eget risus condimentum, molestie leo vel, venenatis nunc. In hac habitasse platea dictumst. Morbi quis dui non metus ultricies aliquam. Vestibulum ornare, sapien ut vehicula ornare, nibh nunc porta magna, eget accumsan ipsum enim eget est. Donec et ligula ac arcu lobortis finibus sit amet lobortis felis.\n",
//   company_name: "Google",
//   company_url: "www.google.com",
//   industry: "Technology",
//   linkedIn: "https://www.linkedin.com/company/google/?originalSubdomain=au",
//   company_size: "10000+",
//   founded_year: "2000",
// };

// const jobs = [
//   {
//     job_id: "aa",
//     company_id: "1",
//     title: "Software engineer intern",
//     description:
//       "Lorem ipsum dolorf sit amet, consectetur adipiscing elit. Etiam sit amet erat id est consequat fermentum. Sed efficitur ligula et ante lacinia, quis pulvinar massa eleifend. Duis interdum ornare nunc, ac tincidunt diam rhoncus non. Vestibulum tincidunt tellus rutrum quam gravida lobortis. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Mauris viverra erat et enim efficitur porta. In hac habitasse platea dictumst. In at erat quis mi accumsan fringilla sit amet eu mi. Phasellus dignissim leo eros, sed rhoncus est vestibulum nec. \n Ut congue, purus sit amet porttitor pellentesque, ex diam pellentesque mi, ac scelerisque nibh dui eu neque. In finibus, eros sit amet consectetur sagittis, arcu orci semper tortor, sit amet blandit est purus ut turpis. Aliquam quis diam ornare, pharetra metus eget, finibus neque. Sed nec mauris id tortor tempus efficitur a cursus nibh. Donec a sollicitudin augue. Mauris auctor nibh ut molestie semper. Praesent felis orci, rhoncus quis pulvinar a, bibendum non lectus. \n Nunc vehicula pulvinar lorem suscipit malesuada. Donec malesuada velit massa, eget ullamcorper ligula convallis nec. Aenean ac mollis elit. Pellentesque ut ultricies velit. Nam quis posuere orci. Etiam nibh sem, venenatis a rutrum id, condimentum non velit. Mauris at tincidunt mauris. Phasellus viverra est a arcu facilisis, ac auctor elit egestas. Quisque eget risus condimentum, molestie leo vel, venenatis nunc. In hac habitasse platea dictumst. Morbi quis dui non metus ultricies aliquam. Vestibulum ornare, sapien ut vehicula ornare, nibh nunc porta magna, eget accumsan ipsum enim eget est. Donec et ligula ac arcu lobortis finibus sit amet lobortis felis.\n",
//     location: "Sydney",
//     closed_date: "01/03/2023",
//     min_salary: "12k",
//     max_salary: "40k",
//     salary_currency: "AUD",
//     company_name: "Google",
//     company_avatar: "https://img.icons8.com/officel/344/google-logo.png",
//     is_remote: "FALSE",
//     job_type: "Full-time",
//     status: "",
//   },
//   {
//     job_id: "aa",
//     company_id: "1",
//     title: "Software engineer intern",
//     description:
//       "Lorem ipsum dolorf sit amet, consectetur adipiscing elit. Etiam sit amet erat id est consequat fermentum. Sed efficitur ligula et ante lacinia, quis pulvinar massa eleifend. Duis interdum ornare nunc, ac tincidunt diam rhoncus non. Vestibulum tincidunt tellus rutrum quam gravida lobortis. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Mauris viverra erat et enim efficitur porta. In hac habitasse platea dictumst. In at erat quis mi accumsan fringilla sit amet eu mi. Phasellus dignissim leo eros, sed rhoncus est vestibulum nec. \n Ut congue, purus sit amet porttitor pellentesque, ex diam pellentesque mi, ac scelerisque nibh dui eu neque. In finibus, eros sit amet consectetur sagittis, arcu orci semper tortor, sit amet blandit est purus ut turpis. Aliquam quis diam ornare, pharetra metus eget, finibus neque. Sed nec mauris id tortor tempus efficitur a cursus nibh. Donec a sollicitudin augue. Mauris auctor nibh ut molestie semper. Praesent felis orci, rhoncus quis pulvinar a, bibendum non lectus. \n Nunc vehicula pulvinar lorem suscipit malesuada. Donec malesuada velit massa, eget ullamcorper ligula convallis nec. Aenean ac mollis elit. Pellentesque ut ultricies velit. Nam quis posuere orci. Etiam nibh sem, venenatis a rutrum id, condimentum non velit. Mauris at tincidunt mauris. Phasellus viverra est a arcu facilisis, ac auctor elit egestas. Quisque eget risus condimentum, molestie leo vel, venenatis nunc. In hac habitasse platea dictumst. Morbi quis dui non metus ultricies aliquam. Vestibulum ornare, sapien ut vehicula ornare, nibh nunc porta magna, eget accumsan ipsum enim eget est. Donec et ligula ac arcu lobortis finibus sit amet lobortis felis.\n",
//     location: "Sydney",
//     closed_date: "01/03/2023",
//     min_salary: "12k",
//     max_salary: "40k",
//     salary_currency: "AUD",
//     company_name: "Google",
//     company_avatar: "https://img.icons8.com/officel/344/google-logo.png",
//     is_remote: "TRUE",
//     job_type: "Full-time",
//     status: "",
//   },
//   {
//     job_id: "aa",
//     company_id: "1",
//     title: "Software engineer intern",
//     description:
//       "Lorem ipsum dolorf sit amet, consectetur adipiscing elit. Etiam sit amet erat id est consequat fermentum. Sed efficitur ligula et ante lacinia, quis pulvinar massa eleifend. Duis interdum ornare nunc, ac tincidunt diam rhoncus non. Vestibulum tincidunt tellus rutrum quam gravida lobortis. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Mauris viverra erat et enim efficitur porta. In hac habitasse platea dictumst. In at erat quis mi accumsan fringilla sit amet eu mi. Phasellus dignissim leo eros, sed rhoncus est vestibulum nec. \n Ut congue, purus sit amet porttitor pellentesque, ex diam pellentesque mi, ac scelerisque nibh dui eu neque. In finibus, eros sit amet consectetur sagittis, arcu orci semper tortor, sit amet blandit est purus ut turpis. Aliquam quis diam ornare, pharetra metus eget, finibus neque. Sed nec mauris id tortor tempus efficitur a cursus nibh. Donec a sollicitudin augue. Mauris auctor nibh ut molestie semper. Praesent felis orci, rhoncus quis pulvinar a, bibendum non lectus. \n Nunc vehicula pulvinar lorem suscipit malesuada. Donec malesuada velit massa, eget ullamcorper ligula convallis nec. Aenean ac mollis elit. Pellentesque ut ultricies velit. Nam quis posuere orci. Etiam nibh sem, venenatis a rutrum id, condimentum non velit. Mauris at tincidunt mauris. Phasellus viverra est a arcu facilisis, ac auctor elit egestas. Quisque eget risus condimentum, molestie leo vel, venenatis nunc. In hac habitasse platea dictumst. Morbi quis dui non metus ultricies aliquam. Vestibulum ornare, sapien ut vehicula ornare, nibh nunc porta magna, eget accumsan ipsum enim eget est. Donec et ligula ac arcu lobortis finibus sit amet lobortis felis.\n",
//     location: "Sydney",
//     closed_date: "01/03/2023",
//     min_salary: "12",
//     max_salary: "40",
//     salary_currency: "AUD",
//     company_name: "Google",
//     company_avatar: "https://img.icons8.com/officel/344/google-logo.png",
//     is_remote: "TRUE",
//     job_type: "Full-time",
//     status: "",
//   },
// ];

const Company = () => {
  const [info, setInfo] = useState([]);
  const [isOverview, setIsOverview] = useState(true);

  useEffect(() => {
    const getData = async () => {
      const queryString = window.location.search;
      const urlParams = new URLSearchParams(queryString);
      const id = urlParams.get("id");
      const res = await getCompanyInfo(id);
      setInfo(res);
    };
    getData();
  }, []);
  console.log(info);
  return (
    <>
      <div className={classes.head}>
        <Avatar
          src={info.company_avatar}
          sx={{ width: "70px", height: "70px", mt: "60px" }}
        />
        <Typography variant="h3" color={"secondary"} mt="60px">
          {info.company_name}
        </Typography>
      </div>
      <div className={classes.nav}>
        <button
          onClick={() => setIsOverview((prev) => !prev)}
          className={isOverview ? classes.active : ""}
        >
          <MenuBookIcon />
          <h4>Overview</h4>
        </button>
        <button
          onClick={() => setIsOverview((prev) => !prev)}
          className={!isOverview ? classes.active : ""}
        >
          <WorkIcon />
          <h4>Jobs</h4>
        </button>
      </div>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          flexDirection: "column",
          my: "50px",
          gap: "25px",
          minHeight: "80vh",
        }}
      >
        {isOverview ? <Overview info={info} /> : <Jobs />}
      </Box>
    </>
  );
};

const Overview = ({ info }) => {
  const history = useHistory();
  console.log(info);
  const { user } = useContext(UserContext);
  return (
    <>
      {user.role === 2 && (
        <Button
          variant="outlined"
          onClick={() => {
            history.push("/editcompanyprofile");
          }}
        >
          Edit Profile
        </Button>
      )}
      <Paper
        elevation={4}
        sx={{
          width: "70%",
          display: "flex",
          flexWrap: "wrap",
          gap: "30px",
          padding: "30px",
          flexDirection: "column",
        }}
      >
        <Box>
          <Typography>
            <b>Company URL: </b>{" "}
            <a href={info.company_url}>{info.company_url}</a>
          </Typography>
          <Typography>
            <b>Founded Year: </b>
            {info.founded_year}
          </Typography>
          <Typography>
            <b>Company Size: </b>
            {info.company_size}
          </Typography>
          <Typography>
            <b>Industry: </b>
            {info.industries?.map((i) => i.name)}
          </Typography>
          <Typography sx={{ wordBreak: "break-all" }}>
            <b>LinkedIn: </b>
            <a href={info.linkedin}>{info.linkedin}</a>
          </Typography>
        </Box>
        <Button variant="outlined" startIcon={<MailOutlineIcon />} size="small">
          Chat
        </Button>
      </Paper>
      <Typography variant="body1" sx={{ width: "80%", mt: "30px" }}>
        {info.description}
      </Typography>
    </>
  );
};

const Jobs = () => {
  const [keyword, setKeyword] = useState("");
  const [location, setLocation] = useState("");
  const [jobsList, setJobsList] = useState([]);
  const [sortBy, setSortBy] = useState("");

  const getJobs = async () => {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const id = urlParams.get("id");
    const res = await companyGetJobInfo(id,"","","");
    console.log(res);
    const jobs = res.jobs.map((i) => ({
      ...i,
      company_logo: res.company_logo,
      company_name: res.company_name,
      location: i.city,
      job_id: i.id,
    }));
    console.log(jobs);
    setJobsList(jobs);
  };

  useEffect(() => {
    getJobs();
  }, []);

  // const searchHandler = (e) => {
    
  // }

  const sortHandler = (e) => {
    setSortBy(e.target.value);
  };

  return (
    <>
      <Grid
        container
        spacing={3}
        sx={{ width: "75%", display: "flex", alignItems: "center", mb: "80px" }}
      >
        <Grid item lg={5} md={12} xs={12}>
          <TextField
            id="keyword_search"
            label="Keyword / Job title"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            className={classes.keyword}
            fullWidth
          />
        </Grid>
        <Grid item lg={5} md={12} xs={12}>
          <TextField
            id="location_search"
            label="City"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className={classes.location}
            fullWidth
          />
        </Grid>
        <Grid item lg={2} md={12} xs={12}>
          <Button variant="contained" type="submit" fullWidth>
            Search
          </Button>
        </Grid>
      </Grid>
      <Box
        sx={{
          minWidth: "450px",
          width: "100%",
          maxWidth: "1260px",
        }}
      >
        <FormControl
          sx={{
            width: "180px",
          }}
        >
          <InputLabel id="sort">Sort By</InputLabel>
          <Select
            labelId="Sort"
            id="sort list"
            value={sortBy}
            label="Sort By"
            onChange={sortHandler}
          >
            <MenuItem value="Default">Default</MenuItem>
            <MenuItem value="Newest">Newest</MenuItem>
            <MenuItem value="Closing Soon">Closing Soon</MenuItem>
          </Select>
        </FormControl>
      </Box>
      {jobsList?.map((job, i) => (
        <JobBlock job={job} key={`job_${i}`} />
      ))}
    </>
  );
};

export default Company;
