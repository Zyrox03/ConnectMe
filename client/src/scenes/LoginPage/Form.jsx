import React, { useEffect, useState } from "react"
import { HashLoader } from 'react-spinners'
import {
  Box,
  Button,
  TextField,
  useMediaQuery,
  Typography,
  useTheme,
} from "@mui/material";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import { Formik, ErrorMessage } from "formik";
import * as yup from "yup";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { logUser, logoutUser } from "../../state/authSlice.js";
import Dropzone from "react-dropzone";
import FlexBetween from "../../components/FlexBetween.jsx";

import { useLocation } from "react-router-dom";
import querystring from 'query-string'

// import '../../App.css'

const registerSchema = yup.object().shape({
  firstName: yup.string().required("required"),
  lastName: yup.string().required("required"),
  location: yup.string().required("required"),
  occupation: yup.string().required("required"),
  picturePath: yup.string(),
  username: yup.string().email("invalid email").required("required"),
  password: yup.string().required("required"),
});



const loginSchema = yup.object().shape({
  username: yup.string().email("invalid email").required("required"),
  password: yup.string().required("required"),

});
const resetSchema = yup.object().shape({
  username: yup.string().email("invalid email").required("required"),

});
const resetPasswordSchema = yup.object().shape({
  password: yup.string()
    .min(8, 'Password must be at least 8 characters')
    .required('Password is required'),
  confirm_password: yup.string()
    .oneOf([yup.ref('password'), null], 'Passwords must match')
    .required('Confirmation Password is required'),

});

const initialValuesRegister = {
  firstName: "",
  lastName: "",
  username: "",
  password: "",
  location: "",
  occupation: "",
  picturePath: "",
};

const initialValuesLogin = {
  username: "",
  password: "",
};
const initialValuesReset = {
  username: "",
};
const initialValuesResetPassword = {
  password: "",
  confirm_password: ""

};

