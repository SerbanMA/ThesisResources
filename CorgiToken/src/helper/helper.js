import * as React from 'react';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

export default function Snack({ open, message, severity = 'error' }) {
  return (
    <Snackbar open={open} autoHideDuration={6000}>
      <Alert severity={severity} sx={{ width: '100%' }}>
        {message}
      </Alert>
    </Snackbar>
  );
}

export function reverse(array) {
  var output = [];

  for (var i = 0; i < array.length; i++) {
    output.push(array[array.length - (i + 1)]);
  }

  return output;
}
