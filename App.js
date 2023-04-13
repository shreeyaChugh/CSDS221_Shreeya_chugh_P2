// Shreeya Chugh project 2
import React, { useContext } from 'react';
import './style.css';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import MenuIcon from '@mui/icons-material/Menu';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import Table from '@mui/material/Table';
import TableHead from '@mui/material/TableHead';
import TableBody from '@mui/material/TableBody';
import DialogTitle from '@mui/material/DialogTitle';
import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import { useState } from 'react';
import Container from '@mui/material/Container';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { MdCancel } from 'react-icons/md';
import { format } from 'date-fns';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import TextField from '@mui/material/TextField';
import EditRoundedIcon from '@mui/icons-material/EditRounded';
import Radio from '@mui/material/Radio';
import EditIcon from '@mui/icons-material/Edit';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormLabel from '@mui/material/FormLabel';
import DoNotDisturbAltRoundedIcon from '@mui/icons-material/DoNotDisturbAltRounded';
import Checkbox from '@mui/material/Checkbox';
import TableContainer from '@mui/material/TableContainer';
import toastr from 'toastr';
import 'toastr/build/toastr.min.css';
import FormControl from '@mui/material/FormControl';

import moment from 'moment';
import jquery from 'jquery';

toastr.options = {
  positionClass: 'toast-bottom-right',
};
var today = new Date().toISOString().substr(0, 10);
export default function App() {
  const [add_state, set_add_state] = useState(true);
  const [showDial, setDialog] = React.useState(false);
  const [titlecheck, setTitleChecker] = useState('');
  const [prioritycheck, setPriorityChecker] = useState('');
  const [descriptioncheck, setDescriptionChecker] = useState('');
  const [deadlinecheck, setDeadlineChecker] = useState('');

  //error messages for title and decription
  const [titleerror, setTitleErrorMessage] = useState(false);
  const [descriptionerror, descriptionErrorMessage] = useState(false);
  const [priorityerror, priorityErrorMessage] = useState(false);
  const [deadlineerror, deadlineErrorMessage] = useState(false);
  //creating a set for unique values of title
  const [arr, setUniqueEntry] = useState([]);
  const [index, setIndex] = useState(-1);
  const [entry, set_entry] = useState({
    title: '',
    description: '',
    deadline: '',
    priority: '',
    isComplete: false,
  });

  const delete_done = () =>
    toastr.success('Success! This task row has been deleted');
  const add_done = () =>
    toastr.success('Success! This task row has been added');
  const edited = () =>
    toastr.success('Success! This task row has been updated');

  let error_message = () => {
    let error = false;
    if (!entry.deadline) {
      setDeadlineChecker('Deadline is Required!');
      error = true;
    } else {
      setDeadlineChecker('');
      error = false;
    }
    deadlineErrorMessage(entry.deadline ? 'Deadline is Required!' : '');
    return error;
  };
  const reset = () => {
    set_entry({
      title: '',
      description: '',
      deadline: '',
      priority: '',
      isComplete: false,
    });
  };

  let update_title = (value) => {
    set_entry({ ...entry, title: value.target.value });
  };

  let update_description = (value) => {
    set_entry({ ...entry, description: value.target.value });
  };

  let validate_title = () => {
    let titlecheck = entry.title;
    let error = false;

    for (let i = 0; i < arr.length; i++) {
      if (titlecheck === arr[i].title) {
        setTitleChecker('Title must be unique!');
        error = true;
        setTitleErrorMessage(true);
        return error;
      }
    }
    // checks if title is empty
    if (titlecheck === '') {
      setTitleChecker('Title is Required!');
      error = true;
    } else {
      setTitleChecker('');
      error = false;
    }
    setTitleErrorMessage(titlecheck === '' ? 'Title is Required!' : '');
    return error;
  };

  let validate_description = () => {
    let descriptioncheck = entry.description;
    let issue = false;

    if (descriptioncheck === '') {
      setDescriptionChecker('Description is required!');
      issue = true;
      descriptionErrorMessage(true);
    } else {
      setDescriptionChecker('');
      issue = false;
      descriptionErrorMessage(false);
    }

    return issue;
  };

  const openDialogBox = () => {
    setDialog(true);
  };

  const closeDial = () => {
    reset();
    setDialog(false);
  };
  const delete_row = (index) => {
    let arrays = [...arr];
    arrays.splice(index, 1);
    setUniqueEntry(arrays);
    delete_done();
  };

  const edit_row = () => {
    if (validate_description()) {
      return;
    } else {
      let search = index;
      console.log(search);
      let array = [...arr];
      let targetEntry = array[search];
      console.log(targetEntry);
      array[search] = {
        title: targetEntry.title,
        description: entry.description,
        deadline: entry.deadline,
        priority: entry.priority,
        isCmplete: targetEntry.isComplete,
      };
      setUniqueEntry(array);
      reset();
      closeDial();
      edited();
    }
  };

  const open_add_dialog = () => {
    reset();
    set_add_state(true);
    openDialogBox();
  };
  function adding_row() {
    const isTitleValid = validate_title();
    const isDescriptionValid = validate_description();
    // if any of the values are empty then the dialog box stays open
    if (isTitleValid || isDescriptionValid) {
      return;
    } else {
      setUniqueEntry((arr) => [...arr, entry]);
      reset();
      closeDial();
      add_done();
    }
  }
  const editDial = (index) => {
    set_add_state(false);
    setIndex(index);
    openDialogBox();
    let targetEntry = arr[index];
    set_entry({
      title: targetEntry.title,
      description: targetEntry.description,
      deadline: targetEntry.deadline,
      priority: targetEntry.priority,
    });
  };

  const tickBox = (index) => (e) => {
    let array = [...arr];
    let targetEntry = array[index];
    let completes = targetEntry.isComplete;
    array[index] = {
      title: targetEntry.title,
      description: targetEntry.description,
      deadline: targetEntry.deadline,
      priority: targetEntry.priority,
      isComplete: !completes,
    };
    setUniqueEntry(array);
  };

  return (
    <div>
      <AppBar position="static">
        <Toolbar
          style={{ bgcolor: 'primary.dark', color: 'white', align: 'center' }}
        >
          <Typography
            align="center"
            style={{ width: '100%', alignItems: 'center' }}
          >
            <Grid display="flex" justifyContent="center">
              <MenuIcon />
              &nbsp;FRAMEWORKS
            </Grid>
          </Typography>
          <Button
            variant="contained"
            onClick={open_add_dialog}
            style={{
              bgcolor: 'primary.dark',

              color: 'white',
              display: AppBar ? 'block' : 'none',
              marginRight: '0%',
            }}
          >
            <Grid display="flex" justifyContent="center" alignItems="center">
              <AddCircleIcon />
              &nbsp;Add
            </Grid>
          </Button>
        </Toolbar>

        <Dialog open={showDial} onClose={closeDial}>
          {add_state ? (
            <DialogTitle
              fullWidth
              sx={{ bgcolor: 'primary.dark', color: 'white' }}
            >
              <AddCircleIcon />
              &nbsp; Add Task
            </DialogTitle>
          ) : (
            <DialogTitle sx={{ bgcolor: 'primary.dark', color: 'white' }}>
              <EditIcon /> Edit Task
            </DialogTitle>
          )}
          <br />
          <DialogContent>
            <TextField
              label="Title"
              fullWidth
              placeholder="Title"
              value={entry.title}
              error={titleerror}
              helperText={titleerror && titlecheck}
              onChange={(event) =>
                set_entry({ ...entry, title: event.target.value })
              }
            ></TextField>
            <br />
            <br />
            <TextField
              label="Description"
              fullWidth
              placeholder="Description"
              value={entry.description}
              error={descriptionerror}
              helperText={descriptionerror && 'Description is required!'}
              onChange={(event) =>
                set_entry({ ...entry, description: event.target.value })
              }
            >
              {descriptionerror && (
                <Typography variant="caption" color="error">
                  Description is required!
                </Typography>
              )}
            </TextField>
            <br />
            <br />

            <TextField
              type="date"
              fullWidth
              label="Deadline"
              fullWidth
              onChange={(e) =>
                set_entry({ ...entry, deadline: e.target.value })
              }
              placeholder="MM/dd/yyyy"
              InputLabelProps={{
                shrink: true,
              }}
            ></TextField>
            <br />
            <TableRow>
              <TableCell align="left">
                <FormControl sx={{ m: 1, minWidth: 120 }}>
                  <FormLabel>Priority</FormLabel>
                  <RadioGroup
                    row
                    FullWidth
                    defaultValue="low"
                    onChange={(e) =>
                      set_entry({ ...entry, priority: e.target.value })
                    }
                    error={priorityerror}
                    helperText={priorityerror && 'Priority is Required!'}
                  >
                    <FormControlLabel
                      value="low"
                      control={<Radio />}
                      label="Low"
                    />
                    <FormControlLabel
                      value="med"
                      control={<Radio />}
                      label="Medium"
                    />
                    <FormControlLabel
                      value="high"
                      control={<Radio />}
                      label="High"
                    />
                  </RadioGroup>
                </FormControl>
              </TableCell>
            </TableRow>
          </DialogContent>
          <DialogActions>
            {add_state ? (
              <Button
                onClick={() => adding_row()}
                variant="contained"
                sx={{ bgcolor: 'primary.dark', width: '35%' }}
              >
                <AddCircleIcon />
                &nbsp;Add
              </Button>
            ) : (
              <Button
                onClick={edit_row}
                variant="contained"
                sx={{ bgcolor: 'primary.dark', width: '35%' }}
              >
                <EditIcon fontSize="small" />
                Edit
              </Button>
            )}
            <Button
              onClick={closeDial}
              variant="contained"
              sx={{ bgcolor: 'red', width: '35%' }}
            >
              <DoNotDisturbAltRoundedIcon />
              Cancel
            </Button>
          </DialogActions>
        </Dialog>
      </AppBar>
      <TableContainer>
        {/*this is the main table */}
        <Table>
          <TableRow>
            <TableCell sx={{ color: 'grey' }}>Title</TableCell>
            <TableCell sx={{ color: 'grey' }}>Description</TableCell>
            <TableCell sx={{ color: 'grey' }}>Deadline</TableCell>
            <TableCell sx={{ color: 'grey' }}>Priority</TableCell>
            <TableCell sx={{ color: 'grey' }}>Is Complete</TableCell>
            <TableCell sx={{ color: 'grey' }}>Action</TableCell>
          </TableRow>
          {arr.map((entry, index) => (
            <TableRow key={entry.title}>
              <TableCell>{entry.title}</TableCell>
              <TableCell>{entry.description}</TableCell>
              <TableCell>{moment(entry.deadline).format('MM/DD/YY')}</TableCell>
              <TableCell>{entry.priority}</TableCell>
              <TableCell>
                <Checkbox onChange={tickBox(index)} />
              </TableCell>
              <TableCell>
                <div>
                  {!entry.isComplete && (
                    <div>
                      <Button
                        variant="contained"
                        onClick={() => editDial(index)}
                      >
                        <EditRoundedIcon />
                        &nbsp;Update
                      </Button>
                    </div>
                  )}

                  <br />
                  <div>
                    <Button
                      variant="contained"
                      onClick={() => delete_row(index)}
                      color="error"
                    >
                      <MdCancel />
                      &nbsp;Delete
                    </Button>
                  </div>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </Table>
      </TableContainer>
      <ToastContainer position="bottom-right" />
    </div>
  );
}
