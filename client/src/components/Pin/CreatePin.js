import React, { useState, useContext } from "react";
import axios from 'axios';
import { withStyles } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import AddAPhotoIcon from "@material-ui/icons/AddAPhotoTwoTone";
import LandscapeIcon from "@material-ui/icons/LandscapeOutlined";
import ClearIcon from "@material-ui/icons/Clear";
import SaveIcon from "@material-ui/icons/SaveTwoTone";

import Context from '../../context';
import { CREATE_PIN_MUTATION } from "../../graphql/mutations";
import { useClient } from '../../client';

const CreatePin = ({ classes }) => {
  const [title, setTitle] = useState('');
  const [image, setImage] = useState('');
  const [content, setContent] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const { state, dispatch } = useContext(Context);
  const client = useClient();

  const handleSubmit = async event => {
    event.preventDefault();
    setSubmitting(true);

    try {
      const imageUrl = await handleImageUpload();

      const variables = {
        title,
        image: imageUrl,
        content,
        latitude: state.draft.latitude,
        longitude: state.draft.longitude,
      };

      const { createPin } = await client.request(CREATE_PIN_MUTATION, variables);

      dispatch({ type: 'CREATE_PIN', payload: createPin });
      setSubmitting(false);

      handleDeleteDraft();
    } catch (error) {
      setSubmitting(false);
      console.error('Error creating pin', error);
    }


  };

  const handleImageUpload = async () => {
    const imageData = new FormData();

    imageData.append('file', image);
    imageData.append('upload_preset', 'GeoPin');
    imageData.append('cloud_name', 'djochmrxh');

    const response = await axios.post('https://api.cloudinary.com/v1_1/djochmrxh/image/upload', imageData);

    return response.data.url;
  };

  const handleDeleteDraft = () => {
    setTitle('');
    setImage('');
    setContent('');

    dispatch({ type: 'DELETE_DRAFT' });
  };

  return (
    <form className={classes.form}>
      <Typography
        className={classes.alignCenter}
        component='h2'
        variant='h4'
        color='secondary'
      >
        <LandscapeIcon className={classes.iconLarge} /> Pin a location
      </Typography>

      <div>
        <TextField
          name='title'
          label='title'
          placeholder='Insert a pin title'
          onChange={event => setTitle(event.target.value)}
        />

        <input
          className={classes.input}
          accept='image/*'
          id='image'
          type='file'
          onChange={event => setImage(event.target.files[0])}
        />

        <label htmlFor='image'>
          <Button
            className={classes.button}
            style={{ color: image && 'green' }}
            component='span'
            size='small'
          >
            <AddAPhotoIcon />
          </Button>
        </label>
      </div>

      <div className={classes.contentField}>
        <TextField
          name='content'
          label='Content'
          multiline
          rows='6'
          margin='normal'
          fullWidth
          variant='outlined'
          onChange={event => setContent(event.target.value)}
        />
      </div>

      <div>
        <Button
          className={classes.button}
          type='submit'
          variant='contained'
          color='secondary'
          disabled={!title.trim() || !image || !content.trim() || submitting}
          onClick={handleSubmit}
        >
          Submit <SaveIcon className={classes.rightIcon} />
        </Button>

        <Button
          className={classes.button}
          variant='contained'
          color='primary'
          onClick={handleDeleteDraft}
        >
          <ClearIcon className={classes.leftIcon} /> Discard
        </Button>
      </div>
    </form>
  );
};

const styles = theme => ({
  form: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "column",
    paddingBottom: theme.spacing.unit
  },
  contentField: {
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit,
    width: "95%"
  },
  input: {
    display: "none"
  },
  alignCenter: {
    display: "flex",
    alignItems: "center"
  },
  iconLarge: {
    fontSize: 40,
    marginRight: theme.spacing.unit
  },
  leftIcon: {
    fontSize: 20,
    marginRight: theme.spacing.unit
  },
  rightIcon: {
    fontSize: 20,
    marginLeft: theme.spacing.unit
  },
  button: {
    marginTop: theme.spacing.unit * 2,
    marginBottom: theme.spacing.unit * 2,
    marginRight: theme.spacing.unit,
    marginLeft: 0
  }
});

export default withStyles(styles)(CreatePin);
