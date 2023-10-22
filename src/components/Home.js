import React from 'react'
import Button from '@mui/material/Button';
import ButtonGroup from '@mui/material/ButtonGroup';import { pink } from '@mui/material/colors';
import Checkbox from '@mui/material/Checkbox';

const label = { inputProps: { 'aria-label': 'Checkbox demo' } };

const Home = () => {
  return (
    <div>
      <h1>This is Home page</h1>
      <p>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum is simply dummy text of the printing and typesetting industry.</p>
      <ButtonGroup variant="contained" aria-label="outlined primary button group">
        <Button>One</Button>
        <Button>Two</Button>
        <Button>Three</Button>
    </ButtonGroup>
    <Checkbox {...label} defaultChecked />
      <Checkbox {...label} defaultChecked color="secondary" />
      <Checkbox {...label} defaultChecked color="success" />
      <Checkbox {...label} defaultChecked color="default" />
      <Checkbox
        {...label}
        defaultChecked
        sx={{
          color: pink[800],
          '&.Mui-checked': {
            color: pink[600],
          },
        }}
      />
    </div>
  )
}

export default Home