const Form = () => {
  const { search } = useLocation();
  const { resetP } = querystring.parse(search);
  const [pageType, setPageType] = useState("register");
  if (resetP) {

    useEffect(() => {
      setPageType('resetPassword')
    }, []);
  }

  const [errorMessage, setErrorMessage] = useState(null);
  const [verifyMessage, setVerifyMessage] = useState(null);
  const [isLoading, setIsLoading] = useState(false)
  const { palette } = useTheme();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isNonMobile = useMediaQuery("(min-width:600px)");
  const isRegister = pageType === "register";
  const isLogin = pageType === "login";
  const isReset = pageType === "reset";
  const isResetPassword = pageType === "resetPassword";


  const register = async (values, onSubmitProps) => {
    setIsLoading(true)
    // this allows us to send form info with image
    const formData = new FormData();
    for (let value in values) {
      formData.append(value, values[value]);
    }
    if (values.picturePath) {
      formData.append("picturePath", values.picturePath.name);
    }





    const savedUserResponse = await fetch(
      // "https://bloom-pickled-pleasure.glitch.me/auth/register",
      "https://woozy-kindhearted-brie.glitch.me/auth/register",
      {
        method: 'POST',
        body: formData
      }
    );
    setIsLoading(false)


    if (savedUserResponse.status === 409) {
      // Authentication failed, display error message

      const error = await savedUserResponse.json();
      setErrorMessage(error.error)
      return;
    } else if (savedUserResponse.status === 403) {
      const verify = await savedUserResponse.json();
      setVerifyMessage(verify.verify)
      return;
    }
    // const savedUser = await savedUserResponse.json();
    onSubmitProps.resetForm();
    // if (savedUser) {
    //   dispatch(
    //     logUser({
    //       user: savedUser,
    //       token: true,
    //     })
    //   );
    //   navigate("/home");

    // }
  };

  const login = async (values, onSubmitProps) => {
    try {
      setIsLoading(true)

      const loggedInResponse = await fetch("https://woozy-kindhearted-brie.glitch.me/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      setIsLoading(false)

      if (loggedInResponse.status === 401) {
        // Authentication failed, display error message
        const error = await loggedInResponse.json();
        setErrorMessage(error.error)
        return;
      }

      const loggedIn = await loggedInResponse.json();
      onSubmitProps.resetForm();

      if (loggedIn) {
        dispatch(
          logUser({
            user: loggedIn,
            token: true,
          })
        );
        navigate("/home");
      }
    }
    catch (err) {
      navigate("/");
    }
  };
  const reset = async (values, onSubmitProps) => {
    try {
      setIsLoading(true)

      const resetResponse = await fetch("https://woozy-kindhearted-brie.glitch.me/auth/reset", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });

      const reset = await resetResponse.json();

      setIsLoading(false)


      if (reset.error) {
        // Authentication failed, display error message
        setErrorMessage(reset.error)
        return;
      }

      if (reset.verify) {
        setVerifyMessage(reset.verify)
        return;
      }
      onSubmitProps.resetForm();

    } catch (err) {
      console.log(err)
    }

  };
  const resetPassword = async (values, onSubmitProps) => {
    try {

      setIsLoading(true)

      const body = {
        password: values.password,
        resetP: resetP
      };
      const resetResponse = await fetch("https://woozy-kindhearted-brie.glitch.me/auth/resetPassword", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const reset = await resetResponse.json();
      if (reset.user) {
        const user = JSON.parse(reset.user)
        dispatch(
          logUser({
            user,
            token: true,
          })
        );
        navigate("/home");
      }
      setIsLoading(false)


      if (reset.error) {
        // Authentication failed, display error message
        setErrorMessage(reset.error)
        return;
      }

      setVerifyMessage(reset.verify)
      onSubmitProps.resetForm();

    } catch (err) {
      console.log(err)
    }

  };


  const handleFormSubmit = async (values, onSubmitProps) => {
    if (isRegister) await register(values, onSubmitProps);
    if (isLogin) await login(values, onSubmitProps);
    if (isReset) await reset(values, onSubmitProps);
    if (isResetPassword) await resetPassword(values, onSubmitProps);
  };


  return (
    <div className={isLoading ? 'loading' : ''}>


      <HashLoader cssOverride={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }} color="#36D7B7" loading={isLoading} />

      {verifyMessage ?
       <>
        <div className="alert alert-success alert-dismissible fade show" role="alert">
          {verifyMessage}
        </div>
        
        <Typography
        onClick={() => {
          // navigate('/home')
        }}
        sx={{
          textDecoration: "underline",
          color: palette.primary.main,
          "&:hover": {
            cursor: "pointer",
            color: palette.primary.light,
          },
        }}
      >
        Login 


      </Typography></>
        :

        <Formik
          initialValues={isRegister ? initialValuesRegister : (isLogin ? initialValuesLogin : (isReset ? initialValuesReset : initialValuesResetPassword))}
          onSubmit={handleFormSubmit}
          validationSchema={isRegister ? registerSchema : (isLogin ? loginSchema : (isReset ? resetSchema : resetPasswordSchema))}
        >
          {({
            values,
            errors,
            touched,
            handleBlur,
            handleChange,
            handleSubmit,
            setFieldValue,
            resetForm,
          }) => (
            <form encType="multipart/form-data" onSubmit={handleSubmit}>
              <Box
                display="grid"
                gap="30px"
                gridTemplateColumns="repeat(4, minmax(0, 1fr))"
                sx={{
                  "& > div": { gridColumn: isNonMobile ? undefined : "span 4" },
                }}
              >
                {isRegister && (
                  <>

                    <TextField
                      label="First Name"
                      onBlur={handleBlur}
                      onChange={handleChange}
                      value={values.firstName}
                      name="firstName"
                      error={
                        Boolean(touched.firstName) && Boolean(errors.firstName)
                      }
                      helperText={touched.firstName && errors.firstName}
                      sx={{ gridColumn: "span 2" }}

                    />
                    <TextField
                      label="Last Name"
                      onBlur={handleBlur}
                      onChange={handleChange}
                      value={values.lastName}
                      name="lastName"
                      error={Boolean(touched.lastName) && Boolean(errors.lastName)}
                      helperText={touched.lastName && errors.lastName}
                      sx={{ gridColumn: "span 2" }}

                    />

                    <TextField
                      label="Location"
                      onBlur={handleBlur}
                      onChange={handleChange}
                      value={values.location}
                      name="location"
                      error={Boolean(touched.location) && Boolean(errors.location)}
                      helperText={touched.location && errors.location}
                      sx={{ gridColumn: "span 4" }}

                    />
                    <TextField
                      label="Occupation"
                      onBlur={handleBlur}
                      onChange={handleChange}
                      value={values.occupation}
                      name="occupation"
                      error={
                        Boolean(touched.occupation) && Boolean(errors.occupation)
                      }
                      helperText={touched.occupation && errors.occupation}
                      sx={{ gridColumn: "span 4" }}

                    />
                    <Box
                      gridColumn="span 4"
                      border={`1px solid ${palette.neutral.medium}`}
                      borderRadius="5px"
                      p="1rem"
                    >
                      <Dropzone
                        acceptedFiles=" .jpg, .jpeg , .png"
                        multiple={false}
                        onDrop={(acceptedFiles) => {
                          if (acceptedFiles.length > 0) {
                            setFieldValue("picturePath", acceptedFiles[0]);
                          } else {

                            setErrorMessage('Please add a picture.')
                          }
                        }
                        }

                      >
                        {({ getRootProps, getInputProps }) => (
                          <Box
                            {...getRootProps()}
                            border={`2px dashed ${palette.primary.main}`}
                            p="1rem"
                            sx={{ "&:hover": { cursor: "pointer" } }}
                          >
                            <input  {...getInputProps()} />
                            {!values.picturePath ? (
                              <p>Add Picture Here</p>
                            ) : (
                              <FlexBetween>
                                <Typography>{values.picturePath.name}</Typography>
                                <EditOutlinedIcon />
                              </FlexBetween>
                            )}
                          </Box>
                        )}
                      </Dropzone>
                    </Box>

                    <TextField
                      label="Email"
                      onBlur={handleBlur}
                      onChange={handleChange}
                      value={values.username}
                      name="username"
                      error={Boolean(touched.username) && Boolean(errors.username)}
                      helperText={touched.username && errors.username}
                      sx={{ gridColumn: "span 4" }}
                    />
                    <TextField
                      label="Password"
                      type="password"
                      onBlur={handleBlur}
                      onChange={handleChange}
                      value={values.password}
                      name="password"
                      error={Boolean(touched.password) && Boolean(errors.password)}
                      helperText={touched.password && errors.password}
                      sx={{ gridColumn: "span 4" }}
                    />
                  </>
                )}

                {isLogin && (
                  <>
                    <TextField
                      label="Email"
                      onBlur={handleBlur}
                      onChange={handleChange}
                      value={values.username}
                      name="username"
                      error={Boolean(touched.username) && Boolean(errors.username)}
                      helperText={touched.username && errors.username}
                      sx={{ gridColumn: "span 4" }}
                    />
                    <TextField
                      label="Password"
                      type="password"
                      onBlur={handleBlur}
                      onChange={handleChange}
                      value={values.password}
                      name="password"
                      error={Boolean(touched.password) && Boolean(errors.password)}
                      helperText={touched.password && errors.password}
                      sx={{ gridColumn: "span 4" }}
                    />
                  </>
                )}

                {isReset && (
                  <>
                    <TextField
                      label="Email"
                      onBlur={handleBlur}
                      onChange={handleChange}
                      value={values.username}
                      name="username"
                      error={Boolean(touched.username) && Boolean(errors.username)}
                      helperText={touched.username && errors.username}
                      sx={{ gridColumn: "span 4" }}
                    />

                  </>
                )}
                {isResetPassword && (
                  <>
                    <TextField
                      label="Password"
                      type="password"
                      onBlur={handleBlur}
                      onChange={handleChange}
                      value={values.password}
                      name="password"
                      error={Boolean(touched.password) && Boolean(errors.password)}
                      helperText={touched.password && errors.password}
                      sx={{ gridColumn: "span 4" }}
                    />
                    <TextField
                      label="Confirm Password"
                      type="password"
                      onBlur={handleBlur}
                      onChange={handleChange}
                      value={values.confirm_password}
                      name="confirm_password"
                      error={Boolean(touched.confirm_password) && Boolean(errors.confirm_password)}
                      helperText={touched.confirm_password && errors.confirm_password}
                      sx={{ gridColumn: "span 4" }}
                    />

                  </>
                )}


              </Box>

              {/* BUTTONS */}
              <Box>
                <Button
                  fullWidth
                  type="submit"
                  sx={{
                    m: "2rem 0",
                    p: "1rem",
                    backgroundColor: palette.primary.main,
                    color: palette.background.alt,
                    "&:hover": { color: palette.primary.main },
                  }}
                >
                  {isLogin && "LOGIN"}
                  {isRegister && "REGISTER"}
                  {isReset && "RESET"}
                  {isResetPassword && "RESET PASSWORD"}
                </Button>

                {errorMessage && <div className="alert alert-danger alert-dismissible fade show" role="alert">
                  {errorMessage}
                  <button onClick={() => { setErrorMessage(null) }} type="button" className="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
                </div>}

                <Typography
                  onClick={() => {
                    setPageType(isLogin ? "register" : "login");
                    setErrorMessage(null);
                    resetForm();
                  }}
                  sx={{
                    textDecoration: "underline",
                    mb: "1em",
                    color: palette.primary.main,
                    "&:hover": {
                      cursor: "pointer",
                      color: palette.primary.light,
                    },
                  }}
                >
                  {isLogin
                    ? "Don't have an account? Sign Up here."
                    : "Already have an account? Login here."}


                </Typography>
                <Typography
                  onClick={() => {
                    setPageType('reset');
                    setErrorMessage(null);
                    resetForm();
                  }}
                  sx={{
                    textDecoration: "underline",
                    color: palette.primary.main,
                    "&:hover": {
                      cursor: "pointer",
                      color: palette.primary.light,
                    },
                  }}
                >
                  Forgot password ?


                </Typography>
              </Box>
            </form>


          )}

        </Formik>
      }




    </div>

  );
}


export default Form;